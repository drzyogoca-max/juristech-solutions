param()

$SUPABASE_URL = "https://wavqqcbssukoxzkegozv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhdnFxY2Jzc3Vrb3h6a2Vnb3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMTk5NDksImV4cCI6MjA5ODc5NTk0OX0.ZE5U7El3wSIYb8E34Xpc-V6tV3QewBaQ_MnP4PyRgoY"

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
