# Guia de publicação — Vercel + Neon

Ordem geral: **GitHub → Neon (banco) → Vercel (hospedagem)**.
Você faz os passos que envolvem criar contas e rodar comandos; o código já está preparado.

---

## 1. Subir o código para o GitHub

Pré-requisitos: conta no GitHub e `git` instalado (`git --version`).

1. Em github.com, crie um repositório **privado** (ex.: `leone-advocacia`).
2. No Terminal, na pasta do projeto:

```bash
cd ~/Desktop/"LEONE ADVOCACIA"/"LEONE ADVOCACIA"
git init
git add .
git commit -m "Plataforma Leone Advocacia"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/leone-advocacia.git
git push -u origin main
```

> O `.gitignore` já protege segredos e dados: `node_modules`, `.env`, `/storage`, `*.db` **não** sobem.

---

## 2. Criar o banco PostgreSQL no Neon

1. Crie conta em https://neon.tech e um **projeto** (região mais próxima do Brasil).
2. Copie a **connection string** (formato `postgresql://...`). Use a versão **"pooled"** (com `-pooler`).

---

## 3. Trocar o banco do projeto para PostgreSQL

Esta troca é necessária para a nuvem. Depois dela, o desenvolvimento local também passa a
usar o Neon (uma única base, mais simples).

1. Em `prisma/schema.prisma`, no bloco `datasource db`, troque:
   `provider = "sqlite"` → `provider = "postgresql"`
2. No arquivo `.env` (local), aponte para o Neon:
   `DATABASE_URL="postgresql://...seu-neon-pooler..."`
3. Aplique o schema e popule os dados iniciais:

```bash
npm run db:push
npm run db:seed
```

> Posso fazer a troca do `schema.prisma` por você — é só pedir.

---

## 4. Publicar na Vercel

1. Crie conta em https://vercel.com e clique em **Add New → Project**.
2. **Importe** o repositório do GitHub. A Vercel detecta Next.js automaticamente.
3. Em **Environment Variables**, adicione:

| Nome | Valor |
| --- | --- |
| `DATABASE_URL` | a connection string do Neon |
| `JWT_SECRET` | uma chave longa (gere: `openssl rand -base64 48`) |
| `NEXT_PUBLIC_SITE_URL` | `https://seu-dominio.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP` | `5562998710007` |

4. Clique em **Deploy**. (O build já roda `prisma generate` automaticamente.)
5. **Crie o acesso admin em produção**: com o `.env` local apontando para o Neon, rode `npm run db:seed` uma vez — isso cria a conta da advogada no banco de produção. **Troque a senha** depois pelo painel.

A cada `git push` para o `main`, a Vercel **republica sozinha**.

> Uso comercial na Vercel pede o plano **Pro** (~US$20/mês). Para testes, o plano gratuito funciona.

---

## 5. Armazenamento de arquivos (contratos/assinados) — fase 2

Na Vercel o disco é somente-leitura, então **uploads não persistem** ainda (o site não quebra —
apenas o arquivo não é salvo). Para habilitar, conectamos o **Vercel Blob**:

1. Na Vercel: **Storage → Create → Blob**.
2. Instalar `@vercel/blob` e adaptar `src/lib/storage.ts` para gravar/ler no Blob.

> Esse passo eu implemento quando você ativar o Blob — é rápido.

---

## 6. Domínio próprio (opcional)

Em **Settings → Domains** na Vercel, adicione seu domínio (ex.: `leoneadvocacia.com.br`) e
ajuste o DNS conforme as instruções exibidas. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio final.

---

## Checklist antes de divulgar

- [ ] Trocar as senhas padrão do seed (admin/cliente).
- [ ] Preencher e-mail e endereço em `src/config/site.ts`.
- [ ] Adicionar as fotos em `public/images/`.
- [ ] Conferir o número de WhatsApp.
- [ ] (Opcional) Conectar o Vercel Blob para uploads.
