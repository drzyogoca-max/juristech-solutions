param()
$routes = @(
    "/", "/dashboard", "/chat", "/contracts", "/vault", "/risk",
    "/video-hub", "/legal-compliance", "/payment", "/auth/login",
    "/reports", "/admin", "/version.json", "/terms-of-service",
    "/privacy-policy", "/legal/terms-of-service.html", "/legal/privacy-policy.html"
)

$bases = @(
    "https://legalshield-solution-live.vercel.app",
    "https://legalshieldsolution.online"
)

foreach ($baseUrl in $bases) {
    Write-Host ""
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Host "BASE: $baseUrl" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    foreach ($route in $routes) {
        $url = $baseUrl + $route
        try {
            $req = [System.Net.HttpWebRequest]::Create($url)
            $req.Timeout = 10000
            $req.AllowAutoRedirect = $true
            $resp = $req.GetResponse()
            $statusCode = [int]$resp.StatusCode
            $resp.Close()
            if ($statusCode -eq 200) {
                Write-Host "  200 OK     $route" -ForegroundColor Green
            } else {
                Write-Host "  $statusCode REDIRECT  $route" -ForegroundColor Yellow
            }
        } catch [System.Net.WebException] {
            if ($null -ne $_.Exception.Response) {
                $code = [int]$_.Exception.Response.StatusCode
                Write-Host "  $code FAIL    $route" -ForegroundColor Red
            } else {
                Write-Host "  NET-ERR  $route  -- $($_.Exception.Message)" -ForegroundColor Magenta
            }
        } catch {
            Write-Host "  ERR      $route  -- $($_.Exception.Message)" -ForegroundColor Magenta
        }
    }
}

Write-Host ""
Write-Host "=== ENV VARIABLES CHECK ===" -ForegroundColor Cyan
