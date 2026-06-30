/**
 * Conteúdo editorial da área pública.
 * ➜ Textos profissionais prontos; ajuste livremente.
 *   Estatísticas marcadas com [PREENCHER] devem refletir dados reais.
 */
import type { IconName } from "@/components/ui/Icon";

export type Demand = {
  icon: IconName;
  title: string;
  description: string;
  slug: string;
  /** Página de detalhamento do tema (quando já publicada). */
  href?: string;
};

/** Principais Demandas — cards da home. */
export const demands: Demand[] = [
  {
    icon: "shield",
    title: "Negativa de cobertura",
    description:
      "Plano negou um procedimento, exame ou internação? Negativas abusivas podem ser revertidas, inclusive por liminar.",
    slug: "negativa-de-cobertura",
    href: "/areas/negativa-de-cobertura",
  },
  {
    icon: "pill",
    title: "Medicamentos de alto custo",
    description:
      "Garantia do fornecimento de medicamentos caros pelo plano ou pelo poder público (SUS), conforme prescrição médica.",
    slug: "medicamentos-alto-custo",
  },
  {
    icon: "spark",
    title: "Tratamentos experimentais",
    description:
      "Acesso a terapias e tratamentos fora do rol ou de caráter experimental, quando indicados pelo médico assistente.",
    slug: "tratamentos-experimentais",
  },
  {
    icon: "hospital",
    title: "Home Care",
    description:
      "Internação domiciliar e atendimento home care negados indevidamente pelos planos de saúde.",
    slug: "home-care",
  },
  {
    icon: "refresh",
    title: "Reembolso",
    description:
      "Reembolso de despesas médicas e hospitalares em casos de urgência ou negativa indevida de cobertura.",
    slug: "reembolso",
  },
  {
    icon: "stethoscope",
    title: "Cirurgias",
    description:
      "Autorização de cirurgias, materiais e próteses negados ou postergados pela operadora.",
    slug: "cirurgias",
  },
  {
    icon: "heart",
    title: "Terapias especiais",
    description:
      "Cobertura de terapias multidisciplinares (TEA, fisioterapia, fonoaudiologia e outras) sem limitação de sessões.",
    slug: "terapias-especiais",
  },
  {
    icon: "ambulance",
    title: "Urgência e emergência",
    description:
      "Atendimento imediato em situações de urgência e emergência, com afastamento de carências abusivas.",
    slug: "urgencia-emergencia",
  },
];

/** Direitos do Paciente — agrupados por contexto (seção dentro de "Saúde"). */
export const patientRights: { icon: IconName; title: string; items: string[] }[] = [
  {
    icon: "shield",
    title: "Perante os planos de saúde",
    items: [
      "Cobertura conforme prescrição do médico assistente",
      "Vedação a negativas abusivas e a limitações de sessões de terapia",
      "Reembolso em casos de urgência e negativa indevida",
      "Atendimento de urgência sem carência abusiva",
    ],
  },
  {
    icon: "hospital",
    title: "Perante o SUS",
    items: [
      "Fornecimento de medicamentos e insumos essenciais",
      "Acesso a tratamentos e procedimentos de alto custo",
      "Critérios definidos pelo STJ (Tema 106) para medicamentos não incorporados",
      "Direito à informação e à continuidade do tratamento",
    ],
  },
  {
    icon: "ambulance",
    title: "Em internações",
    items: [
      "Internação pelo tempo necessário, sem limitação de diárias",
      "Direito a acompanhante nos casos previstos em lei",
      "Cobertura de UTI e materiais indispensáveis",
      "Home care quando indicado em substituição à internação",
    ],
  },
  {
    icon: "stethoscope",
    title: "Em tratamentos",
    items: [
      "Terapias multidisciplinares (incluindo TEA) sem limite de sessões",
      "Medicamentos de uso domiciliar nos casos previstos",
      "Tratamentos fora do rol quando há indicação médica",
      "Segunda opinião e liberdade de escolha do tratamento",
    ],
  },
];

/** Como funciona o atendimento — etapas. */
export const steps = [
  {
    title: "Contato Inicial",
    description:
      "Você nos procura pelo WhatsApp ou formulário e relata sua situação com sigilo total.",
  },
  {
    title: "Análise do Caso",
    description:
      "Avaliamos documentos, prescrições e a viabilidade jurídica da sua demanda.",
  },
  {
    title: "Estratégia Jurídica",
    description:
      "Definimos o melhor caminho — administrativo ou judicial — e os pedidos de urgência cabíveis.",
  },
  {
    title: "Acompanhamento",
    description:
      "Você acompanha cada movimentação pela Área do Cliente, com transparência total.",
  },
  {
    title: "Resultado",
    description:
      "Buscamos a garantia do seu tratamento, medicamento ou reembolso com agilidade.",
  },
];

/** Diferenciais. */
export const differentials: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "heart",
    title: "Atendimento personalizado",
    description: "Cada cliente é acompanhado de perto, com escuta atenta e linguagem clara.",
  },
  {
    icon: "scale",
    title: "Especialização em Direito da Saúde",
    description: "Atuação dedicada e técnica na defesa dos direitos de pacientes e consumidores.",
  },
  {
    icon: "refresh",
    title: "Atualização jurisprudencial constante",
    description: "Acompanhamento permanente das decisões do STJ, STF e tribunais.",
  },
  {
    icon: "document",
    title: "Acompanhamento processual digital",
    description: "Portal exclusivo para acompanhar processos, documentos e mensagens.",
  },
  {
    icon: "check",
    title: "Transparência",
    description: "Comunicação honesta sobre prazos, expectativas e andamentos do caso.",
  },
];

