param(
  [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"

function Require-Env([string]$Name) {
  $value = [Environment]::GetEnvironmentVariable($Name)
  if ([string]::IsNullOrWhiteSpace($value)) {
    Write-Error "Erro: defina a variável de ambiente $Name antes de rodar este script."
  }
  return $value
}

Write-Host "Configurando variáveis de ambiente no Vercel ($Environment)..."

$PALWORLD_API_URL  = [Environment]::GetEnvironmentVariable("PALWORLD_API_URL")
if ([string]::IsNullOrWhiteSpace($PALWORLD_API_URL)) {
  $PALWORLD_API_URL = "http://201.93.248.252:8212"
}

$PALWORLD_API_USER = Require-Env "PALWORLD_API_USER"
$PALWORLD_API_PASS = Require-Env "PALWORLD_API_PASS"

$RCON_HOST = [Environment]::GetEnvironmentVariable("RCON_HOST")
if ([string]::IsNullOrWhiteSpace($RCON_HOST)) {
  $RCON_HOST = "201.93.248.252"
}

$RCON_PORT = [Environment]::GetEnvironmentVariable("RCON_PORT")
if ([string]::IsNullOrWhiteSpace($RCON_PORT)) {
  $RCON_PORT = "25575"
}

$RCON_PASSWORD = Require-Env "RCON_PASSWORD"

$DATABASE_URL = Require-Env "DATABASE_URL"
$JWT_SECRET   = Require-Env "JWT_SECRET"

$ADMIN_USERNAMES = Require-Env "ADMIN_USERNAMES"

# Usa stdin para não vazar valores no histórico do terminal
$PALWORLD_API_URL  | vercel env add PALWORLD_API_URL  $Environment
$PALWORLD_API_USER | vercel env add PALWORLD_API_USER $Environment
$PALWORLD_API_PASS | vercel env add PALWORLD_API_PASS $Environment

$RCON_HOST     | vercel env add RCON_HOST     $Environment
$RCON_PORT     | vercel env add RCON_PORT     $Environment
$RCON_PASSWORD | vercel env add RCON_PASSWORD $Environment

$DATABASE_URL | vercel env add DATABASE_URL $Environment
$JWT_SECRET   | vercel env add JWT_SECRET   $Environment

$ADMIN_USERNAMES | vercel env add ADMIN_USERNAMES $Environment

Write-Host "Concluído. Dica: faça um novo deploy para aplicar as env vars: vercel --prod"