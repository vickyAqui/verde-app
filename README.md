# +Verde

App de mapeamento de áreas não verdes e conexão entre pessoas e ONGs de reflorestamento.

## Stack

- **Mobile:** React Native (Expo)
- **Backend:** Node.js + Express
- **Banco:** MySQL + Sequelize ORM
- **Auth:** JWT

---

## Estrutura do Projeto

```
+Verde/
├── backend/                    # API REST
│   ├── src/
│   │   ├── config/            # Database, Sequelize
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── database/
│   │   │   ├── migrations/    # Criação das tabelas
│   │   │   └── seeders/       # Dados de teste
│   │   ├── middlewares/       # Auth, validação, erros
│   │   ├── models/            # Models (Sequelize)
│   │   ├── routes/            # Rotas REST
│   │   └── validators/        # Validação com Yup
│   └── uploads/               # Arquivos enviados
│
├── mobile/                     # App React Native
│   ├── src/
│   │   ├── api/               # Axios + interceptors
│   │   ├── contexts/          # AuthContext
│   │   ├── navigation/        # Stack + Tab Navigator
│   │   └── screens/
│   │       ├── auth/          # Login, Register
│   │       ├── home/          # Dashboard
│   │       ├── areas/         # Lista de áreas
│   │       ├── ngos/          # Lista de ONGs
│   │       ├── projetos/      # Projetos do usuário
│   │       ├── denuncias/     # Denúncias
│   │       └── profile/       # Perfil
│   └── app.json               # Configuração Expo
│
├── admin/                      # Painel admin (a implementar)
├── dbDadosVerde.sql            # Script SQL do banco
└── .gitignore
```

---

## Banco de Dados

Estrutura conforme `dbDadosVerde.sql`:

```sql
tbl_Usuario       -- idUsuario, nome, email, senha
tbl_Admin         -- idAdmin, idUsuario (FK)
tbl_UsuarioComum  -- idUsarioComum, idUsuario (FK), cpf, dataNasc
tbl_Area          -- idArea, cidade, bairro, rua, statusArea
tbl_Ongs          -- idOngs, idUsuario (FK), regiao, cnpj, telefone, descricao
tbl_Projeto       -- id_Projeto, idUsuario (FK), objetivo, descricao, percentualConclusao
tbl_Denuncias     -- idDenuncias, idUsuario (FK), idArea (FK), titulo, dataDenuncia,
                    statusDenuncia, descricao, foto
```

### Relacionamentos

```
Usuario ──1:1──> Admin
Usuario ──1:1──> UsuarioComum
Usuario ──1:1──> Ongs
Usuario ──1:N──> Projeto
Usuario ──1:N──> Denuncias
Area ────1:N──> Denuncias
```

---

## Setup

### Pré-requisitos

- Node.js >= 18
- MySQL >= 8 (ou Docker)
- Expo CLI (`npm install -g expo-cli`)

---

### Setup com Docker (Recomendado)

O Docker cuida de tudo: sobe o MySQL, o backend, cria o banco, roda as migrations e seeders. O time não precisa ter MySQL instalado na máquina.

#### Primeira vez

```bash
# 1. Clonar o repositório
git clone https://github.com/vickyAqui/verde-app.git
cd verde-app

# 2. Copiar o .env
cp backend/.env.example backend/.env

# 3. Subir tudo de uma vez
npm run setup
```

Esse comando:
1. Sobe o container do MySQL (porta 3306)
2. Sobe o container do Backend (porta 3333)
3. Roda as migrations (cria as tabelas)
4. Roda os seeders (popula com dados de teste)

Pronto. A API já está rodando em `http://localhost:3333`.

#### Dia a dia

```bash
# Iniciar o ambiente (MySQL + Backend)
npm run dev

# Em outro terminal, quando precisar:
npm run migrate          # Rodar migrations
npm run seed             # Rodar seeders

# Parar tudo
npm run stop
```

O Docker tem **hot reload**: qualquer alteração nos arquivos do `backend/src/` reinicia o servidor automaticamente. Não precisa parar e subir de novo.

#### Comandos de controle

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe MySQL + Backend |
| `npm run stop` | Para todos os containers |
| `npm run logs` | Ver logs do backend em tempo real |
| `npm run db:shell` | Entrar no MySQL direto pelo terminal |
| `npm run migrate` | Rodar migrations |
| `npm run seed` | Rodar seeders (dados de teste) |
| `npm run reset` | Apagar tudo e recomeçar do zero |

#### Fluxo de trabalho

```
Terminal 1                    Terminal 2
──────────                    ──────────
npm run dev                   npm run migrate
(watch os logs)               npm run seed
```

1. **Terminal 1:** Roda `npm run dev` — sobe os containers e fica exibindo os logs
2. **Terminal 2:** Roda `npm run migrate` e `npm run seed` — prepara o banco
3. A partir daí, é só codar. O backend reinicia sozinho quando você salva um arquivo

#### Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| Backend | 3333 | `http://localhost:3333` |
| MySQL | 3306 | `localhost:3306` |

#### Credenciais do MySQL (Docker)

| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Porta | `3306` |
| Usuário | `root` |
| Senha | `root` |
| Banco | `dbDadosVerde` |

#### Criando um novo migration

Quando precisar criar uma nova migration:

```bash
# Criar migration (no backend/)
npx sequelize-cli migration:generate --name nome-da-migration

# Rodar migration
npm run migrate
```

#### Resetando o banco

Se estragar algo ou quiser recomeçar:

```bash
npm run reset
```

Isso apaga o banco, recria tudo e popula com os dados de teste.

#### Sem Docker?

