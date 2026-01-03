# Diagnóstico da API PalDefender
$API_URL = "http://201.93.248.252:8212"

Write-Host "=== Diagnóstico API PalDefender ===" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Verificar se a porta está aberta
Write-Host "Teste 1: Verificando se a porta 8212 está aberta..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("201.93.248.252", 8212)
    $tcpClient.Close()
    Write-Host "✅ Porta 8212 está ABERTA" -ForegroundColor Green
} catch {
    Write-Host "❌ Porta 8212 está FECHADA ou bloqueada" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 2: Tentar acessar sem autenticação
Write-Host "Teste 2: GET $API_URL (sem autenticação)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $API_URL -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Resposta recebida!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Content: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Teste 3: Tentar /v1/api/players (sabemos que funciona)
Write-Host "Teste 3: GET /v1/api/players (com autenticação)" -ForegroundColor Yellow
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:060892"))
$headers = @{ "Authorization" = "Basic $credentials" }

try {
    $response = Invoke-WebRequest -Uri "$API_URL/v1/api/players" -Method GET -Headers $headers -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ SUCESSO! API está funcionando!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Jogadores: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 4: Verificar se PalDefender está instalado
Write-Host "Teste 4: Verificando instalação do PalDefender..." -ForegroundColor Yellow
$paldefenderPath = "D:\SteamLibrary\steamapps\common\PalServer\Pal\Binaries\Win64\Mods\PalDefender"
if (Test-Path $paldefenderPath) {
    Write-Host "✅ PalDefender encontrado em: $paldefenderPath" -ForegroundColor Green
    
    # Verificar config
    $configPath = Join-Path $paldefenderPath "Config.json"
    if (Test-Path $configPath) {
        Write-Host "✅ Config.json encontrado" -ForegroundColor Green
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        Write-Host "   API Enabled: $($config.WebAPI.Enabled)" -ForegroundColor Cyan
        Write-Host "   API Port: $($config.WebAPI.Port)" -ForegroundColor Cyan
        Write-Host "   API Username: $($config.WebAPI.Username)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Config.json NÃO encontrado" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ PalDefender NÃO encontrado no caminho padrão" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Diagnóstico concluído ===" -ForegroundColor Cyan
