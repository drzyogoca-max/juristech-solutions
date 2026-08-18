param()

Write-Host "=== DNS CHECK (Google 8.8.8.8) ===" -ForegroundColor Cyan
nslookup legalshieldsolution.online 8.8.8.8 2>&1

Write-Host ""
Write-Host "=== DNS CHECK (Cloudflare 1.1.1.1) ===" -ForegroundColor Cyan
nslookup legalshieldsolution.online 1.1.1.1 2>&1

Write-Host ""
Write-Host "=== HTTPS MAIN DOMAIN ===" -ForegroundColor Cyan
try {
    $req = [System.Net.HttpWebRequest]::Create("https://legalshieldsolution.online")
    $req.Timeout = 10000
    $req.AllowAutoRedirect = $true
    $resp = $req.GetResponse()
    $code = [int]$resp.StatusCode
    $server = $resp.Headers["Server"]
    $resp.Close()
    Write-Host "  STATUS : $code" -ForegroundColor Green
    Write-Host "  SERVER : $server" -ForegroundColor Green
    Write-Host "  SSL/HTTPS : ACTIVE - Domain is LIVE!" -ForegroundColor Green
} catch [System.Net.WebException] {
    if ($null -ne $_.Exception.Response) {
        $code = [int]$_.Exception.Response.StatusCode
        Write-Host "  STATUS : $code" -ForegroundColor Yellow
    } else {
        Write-Host "  NOT REACHABLE YET: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== HTTPS WWW SUBDOMAIN ===" -ForegroundColor Cyan
try {
    $req2 = [System.Net.HttpWebRequest]::Create("https://www.legalshieldsolution.online")
    $req2.Timeout = 10000
    $req2.AllowAutoRedirect = $true
    $resp2 = $req2.GetResponse()
    $code2 = [int]$resp2.StatusCode
    $resp2.Close()
    Write-Host "  WWW STATUS : $code2 - LIVE!" -ForegroundColor Green
} catch [System.Net.WebException] {
    if ($null -ne $_.Exception.Response) {
        $code2 = [int]$_.Exception.Response.StatusCode
        Write-Host "  WWW STATUS : $code2" -ForegroundColor Yellow
    } else {
        Write-Host "  WWW NOT REACHABLE YET: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  WWW ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== VERCEL DOMAIN VERIFY ===" -ForegroundColor Cyan
npx vercel domains inspect legalshieldsolution.online 2>&1
