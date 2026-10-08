param(
  [string]$SUPABASE_URL = $env:SUPABASE_URL,
  [string]$SUPABASE_ANON_KEY = $env:SUPABASE_ANON_KEY
)

if (-not $SUPABASE_URL -or -not $SUPABASE_ANON_KEY) {
  Write-Error "SUPABASE_URL and SUPABASE_ANON_KEY environment variables or parameters are required."
  exit 1
}

Write-Host "Adding VITE_SUPABASE_URL to production..." -ForegroundColor Cyan
echo $SUPABASE_URL | npx vercel env add VITE_SUPABASE_URL production 2>&1

Write-Host "Adding VITE_SUPABASE_ANON_KEY to production..." -ForegroundColor Cyan
echo $SUPABASE_ANON_KEY | npx vercel env add VITE_SUPABASE_ANON_KEY production 2>&1

Write-Host "Adding VITE_SUPABASE_URL to preview..." -ForegroundColor Cyan
echo $SUPABASE_URL | npx vercel env add VITE_SUPABASE_URL preview 2>&1

Write-Host "Adding VITE_SUPABASE_ANON_KEY to preview..." -ForegroundColor Cyan
echo $SUPABASE_ANON_KEY | npx vercel env add VITE_SUPABASE_ANON_KEY preview 2>&1

Write-Host "Done! Listing final env vars..." -ForegroundColor Green
npx vercel env ls 2>&1
