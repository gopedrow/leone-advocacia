/**
 * Modelos de peças jurídicas (Direito da Saúde) usados no editor WYSIWYG.
 *
 * Cada modelo é HTML que vira o conteúdo inicial do documento ao ser
 * selecionado em /admin/documentos/novo. Os marcadores {{CLIENTE}},
 * {{PARTE_CONTRARIA}}, {{PROCESSO}} e {{DATA}} são substituídos pelos dados
 * informados no formulário de criação (ver renderTemplateContent).
 */

export type PetitionCategoryKey =
  | "PETICAO_INICIAL"
  | "CONTESTACAO"
  | "RECURSO_APELACAO"
  | "AGRAVO_INSTRUMENTO"
  | "EMBARGOS_DECLARACAO"
  | "CONTRARRAZOES"
  | "RECURSO_ESPECIAL"
  | "RECURSO_EXTRAORDINARIO"
  | "MANDADO_SEGURANCA"
  | "TUTELA_URGENCIA"
  | "CONTRATO_HONORARIOS"
  | "PROCURACAO"
  | "NOTIFICACAO_EXTRAJUDICIAL"
  | "PARECER"
  | "EM_BRANCO"
  | "OUTRO";

export type PetitionTemplate = {
  slug: string;
  title: string;
  category: PetitionCategoryKey;
  group: string;
  description: string;
  content: string;
};

const ADVOGADA = "Letícia Leone";
const OAB = "OAB/GO 59.154";

const FECHO = (foro = "[FORO/VARA]") => `
<p>Termos em que,<br>Pede deferimento.</p>
<p>[Cidade], {{DATA}}.</p>
<p><strong>${ADVOGADA}</strong><br>${OAB}</p>`;

const ENDERECO_JUIZO = (foro: string) => `<p style="text-align:right">EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ${foro}</p>`;

