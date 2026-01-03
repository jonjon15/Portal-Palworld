# Testar API PalDefender LOCALMENTE
$API_URL = "http://localhost:8212"
$USERNAME = "admin"
$PASSWORD = "060892"

$STEAM_ID = "steam_76561198000866703"
$ITEM_ID = "Shield_01"
$QUANTITY = 1

Write-Host "=== Testando API PalDefender LOCAL ===" -ForegroundColor Cyan
Write-Host ""

$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${USERNAME}:${PASSWORD}"))
$headers = @{
    "Authorization" = "Basic $credentials"
    "Content-Type" = "application/json"
}

# Teste 1: GET /v1/api/players
Write-Host "Teste 1: GET /v1/api/players" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$API_URL/v1/api/players" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Jogadores online: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 2: POST /v1/api/give
Write-Host "Teste 2: POST /v1/api/give" -ForegroundColor Green
$body = @{
    userId = $STEAM_ID
    itemId = $ITEM_ID
    amount = $QUANTITY
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/v1/api/give" -Method POST -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✅ SUCESSO! Item enviado!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
    Write-Host ""
    Write-Host "🎮 VERIFIQUE NO JOGO SE O ITEM APARECEU!" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "=== Se funcionou, vou atualizar o código! ===" -ForegroundColor Cyan
