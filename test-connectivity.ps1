# Testar API PalDefender via IP PÚBLICO (já tem port forwarding)
$PUBLIC_IP = "201.93.248.252"
$LOCAL_IP = "localhost"
$PORT = "8212"

$USERNAME = "admin"
$PASSWORD = "060892"

Write-Host "=== Testando Conectividade API PalDefender ===" -ForegroundColor Cyan
Write-Host ""

$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${USERNAME}:${PASSWORD}"))
$headers = @{
    "Authorization" = "Basic $credentials"
    "Content-Type" = "application/json"
}

# Teste LOCAL
Write-Host "1. Testando LOCAL (localhost:$PORT)..." -ForegroundColor Yellow
$localUrl = "http://localhost:$PORT/v1/api/players"
Write-Host "   URL: $localUrl" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri $localUrl -Method GET -Headers $headers -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "   ✅ LOCAL funciona!" -ForegroundColor Green
    Write-Host "   Jogadores: $($response.Content)" -ForegroundColor White
    $localOk = $true
} catch {
    Write-Host "   ❌ LOCAL falhou: $($_.Exception.Message)" -ForegroundColor Red
    $localOk = $false
}
Write-Host ""

# Teste PÚBLICO
Write-Host "2. Testando PÚBLICO ($PUBLIC_IP`:$PORT)..." -ForegroundColor Yellow
$publicUrl = "http://$PUBLIC_IP`:$PORT/v1/api/players"
Write-Host "   URL: $publicUrl" -ForegroundColor Gray
try {
    $response = Invoke-WebRequest -Uri $publicUrl -Method GET -Headers $headers -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ PÚBLICO funciona!" -ForegroundColor Green
    Write-Host "   Jogadores: $($response.Content)" -ForegroundColor White
    $publicOk = $true
} catch {
    Write-Host "   ❌ PÚBLICO falhou: $($_.Exception.Message)" -ForegroundColor Red
    $publicOk = $false
}
Write-Host ""

# Diagnóstico
Write-Host "=== Diagnóstico ===" -ForegroundColor Cyan
if ($localOk -and !$publicOk) {
    Write-Host "⚠️ API funciona LOCALMENTE mas não via IP PÚBLICO" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor White
    Write-Host "1. Firewall do Windows bloqueando conexões externas na porta 8212" -ForegroundColor White
    Write-Host "2. RESTConfig.json do PalDefender configurado para aceitar apenas localhost" -ForegroundColor White
    Write-Host ""
    Write-Host "Solução:" -ForegroundColor Green
    Write-Host "Execute este comando para abrir a porta no Firewall:" -ForegroundColor White
    Write-Host 'New-NetFirewallRule -DisplayName "PalDefender API" -Direction Inbound -LocalPort 8212 -Protocol TCP -Action Allow' -ForegroundColor Cyan
} elseif ($localOk -and $publicOk) {
    Write-Host "✅ TUDO FUNCIONANDO! API acessível localmente E via IP público!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximo passo: Testar dar item via API" -ForegroundColor Yellow
} elseif (!$localOk) {
    Write-Host "❌ API não está respondendo nem localmente" -ForegroundColor Red
    Write-Host "Verifique se o servidor Palworld está rodando" -ForegroundColor Yellow
}
