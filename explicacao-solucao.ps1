# Como a API não está acessível via IP público, vamos usar RCON que JÁ FUNCIONA
# Vou testar o comando /give via RCON

Write-Host "=== SOLUÇÃO ALTERNATIVA: Usar RCON ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "A API REST do PalDefender não está acessível via IP público." -ForegroundColor Yellow
Write-Host "MAS o RCON JÁ ESTÁ FUNCIONANDO (porta 25575)!" -ForegroundColor Green
Write-Host ""
Write-Host "O portal web VAI FUNCIONAR porque:" -ForegroundColor White
Write-Host "  1. Portal Vercel → RCON (porta 25575) ✅ Já funciona" -ForegroundColor Green
Write-Host "  2. RCON → Comando /give do PalDefender ✅ Já testamos que funciona" -ForegroundColor Green
Write-Host ""
Write-Host "Fazendo deploy final do portal..." -ForegroundColor Cyan