Se preferir rodar sem Docker (com MySQL instalado na máquina):

```bash
cd backend
cp .env.example .env
# Editar .env com suas credenciais do MySQL local

npm install
mysql -u root -e "CREATE DATABASE dbDadosVerde"
npm run migrate
npm run seed
npm run dev
```

---

### Mobile

```bash
cd mobile

# Instalar dependências
npm install

# Iniciar Expo
npx expo start
```

Scanear o QR Code com o Expo Go (iOS/Android).

> **Nota:** O mobile se conecta ao backend em `http://localhost:3333`. Se estiver usando Docker, o backend já está rodando. Se estiver rodando manualmente, certifique-se de que o backend está ativo antes de abrir o app.

---

## Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@verde.com | 123456 |
| Usuário | maria@verde.com | 123456 |
| Usuário | joao@verde.com | 123456 |

---

## API REST

Base URL: `http://localhost:3333/api`

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/login` | Login | Não |
| POST | `/auth/register` | Cadastro | Não |

**Body login:**
```json
{ "email": "admin@verde.com", "senha": "123456" }
```

**Body register:**
```json
{ "nome": "Nome", "email": "email@test.com", "senha": "123456", "cpf": "12345678901", "dataNasc": "1995-06-15" }
```

### Usuários

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/usuarios/profile` | Ver perfil | Sim |
| PUT | `/usuarios/profile` | Atualizar perfil | Sim |
| DELETE | `/usuarios/profile` | Deletar conta | Sim |

### Áreas

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/areas` | Listar áreas | Sim |
| GET | `/areas/:id` | Buscar área | Sim |
| POST | `/areas` | Criar área | Sim |
| PUT | `/areas/:id` | Atualizar área | Sim |
| DELETE | `/areas/:id` | Deletar área | Sim |

**Filtros:** `?cidade=São Paulo&bairro=Mooca&statusArea=identificada`

**Body criar área:**
```json
{ "cidade": "São Paulo", "bairro": "Mooca", "rua": "Rua da Graça", "statusArea": "identificada" }
```

### ONGs

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/ongs` | Listar ONGs | Sim |
| GET | `/ongs/:id` | Buscar ONG | Sim |
| POST | `/ongs` | Cadastrar ONG | Sim |

**Filtro:** `?regiao=Centro-Sul`

### Projetos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/projetos` | Listar projetos do usuário | Sim |
| GET | `/projetos/:id` | Buscar projeto | Sim |
| POST | `/projetos` | Criar projeto | Sim |
| PUT | `/projetos/:id` | Atualizar projeto | Sim |
| DELETE | `/projetos/:id` | Deletar projeto | Sim |

**Body criar projeto:**
```json
{ "objetivo": "Reflorestar área urbana", "descricao": "Plantio de 50 árvores" }
```

### Denúncias

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/denuncias` | Listar denúncias | Sim |
| GET | `/denuncias/:id` | Buscar denúncia | Sim |
| POST | `/denuncias` | Criar denúncia | Sim |
| PUT | `/denuncias/:id` | Atualizar denúncia | Sim |

**Filtros:** `?idArea=1&statusDenuncia=aberta`

**Body criar denúncia:**
```json
{ "idArea": 1, "titulo": "Desmatamento", "descricao": "Área com árvores derrubadas", "foto": "url_foto" }
```

### Admin

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/admin/dashboard` | Estatísticas gerais | Admin |
| GET | `/admin/usuarios` | Listar todos os usuários | Admin |
| GET | `/admin/areas` | Listar todas as áreas | Admin |
| GET | `/admin/ongs` | Listar todas as ONGs | Admin |
| GET | `/admin/denuncias` | Listar todas as denúncias | Admin |

---

## Autenticação

Para rotas autenticadas, enviar header:

```
Authorization: Bearer <token>
```

O token é retornado no login/register.

### Roles

- **admin:** Acessa rotas `/admin/*`. Identificado pela existência de registro em `tbl_Admin`.
- **comum:** Usuário comum. Identificado pela existência de registro em `tbl_UsuarioComum`.

---

## Mobile - Screens

| Screen | Descrição |
|--------|-----------|
| LoginScreen | Tela de login |
| RegisterScreen | Cadastro de usuário |
| HomeScreen | Dashboard com resumo |
| AreasScreen | Lista de áreas não verdes |
| NGOsScreen | Lista de ONGs |
| ProjetosScreen | Projetos do usuário (com % conclusão) |
| DenunciasScreen | Lista de denúncias |
| ProfileScreen | Perfil + logout |

---

## Mobile - Navegação

```
AuthStack (não logado)
├── Login
└── Register

MainTab (logado)
├── Home
├── Areas
├── ONGs
├── Projetos
├── Denuncias
└── Profile
```

---

## Deploy (futuro)

### Backend
- Railway, Render, ou Vercel (serverless)
- MySQL: PlanetScale, Railway, ou AWS RDS

### Mobile
- EAS Build (Expo)
- Produção: `eas build --platform android` / `eas build --platform ios`

---

## Comandos Úteis

```bash
# Backend
npm run dev              # Iniciar em dev
npm run migrate          # Rodar migrations
npm run migrate:undo     # Desfazer última migration
npm run seed             # Rodar seeders
npm run seed:undo        # Desfazer seeders

# Mobile
npx expo start           # Iniciar Expo
npx expo start --clear   # Limpar cache
```

---

## Contribuição

1. Criar branch (`git checkout -b feature/nome`)
2. Commitar (`git commit -m "feat: descrição"`)
3. Push (`git push origin feature/nome`)
4. Abrir Pull Request
