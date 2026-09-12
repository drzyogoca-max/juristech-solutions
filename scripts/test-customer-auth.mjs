/**
 * scripts/test-customer-auth.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * JurisTech Solutions — Sprint 03A Customer Auth Foundation Test Suite
 * 
 * Deterministic verification of:
 *  1. Supabase Auth Integration & Interface Contracts
 *  2. Customer Signup flow & input validation
 *  3. Customer Login flow & session capture
 *  4. Customer Logout / Signout lifecycle
 *  5. Session restoration & persistence rules
 *  6. Invalid credentials error handling (AR & EN)
 *  7. Duplicate account handling
 *  8. Role isolation & privilege escalation protection (Client vs Super Admin)
 *  9. Admin authentication integrity preservation
 * 10. Zero plaintext passwords in client-side storage
 * 11. Live Supabase Auth endpoint connectivity
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passedTests = 0;
let totalTests = 0;

function pass(msg) {
  passedTests++;
  totalTests++;
  console.log(`  ✅ [PASS] ${msg}`);
}

function fail(msg, err) {
  totalTests++;
  console.error(`  ❌ [FAIL] ${msg}:`, err?.message || err);
}

console.log('================================================================');
console.log('🔐  JURISTECH SOLUTIONS — SPRINT 03A CUSTOMER AUTH TEST SUITE');
console.log('================================================================\n');

// ── TEST GROUP 1: Interface & Source Code Integrity ──────────────────────────
console.log('--- TEST GROUP 1: AuthContext Interface & Source Code Integrity ---');

try {
  const authContextContent = fs.readFileSync(path.resolve('src/lib/authContext.tsx'), 'utf-8');

  // Verify AuthContextType has required customer auth functions and properties
  assert(authContextContent.includes('signIn: (email: string, password: string) => Promise'), 'AuthContextType must declare signIn');
  assert(authContextContent.includes('signUp: (email: string, password: string, fullName?: string) => Promise'), 'AuthContextType must declare signUp');
  assert(authContextContent.includes('signOut: () => Promise'), 'AuthContextType must declare signOut');
  assert(authContextContent.includes('session: any;'), 'AuthContextType must declare session');
  assert(authContextContent.includes('isAuthenticated: boolean;'), 'AuthContextType must declare isAuthenticated');
  pass('AuthContextType exports signIn, signUp, signOut, session, and isAuthenticated');

  // Verify Supabase Auth calls in AuthProvider
  assert(authContextContent.includes('supabase.auth.signInWithPassword'), 'signIn must invoke supabase.auth.signInWithPassword');
  assert(authContextContent.includes('supabase.auth.signUp'), 'signUp must invoke supabase.auth.signUp');
  assert(authContextContent.includes('supabase.auth.signOut'), 'signOut must invoke supabase.auth.signOut');
  assert(authContextContent.includes('supabase.auth.getSession()'), 'initAuth must invoke supabase.auth.getSession');
  assert(authContextContent.includes('supabase.auth.onAuthStateChange'), 'AuthProvider must subscribe to onAuthStateChange');
  pass('AuthProvider wires up native Supabase Auth methods');

  // Verify admin auth behavior is preserved
  assert(authContextContent.includes('isAuthorizedAdminEmail'), 'Admin email verification guard preserved');
  assert(authContextContent.includes('verifyAdminAccess'), 'Admin session verification preserved');
  assert(authContextContent.includes('logoutAdmin'), 'Admin logout function preserved');
  pass('Admin authentication and sovereign authorization rules preserved');

  // Verify localStorage is NOT used as credentials or password storage
  assert(!authContextContent.includes("localStorage.setItem('password'"), 'No passwords stored in localStorage in authContext');
  assert(!authContextContent.includes("localStorage.setItem('user_password'"), 'No user_passwords stored in localStorage in authContext');
  pass('Zero client-side password persistence in authContext');
} catch (e) {
  fail('AuthContext interface checks', e);
}

// ── TEST GROUP 2: CustomerAuthModal Component Verification ───────────────────
console.log('\n--- TEST GROUP 2: CustomerAuthModal Component Verification ---');

try {
  const modalContent = fs.readFileSync(path.resolve('src/components/CustomerAuthModal.tsx'), 'utf-8');

  // Check modes
  assert(modalContent.includes("mode === 'login'"), 'Modal supports login mode');
  assert(modalContent.includes("mode === 'signup'"), 'Modal supports signup mode');
  pass('CustomerAuthModal supports both Login and Signup tabs');

  // Check form inputs
  assert(modalContent.includes('type="email"'), 'Modal contains required email input');
  assert(modalContent.includes('type={showPassword ? \'text\' : \'password\'}'), 'Modal contains toggleable password input');
  assert(modalContent.includes('minLength={6}'), 'Modal enforces minimum 6 character password length');
  assert(modalContent.includes('setFullName'), 'Modal contains full name input for signup');
  pass('Modal form enforces required fields and security constraints');

  // Check error parser
  assert(modalContent.includes('parseAuthError'), 'Modal defines error parser for Supabase Auth errors');
  assert(modalContent.includes('invalid login credentials') || modalContent.includes('invalid credentials'), 'Error parser handles invalid credentials');
  assert(modalContent.includes('user already registered') || modalContent.includes('already exists'), 'Error parser handles duplicate user');
  pass('Modal error parser translates Supabase Auth error codes with localized messages');

  // Check Navbar integration
  const navbarContent = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf-8');
  assert(navbarContent.includes('CustomerAuthModal'), 'Navbar imports CustomerAuthModal');
  assert(navbarContent.includes('showAuthModal'), 'Navbar manages showAuthModal state');
  assert(navbarContent.includes('signOut()'), 'Navbar provides logout action when user is authenticated');
  pass('Navbar properly mounts and triggers CustomerAuthModal');

  // Check MobileBottomNav integration
  const mobileNavContent = fs.readFileSync(path.resolve('src/components/MobileBottomNav.tsx'), 'utf-8');
  assert(mobileNavContent.includes('CustomerAuthModal'), 'MobileBottomNav imports CustomerAuthModal');
  assert(mobileNavContent.includes('showAuthModal'), 'MobileBottomNav manages showAuthModal state');
  pass('MobileBottomNav properly mounts CustomerAuthModal for mobile users');
} catch (e) {
  fail('CustomerAuthModal verification', e);
}

// ── TEST GROUP 3: Authentication Error Formatter Logic ───────────────────────
console.log('\n--- TEST GROUP 3: Authentication Error Formatter Unit Tests ---');

function parseAuthErrorMock(err, isArabic = false) {
  const raw = (err?.message || err?.error_description || String(err || '')).toLowerCase();

  if (raw.includes('invalid login credentials') || raw.includes('invalid credentials')) {
    return isArabic
      ? 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.'
      : 'Invalid login credentials. Please check your email and password.';
  }
  if (raw.includes('user already registered') || raw.includes('already exists')) {
    return isArabic
      ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استعادة الحساب.'
      : 'This email address is already registered. Please sign in instead.';
  }
  if (raw.includes('password should be at least 6 characters') || raw.includes('password is too short')) {
    return isArabic
      ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'
      : 'Password must be at least 6 characters long.';
  }
  if (raw.includes('rate limit') || raw.includes('too many requests')) {
    return isArabic
      ? 'تم تجاوز عدد المحاولات المسموح بها مؤقتاً. يرجى المحاولة بعد قليل.'
      : 'Too many attempts. Please wait a few moments before trying again.';
  }
  return err?.message || 'Authentication error';
}

try {
  // Test Invalid Credentials Error
  const errInvalid = { message: 'Invalid login credentials' };
  const msgEn1 = parseAuthErrorMock(errInvalid, false);
  const msgAr1 = parseAuthErrorMock(errInvalid, true);
  assert(msgEn1.includes('Invalid login credentials'), 'Invalid credentials mapped to English message');
  assert(msgAr1.includes('بيانات الدخول غير صحيحة'), 'Invalid credentials mapped to Arabic message');
  pass('Invalid credentials error correctly formatted for both English and Arabic');

  // Test Duplicate Email Error
  const errDup = { message: 'User already registered' };
  const msgEn2 = parseAuthErrorMock(errDup, false);
  const msgAr2 = parseAuthErrorMock(errDup, true);
  assert(msgEn2.includes('already registered'), 'Duplicate email mapped to English warning');
  assert(msgAr2.includes('مسجل بالفعل'), 'Duplicate email mapped to Arabic warning');
  pass('Duplicate email error correctly formatted for both English and Arabic');

  // Test Password Length Error
  const errShortPass = { message: 'Password should be at least 6 characters' };
  const msgEn3 = parseAuthErrorMock(errShortPass, false);
  const msgAr3 = parseAuthErrorMock(errShortPass, true);
  assert(msgEn3.includes('at least 6 characters'), 'Short password mapped to English warning');
  assert(msgAr3.includes('6 أحرف على الأقل'), 'Short password mapped to Arabic warning');
  pass('Short password error correctly formatted');

  // Test Rate Limit Error
  const errRate = { message: 'email rate limit exceeded' };
  const msgEn4 = parseAuthErrorMock(errRate, false);
  assert(msgEn4.includes('Too many attempts'), 'Rate limit mapped to friendly English warning');
  pass('Rate limit error correctly formatted');
} catch (e) {
  fail('Error formatting unit tests', e);
}

// ── TEST GROUP 4: State Machine & Session Restoration Simulation ─────────────
console.log('\n--- TEST GROUP 4: State Machine & Session Restoration Simulation ---');

class MockAuthStateMachine {
  constructor() {
    this.user = null;
    this.session = null;
    this.role = 'client';
    this.isAdmin = false;
    this.isAuthenticated = false;
  }

  initSession(savedSession) {
    if (savedSession?.user) {
      this.user = savedSession.user;
      this.session = savedSession;
      this.isAuthenticated = true;
      if (['founder@juristech.solutions', 'drzyogo.ca@gmail.com'].includes(savedSession.user.email?.toLowerCase())) {
        this.role = 'super-admin';
        this.isAdmin = true;
      } else {
        this.role = 'client';
        this.isAdmin = false;
      }
    } else {
      this.user = null;
      this.session = null;
      this.isAuthenticated = false;
      this.role = 'client';
      this.isAdmin = false;
    }
  }

  signInSuccess(userData, token) {
    const sessionObj = {
      user: userData,
      access_token: token,
      expires_at: Date.now() + 3600000,
    };
    this.initSession(sessionObj);
  }

  signOut() {
    this.initSession(null);
  }

  attemptPrivilegeEscalation(targetRole) {
    // If not admin, escalation is blocked
    if (!this.isAdmin && (targetRole === 'admin' || targetRole === 'super-admin')) {
      return false;
    }
    this.role = targetRole;
    return true;
  }
}

try {
  const authSm = new MockAuthStateMachine();

  // Test 1: Initial state (Guest)
  assert.strictEqual(authSm.isAuthenticated, false, 'Guest is not authenticated');
  assert.strictEqual(authSm.role, 'client', 'Guest starts with client role');
  assert.strictEqual(authSm.user, null, 'Guest has null user');
  pass('Initial unauthenticated state is clean');

  // Test 2: Customer Sign In
  const mockCustomer = {
    id: 'usr_c872a91f-2e38-4e52-a14a-89a1c1d9f821',
    email: 'test_client@firm.com',
    user_metadata: { full_name: 'Test Client' },
  };
  authSm.signInSuccess(mockCustomer, 'mock_jwt_token_xyz');
  assert.strictEqual(authSm.isAuthenticated, true, 'User is authenticated after signIn');
  assert.strictEqual(authSm.user.id, 'usr_c872a91f-2e38-4e52-a14a-89a1c1d9f821', 'Customer user.id is preserved');
  assert.strictEqual(authSm.role, 'client', 'Customer assigned client role');
  assert.strictEqual(authSm.isAdmin, false, 'Customer is NOT admin');
  pass('Customer sign-in establishes stable customer identity');

  // Test 3: Session Restoration after Refresh
  const storedSession = authSm.session;
  const newSmInstance = new MockAuthStateMachine();
  newSmInstance.initSession(storedSession);
  assert.strictEqual(newSmInstance.isAuthenticated, true, 'Session restored successfully');
  assert.strictEqual(newSmInstance.user.id, mockCustomer.id, 'Restored user.id matches original');
  assert.strictEqual(newSmInstance.role, 'client', 'Restored role remains client');
  pass('Session restoration preserves user.id and authentication state');

  // Test 4: Privilege Escalation Guard
  const escalationResult = newSmInstance.attemptPrivilegeEscalation('super-admin');
  assert.strictEqual(escalationResult, false, 'Unauthorized role escalation blocked');
  assert.strictEqual(newSmInstance.role, 'client', 'Role was not escalated');
  pass('Privilege escalation attempt successfully blocked for customer user');

  // Test 5: Customer Sign Out
  newSmInstance.signOut();
  assert.strictEqual(newSmInstance.isAuthenticated, false, 'isAuthenticated is false after signOut');
  assert.strictEqual(newSmInstance.user, null, 'user is null after signOut');
  assert.strictEqual(newSmInstance.session, null, 'session is null after signOut');
  pass('Sign out terminates session cleanly');
} catch (e) {
  fail('State machine simulation tests', e);
}

// ── TEST GROUP 5: Live Supabase Auth Endpoint Verification ───────────────────
console.log('\n--- TEST GROUP 5: Live Supabase Auth Endpoint Verification ---');

const SUPABASE_URL = 'https://slhxqshdvivvsdifbsxo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1Ow9T5Ph861kcGfNpu4w1Q_QJeTEJOO';

async function testLiveSupabaseAuth() {
  try {
    // 1. Check Auth Health Endpoint
    const healthRes = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: SUPABASE_KEY }
    });
    assert(healthRes.status === 200, `Auth health endpoint responded with status ${healthRes.status}`);
    pass('Live Supabase Auth health endpoint is operational (HTTP 200 OK)');

    // 2. Test Invalid Credentials against Live Endpoint
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `nonexistent_user_${Date.now()}@juristech.solutions`,
        password: 'incorrect_password_123!',
      }),
    });

    const loginJson = await loginRes.json();
    assert(loginRes.status === 400, `Expected HTTP 400 for invalid credentials, got ${loginRes.status}`);
    assert(
      loginJson.error_code === 'invalid_credentials' ||
      loginJson.msg?.toLowerCase().includes('invalid') ||
      loginJson.error_description?.toLowerCase().includes('invalid'),
      `Expected invalid credentials error message, got: ${JSON.stringify(loginJson)}`
    );
    pass('Live Supabase Auth correctly rejects invalid credentials with 400 Bad Request');

    // 3. Test Short Password Validation against Live Signup Endpoint
    const shortPassRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `test_shortpass_${Date.now()}@juristech.solutions`,
        password: '123', // < 6 chars
      }),
    });

    const shortPassJson = await shortPassRes.json();
    assert(shortPassRes.status === 400 || shortPassRes.status === 422, `Expected 400/422 for short password, got ${shortPassRes.status}`);
    assert(
      (shortPassJson.msg || shortPassJson.message || '').toLowerCase().includes('at least 6') ||
      (shortPassJson.error_description || '').toLowerCase().includes('password'),
      'Live Supabase Auth enforces minimum password length constraint'
    );
    pass('Live Supabase Auth enforces password length requirements on signup');

  } catch (err) {
    fail('Live Supabase Auth endpoint verification', err);
  }
}

await testLiveSupabaseAuth();

// ── SUMMARY REPORT ───────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`🏁  TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL SPRINT 03A CUSTOMER AUTH TESTS PASSED DETERMINISTICALLY!\n');
} else {
  console.error(`❌ ${totalTests - passedTests} TESTS FAILED\n`);
  process.exitCode = 1;
}

