# Script para testar API do PalDefender
# Configurações
$API_URL = "http://201.93.248.252:8212"
$USERNAME = "admin"  # Substitua com seu username da API
$PASSWORD = "sua_senha_aqui"  # Substitua com sua senha da API

$STEAM_ID = "steam_76561198000866703"  # X_DRAKE_X
$ITEM_ID = "Shield_01"  # Item de teste
$QUANTITY = 1

# Credenciais em Base64
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${USERNAME}:${PASSWORD}"))
$headers = @{
    "Authorization" = "Basic $credentials"
    "Content-Type" = "application/json"
}

Write-Host "=== Testando API do PalDefender ===" -ForegroundColor Cyan
Write-Host "Steam ID: $STEAM_ID" -ForegroundColor Yellow
Write-Host "Item: $ITEM_ID x$QUANTITY" -ForegroundColor Yellow
Write-Host ""

# Teste 1: POST /v1/api/give
Write-Host "Teste 1: POST /v1/api/give" -ForegroundColor Green
$body1 = @{
    userId = $STEAM_ID
    itemId = $ITEM_ID
    amount = $QUANTITY
} | ConvertTo-Json

try {
    $response1 = Invoke-WebRequest -Uri "$API_URL/v1/api/give" -Method POST -Headers $headers -Body $body1 -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Status: $($response1.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response1.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 2: PUT /v1/api/player/give
Write-Host "Teste 2: PUT /v1/api/player/give" -ForegroundColor Green
$body2 = @{
    steamId = $STEAM_ID
    itemId = $ITEM_ID
    quantity = $QUANTITY
} | ConvertTo-Json

try {
    $response2 = Invoke-WebRequest -Uri "$API_URL/v1/api/player/give" -Method PUT -Headers $headers -Body $body2 -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Status: $($response2.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response2.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 3: POST /v1/api/player/give
Write-Host "Teste 3: POST /v1/api/player/give" -ForegroundColor Green
try {
    $response3 = Invoke-WebRequest -Uri "$API_URL/v1/api/player/give" -Method POST -Headers $headers -Body $body2 -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Status: $($response3.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response3.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 4: POST /v1/api/player/item
Write-Host "Teste 4: POST /v1/api/player/item" -ForegroundColor Green
$body4 = @{
    playerId = $STEAM_ID
    itemId = $ITEM_ID
    count = $QUANTITY
} | ConvertTo-Json

try {
    $response4 = Invoke-WebRequest -Uri "$API_URL/v1/api/player/item" -Method POST -Headers $headers -Body $body4 -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Status: $($response4.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response4.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 5: POST /v1/api/giveitem
Write-Host "Teste 5: POST /v1/api/giveitem" -ForegroundColor Green
try {
    $response5 = Invoke-WebRequest -Uri "$API_URL/v1/api/giveitem" -Method POST -Headers $headers -Body $body1 -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Status: $($response5.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response5.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 6: Listar endpoints disponíveis
Write-Host "Teste 6: GET /v1/api" -ForegroundColor Green
try {
    $response6 = Invoke-WebRequest -Uri "$API_URL/v1/api" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ SUCESSO!" -ForegroundColor Green
    Write-Host "Status: $($response6.StatusCode)" -ForegroundColor White
    Write-Host "Response: $($response6.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Testes concluídos ===" -ForegroundColor Cyan
