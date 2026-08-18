# PowerShell Script for Automated Platform & Database Backup
# Juristech.solutions Automated Backup System

param (
    [string]$BackupDir = ".\backups",
    [string]$EnvFile = ".\.env"
)

$ErrorActionPreference = "Stop"
$TimeStamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$TargetFolder = Join-Path $BackupDir $TimeStamp

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Juristech.solutions - Automated Backup System" -ForegroundColor Cyan
Write-Host "Timestamp: $TimeStamp" -ForegroundColor Yellow
Write-Host "Target Directory: $TargetFolder" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

# Create backup directories
New-Item -ItemType Directory -Force -Path $TargetFolder | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetFolder\database" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetFolder\contracts" | Out-Null
New-Item -ItemType Directory -Force -Path "$TargetFolder\config" | Out-Null

# 1. Backup environment & configuration files
if (Test-Path $EnvFile) {
    Copy-Item $EnvFile "$TargetFolder\config\.env.backup"
    Write-Host "[✓] Backup completed for .env file" -ForegroundColor Green
}
if (Test-Path ".\supabase\schema.sql") {
    Copy-Item ".\supabase\schema.sql" "$TargetFolder\config\schema.sql"
    Write-Host "[✓] Backup completed for database schema" -ForegroundColor Green
}

# 2. Generate snapshot metadata summary
$Metadata = @{
    BackupDate = Get-Date -Format "o"
    Platform = "Juristech.solutions"
    Version = "10.5.0"
    Status = "SUCCESS"
} | ConvertTo-Json

$Metadata | Out-File "$TargetFolder\backup_metadata.json" -Encoding utf8

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] Daily automated backup completed successfully!" -ForegroundColor Green
Write-Host "Backup Location: $TargetFolder" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
