# Re:Dungeon — Banco de Dados

Sistema administrativo responsável pelo gerenciamento dos dados e conteúdos do universo **Re:Dungeon**.

Este projeto funciona como uma aplicação separada do jogo principal, concentrando ferramentas administrativas e a estrutura de dados utilizada pelo Re:Dungeon.

> Projeto atualmente em desenvolvimento.

## Tecnologias

- HTML
- CSS
- JavaScript com módulos ES
- Vite
- ESLint
- Prettier
- Vitest
- Firebase Authentication
- Cloud Firestore

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

Instale as dependências:

```bash
npm install
```

## Desenvolvimento

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Depois, abra no navegador o endereço exibido pelo Vite no terminal.

Normalmente:

```text
http://localhost:5173/
```

## Verificações

Antes de enviar alterações para o repositório, execute:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

## Firebase

O projeto utiliza Firebase como infraestrutura principal do sistema.

### Firebase Authentication

Responsável pela autenticação dos usuários autorizados a acessar o Banco de Dados do Re:Dungeon.

### Cloud Firestore

Responsável pelo armazenamento e gerenciamento dos dados utilizados pelo sistema.

A estrutura será desenvolvida gradualmente conforme os módulos do Re:Dungeon forem implementados.

Entre os domínios planejados estão:

- Aventura
- Jogadores
- NPCs
- Criaturas
- Raças
- Classes
- Habilidades
- Itens
- Condições
- Missões
- Cultivo
- Vias Astrais
- CardFlux
- Notas
- Usuários

## Configuração do Firebase

1. Crie ou selecione o projeto correspondente no Firebase Console.
2. Registre um aplicativo Web.
3. Copie `.env.example` para `.env.local`.
4. Preencha as variáveis necessárias do Firebase em `.env.local`.
5. Nunca publique `.env.local` no GitHub.
6. Nunca coloque credenciais ou segredos diretamente no código-fonte.

Exemplo:

```text
.env.example
.env.local
```

O arquivo `.env.example` pode ser versionado.

O arquivo `.env.local` deve permanecer privado.

## Estrutura

A estrutura será expandida conforme o desenvolvimento do sistema.

```text
src/
├── database/             # Domínios e acesso aos dados do Re:Dungeon
│   ├── aventura/
│   ├── jogadores/
│   ├── npcs/
│   ├── criaturas/
│   ├── racas/
│   ├── classes/
│   ├── habilidades/
│   ├── itens/
│   ├── condicoes/
│   ├── missoes/
│   ├── cultivo/
│   ├── vias-astrais/
│   ├── cardflux/
│   ├── notas/
│   └── usuarios/
│
├── lib/
│   └── firebase/         # Configuração do Firebase, Auth e Firestore
│
├── pages/                # Telas do sistema administrativo
├── components/           # Componentes compartilhados
├── types/                # Tipos compartilhados
└── test/                 # Infraestrutura de testes
```

A estrutura real pode variar conforme novos módulos forem implementados.

## Banco de Dados

O Cloud Firestore será organizado por módulos do universo Re:Dungeon.

Cada módulo será desenvolvido separadamente para evitar acoplamento desnecessário e facilitar manutenção, testes e expansão do sistema.

A implementação das collections, documentos, referências e regras de segurança será feita gradualmente.

## Segurança

O Banco de Dados é uma ferramenta administrativa.

Não devem ser armazenados no repositório:

- senhas;
- tokens;
- arquivos `.env.local`;
- chaves privadas;
- credenciais administrativas;
- arquivos de conta de serviço;
- outros segredos.

O acesso aos dados não deve depender apenas da interface. As permissões também deverão ser protegidas pelas regras do Firebase.

## GitHub

Para enviar alterações:

```bash
git add .
git commit -m "descrição da alteração"
git push
```

Repositório:

`Re-Dungeon-Game-Banco-De-Dados`

## Status

🚧 **Em desenvolvimento**

Atualmente o projeto está sendo preparado para receber gradualmente a estrutura administrativa e os bancos de dados do Re:Dungeon.

---

**Re:Dungeon — Banco de Dados**  
Sistema administrativo do universo Re:Dungeon.