export const PETITION_TEMPLATES: PetitionTemplate[] = [
  {
    slug: "peticao-inicial-medicamento",
    title: "Petição Inicial — Fornecimento de Medicamento de Alto Custo",
    category: "PETICAO_INICIAL",
    group: "Petições e recursos",
    description: "Obrigação de fazer c/c tutela de urgência para fornecimento de medicamento.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<h1>Ação de Obrigação de Fazer c/c Pedido de Tutela de Urgência</h1>
<p><strong>{{CLIENTE}}</strong>, já qualificado(a) nos autos, por sua advogada que esta subscreve, vem respeitosamente perante Vossa Excelência propor a presente</p>
<h2>AÇÃO DE OBRIGAÇÃO DE FAZER C/C PEDIDO DE TUTELA DE URGÊNCIA</h2>
<p>em face de <strong>{{PARTE_CONTRARIA}}</strong>, pelos fatos e fundamentos a seguir expostos.</p>
<h2>I — Dos fatos</h2>
<p>A parte autora é portadora de [CID/diagnóstico], necessitando, com urgência, do medicamento [NOME DO MEDICAMENTO], conforme prescrição médica e relatório anexos, sob pena de grave risco à sua saúde e à sua vida.</p>
<p>A parte ré negou o fornecimento/cobertura do tratamento, sob a alegação de [motivo da negativa], conforme documento anexo.</p>
<h2>II — Do direito</h2>
<p>A negativa configura violação ao direito fundamental à saúde (art. 196 da Constituição Federal) e, quando aplicável, ao Código de Defesa do Consumidor e à Lei nº 9.656/1998, sendo entendimento consolidado dos Tribunais Superiores a obrigatoriedade de custeio do tratamento prescrito pelo médico assistente.</p>
<h2>III — Da tutela de urgência</h2>
<p>Estão presentes a probabilidade do direito (prescrição médica e laudo) e o perigo de dano (risco à saúde/vida em caso de demora), nos termos do art. 300 do CPC, justificando-se a concessão de tutela de urgência <em>inaudita altera parte</em> para determinar o fornecimento imediato do tratamento.</p>
<h2>IV — Dos pedidos</h2>
<ol>
<li>A concessão de tutela de urgência para determinar que a parte ré forneça, no prazo de [prazo], o medicamento/tratamento [NOME], sob pena de multa diária;</li>
<li>A citação da parte ré para, querendo, contestar a presente ação;</li>
<li>Ao final, a confirmação da tutela e a procedência total dos pedidos;</li>
<li>A condenação da parte ré ao pagamento das custas processuais e honorários advocatícios.</li>
</ol>
<p>Dá-se à causa o valor de R$ [valor].</p>
<p>Nestes termos, pede deferimento.</p>
${FECHO()}`,
  },
  {
    slug: "peticao-inicial-cirurgia",
    title: "Petição Inicial — Autorização de Cirurgia/Procedimento",
    category: "PETICAO_INICIAL",
    group: "Petições e recursos",
    description: "Obrigação de fazer c/c tutela de urgência para autorizar cirurgia, terapia ou procedimento.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<h1>Ação de Obrigação de Fazer c/c Tutela de Urgência — Autorização de Procedimento</h1>
<p><strong>{{CLIENTE}}</strong> vem propor a presente ação em face de <strong>{{PARTE_CONTRARIA}}</strong>, pelos fatos e fundamentos a seguir.</p>
<h2>I — Dos fatos</h2>
<p>A parte autora necessita, com urgência, da realização do procedimento [cirurgia/terapia/exame], conforme indicação médica anexa, tendo a parte ré negado a autorização/cobertura sob a justificativa de [motivo].</p>
<h2>II — Do direito</h2>
<p>A indicação do procedimento é prerrogativa do médico assistente, não cabendo à operadora/ente público questionar a escolha terapêutica, sendo abusiva e ilegal a negativa, conforme jurisprudência consolidada do STJ (Súmula 102) e do TJGO.</p>
<h2>III — Da urgência</h2>
<p>O quadro clínico da parte autora demanda a realização do procedimento em caráter de urgência, sob risco de agravamento irreversível, preenchendo os requisitos do art. 300 do CPC.</p>
<h2>IV — Dos pedidos</h2>
<ol>
<li>Tutela de urgência para autorização imediata do procedimento [NOME], incluindo materiais, equipe médica e internação, sob pena de multa diária;</li>
<li>Citação da parte ré;</li>
<li>Procedência dos pedidos, confirmando-se a tutela concedida;</li>
<li>Condenação em custas e honorários advocatícios.</li>
</ol>
<p>Dá-se à causa o valor de R$ [valor].</p>
${FECHO()}`,
  },
  {
    slug: "peticao-inicial-negativa-cobertura",
    title: "Petição Inicial — Negativa de Cobertura (Plano de Saúde)",
    category: "PETICAO_INICIAL",
    group: "Petições e recursos",
    description: "Ação revisional/declaratória contra recusa de cobertura por plano de saúde, com pedido de reembolso.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<h1>Ação Declaratória de Obrigação de Cobertura c/c Reparação de Danos</h1>
<p><strong>{{CLIENTE}}</strong>, beneficiário(a) do plano de saúde mantido pela parte ré <strong>{{PARTE_CONTRARIA}}</strong>, vem propor a presente ação pelos fatos e fundamentos seguintes.</p>
<h2>I — Dos fatos</h2>
<p>A parte ré recusou a cobertura de [procedimento/tratamento/exame], sob o argumento de [motivo: doença preexistente, rol da ANS, carência etc.], mesmo diante de indicação médica expressa, causando à parte autora prejuízos materiais e morais.</p>
<h2>II — Do direito</h2>
<p>Nos termos da Lei nº 9.656/1998 e do CDC, é abusiva a negativa de cobertura de tratamento prescrito por médico assistente, sendo o rol da ANS meramente exemplificativo conforme entendimento jurisprudencial e a Lei nº 14.454/2022.</p>
<h2>III — Dos danos morais</h2>
<p>A recusa indevida, em momento de fragilidade e necessidade, ultrapassa o mero aborrecimento, configurando dano moral indenizável.</p>
<h2>IV — Dos pedidos</h2>
<ol>
<li>Tutela de urgência para cobertura imediata do tratamento;</li>
<li>Declaração de nulidade da negativa de cobertura;</li>
<li>Condenação da ré ao reembolso de valores eventualmente desembolsados pela parte autora;</li>
<li>Condenação por danos morais no valor de R$ [valor];</li>
<li>Condenação em custas e honorários.</li>
</ol>
<p>Dá-se à causa o valor de R$ [valor].</p>
${FECHO()}`,
  },
  {
    slug: "contestacao",
    title: "Contestação",
    category: "CONTESTACAO",
    group: "Petições e recursos",
    description: "Resposta à ação ajuizada em desfavor do cliente, com preliminares e mérito.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<p>Processo nº {{PROCESSO}}</p>
<h1>Contestação</h1>
<p><strong>{{CLIENTE}}</strong>, já qualificado(a) nos autos da ação que lhe move <strong>{{PARTE_CONTRARIA}}</strong>, vem apresentar <strong>CONTESTAÇÃO</strong>, pelos fatos e fundamentos a seguir.</p>
<h2>I — Preliminares</h2>
<p>[Inserir preliminares cabíveis: inépcia da inicial, ilegitimidade, carência de ação, prescrição/decadência etc., ou suprimir esta seção caso não haja preliminares.]</p>
<h2>II — Dos fatos</h2>
<p>[Breve resumo da versão dos fatos apresentada pela parte autora, seguida da impugnação fundamentada.]</p>
<h2>III — Do direito</h2>
<p>[Fundamentação jurídica da defesa, com impugnação específica de cada pedido da inicial, nos termos do art. 341 do CPC.]</p>
<h2>IV — Dos pedidos</h2>
<ol>
<li>O acolhimento das preliminares arguidas, com a extinção do processo sem resolução de mérito; ou, subsidiariamente,</li>
<li>A total improcedência dos pedidos formulados na inicial;</li>
<li>A condenação da parte autora ao pagamento das custas e honorários advocatícios sucumbenciais;</li>
<li>A produção de todas as provas em direito admitidas, especialmente [tipo de prova].</li>
</ol>
${FECHO()}`,
  },
  {
    slug: "recurso-apelacao",
    title: "Recurso de Apelação",
    category: "RECURSO_APELACAO",
    group: "Petições e recursos",
    description: "Apelação contra sentença de primeiro grau, com razões recursais.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<p>Processo nº {{PROCESSO}}</p>
<h1>Razões de Apelação</h1>
<p><strong>Apelante:</strong> {{CLIENTE}}<br><strong>Apelado(a):</strong> {{PARTE_CONTRARIA}}</p>
<h2>I — Síntese do processo e da sentença recorrida</h2>
<p>[Resumo do trâmite processual e dos fundamentos da sentença que se pretende reformar.]</p>
<h2>II — Razões do inconformismo</h2>
<p>[Demonstração dos erros de fato e/ou de direito da sentença recorrida, com fundamentação jurídica e jurisprudencial.]</p>
<h2>III — Do pedido de efeito suspensivo (se cabível)</h2>
<p>[Caso aplicável, justificar a urgência na suspensão dos efeitos da sentença até o julgamento do recurso.]</p>
<h2>IV — Do pedido</h2>
<p>Ante o exposto, requer-se o conhecimento e provimento do presente recurso, para que seja reformada a sentença recorrida nos termos acima expostos, condenando-se o apelado ao pagamento das custas e honorários recursais.</p>
${FECHO()}`,
  },
  {
    slug: "agravo-instrumento",
    title: "Agravo de Instrumento",
    category: "AGRAVO_INSTRUMENTO",
    group: "Petições e recursos",
    description: "Recurso contra decisão interlocutória, com pedido de efeito suspensivo/antecipação de tutela recursal.",
    content: `<p style="text-align:right">EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE GOIÁS</p>
<p>Processo de origem nº {{PROCESSO}}</p>
<h1>Agravo de Instrumento</h1>
<p><strong>Agravante:</strong> {{CLIENTE}}<br><strong>Agravado(a):</strong> {{PARTE_CONTRARIA}}</p>
<h2>I — Da decisão agravada</h2>
<p>[Transcrever/resumir a decisão interlocutória recorrida e a data de sua publicação/intimação.]</p>
<h2>II — Da tempestividade e do cabimento</h2>
<p>O presente recurso é tempestivo, nos termos do art. 1.003, §5º, do CPC, e cabível por se tratar de hipótese do art. 1.015 do CPC.</p>
<h2>III — Das razões recursais</h2>
<p>[Fundamentação jurídica demonstrando o desacerto da decisão agravada.]</p>
<h2>IV — Do pedido de efeito suspensivo/antecipação da tutela recursal</h2>
<p>Estão presentes a probabilidade de provimento do recurso e o risco de dano grave de difícil reparação, justificando-se a concessão de efeito suspensivo/antecipação da tutela recursal, nos termos do art. 1.019, I, do CPC.</p>
<h2>V — Do pedido</h2>
<p>Requer-se o recebimento, processamento e, ao final, o provimento do presente agravo, para reformar a decisão agravada nos termos expostos.</p>
${FECHO()}`,
  },
  {
    slug: "embargos-declaracao",
    title: "Embargos de Declaração",
    category: "EMBARGOS_DECLARACAO",
    group: "Petições e recursos",
    description: "Embargos para sanar omissão, contradição, obscuridade ou erro material na decisão.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<p>Processo nº {{PROCESSO}}</p>
<h1>Embargos de Declaração</h1>
<p><strong>{{CLIENTE}}</strong>, em face de <strong>{{PARTE_CONTRARIA}}</strong>, vem opor os presentes <strong>EMBARGOS DE DECLARAÇÃO</strong>, com fundamento no art. 1.022 do CPC, pelas razões a seguir.</p>
<h2>I — Da omissão/contradição/obscuridade/erro material</h2>
<p>[Apontar especificamente o vício da decisão embargada: ponto sobre o qual o juízo não se manifestou, contradição entre fundamentos e dispositivo, obscuridade na redação ou erro material a corrigir.]</p>
<h2>II — Do pedido</h2>
<p>Requer-se o acolhimento dos presentes embargos para sanar o vício apontado, com efeitos infringentes se necessário, integrando-se a decisão embargada.</p>
${FECHO()}`,
  },
  {
    slug: "contrarrazoes",
    title: "Contrarrazões de Apelação",
    category: "CONTRARRAZOES",
    group: "Petições e recursos",
    description: "Resposta ao recurso de apelação interposto pela parte contrária.",
    content: `${ENDERECO_JUIZO("___ VARA CÍVEL DA COMARCA DE [COMARCA]")}
<p>Processo nº {{PROCESSO}}</p>
<h1>Contrarrazões de Apelação</h1>
<p><strong>Apelado(a):</strong> {{CLIENTE}}<br><strong>Apelante:</strong> {{PARTE_CONTRARIA}}</p>
<h2>I — Síntese do recurso</h2>
<p>[Resumo dos argumentos apresentados pela parte apelante.]</p>
<h2>II — Da manutenção da sentença</h2>
<p>[Demonstração de que a sentença recorrida deve ser mantida, rebatendo, ponto a ponto, os argumentos da apelação.]</p>
<h2>III — Do pedido</h2>
<p>Requer-se o conhecimento e desprovimento do recurso de apelação, mantendo-se incólume a sentença recorrida, condenando-se o apelante ao pagamento de honorários recursais.</p>
${FECHO()}`,
  },
  {
    slug: "recurso-especial",
    title: "Recurso Especial (STJ)",
    category: "RECURSO_ESPECIAL",
    group: "Petições e recursos",
    description: "Recurso especial ao Superior Tribunal de Justiça por violação à lei federal ou divergência jurisprudencial.",
    content: `<p style="text-align:right">EGRÉGIO SUPERIOR TRIBUNAL DE JUSTIÇA</p>
<p>(via Presidência/Vice-Presidência do Tribunal de Justiça do Estado de Goiás)</p>
<p>Processo nº {{PROCESSO}}</p>
<h1>Recurso Especial</h1>
<p><strong>Recorrente:</strong> {{CLIENTE}}<br><strong>Recorrido(a):</strong> {{PARTE_CONTRARIA}}</p>
<h2>I — Do cabimento</h2>
<p>O presente recurso é cabível com fundamento no art. 105, III, [alínea a/c], da Constituição Federal, por contrariedade/negativa de vigência a lei federal e/ou divergência jurisprudencial quanto à interpretação de [dispositivo legal].</p>
<h2>II — Do prequestionamento</h2>
<p>A matéria foi devidamente prequestionada nas instâncias ordinárias, conforme [referência às peças/decisões anteriores].</p>
<h2>III — Das razões de mérito</h2>
<p>[Fundamentação jurídica demonstrando a violação à legislação federal e/ou a divergência jurisprudencial, com indicação de precedentes do STJ.]</p>
<h2>IV — Do pedido</h2>
<p>Requer-se o conhecimento e provimento do presente recurso especial, para reformar o acórdão recorrido nos termos expostos.</p>
${FECHO()}`,
  },
  {
    slug: "mandado-seguranca",
    title: "Mandado de Segurança",
    category: "MANDADO_SEGURANCA",
    group: "Petições e recursos",
    description: "Mandado de segurança contra ato de autoridade pública (ex.: ente público de saúde — SUS).",
    content: `${ENDERECO_JUIZO("___ VARA DE FAZENDA PÚBLICA DA COMARCA DE [COMARCA]")}
<h1>Mandado de Segurança</h1>
<p><strong>Impetrante:</strong> {{CLIENTE}}<br><strong>Impetrado(a):</strong> {{PARTE_CONTRARIA}}</p>
<h2>I — Do ato coator</h2>
<p>[Descrever o ato ilegal/abusivo da autoridade pública: negativa de fornecimento de medicamento/tratamento pelo SUS, indeferimento administrativo etc.]</p>
<h2>II — Do direito líquido e certo</h2>
<p>O direito da parte impetrante decorre de prova pré-constituída (laudo médico, prescrição, requerimento administrativo e respectiva negativa), demonstrando-se líquido e certo nos termos do art. 5º, LXIX, da Constituição Federal e da Lei nº 12.016/2009.</p>
<h2>III — Da liminar</h2>
<p>Presentes a relevância dos fundamentos e o risco de ineficácia da medida, requer-se a concessão de liminar para determinar, desde logo, o fornecimento de [medicamento/tratamento].</p>
<h2>IV — Dos pedidos</h2>
<ol>
<li>A concessão de liminar para o fornecimento imediato de [medicamento/tratamento];</li>
<li>A notificação da autoridade coatora para prestar informações;</li>
<li>A intimação do órgão de representação judicial da pessoa jurídica interessada;</li>
<li>A oitiva do Ministério Público;</li>
<li>Ao final, a concessão definitiva da segurança.</li>
</ol>
<p>Dá-se à causa o valor de R$ [valor].</p>
${FECHO()}`,
  },
  {
    slug: "contrato-honorarios",
    title: "Contrato de Honorários Advocatícios",
    category: "CONTRATO_HONORARIOS",
    group: "Contratos e procurações",
    description: "Contrato de prestação de serviços advocatícios e honorários.",
    content: `<h1 style="text-align:center">Contrato de Prestação de Serviços Advocatícios e Honorários</h1>
<p><strong>CONTRATANTE:</strong> {{CLIENTE}}.</p>
<p><strong>CONTRATADA:</strong> ${ADVOGADA}, advogada, inscrita na ${OAB}.</p>
<p>As partes acima identificadas têm, entre si, justo e acertado o presente contrato de prestação de serviços advocatícios, mediante as cláusulas seguintes.</p>
<h2>Cláusula 1ª — Do objeto</h2>
<p>A CONTRATADA prestará serviços de assessoria e representação jurídica à CONTRATANTE no(s) seguinte(s) caso(s): [descrever a demanda — ex.: ação contra {{PARTE_CONTRARIA}} para fornecimento de tratamento de saúde].</p>
<h2>Cláusula 2ª — Dos honorários</h2>
<p>Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA honorários no valor/modalidade de [à vista / parcelado / êxito de X% sobre o proveito econômico], conforme detalhamento abaixo: [detalhar valores e forma de pagamento].</p>
<h2>Cláusula 3ª — Dos honorários de sucumbência</h2>
<p>Os honorários de sucumbência fixados judicialmente pertencem exclusivamente à CONTRATADA, nos termos do art. 23 da Lei nº 8.906/1994.</p>
<h2>Cláusula 4ª — Das obrigações das partes</h2>
<p>A CONTRATADA se obriga a empregar todos os esforços técnicos cabíveis na defesa dos interesses da CONTRATANTE. A CONTRATANTE se obriga a fornecer todas as informações e documentos necessários ao bom desempenho do mandato.</p>
<h2>Cláusula 5ª — Da vigência e rescisão</h2>
<p>O presente contrato vigorará até o encerramento da demanda descrita na Cláusula 1ª, podendo ser rescindido por qualquer das partes mediante comunicação prévia, observado o direito da CONTRATADA aos honorários proporcionais ao trabalho já realizado.</p>
<h2>Cláusula 6ª — Do foro</h2>
<p>Fica eleito o foro da comarca de Goiânia/GO para dirimir quaisquer controvérsias oriundas deste contrato.</p>
<p>E por estarem assim justas e contratadas, firmam o presente instrumento.</p>
<p>Goiânia, {{DATA}}.</p>
<p>_____________________________________<br><strong>{{CLIENTE}}</strong> (Contratante)</p>
<p>_____________________________________<br><strong>${ADVOGADA}</strong> — ${OAB} (Contratada)</p>`,
  },
  {
    slug: "procuracao",
    title: "Procuração Ad Judicia",
    category: "PROCURACAO",
    group: "Contratos e procurações",
    description: "Instrumento de mandato outorgando poderes para representação judicial.",
    content: `<h1 style="text-align:center">Procuração Ad Judicia et Extra</h1>
<p><strong>OUTORGANTE:</strong> {{CLIENTE}}.</p>
<p><strong>OUTORGADA:</strong> ${ADVOGADA}, advogada, inscrita na ${OAB}, com escritório profissional em Goiânia/GO.</p>
<p>Pelo presente instrumento particular de procuração, o(a) OUTORGANTE nomeia e constitui sua bastante procuradora a OUTORGADA acima qualificada, a quem confere amplos, gerais e ilimitados poderes para o foro em geral, com a cláusula <em>ad judicia et extra</em>, em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes — em especial em face de <strong>{{PARTE_CONTRARIA}}</strong> — e defendê-la(o) nas contrárias, seguindo umas e outras até final decisão, usando os recursos legais e acompanhando-os, conferindo-lhe ainda poderes especiais para confessar, desistir, transigir, firmar compromissos ou acordos, receber e dar quitação, agindo em conjunto ou separadamente, podendo ainda substabelecer esta a outrem, com ou sem reserva de poderes, dando tudo por bom, firme e valioso.</p>
<p>Goiânia, {{DATA}}.</p>
<p>_____________________________________<br><strong>{{CLIENTE}}</strong> (Outorgante)</p>`,
  },
  {
    slug: "notificacao-extrajudicial",
    title: "Notificação Extrajudicial",
    category: "NOTIFICACAO_EXTRAJUDICIAL",
    group: "Comunicações",
    description: "Notificação prévia à parte contrária (plano de saúde, ente público etc.) antes do ajuizamento.",
    content: `<h1 style="text-align:center">Notificação Extrajudicial</h1>
<p><strong>Notificante:</strong> {{CLIENTE}}</p>
<p><strong>Notificado(a):</strong> {{PARTE_CONTRARIA}}</p>
<p>Pela presente, o(a) Notificante, por meio de sua advogada que esta subscreve, vem <strong>NOTIFICAR</strong> o(a) Notificado(a) acerca do quanto segue:</p>
<h2>I — Dos fatos</h2>
<p>[Descrever os fatos: negativa de cobertura, ausência de resposta, descumprimento contratual etc.]</p>
<h2>II — Do direito</h2>
<p>[Fundamentação sucinta do direito da parte notificante.]</p>
<h2>III — Da notificação</h2>
<p>Diante do exposto, fica o(a) Notificado(a) formalmente notificado(a) a, no prazo de [prazo] dias contados do recebimento desta, [providência solicitada — ex.: autorizar o procedimento, fornecer o medicamento, responder ao pedido], sob pena de adoção das medidas judiciais cabíveis, sem prejuízo de eventual responsabilização por perdas e danos.</p>
<p>Goiânia, {{DATA}}.</p>
<p><strong>${ADVOGADA}</strong><br>${OAB}</p>`,
  },
  {
    slug: "parecer-juridico",
    title: "Parecer Jurídico",
    category: "PARECER",
    group: "Outros",
    description: "Análise técnica de viabilidade de uma demanda, para orientação do cliente.",
    content: `<h1 style="text-align:center">Parecer Jurídico</h1>
<p><strong>Interessado(a):</strong> {{CLIENTE}}</p>
<p><strong>Parte contrária:</strong> {{PARTE_CONTRARIA}}</p>
<h2>I — Consulta</h2>
<p>[Descrever a consulta/dúvida apresentada pelo(a) cliente.]</p>
<h2>II — Dos fatos relevantes</h2>
<p>[Resumo dos fatos e documentos analisados.]</p>
<h2>III — Análise jurídica</h2>
<p>[Fundamentação legal e jurisprudencial aplicável ao caso.]</p>
<h2>IV — Conclusão</h2>
<p>Diante do exposto, opina-se pela [viabilidade/inviabilidade] da medida pretendida, recomendando-se [próximos passos sugeridos].</p>
<p>Goiânia, {{DATA}}.</p>
<p><strong>${ADVOGADA}</strong><br>${OAB}</p>`,
  },
  {
    slug: "em-branco",
    title: "Modelo em branco",
    category: "EM_BRANCO",
    group: "Em branco",
    description: "Comece do zero, sem texto pré-definido.",
    content: `<h1>{{TITULO}}</h1>
<p><strong>Cliente:</strong> {{CLIENTE}} &nbsp;|&nbsp; <strong>Parte contrária:</strong> {{PARTE_CONTRARIA}}</p>
<p><br></p>`,
  },
];

export const BLANK_TEMPLATE = PETITION_TEMPLATES.find((t) => t.slug === "em-branco")!;

export function getTemplate(slug: string | null | undefined): PetitionTemplate {
  return PETITION_TEMPLATES.find((t) => t.slug === slug) ?? BLANK_TEMPLATE;
}

export function renderTemplateContent(
  content: string,
  vars: { titulo?: string; cliente?: string; parteContraria?: string; processo?: string }
): string {
  const data = new Date().toLocaleDateString("pt-BR");
  return content
    .replace(/\{\{TITULO\}\}/g, vars.titulo?.trim() || "Documento")
    .replace(/\{\{CLIENTE\}\}/g, vars.cliente?.trim() || "[CLIENTE]")
    .replace(/\{\{PARTE_CONTRARIA\}\}/g, vars.parteContraria?.trim() || "[PARTE CONTRÁRIA]")
    .replace(/\{\{PROCESSO\}\}/g, vars.processo?.trim() || "[NÚMERO DO PROCESSO]")
    .replace(/\{\{DATA\}\}/g, data);
}

export const PETITION_TEMPLATE_GROUPS = [
  "Petições e recursos",
  "Contratos e procurações",
  "Comunicações",
  "Outros",
  "Em branco",
] as const;
