# 🚀 BoletoReminder SaaS

> Sistema SaaS completo para gestão e cobrança de boletos com integração WhatsApp, Open Finance e notificações push.

## 📋 Funcionalidades Implementadas

### ✅ Core Features
- **Autenticação Multi-tenant** com NextAuth.js (Google OAuth + Credenciais)
- **Dashboard Completo** com métricas em tempo real
- **Gestão de Clientes** (CRUD completo)
- **Gestão de Boletos** (Upload .rem, geração, acompanhamento)
- **Sistema de Lembretes** automatizados
- **Relatórios Avançados** com filtros e exportação
- **Sistema de Planos** (Starter, Pro, Enterprise)
- **PWA** (Progressive Web App) com offline support

### 🔗 Integrações
- **WhatsApp Business API** para envio de lembretes
- **Open Finance** para consulta de dados bancários
- **Push Notifications** via Firebase
- **Upload de Arquivos .rem** com parser automático

### 🎨 Interface
- **Design System** completo com Tailwind CSS
- **Tema Claro/Escuro** automático
- **Componentes Reutilizáveis** (shadcn/ui)
- **Responsivo** para mobile e desktop
- **Animações** e transições suaves

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** (App Router)
- **React 18** com TypeScript
- **Tailwind CSS** + shadcn/ui
- **Framer Motion** para animações
- **React Hook Form** + Zod validação

### Backend
- **Next.js API Routes**
- **Prisma ORM** com PostgreSQL
- **NextAuth.js** para autenticação
- **Bull Queue** para processamento assíncrono

### Infraestrutura
- **Docker** + Docker Compose
- **PostgreSQL** como banco principal
- **Redis** para cache e filas
- **Firebase** para push notifications

### Integrações
- **WhatsApp Business API**
- **Open Finance APIs**
- **Google OAuth**
- **Parser de arquivos .rem**

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- Conta Google (OAuth)
- WhatsApp Business API (opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/jorgehenriquess/boleto-reminder-saas.git
cd boleto-reminder-saas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas configurações

# Inicie os serviços com Docker
docker-compose up -d

# Execute as migrações do banco
npx prisma migrate dev

# Popule o banco com dados de exemplo
npx prisma db seed

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/boleto_reminder"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# WhatsApp (opcional)
WHATSAPP_API_URL="https://api.whatsapp.com"
WHATSAPP_TOKEN="your-whatsapp-token"

# Firebase (opcional)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-client-email"

# Redis
REDIS_URL="redis://localhost:6379"
```

## 📱 Fluxo de Uso

### 1. Cadastro e Onboarding
1. Usuário se cadastra via Google OAuth
2. Completa o onboarding (dados da empresa, plano)
3. Configura integrações (WhatsApp, Open Finance)

### 2. Gestão de Clientes
1. Adiciona clientes manualmente ou via importação
2. Valida dados (CPF/CNPJ, telefone)
3. Organiza por tags e categorias

### 3. Gestão de Boletos
1. Faz upload de arquivo .rem ou cria manualmente
2. Sistema processa e extrai dados automaticamente
3. Boletos ficam disponíveis no dashboard

### 4. Lembretes Automáticos
1. Sistema monitora vencimentos
2. Envia lembretes via WhatsApp/Push
3. Registra tentativas e respostas

### 5. Relatórios e Analytics
1. Visualiza métricas em tempo real
2. Gera relatórios personalizados
3. Exporta dados para análise

## 💰 Planos e Limites

### Starter (Gratuito)
- 50 boletos/mês
- 100 clientes
- Lembretes básicos
- Suporte por email

### Pro (R$ 49/mês)
- 500 boletos/mês
- 1.000 clientes
- WhatsApp + Push notifications
- Relatórios avançados
- Suporte prioritário

### Enterprise (R$ 149/mês)
- Boletos ilimitados
- Clientes ilimitados
- Open Finance integration
- API access
- Suporte dedicado
- White-label option

## 📄 Upload de Arquivos .rem

O sistema suporta upload e processamento automático de arquivos .rem (Remessa bancária):

### Formatos Suportados
- CNAB 240 (Febraban)
- CNAB 400 (Febraban)
- Arquivos de retorno bancário

### Processamento Automático
1. **Validação** do formato e estrutura
2. **Extração** de dados dos boletos
3. **Associação** com clientes existentes
4. **Criação** automática de novos registros
5. **Notificação** de erros ou inconsistências

### Campos Extraídos
- Dados do beneficiário
- Informações do pagador
- Valores e vencimentos
- Códigos de barras
- Instruções bancárias

## 🔗 Integrações

### WhatsApp Business API
- Envio de lembretes personalizados
- Templates aprovados pelo WhatsApp
- Webhook para respostas
- Métricas de entrega

### Open Finance
- Consulta de dados bancários
- Verificação de conta corrente
- Histórico de transações
- Score de crédito

### Push Notifications
- Notificações em tempo real
- Suporte offline
- Segmentação de usuários
- Analytics de engajamento

## 🔌 APIs Principais

### Autenticação
```typescript
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
```

### Clientes
```typescript
GET    /api/clients          # Listar clientes
POST   /api/clients          # Criar cliente
GET    /api/clients/[id]     # Buscar cliente
PUT    /api/clients/[id]     # Atualizar cliente
DELETE /api/clients/[id]     # Deletar cliente
```

### Boletos
```typescript
GET    /api/boletos          # Listar boletos
POST   /api/boletos          # Criar boleto
GET    /api/boletos/[id]     # Buscar boleto
PUT    /api/boletos/[id]     # Atualizar boleto
POST   /api/boletos/upload   # Upload arquivo .rem
```

### Lembretes
```typescript
GET    /api/reminders        # Listar lembretes
POST   /api/reminders        # Criar lembrete
POST   /api/reminders/send   # Enviar lembrete
```

### WhatsApp
```typescript
POST   /api/whatsapp/send    # Enviar mensagem
POST   /api/whatsapp/webhook # Webhook do WhatsApp
GET    /api/whatsapp/status  # Status da integração
```

### Relatórios
```typescript
GET    /api/reports/dashboard    # Métricas do dashboard
GET    /api/reports/boletos     # Relatório de boletos
GET    /api/reports/clientes    # Relatório de clientes
POST   /api/reports/export      # Exportar relatório
```

## 🧪 Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting
npm run type-check   # Verifica tipos TypeScript

# Banco de dados
npx prisma migrate dev    # Executa migrações
npx prisma db seed        # Popula banco com dados de exemplo
npx prisma studio         # Interface visual do banco
npx prisma generate       # Gera cliente Prisma

# Docker
docker-compose up -d      # Inicia serviços
docker-compose down       # Para serviços
docker-compose logs -f    # Visualiza logs

# Testes
npm run test         # Executa testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Cobertura de testes
```

## 📚 Documentação Adicional

- [Arquitetura do Sistema](./plan/ARCHITECTURE.md)
- [Guia de Features](./plan/FEATURES.md)
- [Roadmap](./plan/ROADMAP.md)
- [Design System](./plan/UI_DESIGN.md)
- [Open Finance Integration](./plan/OPEN_FINANCE_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: suporte@boletoreminder.com
- 💬 WhatsApp: +55 11 99999-9999
- 🌐 Website: https://boletoreminder.com
- 📖 Documentação: https://docs.boletoreminder.com

---

**Desenvolvido com ❤️ para facilitar a gestão de cobranças no Brasil**