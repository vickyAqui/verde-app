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

O Docker sobe o backend + MySQL automaticamente, sem precisar instalar nada além do Docker.

```bash
# Copiar .env do backend
cp backend/.env.example backend/.env

# Subir tudo (MySQL + Backend + Migrations + Seeders)
npm run setup

# Ou passo a passo:
npm run dev              # Sobe MySQL + Backend
npm run migrate          # Rodar migrations (em outro terminal)
npm run seed             # Rodar seeders (em outro terminal)
```

**Comandos Docker:**

```bash
npm run dev              # Subir tudo (backend + MySQL)
npm run stop             # Parar tudo
npm run logs             # Ver logs
npm run db:shell         # Entrar no MySQL
npm run reset            # Resetar banco (drop + recreate + seed)
```

Backend roda em `http://localhost:3333`
MySQL roda em `localhost:3306` (usuário: `root`, senha: `root`)

---

### Setup Manual (sem Docker)

#### Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar banco de dados
mysql -u root -e "CREATE DATABASE dbDadosVerde"

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do MySQL

# Rodar migrations
npm run migrate

# Rodar seeders (dados de teste)
npm run seed

# Iniciar servidor
npm run dev
```

Servidor roda em `http://localhost:3333`

#### Mobile

```bash
cd mobile

# Instalar dependências
npm install

# Iniciar Expo
npx expo start
```

Scanear o QR Code com o Expo Go (iOS/Android).

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
