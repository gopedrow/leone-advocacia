import { PrismaClient, Role, ProcessStatus, Tribunal, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Semeando banco de dados...");

  // Credenciais do admin via variáveis de ambiente (NÃO ficam no GitHub).
  // Defina ADMIN_EMAIL e ADMIN_PASSWORD ao rodar o seed em produção.
  const adminEmail = (process.env.ADMIN_EMAIL ?? "leticia@leoneadvocacia.com.br").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const adminPass = await bcrypt.hash(adminPassword, 10);

  // Admin — Dra. Letícia Leone
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Dra. Letícia Leone",
      email: adminEmail,
      passwordHash: adminPass,
      role: Role.ADMIN,
    },
  });

  // Dados de demonstração (cliente + processo de exemplo).
  // Só são criados quando SEED_DEMO=true — evita cliente fictício em produção.
  if (process.env.SEED_DEMO === "true") {
    const clientPass = await bcrypt.hash("cliente123", 10);
    const client = await prisma.user.upsert({
      where: { email: "cliente@exemplo.com" },
      update: {},
      create: {
        name: "Maria Oliveira",
        email: "cliente@exemplo.com",
        passwordHash: clientPass,
        role: Role.CLIENT,
        phone: "(62) 90000-0000",
      },
    });

    await prisma.process.upsert({
      where: { number: "0001234-56.2026.8.09.0051" },
      update: {},
      create: {
        number: "0001234-56.2026.8.09.0051",
        title: "Obrigação de fazer — fornecimento de medicamento de alto custo",
        court: "TJGO",
        jurisdiction: "3ª Vara da Fazenda Pública de Goiânia",
        className: "Procedimento Comum Cível",
        subject: "Saúde / Fornecimento de medicamento",
        status: ProcessStatus.EM_ANDAMENTO,
        clientId: client.id,
        movements: {
          create: [
            {
              date: new Date("2026-05-10"),
              title: "Distribuição",
              description: "Ação distribuída por dependência.",
            },
            {
              date: new Date("2026-05-22"),
              title: "Decisão — Tutela de urgência deferida",
              description:
                "Determinado o fornecimento do medicamento no prazo de 10 dias.",
            },
          ],
        },
      },
    });
  }

  // Categorias e artigos
  const cat = await prisma.category.upsert({
    where: { slug: "planos-de-saude" },
    update: {},
    create: { name: "Planos de Saúde", slug: "planos-de-saude" },
  });

  await prisma.article.upsert({
    where: { slug: "negativa-de-cobertura-o-que-fazer" },
    update: {},
    create: {
      title: "Negativa de cobertura pelo plano de saúde: o que fazer?",
      slug: "negativa-de-cobertura-o-que-fazer",
      excerpt:
        "Entenda seus direitos quando o plano de saúde nega um procedimento e quais caminhos jurídicos existem.",
      content:
        "## Conteúdo de exemplo\n\nSubstitua este texto pelo artigo real no painel administrativo.",
      status: ContentStatus.PUBLISHED,
      readMinutes: 6,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: cat.id,
    },
  });

  // Jurisprudência de exemplo
  await prisma.jurisprudence.upsert({
    where: { slug: "stj-tema-106-medicamentos" },
    update: {},
    create: {
      title: "STJ — Tema 106: fornecimento de medicamentos não incorporados",
      slug: "stj-tema-106-medicamentos",
      tribunal: Tribunal.STJ,
      reference: "REsp 1.657.156/RJ (Tema 106)",
      summary:
        "Critérios para o fornecimento de medicamentos não incorporados aos atos normativos do SUS.",
      decisionDate: new Date("2018-04-25"),
      tags: "SUS, medicamentos, alto custo",
      authorId: admin.id,
    },
  });

  // FAQ
  const faqs = [
    {
      question: "O plano de saúde pode negar um tratamento prescrito pelo médico?",
      answer:
        "Em regra, não. A jurisprudência entende que cabe ao médico assistente definir o tratamento. Negativas abusivas podem ser revertidas judicialmente.",
      order: 1,
    },
    {
      question: "Quanto tempo demora uma liminar para medicamento?",
      answer:
        "Decisões de urgência (liminares) podem ser proferidas em poucos dias, a depender do caso e da comarca.",
      order: 2,
    },
    {
      question: "Tenho direito a reembolso de despesas médicas?",
      answer:
        "Em muitos casos sim, especialmente quando há negativa indevida ou urgência. Cada situação deve ser analisada individualmente.",
      order: 3,
    },
  ];
  for (const f of faqs) {
    await prisma.faqItem.create({ data: f });
  }

  console.log("✅ Seed concluído.");
  console.log(`   Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
