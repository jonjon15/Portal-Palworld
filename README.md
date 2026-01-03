# Portal-Palworld

Portal web + API para integrar dados do Palworld (REST + opcional RCON) com autenticação (Prisma + JWT).

## Requisitos
- Node.js
- Banco Postgres (para Prisma)
- Variáveis de ambiente configuradas (veja `.env.example`)

## Setup (local)
1) Instalar deps: `npm install`
2) Criar `.env` baseado em `.env.example`
3) Rodar migrações: `npm run prisma:migrate`
4) Gerar Prisma Client: `npm run prisma:generate`

## Dev
- Frontend estático (só HTML): `npm run dev` (ou `npm run dev:static`)
- Full stack (inclui `/api` igual produção): `npm run dev:vercel`

## Deploy (Vercel)
- Configure `DATABASE_URL`, `JWT_SECRET`, `PALWORLD_API_URL`, `PALWORLD_API_USER`, `PALWORLD_API_PASS`.
- Opcional: `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`.
- Recomendado: `CORS_ALLOWED_ORIGINS` com seu domínio da Vercel.

### Admin (drop de itens)
- A página `/admin` só libera para usuários listados em `ADMIN_USERNAMES` (separado por vírgula).
- O endpoint `/api/admin/drop-item` executa um comando via RCON.
- Se você não informar um comando completo, o backend usa `PALWORLD_DROP_ITEM_COMMAND_TEMPLATE`.

### Player (drop de itens no próprio inventário)
- O endpoint `/api/player/drop-item` dá o item para o jogador vinculado ao usuário autenticado (tabela `Player`).
- Requer RCON configurado (`RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`).
- Body (JSON): `{ "item": "<nome/código do item>", "quantity": 1 }`
- Observação: o endpoint valida se o jogador está online antes de executar o comando.

### CORS (recomendado)
- Defina `CORS_ALLOWED_ORIGINS` com o(s) domínio(s) permitido(s), separado por vírgula.
- Chamadas via curl/PowerShell (sem header `Origin`) continuam funcionando.

### Setup de env vars via CLI
- Windows (PowerShell): `setup_env.ps1`
	- Exemplo:
		- Defina as variáveis no ambiente e rode: `powershell -ExecutionPolicy Bypass -File .\setup_env.ps1`
- Linux/Mac (bash): `setup_env.sh`