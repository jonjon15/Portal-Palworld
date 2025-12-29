#!/bin/bash

# Configurações do servidor Palworld
API_URL="http://201.93.248.252:8212"
API_USER="admin"
API_PASS="admin"  # Tentar com senha padrão primeiro
RCON_HOST="201.93.248.252"
RCON_PORT="25575"
RCON_PASS="060892"

echo "Configurando variáveis de ambiente no Vercel..."

# PALWORLD_API_URL
echo "$API_URL" | vercel env add PALWORLD_API_URL production

# PALWORLD_API_USER  
echo "$API_USER" | vercel env add PALWORLD_API_USER production

# PALWORLD_API_PASS
echo "$API_PASS" | vercel env add PALWORLD_API_PASS production

# RCON_HOST
echo "$RCON_HOST" | vercel env add RCON_HOST production

# RCON_PORT
echo "$RCON_PORT" | vercel env add RCON_PORT production

# RCON_PASSWORD
echo "$RCON_PASS" | vercel env add RCON_PASSWORD production

echo "Configuração concluída!"
