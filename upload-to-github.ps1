Param(
    [string]$ProjectPath = "."
)

$ErrorActionPreference = "Stop"

if (-not $env:GITHUB_USERNAME -or -not $env:GITHUB_REPO) {
    Write-Host "❌ Faltan variables de entorno requeridas" -ForegroundColor Red
    Write-Host "Define estas variables antes de ejecutar:" -ForegroundColor Yellow
    Write-Host "  `$env:GITHUB_USERNAME='tu_usuario'"
    Write-Host "  `$env:GITHUB_REPO='studio26-pilates'"
    Write-Host "Opcional (si no tienes sesión iniciada en Git):"
    Write-Host "  `$env:GITHUB_TOKEN='tu_token_pat'"
    Exit 1
}

$resolvedProjectPath = Resolve-Path $ProjectPath
Set-Location $resolvedProjectPath

if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json en $resolvedProjectPath" -ForegroundColor Red
    Exit 1
}

Write-Host "🚀 Subiendo proyecto a GitHub..." -ForegroundColor Cyan
Write-Host "Usuario: $($env:GITHUB_USERNAME)"
Write-Host "Repo: $($env:GITHUB_REPO)"

$gitName = if ($env:GIT_NAME) { $env:GIT_NAME } else { "Your Name" }
$gitEmail = if ($env:GIT_EMAIL) { $env:GIT_EMAIL } else { "you@example.com" }

git config user.name "$gitName"
git config user.email "$gitEmail"

if (-not (Test-Path ".git")) {
    git init
}

git branch -M main
git add .

git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "chore: update project files"
}

git remote remove origin 2>$null
if ($env:GITHUB_TOKEN) {
    git remote add origin "https://$($env:GITHUB_USERNAME):$($env:GITHUB_TOKEN)@github.com/$($env:GITHUB_USERNAME)/$($env:GITHUB_REPO).git"
} else {
    git remote add origin "https://github.com/$($env:GITHUB_USERNAME)/$($env:GITHUB_REPO).git"
}

Write-Host "☁️  Subiendo rama main..." -ForegroundColor Cyan
git push -u origin main

Write-Host "✅ Listo: https://github.com/$($env:GITHUB_USERNAME)/$($env:GITHUB_REPO)" -ForegroundColor Green