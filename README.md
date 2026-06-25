# Leone Advocacia — Plataforma de Direito da Saúde

Plataforma jurídica especializada em **Direito da Saúde** da **Dra. Letícia Leone (OAB/GO 59.154)**:
site institucional, portal de conteúdo, área do cliente e painel administrativo — preparada para
integrações futuras com tribunais.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (design system com tokens)
- **Prisma** + SQLite (dev) / PostgreSQL (produção)
- **Autenticação JWT** (cookies httpOnly) com **RBAC** (CLIENT / ADMIN)
- SEO (metadata dinâmica, Open Graph, sitemap, robots, Schema.org), acessibilidade (WCAG AA)

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
#   - Gere um JWT_SECRET forte:  openssl rand -base64 48

# 3. Criar e popular o banco (SQLite)
npm run db:push
npm run db:seed

# 4. Ambiente de desenvolvimento
npm run dev
# → http://localhost:3000
```

### Acessos de demonstração (após o seed)

| Perfil  | E-mail                          | Senha       |
| ------- | ------------------------------- | ----------- |
| Admin   | leticia@leoneadvocacia.com.br   | admin123    |
| Cliente | cliente@exemplo.com             | cliente123  |

> Troque essas credenciais antes de qualquer uso real.

## Estrutura

```
src/
  app/
    (public)/        → site institucional (home, sobre, direito-da-saude, ...)
    (auth)/          → login, recuperação de senha
    area-cliente/    → painel do cliente (protegido)
    admin/           → painel administrativo (protegido, somente ADMIN)
    sitemap.ts, robots.ts
  components/        → ui/, layout/, brand/, dashboard/, public/, seo/
  config/            → site.ts (dados de contato/menu) e content.ts (textos)
  lib/               → db, auth (jwt/password/session), audit, validation, labels
  services/tribunais/→ camada de integração (PJe, e-SAJ, Projudi, EPROC) — stubs
  middleware.ts      → proteção de rotas por perfil (RBAC)
prisma/
  schema.prisma      → modelo de dados
  seed.ts            → dados iniciais
```

## O que personalizar primeiro

1. **`src/config/site.ts`** — telefone, e-mail, endereço, WhatsApp (marcados com `[PREENCHER]`).
2. **`src/config/content.ts`** — biografia, estatísticas e textos institucionais.
3. **`public/images/`** — `advogada-hero.jpg`, `advogada-sobre.jpg`, `og-default.jpg`.

## Próximas fases

- CRUD completo no painel admin (formulários + server actions).
- Upload/armazenamento de documentos (S3/Supabase/local).
- Envio de e-mail (recuperação de senha, notificações).
- Implementação real dos provedores em `src/services/tribunais/` (sincronização de andamentos).
- Migração para PostgreSQL em produção.

## Segurança & LGPD

- Senhas com hash **bcrypt**; sessão via **JWT** assinado em cookie httpOnly.
- **RBAC** na borda (`middleware.ts`) e nos layouts protegidos.
- **Logs de auditoria** (`AuditLog`) para eventos sensíveis.
- Cabeçalhos de segurança em `next.config.ts`.