/** Estatísticas institucionais (ajuste com dados reais). */
export const stats = [
  { value: "+300", label: "Casos atendidos" },
  { value: "8+", label: "Áreas de atuação em Saúde" },
  { value: "6", label: "Anos de experiência" },
];

/**
 * Depoimentos — conteúdo GENÉRICO/ILUSTRATIVO.
 * ➜ Substitua por avaliações reais e autorizadas pelos clientes.
 *   Foco na experiência de atendimento (sem prometer resultados),
 *   em linha com as regras de publicidade da OAB.
 */
export const testimonials: { quote: string; author: string }[] = [
  {
    quote:
      "Fui tratada com muita atenção e respeito em um momento delicado. Explicaram cada etapa de forma clara e acessível.",
    author: "M. S. — Goiânia/GO",
  },
  {
    quote:
      "Profissionalismo e transparência do início ao fim. Sempre soube exatamente em que pé estava o meu caso.",
    author: "R. A. — Aparecida de Goiânia/GO",
  },
  {
    quote:
      "Atendimento humano e dedicado. Senti segurança e confiança durante todo o acompanhamento.",
    author: "J. P. — Goiânia/GO",
  },
  {
    quote:
      "Comunicação clara e acompanhamento próximo. Recomendo a quem busca orientação séria e cuidadosa.",
    author: "C. F. — Senador Canedo/GO",
  },
  {
    quote:
      "Escuta atenta e linguagem simples. Tirei todas as minhas dúvidas com tranquilidade.",
    author: "L. M. — Goiânia/GO",
  },
  {
    quote:
      "Seriedade e comprometimento em cada etapa. Um atendimento que transmite confiança.",
    author: "A. T. — Goiânia/GO",
  },
];

/**
 * Biografia / Sobre — texto profissional editável.
 * Substitua pelos dados reais da trajetória da Dra. Letícia Leone.
 */
export const about = {
  intro:
    "A Leone Advocacia é dedicada à defesa do direito fundamental à saúde, atuando com seriedade técnica e atendimento humanizado para garantir que pacientes recebam os tratamentos, medicamentos e procedimentos a que têm direito.",
  bio: [
    "Dra. Letícia Leone é advogada inscrita na OAB/GO sob o nº 59.154, com atuação especializada em Direito da Saúde — área que une rigor jurídico e sensibilidade diante de demandas urgentes que envolvem a vida e o bem-estar das pessoas.",
    "Seu trabalho concentra-se na defesa de pacientes e consumidores frente a planos de saúde e ao poder público, abrangendo negativas de cobertura, fornecimento de medicamentos de alto custo, tratamentos, cirurgias e reembolsos.",
    "Com dedicação integral à advocacia em saúde, acompanha de perto a evolução da jurisprudência do STJ e do STF e as mudanças regulatórias do setor, construindo estratégias sólidas e atualizadas para cada caso — sempre com o compromisso de traduzir o conhecimento jurídico em resultados concretos para o cliente.",
  ],
  mission:
    "Transformar direitos em resultados concretos, garantindo que nenhuma pessoa tenha seu acesso à saúde comprometido por negativas indevidas, burocracias ou abusos, sempre com excelência jurídica e atendimento humanizado.",
  values: [
    {
      title: "Ética e Transparência",
      description:
        "Atuar com integridade, honestidade e clareza em todas as etapas do atendimento, mantendo o cliente plenamente informado sobre seus direitos, as estratégias jurídicas adotadas e o andamento de seu caso.",
    },
    {
      title: "Compromisso com o Paciente",
      description:
        "Compreender que, por trás de cada processo, existe uma pessoa enfrentando desafios relacionados à sua saúde e bem-estar. Por isso, cada demanda é conduzida com responsabilidade, empatia e dedicação à busca da melhor solução possível.",
    },
    {
      title: "Excelência Técnica",
      description:
        "Manter constante atualização jurídica e aprofundamento nas questões relacionadas ao Direito da Saúde, garantindo uma atuação estratégica, fundamentada e orientada à obtenção de resultados efetivos.",
    },
    {
      title: "Agilidade e Atendimento Humanizado",
      description:
        "Reconhecer que muitas demandas de saúde exigem respostas rápidas e eficazes. Por isso, atuar com celeridade, acessibilidade e proximidade, oferecendo suporte contínuo e atendimento personalizado em cada etapa do processo.",
    },
    {
      title: "Defesa Intransigente dos Direitos do Cliente",
      description:
        "Atuar de forma firme e estratégica na proteção dos direitos dos pacientes, buscando assegurar acesso a tratamentos, medicamentos, procedimentos e demais garantias legais sempre que houver negativa indevida ou violação de direitos.",
    },
    {
      title: "Responsabilidade e Confiança",
      description:
        "Construir relações pautadas pela credibilidade, pelo respeito e pela segurança jurídica, para que cada cliente tenha a tranquilidade de contar com uma representação comprometida com seus interesses e necessidades.",
    },
  ],
};
