# Testar comando /give via RCON
$RCON_HOST = "201.93.248.252"
$RCON_PORT = 25575
$RCON_PASSWORD = "060892"

$STEAM_ID = "steam_76561198000866703"
$ITEM = "Shield_01"
$QUANTITY = 1

Write-Host "=== Teste RCON /give ===" -ForegroundColor Cyan
Write-Host "Host: $RCON_HOST:$RCON_PORT" -ForegroundColor Yellow
Write-Host "Comando: /give $STEAM_ID $ITEM $QUANTITY" -ForegroundColor Yellow
Write-Host ""

# Instalar mcrcon se não existir
if (!(Test-Path ".\mcrcon.exe")) {
    Write-Host "Baixando mcrcon..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/Tiiffi/mcrcon/releases/download/v0.7.2/mcrcon-0.7.2-windows-x86-64.zip" -OutFile "mcrcon.zip"
    Expand-Archive -Path "mcrcon.zip" -DestinationPath "." -Force
    Remove-Item "mcrcon.zip"
}

# Executar comando
$command = "/give $STEAM_ID $ITEM $QUANTITY"
Write-Host "Enviando comando..." -ForegroundColor Green

$result = & .\mcrcon.exe -H $RCON_HOST -P $RCON_PORT -p $RCON_PASSWORD $command 2>&1

Write-Host ""
Write-Host "Resposta do servidor:" -ForegroundColor Cyan
Write-Host $result -ForegroundColor White
Write-Host ""

if ($result -match "Unknown command" -or $result -match "not found") {
    Write-Host "❌ Comando /give NÃO EXISTE no servidor" -ForegroundColor Red
    Write-Host "   O PalDefender pode não estar instalado ou configurado" -ForegroundColor Yellow
} elseif ($result -match "error" -or $result -match "failed") {
    Write-Host "❌ Erro ao executar comando" -ForegroundColor Red
} else {
    Write-Host "✅ Comando executado! Verifique no jogo se o item apareceu" -ForegroundColor Green
}
