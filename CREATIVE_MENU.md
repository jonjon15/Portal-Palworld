# 🎮 Creative Menu - Portal Palworld

## 📋 Descrição

Interface visual estilo **Creative Menu** do mod Palworld, permitindo dropar itens para jogadores online através de uma interface web moderna e intuitiva.

## ✨ Funcionalidades

### 🎨 Interface Visual
- **Catálogo completo** com 100+ itens do Palworld
- **Categorias organizadas**: Recursos, Armas, Armaduras, Consumíveis, Esferas, Munição, Materiais, Construção e Especiais
- **Ícones visuais** para cada item
- **Busca em tempo real** por nome ou ID do item
- **Design moderno** inspirado no mod Creative Menu

### 🎯 Funcionalidades de Admin
- **Dropar itens** para qualquer jogador online
- **Controle de quantidade** (1 a 9999 unidades)
- **Seleção visual** de itens
- **Lista automática** de jogadores online
- **Feedback em tempo real** do status de envio

## 🚀 Como Usar

### 1. Configurar Permissões de Admin

No arquivo `.env`, adicione seu username:

```env
ADMIN_USERNAMES="seuusername"
```

Para múltiplos admins:
```env
ADMIN_USERNAMES="admin,jon,outrouser"
```

### 2. Acessar o Creative Menu

1. Faça login no Portal Palworld
2. No Dashboard, clique no card "🎮 Creative Menu"
3. Ou acesse diretamente: `http://localhost:3000/creative-menu.html`

### 3. Dropar Itens

1. **Selecione uma categoria** na barra lateral esquerda
2. **Clique em um item** no grid central
3. **Escolha o jogador** no dropdown (lista de jogadores online)
4. **Defina a quantidade** (padrão: 1)
5. **Clique em "DROPAR ITEM"**

## 📂 Estrutura de Arquivos

```
public/
├── creative-menu.html          # Interface principal do Creative Menu
├── admin.html                  # Interface clássica de admin
├── dashboard.html              # Dashboard atualizado com links
└── data/
    └── palworld-items.json     # Catálogo de itens do Palworld
```

## 🎯 Categorias de Itens

### 🪨 Recursos
Pedra, Madeira, Fibra, Minérios, Lingotes, Pólvora, Cimento

### ⚔️ Armas
Bastão, Lança, Arco, Besta, Pistola, Rifles, Escopeta, Lança-Foguetes, Lança-Chamas, Rifle Laser, Ferramentas

### 🛡️ Armaduras
Armaduras de Pano, Cobre, Ferro, Aço, Capacetes, Armaduras para Pals

### 🍖 Consumíveis
Alimentos, Bebidas, Poções de Vida e Stamina, Suprimentos Médicos

### ⚪ Esferas
Pal Sphere, Mega Sphere, Giga Sphere, Hyper Sphere, Ultra Sphere, Legendary Sphere

### 🔹 Munição
Flechas (Normal, Fogo, Veneno), Balas, Cartuchos, Foguetes, Balas Explosivas

### 🦴 Materiais
Couro, Tecido, Ossos, Chifres, Lã, Órgãos Elementais, Peças Antigas

### 🏗️ Construção
Paredes, Fundações, Portas (Madeira, Pedra, Metal), Baús, Camas, Fogueira

### ✨ Especiais
Moedas de Ouro, Pontos de Tecnologia, Livros de Esquemas, Frutas de Habilidade

## 🔧 Como Funciona

### Backend
O sistema usa a API existente em `/api/admin/drop-item.ts` que:
1. Verifica se o usuário é admin (via `ADMIN_USERNAMES`)
2. Tenta usar a API REST do PalDefender/PalGuard primeiro
3. Se falhar, usa RCON como fallback com comando `/give`

### Frontend
- **Carregamento dinâmico** do catálogo de itens
- **Atualização automática** da lista de jogadores (a cada 10s)
- **Validação** antes de enviar o item
- **Feedback visual** de sucesso/erro

## 🎨 Características da Interface

- **Design dark moderno** com gradientes e efeitos visuais
- **Responsivo** para desktop e tablets
- **Animações suaves** em hover e seleção
- **Ícones emoji** para fácil identificação
- **Busca instantânea** sem reload da página
- **Status em tempo real** de jogadores online

## 📝 Exemplos de IDs de Itens

```javascript
// Recursos
"Stone", "Wood", "Fiber", "Paldium"

// Armas
"Launcher_Default", "Rifle_Default", "AssaultRifle_Default"

// Esferas
"PalSphere", "MegaSphere", "GigaSphere"

// Consumíveis
"Bread", "CookedMeat", "HealthPotion"
```

## 🛠️ Solução de Problemas

### "Acesso admin não configurado"
Configure `ADMIN_USERNAMES` no arquivo `.env`

### "Nenhum jogador online"
Verifique se:
- O servidor Palworld está rodando
- A API PalDefender/PalGuard está acessível
- As configurações de RCON estão corretas

### Item não aparece no jogo
- Confirme que o ID do item está correto
- Verifique os logs do servidor RCON
- Teste com a página `/admin.html` clássica

## 🔒 Segurança

- ✅ Autenticação via JWT
- ✅ Verificação de permissões admin
- ✅ Validação de inputs
- ✅ Proteção CORS
- ✅ Tokens com expiração

## 📱 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Desktop e Tablet
- ⚠️ Mobile (layout adaptado mas experiência reduzida)

## 🚀 Próximas Melhorias

- [ ] Upload de ícones reais dos itens
- [ ] Categorias customizáveis
- [ ] Histórico de itens dropados
- [ ] Favoritos
- [ ] Dropar para múltiplos jogadores
- [ ] Templates de kits (conjuntos de itens)

## 📄 Licença

Este projeto é parte do Portal Palworld.

---

**Desenvolvido com ❤️ para a comunidade Palworld**
