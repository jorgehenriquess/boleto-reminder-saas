# 🚀 BoletoReminder SaaS

Sistema completo multi-tenant de lembretes automáticos de boletos via WhatsApp, desenvolvido com Next.js 15, TypeScript, Prisma e Evolution API.

## 📋 Funcionalidades Implementadas

### ✅ Sistema Completo 100% Funcional
- 🏢 **Sistema Multi-Tenant** - Isolamento completo de dados por empresa
- 🔐 **Autenticação & Autorização** - NextAuth.js com roles e permissões
- 📁 **Upload & Parser .rem** - Processamento automático de remessas bancárias (Bradesco, Itaú, Santander)
- 📱 **Integração WhatsApp Completa** - Evolution API com QR Code, instâncias múltiplas
- 👥 **Gestão Completa de Clientes** - CRUD com validações e limites de plano
- 💰 **Gestão Completa de Boletos** - Status, valores, vencimentos, histórico
- 🏷️ **Sistema de Planos & Billing** - STARTER, PROFESSIONAL, ENTERPRISE com limites dinâmicos
- 💳 **Sistema de Pagamentos Mock** - Cartão, PIX, Boleto para demonstração
- 📊 **Dashboard Analytics** - Estatísticas em tempo real, gráficos, métricas
- 🔔 **Sistema de Lembretes** - Automático e manual com templates personalizáveis
- 🌐 **Landing Pages** - Preços, termos, privacidade, sobre
- 🛡️ **Controle de Limites** - Por plano com avisos e bloqueios automáticos
- 📱 **PWA Ready** - Service Worker, manifesto, notificações
- 🚀 **Performance** - Turbopack, React Query, otimizações

## 🛠 Stack Tecnológica

### Frontend & Core
- **Next.js 15.5.2** - App Router com Turbopack para desenvolvimento
- **TypeScript** - Tipagem estática completa
- **React 19** - Hooks, Server Components, Streaming
- **TailwindCSS + shadcn/ui** - Design system moderno
- **React Query (TanStack)** - State management e cache
- **NextAuth.js** - Autenticação completa

### Backend & Database  
- **Prisma ORM** - Schema multi-tenant com type safety
- **PostgreSQL** - Banco principal com row-level security
- **Redis** - Cache e filas de processamento
- **Zod** - Validação de schemas
- **bcryptjs** - Hash de senhas seguro

### Integrações & Services
- **Evolution API v2.1.1** - Gateway WhatsApp open-source
- **Sistema de Upload** - Processamento de arquivos .rem
- **Parser Bancário** - Suporte Bradesco, Itaú, Santander
- **Mock Payment Gateway** - Simulação completa de pagamentos

### DevOps & Tools
- **Docker Compose** - Ambiente de desenvolvimento completo
- **Prisma Studio** - Interface administrativa do banco
- **ESLint + Prettier** - Code quality
- **PWA** - Service Worker e manifesto