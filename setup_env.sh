#!/bin/bash

# Configurações do servidor Palworld (NÃO deixe senhas hardcoded aqui)
# Rode assim:
#   PALWORLD_API_USER=admin PALWORLD_API_PASS=xxxx RCON_PASSWORD=yyyy ./setup_env.sh

API_URL="${PALWORLD_API_URL:-http://201.93.248.252:8212}"
API_USER="${PALWORLD_API_USER:-}"
API_PASS="${PALWORLD_API_PASS:-}"

RCON_HOST="${RCON_HOST:-201.93.248.252}"
RCON_PORT="${RCON_PORT:-25575}"
RCON_PASSWORD="${RCON_PASSWORD:-}"

ADMIN_USERNAMES="${ADMIN_USERNAMES:-}"

if [ -z "$API_USER" ] || [ -z "$API_PASS" ]; then
	echo "Erro: defina PALWORLD_API_USER e PALWORLD_API_PASS antes de rodar."
	exit 1
fi

if [ -z "$RCON_PASSWORD" ]; then
	echo "Erro: defina RCON_PASSWORD antes de rodar."
	exit 1
fi

if [ -z "$ADMIN_USERNAMES" ]; then
	echo "Erro: defina ADMIN_USERNAMES antes de rodar. Ex: ADMIN_USERNAMES=admin,jon"
	exit 1
fi

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
echo "$RCON_PASSWORD" | vercel env add RCON_PASSWORD production

# ADMIN_USERNAMES
echo "$ADMIN_USERNAMES" | vercel env add ADMIN_USERNAMES production

echo "Configuração concluída!"
