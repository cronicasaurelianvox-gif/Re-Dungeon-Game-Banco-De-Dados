# Re:Dungeon — Banco de Dados

Aplicação administrativa e infraestrutura de dados do **Re:Dungeon**.

Este projeto será responsável pelo gerenciamento do conteúdo global do jogo, autenticação, dados dos jogadores e integração com os serviços Firebase utilizados pelo ecossistema Re:Dungeon.

> 🚧 Projeto em desenvolvimento.

---

## Objetivo

O Re:Dungeon utiliza um único projeto Firebase organizado em coleções.

A arquitetura separa dois tipos principais de informação:

### Conteúdo Global

Representa tudo aquilo que existe no jogo e é definido administrativamente.

Exemplos:

- Modos de jogo
- Personagens
- Habilidades
- Talentos
- Objetivos
- Conquistas
- Crônicas
- Itens
- Materiais
- Receitas
- Inimigos
- Cartas
- Eventos
- Recompensas
- Loja
- Mundo e exploração
- Configurações globais

### Dados do Jogador

Representam o progresso individual de cada conta.

Exemplos:

- Perfil
- Progresso da Aventura
- Progresso da Partida Rápida
- Progresso dos Desafios
- Personagens desbloqueados
- Inventário
- Objetivos
- Conquistas
- Crônicas descobertas
- Mapas
- Carteira
- Histórico de transações

A definição global de um conteúdo nunca deve ser confundida com o progresso individual do jogador.

---

# Firebase

A infraestrutura será baseada nos seguintes serviços:

## Firebase Authentication

Responsável pela identidade e autenticação de:

- jogadores;
- administradores.

## Cloud Firestore

Banco principal para dados estruturados.

Será utilizado para armazenar:

- conteúdo global;
- configurações;
- personagens;
- modos;
- objetivos;
- inventário;
- progressão;
- dados individuais dos jogadores.

## Firebase Storage

Reservado para arquivos pesados ou que precisem ser substituídos remotamente.

Exemplos:

- músicas grandes;
- spritesheets;
- mapas;
- vídeos;
- outros assets remotos.

Assets pequenos e estáticos podem continuar no projeto.

## Cloud Functions

Utilizadas posteriormente para operações protegidas.

Exemplos:

- recompensas;
- compras;
- Trickster Coins;
- economia;
- validações;
- alterações críticas de progresso.

Operações sensíveis não devem depender exclusivamente do frontend.

## Firebase Hosting

Poderá ser utilizado futuramente para hospedagem da aplicação web, caso necessário.

---

# Estrutura do Firestore

## Coleções globais

Estrutura inicialmente planejada:

```text
gameModes/
characters/
abilities/
talents/
achievements/
objectives/
chronicles/
shopItems/
items/
materials/
recipes/
enemies/
cards/
events/
rewards/
realms/
maps/
locations/
musicTracks/
gameConfig/
```

Essas coleções representam definições globais do Re:Dungeon.

---

# Modos de jogo

Os modos principais são:

```text
gameModes/adventure
gameModes/quickMatch
gameModes/challenge
```

Cada modo possui uma definição global.

O progresso individual permanece associado ao usuário.

Exemplo:

```text
users/{userId}/gameProgress/adventure
users/{userId}/gameProgress/quickMatch
users/{userId}/gameProgress/challenge
```

Isso permite atualizar regras e conteúdo sem apagar o histórico individual dos jogadores.

---

# Dados do jogador

Todos os dados individuais ficam associados ao usuário autenticado.

Estrutura conceitual:

```text
users/{userId}/

├── profile
│
├── gameProgress/
│   ├── adventure
│   ├── quickMatch
│   └── challenge
│
├── characters/
│   └── {characterId}
│
├── globalInventory/
│   └── {itemId}
│
├── objectives/
│   └── {objectiveId}
│
├── achievements/
│   └── {achievementId}
│
├── chronicles/
│   └── {chronicleId}
│
├── maps/
│   └── {mapId}
│
├── wallet/
│   └── main
│
└── walletTransactions/
    └── {transactionId}
```

---

# Separação entre definição e progresso

Esta é uma das regras principais da arquitetura.

### Personagem global

```text
characters/{characterId}
```

Define o personagem existente no jogo.

### Personagem do jogador

```text
users/{userId}/characters/{characterId}
```

Armazena o progresso daquela conta com esse personagem.

O mesmo princípio será aplicado a outros sistemas.

Por exemplo:

```text
objectives/{objectiveId}
```

define um objetivo.

Enquanto:

```text
users/{userId}/objectives/{objectiveId}
```

armazena o progresso daquele jogador.

---

# Inventário

Existirão dois contextos diferentes de inventário.

## Inventário global da conta

```text
users/{userId}/globalInventory/{itemId}
```

Pode armazenar:

- materiais;
- recursos;
- fragmentos;
- receitas;
- itens de missão;
- recursos compartilhados.

## Inventário do personagem

```text
users/{userId}/characters/{characterId}/inventory/{itemId}
```

Pode armazenar:

- armas;
- armaduras;
- acessórios;
- itens equipados;
- equipamentos vinculados ao personagem.

---

# Economia

A carteira do jogador ficará associada à conta:

```text
users/{userId}/wallet/main
```

E o histórico:

```text
users/{userId}/walletTransactions/{transactionId}
```

Operações envolvendo:

- Trickster Coins;
- compras;
- recompensas;
- transações;
- progresso crítico;

não deverão ser livremente alteradas pelo navegador.

Essas operações deverão utilizar regras de segurança e, quando necessário, Cloud Functions.

---

# Estrutura do projeto

Estrutura base planejada:

```text
src/
├── components/
├── pages/
│
├── features/
│   ├── adventure/
│   ├── quick-match/
│   ├── challenge/
│   ├── characters/
│   ├── inventory/
│   ├── objectives/
│   ├── achievements/
│   ├── chronicles/
│   ├── shop/
│   └── music/
│
├── lib/
│   ├── firebase.ts
│   ├── auth.ts
│   └── firestore.ts
│
├── types/
└── styles/

public/
└── assets/
    ├── animations/
    ├── images/
    ├── icons/
    └── music/

functions/

firestore.rules
firestore.indexes.json
firebase.json
.env.example
.gitignore
README.md
```

A estrutura poderá crescer conforme os sistemas do Re:Dungeon forem implementados.

---

# Camada de acesso aos dados

As chamadas do Firestore não devem ficar espalhadas pelos componentes da interface.

O projeto utilizará uma camada dedicada para acesso aos dados.

Exemplos futuros:

```text
getPublishedGameModes()
getPublishedCharacters()
getCharacterById()
getPublishedAbilities()
getPublishedTalents()
getPublishedObjectives()

getPlayerProfile()
getPlayerCharacters()
getGlobalInventory()
getCharacterInventory()

getPlayerObjectives()
getPlayerAchievements()
getPlayerChronicles()

getShopItems()
getWallet()
```

Essa camada permitirá separar:

```text
Interface
    ↓
Camada de dados
    ↓
Firestore
```

---

# Aplicação administrativa

Este repositório também servirá como base para a interface administrativa do Re:Dungeon.

O sistema administrativo permitirá futuramente gerenciar e publicar conteúdos como:

- personagens;
- habilidades;
- talentos;
- modos de jogo;
- objetivos;
- conquistas;
- crônicas;
- itens;
- inimigos;
- cartas;
- eventos;
- recompensas;
- configurações.

O acesso administrativo utilizará Firebase Authentication e permissões seguras.

---

# Variáveis de ambiente

Criar:

```text
.env.local
```

a partir de:

```text
.env.example
```

Estrutura esperada:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

O arquivo `.env.local` nunca deve ser enviado ao GitHub.

---

# Segurança

Podem existir no frontend apenas as configurações públicas necessárias ao Firebase Web SDK.

Nunca colocar no frontend:

- Service Account;
- Private Key;
- Firebase Admin SDK credentials;
- senhas administrativas;
- tokens privados;
- credenciais com acesso irrestrito.

Credenciais administrativas devem existir somente em ambiente seguro.

As regras do Firestore também não devem utilizar:

```text
allow read, write: if true
```

em produção.

---

# Desenvolvimento

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

```bash
npm install
```

## Executar

```bash
npm run dev
```

## Verificações

Antes de publicar alterações:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

---

# Git

Este projeto possui repositório próprio e é separado do código principal do jogo.

Antes de enviar alterações:

```bash
git status
```

Adicionar:

```bash
git add .
```

Criar commit:

```bash
git commit -m "descrição da alteração"
```

Enviar:

```bash
git push
```

Nunca enviar:

```text
.env
.env.local
serviceAccountKey.json
private keys
credenciais administrativas
```

---

# Ordem de implementação

A implementação seguirá uma sequência gradual.

### Etapa 1

Firebase, Authentication, variáveis de ambiente e regras básicas.

### Etapa 2

Tipos, coleções globais e leitura do conteúdo publicado.

### Etapa 3

Perfil, personagens, inventário, objetivos e conquistas dos jogadores.

### Etapa 4

Integração dos modos:

- Aventura;
- Partida Rápida;
- Desafio.

### Etapa 5

Loja, Trickster Coins, compras e operações protegidas com Cloud Functions.

### Etapa 6

Expansão do aplicativo administrativo e fluxo de publicação.

---

# Regra arquitetural principal

O Re:Dungeon **não utiliza um banco separado para cada sistema**.

Existe um único projeto Firebase organizado em:

```text
FIREBASE
│
├── CONTEÚDO GLOBAL
│   ├── characters
│   ├── abilities
│   ├── items
│   ├── gameModes
│   ├── objectives
│   └── ...
│
└── USERS
    └── {userId}
        ├── profile
        ├── gameProgress
        ├── characters
        ├── inventory
        ├── objectives
        ├── achievements
        ├── chronicles
        └── wallet
```

O conteúdo global define **o que existe no jogo**.

Os dados dentro de `users/{userId}` definem **o que aquele jogador possui, desbloqueou, equipou ou concluiu**.

---

## Status

🚧 **Em desenvolvimento**

A arquitetura será implementada gradualmente para evitar acoplamento, duplicação de dados e operações inseguras.

**Re:Dungeon — Banco de Dados**  
Infraestrutura e sistema administrativo do universo Re:Dungeon.