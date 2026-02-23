// Dados simulados para os documentos do Portal Jurídico

export const documentsData = [
  {
    id: 'MIN-001-2026',
    date: '15-01-2026',
    vigencia: '15-01-2026',
    title: 'Minuta - Reunião de Diretoria - Aprovação de Orçamento Anual',
    summary: 'Minuta da reunião de diretoria realizada em 15 de janeiro de 2026, contendo as deliberações sobre a aprovação do orçamento anual, definição de metas estratégicas e alocação de recursos para os diversos departamentos da instituição.',
    summarySimplified: 'Esta minuta registra a reunião da diretoria onde foi aprovado o orçamento do ano. Foram definidas as metas que a empresa vai buscar e como o dinheiro será distribuído entre os diferentes setores.',
    content: `MINUTA DE REUNIÃO DE DIRETORIA

Data: 15 de janeiro de 2026
Local: Sala de Reuniões - Sede Administrativa
Presidência: Diretor Geral

DELIBERAÇÕES:

1. APROVAÇÃO DE ORÇAMENTO ANUAL
   A diretoria, em conformidade com o art. 45 da Lei nº 8.666/93 e as diretrizes estabelecidas no plano estratégico institucional, deliberou pela aprovação do orçamento anual para o exercício de 2026, no valor total de R$ 15.000.000,00 (quinze milhões de reais).

2. DEFINIÇÃO DE METAS ESTRATÉGICAS
   Foram estabelecidas metas quantitativas e qualitativas para os diversos departamentos, observando os indicadores de desempenho previstos no contrato de gestão e as diretrizes da política institucional.

3. ALOCAÇÃO DE RECURSOS
   Os recursos foram distribuídos proporcionalmente entre os departamentos, respeitando as necessidades operacionais, projetos em andamento e investimentos previstos no plano de ação anual.

CONCLUSÃO:
A reunião foi encerrada com a aprovação unânime das deliberações apresentadas, ficando determinado que as ações serão implementadas conforme cronograma estabelecido.`,
    categories: ['Minuta', 'Diretoria'],
    highlightText: 'Minuta - Reunião de Diretoria',
    classificacaoSigilo: 'interno'
  },
  {
    id: 'INF-045-2026',
    date: '18-01-2026',
    vigencia: '18-01-2026',
    title: 'Informativo Jurídico - Regulamentação de Horário de Trabalho Remoto',
    summary: 'Informativo sobre as diretrizes jurídicas para implementação e regulamentação do trabalho remoto, incluindo aspectos contratuais, de segurança da informação e cumprimento da legislação trabalhista vigente.',
    summarySimplified: 'Este informativo explica as regras legais para trabalhar de casa. Fala sobre o que precisa estar no contrato, como proteger informações da empresa e quais são os direitos e deveres do trabalhador e da empresa.',
    content: `INFORMATIVO JURÍDICO Nº 045/2026

REGULAMENTAÇÃO DE HORÁRIO DE TRABALHO REMOTO

Considerando o disposto na Consolidação das Leis do Trabalho (CLT), especialmente os arts. 6º e 75-B, e a necessidade de adequação às novas modalidades de prestação de serviços, este informativo estabelece as diretrizes jurídicas para implementação do trabalho remoto.

ASPECTOS CONTRATUAIS:
O trabalho remoto deve ser formalizado mediante aditivo contratual ou acordo individual, estabelecendo claramente as condições de trabalho, jornada, forma de controle e responsabilidades das partes contratantes.

SEGURANÇA DA INFORMAÇÃO:
A instituição deve fornecer equipamentos e sistemas adequados, garantindo a segurança dos dados e informações institucionais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

CUMPRIMENTO LEGISLATIVO:
O trabalho remoto não altera a relação de emprego, mantendo-se todos os direitos trabalhistas previstos na CLT, incluindo horas extras, intervalos e descanso semanal remunerado, quando aplicável.

CONCLUSÃO:
A implementação do trabalho remoto deve observar rigorosamente a legislação trabalhista vigente, garantindo os direitos dos trabalhadores e a segurança jurídica da instituição.`,
    categories: ['Informativo Jurídico', 'Trabalhista'],
    highlightText: 'Informativo Jurídico',
    classificacaoSigilo: 'grupo',
    gruposAutorizados: [1]
  },
  {
    id: 'DEC-012-2026',
    date: '20-01-2026',
    vigencia: '20-01-2026',
    title: 'Decisão - Aprovação de Contrato de Prestação de Serviços de Limpeza',
    summary: 'Decisão administrativa sobre a aprovação do contrato de prestação de serviços de limpeza e conservação, incluindo análise de propostas, critérios de seleção e definição de valores contratuais.',
    summarySimplified: 'Esta decisão aprova a contratação de uma empresa para fazer a limpeza dos prédios. Foram analisadas várias propostas, escolhida a melhor e definido quanto será pago pelo serviço.',
    content: `DECISÃO ADMINISTRATIVA Nº 012/2026

APROVAÇÃO DE CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE LIMPEZA E CONSERVAÇÃO

Considerando o processo de licitação realizado nos termos da Lei nº 8.666/93, e após análise das propostas apresentadas, decide-se pela aprovação do contrato de prestação de serviços de limpeza e conservação.

ANÁLISE DE PROPOSTAS:
Foram analisadas 5 (cinco) propostas comerciais, sendo avaliados os critérios de preço, qualidade dos serviços, experiência comprovada e capacidade técnica dos proponentes.

CRITÉRIOS DE SELEÇÃO:
A seleção foi realizada com base na melhor relação custo-benefício, observando os requisitos técnicos estabelecidos no edital de licitação e a conformidade com as normas de segurança do trabalho.

DEFINIÇÃO DE VALORES:
O contrato foi estabelecido no valor mensal de R$ 45.000,00 (quarenta e cinco mil reais), com vigência de 12 (doze) meses, prorrogável por igual período, mediante acordo entre as partes.

CONCLUSÃO:
Fica aprovado o contrato com a empresa selecionada, devendo ser observado o cumprimento rigoroso das cláusulas contratuais e das normas de qualidade estabelecidas.`,
    categories: ['Decisão', 'Contratos'],
    highlightText: 'Decisão',
    classificacaoSigilo: 'pessoal',
    usuariosAutorizados: [1, 2]
  },
  {
    id: 'MIN-002-2026',
    date: '22-01-2026',
    vigencia: '22-01-2026',
    title: 'Minuta - Comitê de Compras - Aquisição de Equipamentos de TI',
    summary: 'Registro das discussões e deliberações do comitê de compras sobre a aquisição de equipamentos de tecnologia da informação, análise de fornecedores e definição de especificações técnicas necessárias.',
    summarySimplified: 'Esta minuta registra a reunião do comitê de compras sobre a compra de computadores e equipamentos de informática. Foram discutidas as especificações técnicas necessárias e analisados diferentes fornecedores.',
    content: `MINUTA DE REUNIÃO DO COMITÊ DE COMPRAS

Data: 22 de janeiro de 2026
Participantes: Membros do Comitê de Compras e Departamento de TI

DELIBERAÇÕES:

1. AQUISIÇÃO DE EQUIPAMENTOS DE TI
   O comitê deliberou pela aquisição de equipamentos de tecnologia da informação para modernização da infraestrutura tecnológica da instituição, em conformidade com o plano de investimentos aprovado.

2. ANÁLISE DE FORNECEDORES
   Foram analisadas propostas de 3 (três) fornecedores habilitados, sendo avaliados critérios de preço, qualidade dos equipamentos, garantia oferecida e suporte técnico disponível.

3. ESPECIFICAÇÕES TÉCNICAS
   Foram definidas as especificações técnicas mínimas necessárias para os equipamentos, incluindo processadores, memória RAM, armazenamento e sistemas operacionais compatíveis com a infraestrutura existente.

CONCLUSÃO:
Ficou aprovada a aquisição dos equipamentos conforme especificações técnicas definidas, devendo o processo de compra seguir os procedimentos estabelecidos na política de compras institucional.`,
    categories: ['Minuta', 'Compras'],
    highlightText: 'Minuta - Comitê de Compras'
  },
  {
    id: 'INF-046-2026',
    date: '25-01-2026',
    vigencia: '25-01-2026',
    title: 'Informativo Jurídico - Compliance e Proteção de Dados Pessoais',
    summary: 'Orientação jurídica sobre as obrigações de compliance relacionadas à proteção de dados pessoais, adequação à LGPD, políticas internas necessárias e procedimentos para tratamento de dados de colaboradores e clientes.',
    summarySimplified: 'Este informativo explica as regras sobre proteção de dados pessoais. Fala sobre o que a empresa precisa fazer para proteger informações de funcionários e clientes, seguindo a lei de proteção de dados.',
    content: `INFORMATIVO JURÍDICO Nº 046/2026

COMPLIANCE E PROTEÇÃO DE DADOS PESSOAIS

Considerando o disposto na Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e a necessidade de adequação às normas de proteção de dados pessoais, este informativo estabelece as diretrizes para compliance em matéria de proteção de dados.

OBRIGAÇÕES DE COMPLIANCE:
A instituição, na qualidade de controladora de dados pessoais, deve implementar medidas técnicas e administrativas adequadas para proteger os dados pessoais contra acessos não autorizados e situações acidentais ou ilícitas.

ADEQUAÇÃO À LGPD:
É necessário estabelecer políticas internas claras sobre o tratamento de dados pessoais, designar encarregado de proteção de dados (DPO), realizar mapeamento de dados e implementar medidas de segurança da informação.

PROCEDIMENTOS PARA TRATAMENTO DE DADOS:
O tratamento de dados pessoais de colaboradores e clientes deve ser realizado com base em fundamento legal adequado, observando os princípios da finalidade, adequação, necessidade e transparência previstos na LGPD.

CONCLUSÃO:
A adequação à LGPD é obrigatória e essencial para evitar sanções administrativas e garantir a segurança jurídica nas operações de tratamento de dados pessoais.`,
    categories: ['Informativo Jurídico', 'LGPD'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-013-2026',
    date: '28-01-2026',
    vigencia: '28-01-2026',
    title: 'Decisão - Renovação de Aluguel de Espaços Físicos',
    summary: 'Decisão sobre a renovação dos contratos de aluguel de espaços físicos utilizados pela instituição, análise de valores, negociação de condições e aprovação dos novos termos contratuais.',
    summarySimplified: 'Esta decisão aprova a renovação dos contratos de aluguel dos prédios que a empresa usa. Foram analisados os valores, negociadas as condições e aprovados os novos termos dos contratos.',
    content: `DECISÃO ADMINISTRATIVA Nº 013/2026

RENOVAÇÃO DE CONTRATOS DE ALUGUEL DE ESPAÇOS FÍSICOS

Considerando a necessidade de manutenção das atividades institucionais e a análise dos contratos de locação vigentes, decide-se pela renovação dos contratos de aluguel de espaços físicos.

ANÁLISE DE VALORES:
Foram analisados os valores praticados no mercado imobiliário local, comparando-os com os valores dos contratos vigentes, verificando-se a adequação dos valores propostos para renovação.

NEGOCIAÇÃO DE CONDIÇÕES:
Foram negociadas condições contratuais favoráveis à instituição, incluindo reajustes anuais baseados em índices oficiais, cláusulas de rescisão e manutenção das instalações.

APROVAÇÃO DOS TERMOS:
Ficam aprovados os novos termos contratuais, estabelecendo-se a vigência de 36 (trinta e seis) meses, com possibilidade de prorrogação mediante acordo entre as partes.

CONCLUSÃO:
A renovação dos contratos de locação garante a continuidade das atividades institucionais e a segurança jurídica nas relações contratuais estabelecidas.`,
    categories: ['Decisão', 'Imóveis'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-003-2026',
    date: '01-02-2026',
    vigencia: '01-02-2026',
    title: 'Minuta - Reunião de RH - Política de Benefícios e Remuneração',
    summary: 'Minuta da reunião do departamento de recursos humanos sobre revisão da política de benefícios e remuneração, discussão de ajustes salariais, benefícios complementares e adequação às práticas de mercado.',
    summarySimplified: 'Esta minuta registra a reunião do RH sobre benefícios e salários. Foram discutidos ajustes nos salários, benefícios extras que a empresa oferece e como ficar competitivo no mercado de trabalho.',
    content: `MINUTA DE REUNIÃO DO DEPARTAMENTO DE RECURSOS HUMANOS

Data: 01 de fevereiro de 2026
Participantes: Equipe de RH e Diretoria

DELIBERAÇÕES:

1. REVISÃO DA POLÍTICA DE BENEFÍCIOS E REMUNERAÇÃO
   Foi discutida a necessidade de revisão da política de benefícios e remuneração, visando adequação às práticas de mercado e manutenção da competitividade na atração e retenção de talentos.

2. AJUSTES SALARIAIS
   Foram analisados os índices de inflação e as práticas salariais do mercado, sendo proposta a implementação de ajustes salariais proporcionais, observando a capacidade financeira da instituição.

3. BENEFÍCIOS COMPLEMENTARES
   Foi discutida a ampliação dos benefícios complementares oferecidos aos colaboradores, incluindo plano de saúde, vale-refeição, auxílio-transporte e programas de desenvolvimento profissional.

CONCLUSÃO:
Ficou estabelecido que a política de benefícios e remuneração será revisada anualmente, garantindo a competitividade e a satisfação dos colaboradores.`,
    categories: ['Minuta', 'Recursos Humanos'],
    highlightText: 'Minuta - Reunião de RH'
  },
  {
    id: 'INF-047-2026',
    date: '05-02-2026',
    vigencia: '05-02-2026',
    title: 'Informativo Jurídico - Licitações e Contratações Públicas',
    summary: 'Orientação sobre os procedimentos legais para participação em licitações públicas, análise de editais, apresentação de propostas e cumprimento dos requisitos estabelecidos na legislação de licitações.',
    summarySimplified: 'Este informativo explica como participar de licitações públicas (concursos para fornecer serviços ao governo). Fala sobre como analisar os editais, apresentar propostas e seguir todas as regras necessárias.',
    content: `INFORMATIVO JURÍDICO Nº 047/2026

LICITAÇÕES E CONTRATAÇÕES PÚBLICAS

Considerando o disposto na Lei nº 8.666/93 (Lei de Licitações) e a necessidade de orientação sobre os procedimentos legais para participação em processos licitatórios, este informativo estabelece as diretrizes para participação em licitações públicas.

PROCEDIMENTOS LEGAIS:
A participação em licitações públicas deve observar rigorosamente os procedimentos estabelecidos na Lei nº 8.666/93, incluindo habilitação jurídica, qualificação técnica e econômica, e apresentação de documentação exigida no edital.

ANÁLISE DE EDITAIS:
É essencial realizar análise detalhada dos editais de licitação, verificando os requisitos de habilitação, especificações técnicas, critérios de julgamento e condições de execução do objeto licitado.

APRESENTAÇÃO DE PROPOSTAS:
As propostas devem ser apresentadas dentro dos prazos estabelecidos, observando todas as exigências do edital, incluindo documentação, garantias e especificações técnicas requeridas.

CONCLUSÃO:
A participação em licitações públicas requer conhecimento técnico-jurídico adequado e observância rigorosa dos procedimentos legais estabelecidos na legislação de licitações.`,
    categories: ['Informativo Jurídico', 'Licitações'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-014-2026',
    date: '08-02-2026',
    vigencia: '08-02-2026',
    title: 'Decisão - Aprovação de Parceria para Eventos Culturais',
    summary: 'Decisão sobre a aprovação de parceria estratégica para realização de eventos culturais, análise de proposta, definição de contrapartidas e estabelecimento de cronograma de execução das atividades.',
    summarySimplified: 'Esta decisão aprova uma parceria para fazer eventos culturais. Foram analisadas as propostas, definidas as contrapartidas (o que cada parte vai fazer) e estabelecido um cronograma para realizar as atividades.',
    content: `DECISÃO ADMINISTRATIVA Nº 014/2026

APROVAÇÃO DE PARCERIA PARA REALIZAÇÃO DE EVENTOS CULTURAIS

Considerando a missão institucional de promoção da cultura e a necessidade de estabelecer parcerias estratégicas para ampliação das atividades culturais oferecidas, decide-se pela aprovação de parceria para realização de eventos culturais.

ANÁLISE DE PROPOSTA:
Foi analisada proposta de parceria apresentada por instituição cultural reconhecida, verificando-se a viabilidade técnica, financeira e a adequação aos objetivos institucionais.

DEFINIÇÃO DE CONTRAPARTIDAS:
Foram estabelecidas as contrapartidas de cada parte envolvida na parceria, incluindo disponibilização de espaços físicos, recursos humanos, materiais e equipamentos necessários para realização dos eventos.

CRONOGRAMA DE EXECUÇÃO:
Foi estabelecido cronograma de execução das atividades, definindo-se prazos, responsabilidades e etapas de implementação da parceria, garantindo o cumprimento dos objetivos propostos.

CONCLUSÃO:
A parceria aprovada contribuirá para o fortalecimento das atividades culturais oferecidas pela instituição, ampliando o acesso da comunidade aos serviços culturais disponibilizados.`,
    categories: ['Decisão', 'Parcerias'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-004-2026',
    date: '12-02-2026',
    vigencia: '12-02-2026',
    title: 'Minuta - Comitê de Segurança - Protocolos de Segurança e Emergência',
    summary: 'Registro das discussões sobre atualização dos protocolos de segurança e emergência, revisão de procedimentos, treinamentos necessários e adequação às normas de segurança do trabalho.',
    summarySimplified: 'Esta minuta registra a reunião sobre segurança. Foram discutidos os protocolos de segurança e o que fazer em caso de emergência, além dos treinamentos necessários para os funcionários.',
    content: `MINUTA DE REUNIÃO DO COMITÊ DE SEGURANÇA

Data: 12 de fevereiro de 2026
Participantes: Membros do Comitê de Segurança e CIPA

DELIBERAÇÕES:

1. ATUALIZAÇÃO DOS PROTOCOLOS DE SEGURANÇA E EMERGÊNCIA
   Foi discutida a necessidade de atualização dos protocolos de segurança e emergência, visando adequação às normas de segurança do trabalho e melhoria dos procedimentos de prevenção de acidentes.

2. REVISÃO DE PROCEDIMENTOS
   Foram revisados os procedimentos de evacuação, combate a incêndios, primeiros socorros e comunicação de emergências, garantindo a eficácia dos protocolos estabelecidos.

3. TREINAMENTOS NECESSÁRIOS
   Foi definido cronograma de treinamentos para colaboradores, incluindo capacitação em segurança do trabalho, uso de equipamentos de proteção individual e procedimentos de emergência.

CONCLUSÃO:
Os protocolos de segurança e emergência foram atualizados e serão implementados conforme cronograma estabelecido, garantindo a segurança dos colaboradores e usuários das instalações.`,
    categories: ['Minuta', 'Segurança'],
    highlightText: 'Minuta - Comitê de Segurança'
  },
  {
    id: 'INF-048-2026',
    date: '15-02-2026',
    vigencia: '15-02-2026',
    title: 'Informativo Jurídico - Responsabilidade Civil em Atividades Esportivas',
    summary: 'Orientação jurídica sobre a responsabilidade civil da instituição em atividades esportivas oferecidas, análise de riscos, medidas preventivas necessárias e adequação de seguros e coberturas.',
    summarySimplified: 'Este informativo explica a responsabilidade legal da empresa em atividades esportivas. Fala sobre os riscos, o que fazer para prevenir acidentes e quais seguros são necessários para proteger a empresa e os participantes.',
    content: `INFORMATIVO JURÍDICO Nº 048/2026

RESPONSABILIDADE CIVIL EM ATIVIDADES ESPORTIVAS

Considerando o disposto no Código Civil (Lei nº 10.406/2002), especialmente os arts. 927 e 932, e a necessidade de orientação sobre a responsabilidade civil em atividades esportivas, este informativo estabelece as diretrizes jurídicas sobre o tema.

RESPONSABILIDADE CIVIL:
A instituição, na qualidade de organizadora de atividades esportivas, responde objetivamente pelos danos causados aos participantes, em conformidade com a teoria do risco da atividade, independentemente de culpa.

ANÁLISE DE RISCOS:
É essencial realizar análise detalhada dos riscos inerentes às atividades esportivas oferecidas, identificando potenciais situações de dano e implementando medidas preventivas adequadas.

MEDIDAS PREVENTIVAS:
Devem ser implementadas medidas preventivas, incluindo adequação de instalações, fornecimento de equipamentos de segurança, supervisão adequada e orientação aos participantes sobre os riscos das atividades.

SEGUROS E COBERTURAS:
É recomendável a contratação de seguro de responsabilidade civil para cobertura de eventuais danos causados durante a realização das atividades esportivas, garantindo a proteção patrimonial da instituição.

CONCLUSÃO:
A implementação de medidas preventivas e a contratação de seguros adequados são essenciais para mitigar os riscos de responsabilização civil e garantir a segurança jurídica nas atividades esportivas oferecidas.`,
    categories: ['Informativo Jurídico', 'Responsabilidade Civil'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-015-2026',
    date: '18-02-2026',
    vigencia: '18-02-2026',
    title: 'Decisão - Contratação de Serviços de Consultoria Contábil',
    summary: 'Decisão sobre a contratação de serviços de consultoria contábil para apoio nas rotinas fiscais e contábeis, análise de propostas técnicas e comerciais e definição do escopo dos serviços.',
    summarySimplified: 'Esta decisão aprova a contratação de uma empresa de consultoria para ajudar com questões de contabilidade e impostos. Foram analisadas as propostas e definido o que será feito.',
    content: `DECISÃO ADMINISTRATIVA Nº 015/2026

CONTRATAÇÃO DE SERVIÇOS DE CONSULTORIA CONTÁBIL

Considerando a necessidade de apoio especializado nas rotinas fiscais e contábeis da instituição, decide-se pela contratação de serviços de consultoria contábil.

ANÁLISE DE PROPOSTAS:
Foram analisadas propostas técnicas e comerciais de 3 (três) empresas de consultoria contábil, sendo avaliados critérios de experiência, qualificação técnica, referências e valores propostos.

DEFINIÇÃO DO ESCOPO:
Foi definido o escopo dos serviços a serem prestados, incluindo apoio na elaboração de demonstrações contábeis, assessoria fiscal, planejamento tributário e orientação sobre questões contábeis e fiscais.

CONCLUSÃO:
Fica aprovada a contratação dos serviços de consultoria contábil, devendo ser observado o cumprimento rigoroso do escopo definido e a qualidade dos serviços prestados.`,
    categories: ['Decisão', 'Consultoria'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-005-2026',
    date: '20-02-2026',
    vigencia: '20-02-2026',
    title: 'Minuta - Reunião de Marketing - Estratégias de Comunicação Digital',
    summary: 'Registro das discussões sobre estratégias de comunicação digital, planejamento de campanhas, uso de redes sociais e definição de métricas para avaliação de resultados das ações de marketing.',
    summarySimplified: 'Esta minuta registra a reunião de marketing sobre comunicação digital. Foram discutidas estratégias para usar redes sociais, planejar campanhas e medir os resultados das ações de marketing.',
    content: `MINUTA DE REUNIÃO DO DEPARTAMENTO DE MARKETING

Data: 20 de fevereiro de 2026
Participantes: Equipe de Marketing e Comunicação

DELIBERAÇÕES:

1. ESTRATÉGIAS DE COMUNICAÇÃO DIGITAL
   Foi discutida a necessidade de ampliação das estratégias de comunicação digital, visando maior engajamento com o público-alvo e ampliação da presença digital da instituição.

2. PLANEJAMENTO DE CAMPANHAS
   Foram definidas diretrizes para planejamento de campanhas digitais, incluindo definição de público-alvo, canais de comunicação, conteúdo e cronograma de execução das ações.

3. USO DE REDES SOCIAIS
   Foi estabelecida estratégia para uso de redes sociais, definindo-se plataformas prioritárias, frequência de postagens, tipo de conteúdo e métricas de engajamento a serem monitoradas.

CONCLUSÃO:
As estratégias de comunicação digital foram definidas e serão implementadas conforme planejamento estabelecido, visando fortalecer a presença digital da instituição.`,
    categories: ['Minuta', 'Marketing'],
    highlightText: 'Minuta - Reunião de Marketing'
  },
  {
    id: 'INF-049-2026',
    date: '22-02-2026',
    vigencia: '22-02-2026',
    title: 'Informativo Jurídico - Direitos Autorais em Materiais Educacionais',
    summary: 'Orientação sobre os aspectos legais relacionados aos direitos autorais em materiais educacionais produzidos pela instituição, uso de conteúdo de terceiros e proteção da propriedade intelectual.',
    summarySimplified: 'Este informativo explica as regras sobre direitos autorais em materiais educacionais. Fala sobre como proteger os materiais que a empresa cria e como usar conteúdo de outras pessoas de forma legal.',
    content: `INFORMATIVO JURÍDICO Nº 049/2026

DIREITOS AUTORAIS EM MATERIAIS EDUCACIONAIS

Considerando o disposto na Lei de Direitos Autorais (Lei nº 9.610/98) e a necessidade de orientação sobre proteção da propriedade intelectual em materiais educacionais, este informativo estabelece as diretrizes jurídicas sobre o tema.

PROTEÇÃO DA PROPRIEDADE INTELECTUAL:
Os materiais educacionais produzidos pela instituição são protegidos pela Lei de Direitos Autorais, sendo necessário registro adequado e identificação clara da autoria para garantia da proteção legal.

USO DE CONTEÚDO DE TERCEIROS:
O uso de conteúdo de terceiros em materiais educacionais deve observar os limites estabelecidos na Lei de Direitos Autorais, incluindo citações, uso para fins educacionais e obtenção de autorização quando necessário.

PROTEÇÃO DA PROPRIEDADE INTELECTUAL:
É recomendável estabelecer políticas internas sobre uso de materiais protegidos por direitos autorais, garantindo o cumprimento da legislação e evitando violações de direitos autorais.

CONCLUSÃO:
A observância da legislação de direitos autorais é essencial para garantir a proteção da propriedade intelectual da instituição e evitar responsabilização por violação de direitos autorais de terceiros.`,
    categories: ['Informativo Jurídico', 'Propriedade Intelectual'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-016-2026',
    date: '25-02-2026',
    vigencia: '25-02-2026',
    title: 'Decisão - Aprovação de Programa de Capacitação de Colaboradores',
    summary: 'Decisão sobre a aprovação de programa de capacitação e desenvolvimento profissional dos colaboradores, definição de cursos, investimento em treinamentos e parcerias com instituições de ensino.',
    summarySimplified: 'Esta decisão aprova um programa para capacitar os funcionários. Foram definidos os cursos que serão oferecidos, quanto será investido em treinamentos e parcerias com escolas e universidades.',
    content: `DECISÃO ADMINISTRATIVA Nº 016/2026

APROVAÇÃO DE PROGRAMA DE CAPACITAÇÃO DE COLABORADORES

Considerando a importância do desenvolvimento profissional dos colaboradores e a necessidade de investimento em capacitação, decide-se pela aprovação de programa de capacitação e desenvolvimento profissional.

DEFINIÇÃO DE CURSOS:
Foram definidos os cursos e programas de capacitação a serem oferecidos, incluindo treinamentos técnicos, desenvolvimento de competências comportamentais e programas de educação continuada.

INVESTIMENTO EM TREINAMENTOS:
Foi aprovado investimento de R$ 200.000,00 (duzentos mil reais) para realização de programas de capacitação, incluindo custos com instrutores, materiais didáticos e infraestrutura necessária.

PARCERIAS COM INSTITUIÇÕES DE ENSINO:
Foram estabelecidas parcerias com instituições de ensino reconhecidas para oferta de cursos e programas de capacitação, garantindo qualidade e reconhecimento dos certificados emitidos.

CONCLUSÃO:
O programa de capacitação aprovado contribuirá para o desenvolvimento profissional dos colaboradores e o fortalecimento das competências organizacionais da instituição.`,
    categories: ['Decisão', 'Desenvolvimento'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-006-2026',
    date: '28-02-2026',
    vigencia: '28-02-2026',
    title: 'Minuta - Comitê de Sustentabilidade - Projetos Ambientais',
    summary: 'Registro das discussões sobre projetos de sustentabilidade ambiental, implementação de práticas eco-friendly, redução de consumo de recursos e certificações ambientais.',
    summarySimplified: 'Esta minuta registra a reunião sobre projetos ambientais. Foram discutidas formas de tornar a empresa mais sustentável, reduzir o consumo de recursos naturais e obter certificações ambientais.',
    content: `MINUTA DE REUNIÃO DO COMITÊ DE SUSTENTABILIDADE

Data: 28 de fevereiro de 2026
Participantes: Membros do Comitê de Sustentabilidade

DELIBERAÇÕES:

1. PROJETOS DE SUSTENTABILIDADE AMBIENTAL
   Foi discutida a implementação de projetos de sustentabilidade ambiental, visando redução do impacto ambiental das atividades institucionais e promoção de práticas sustentáveis.

2. IMPLEMENTAÇÃO DE PRÁTICAS ECO-FRIENDLY
   Foram definidas práticas eco-friendly a serem implementadas, incluindo redução do consumo de energia, uso de materiais recicláveis, gestão adequada de resíduos e promoção de transporte sustentável.

3. REDUÇÃO DE CONSUMO DE RECURSOS
   Foi estabelecido plano de redução do consumo de recursos naturais, incluindo metas de redução de consumo de água, energia elétrica e materiais descartáveis.

CONCLUSÃO:
Os projetos de sustentabilidade ambiental foram aprovados e serão implementados conforme cronograma estabelecido, contribuindo para a responsabilidade socioambiental da instituição.`,
    categories: ['Minuta', 'Sustentabilidade'],
    highlightText: 'Minuta - Comitê de Sustentabilidade'
  },
  {
    id: 'INF-050-2026',
    date: '02-03-2026',
    vigencia: '02-03-2026',
    title: 'Informativo Jurídico - Contratos de Prestação de Serviços Educacionais',
    summary: 'Orientação jurídica sobre a elaboração e gestão de contratos de prestação de serviços educacionais, cláusulas essenciais, direitos e deveres das partes e resolução de conflitos.',
    summarySimplified: 'Este informativo explica as regras para fazer contratos de serviços educacionais. Fala sobre o que precisa estar no contrato, os direitos e deveres de cada parte e como resolver problemas que possam surgir.',
    content: `INFORMATIVO JURÍDICO Nº 050/2026

CONTRATOS DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS

Considerando o disposto no Código de Defesa do Consumidor (Lei nº 8.078/90) e a necessidade de orientação sobre contratos de prestação de serviços educacionais, este informativo estabelece as diretrizes jurídicas sobre o tema.

ELABORAÇÃO E GESTÃO DE CONTRATOS:
Os contratos de prestação de serviços educacionais devem ser elaborados com clareza e transparência, estabelecendo de forma precisa os direitos e deveres das partes contratantes e as condições de prestação dos serviços.

CLÁUSULAS ESSENCIAIS:
Devem ser incluídas cláusulas essenciais, tais como objeto do contrato, valor e forma de pagamento, duração, condições de cancelamento, política de reembolso e responsabilidades das partes.

DIREITOS E DEVERES DAS PARTES:
O contrato deve estabelecer claramente os direitos e deveres de cada parte, garantindo a proteção dos interesses do consumidor e a segurança jurídica da instituição prestadora de serviços.

RESOLUÇÃO DE CONFLITOS:
Devem ser estabelecidos mecanismos de resolução de conflitos, incluindo mediação, arbitragem ou resolução judicial, garantindo solução adequada para eventuais controvérsias contratuais.

CONCLUSÃO:
A elaboração adequada de contratos de prestação de serviços educacionais é essencial para garantir a segurança jurídica e a proteção dos direitos das partes envolvidas.`,
    categories: ['Informativo Jurídico', 'Contratos'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-017-2026',
    date: '05-03-2026',
    vigencia: '05-03-2026',
    title: 'Decisão - Renovação de Convênios com Instituições de Ensino',
    summary: 'Decisão sobre a renovação de convênios com instituições de ensino superior para oferta de cursos e programas educacionais, análise de propostas e definição de termos de cooperação.',
    summarySimplified: 'Esta decisão aprova a renovação de convênios com universidades para oferecer cursos. Foram analisadas as propostas e definidos os termos de cooperação entre as instituições.',
    content: `DECISÃO ADMINISTRATIVA Nº 017/2026

RENOVAÇÃO DE CONVÊNIOS COM INSTITUIÇÕES DE ENSINO SUPERIOR

Considerando a necessidade de manutenção de parcerias estratégicas para oferta de cursos e programas educacionais, decide-se pela renovação de convênios com instituições de ensino superior.

ANÁLISE DE PROPOSTAS:
Foram analisadas propostas de renovação de convênios apresentadas por 4 (quatro) instituições de ensino superior, sendo avaliados critérios de qualidade acadêmica, infraestrutura disponível e condições de cooperação propostas.

DEFINIÇÃO DE TERMOS DE COOPERAÇÃO:
Foram definidos os termos de cooperação, incluindo disponibilização de espaços físicos, recursos humanos, materiais didáticos e certificação dos cursos oferecidos em conjunto.

CONCLUSÃO:
A renovação dos convênios garante a continuidade da oferta de cursos e programas educacionais de qualidade, fortalecendo as parcerias estratégicas estabelecidas.`,
    categories: ['Decisão', 'Convênios'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-007-2026',
    date: '08-03-2026',
    vigencia: '08-03-2026',
    title: 'Minuta - Reunião de TI - Modernização de Sistemas',
    summary: 'Registro das discussões sobre projetos de modernização de sistemas de informação, migração para cloud computing, segurança cibernética e otimização de processos digitais.',
    summarySimplified: 'Esta minuta registra a reunião de TI sobre modernização de sistemas. Foram discutidos projetos para atualizar os sistemas, migrar para a nuvem, melhorar a segurança digital e otimizar processos.',
    content: `MINUTA DE REUNIÃO DO DEPARTAMENTO DE TECNOLOGIA DA INFORMAÇÃO

Data: 08 de março de 2026
Participantes: Equipe de TI e Diretoria

DELIBERAÇÕES:

1. PROJETOS DE MODERNIZAÇÃO DE SISTEMAS
   Foi discutida a necessidade de modernização dos sistemas de informação, visando melhoria da eficiência operacional e adequação às novas tecnologias disponíveis.

2. MIGRAÇÃO PARA CLOUD COMPUTING
   Foi aprovada a migração de sistemas para cloud computing, visando redução de custos, maior escalabilidade e melhoria da disponibilidade dos serviços de tecnologia da informação.

3. SEGURANÇA CIBERNÉTICA
   Foram definidas estratégias de segurança cibernética, incluindo implementação de medidas de proteção contra ataques, backup de dados e políticas de segurança da informação.

CONCLUSÃO:
Os projetos de modernização de sistemas foram aprovados e serão implementados conforme cronograma estabelecido, garantindo a modernização da infraestrutura tecnológica da instituição.`,
    categories: ['Minuta', 'Tecnologia'],
    highlightText: 'Minuta - Reunião de TI'
  },
  {
    id: 'INF-051-2026',
    date: '10-03-2026',
    vigencia: '10-03-2026',
    title: 'Informativo Jurídico - Regulamentação de Atividades Culturais',
    summary: 'Orientação sobre os aspectos legais relacionados à realização de atividades culturais, obtenção de licenças, direitos de imagem, contratação de artistas e cumprimento de normas sanitárias.',
    summarySimplified: 'Este informativo explica as regras legais para fazer atividades culturais. Fala sobre as licenças necessárias, direitos de imagem, como contratar artistas e seguir as normas de saúde e segurança.',
    content: `INFORMATIVO JURÍDICO Nº 051/2026

REGULAMENTAÇÃO DE ATIVIDADES CULTURAIS

Considerando a necessidade de orientação sobre os aspectos legais relacionados à realização de atividades culturais, este informativo estabelece as diretrizes jurídicas para organização e realização de eventos culturais.

OBTENÇÃO DE LICENÇAS:
A realização de atividades culturais pode exigir obtenção de licenças junto aos órgãos competentes, incluindo alvarás de funcionamento, autorizações de uso de espaço público e licenças ambientais quando aplicável.

DIREITOS DE IMAGEM:
É necessário obter autorização expressa para uso de imagem de participantes, artistas e público em materiais de divulgação, observando os limites estabelecidos na legislação de proteção de dados pessoais.

CONTRATAÇÃO DE ARTISTAS:
A contratação de artistas deve ser formalizada mediante contrato adequado, estabelecendo condições de prestação de serviços, valores, direitos autorais e responsabilidades das partes.

CUMPRIMENTO DE NORMAS SANITÁRIAS:
Devem ser observadas as normas sanitárias vigentes, incluindo capacidade máxima de público, medidas de segurança e cumprimento de protocolos de saúde pública.

CONCLUSÃO:
A observância dos aspectos legais é essencial para garantir a legalidade e segurança jurídica na realização de atividades culturais.`,
    categories: ['Informativo Jurídico', 'Cultura'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-018-2026',
    date: '12-03-2026',
    vigencia: '12-03-2026',
    title: 'Decisão - Aprovação de Projeto de Reforma de Instalações',
    summary: 'Decisão sobre a aprovação de projeto de reforma e modernização de instalações físicas, análise de orçamentos, cronograma de execução e definição de prioridades de intervenção.',
    summarySimplified: 'Esta decisão aprova um projeto para reformar e modernizar os prédios. Foram analisados os orçamentos, definido o cronograma de obras e estabelecidas as prioridades do que será feito primeiro.',
    content: `DECISÃO ADMINISTRATIVA Nº 018/2026

APROVAÇÃO DE PROJETO DE REFORMA DE INSTALAÇÕES

Considerando a necessidade de modernização e adequação das instalações físicas da instituição, decide-se pela aprovação de projeto de reforma e modernização de instalações.

ANÁLISE DE ORÇAMENTOS:
Foram analisados orçamentos apresentados por 3 (três) empresas de construção, sendo avaliados critérios de preço, qualidade dos materiais, experiência e prazo de execução das obras.

CRONOGRAMA DE EXECUÇÃO:
Foi estabelecido cronograma de execução das obras, definindo-se etapas de intervenção, prazos e responsabilidades, garantindo o mínimo impacto nas atividades institucionais.

DEFINIÇÃO DE PRIORIDADES:
Foram definidas as prioridades de intervenção, iniciando pelas áreas de maior necessidade e impacto nas atividades institucionais, seguindo cronograma estabelecido.

CONCLUSÃO:
O projeto de reforma aprovado contribuirá para a modernização das instalações físicas e melhoria das condições de trabalho e atendimento aos usuários dos serviços oferecidos.`,
    categories: ['Decisão', 'Infraestrutura'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-008-2026',
    date: '15-03-2026',
    vigencia: '15-03-2026',
    title: 'Minuta - Reunião de Qualidade - Certificações e Padrões',
    summary: 'Registro das discussões sobre processos de certificação de qualidade, adequação a padrões internacionais, auditorias internas e externas e melhoria contínua dos processos.',
    summarySimplified: 'Esta minuta registra a reunião sobre qualidade. Foram discutidos processos para obter certificações de qualidade, seguir padrões internacionais e melhorar continuamente os processos da empresa.',
    content: `MINUTA DE REUNIÃO DO DEPARTAMENTO DE QUALIDADE

Data: 15 de março de 2026
Participantes: Equipe de Qualidade e Gestão

DELIBERAÇÕES:

1. PROCESSOS DE CERTIFICAÇÃO DE QUALIDADE
   Foi discutida a necessidade de obtenção de certificações de qualidade, visando reconhecimento externo e melhoria dos processos organizacionais.

2. ADEQUAÇÃO A PADRÕES INTERNACIONAIS
   Foram definidas estratégias para adequação a padrões internacionais de qualidade, incluindo ISO 9001 e outras certificações relevantes para o setor de atuação.

3. AUDITORIAS INTERNAS E EXTERNAS
   Foi estabelecido cronograma de auditorias internas e externas, visando verificação do cumprimento dos padrões de qualidade e identificação de oportunidades de melhoria.

CONCLUSÃO:
Os processos de certificação de qualidade foram definidos e serão implementados conforme cronograma estabelecido, garantindo a melhoria contínua dos processos organizacionais.`,
    categories: ['Minuta', 'Qualidade'],
    highlightText: 'Minuta - Reunião de Qualidade'
  },
  {
    id: 'INF-052-2026',
    date: '18-03-2026',
    vigencia: '18-03-2026',
    title: 'Informativo Jurídico - Relações Trabalhistas e Negociação Coletiva',
    summary: 'Orientação jurídica sobre relações trabalhistas, negociação coletiva, acordos e convenções coletivas de trabalho, direitos dos trabalhadores e obrigações patronais.',
    summarySimplified: 'Este informativo explica as regras sobre relações de trabalho. Fala sobre negociação coletiva (quando trabalhadores e empresa negociam juntos), acordos coletivos e os direitos e deveres de cada parte.',
    content: `INFORMATIVO JURÍDICO Nº 052/2026

RELAÇÕES TRABALHISTAS E NEGOCIAÇÃO COLETIVA

Considerando o disposto na Consolidação das Leis do Trabalho (CLT) e a importância da negociação coletiva nas relações trabalhistas, este informativo estabelece as diretrizes jurídicas sobre o tema.

NEGOCIAÇÃO COLETIVA:
A negociação coletiva é instrumento essencial para estabelecimento de condições de trabalho, devendo ser realizada de forma transparente e respeitando os direitos fundamentais dos trabalhadores.

ACORDOS E CONVENÇÕES COLETIVAS:
Os acordos e convenções coletivas de trabalho estabelecem condições de trabalho específicas para determinada categoria ou empresa, complementando ou suplementando a legislação trabalhista vigente.

DIREITOS DOS TRABALHADORES:
Os trabalhadores têm direito à participação em negociações coletivas, sendo garantida a representação sindical e a proteção contra práticas antissindicais.

OBRIGAÇÕES PATRONAIS:
A instituição deve cumprir rigorosamente as obrigações estabelecidas em acordos e convenções coletivas, garantindo os direitos dos trabalhadores e evitando responsabilização trabalhista.

CONCLUSÃO:
A observância das normas de negociação coletiva e o cumprimento dos acordos e convenções coletivas são essenciais para garantir relações trabalhistas harmoniosas e segurança jurídica.`,
    categories: ['Informativo Jurídico', 'Trabalhista'],
    highlightText: 'Informativo Jurídico'
  },
  {
    id: 'DEC-019-2026',
    date: '20-03-2026',
    vigencia: '20-03-2026',
    title: 'Decisão - Aprovação de Política de Home Office',
    summary: 'Decisão sobre a aprovação de política institucional de trabalho remoto (home office), definição de critérios, regras de adesão, equipamentos necessários e avaliação de desempenho.',
    summarySimplified: 'Esta decisão aprova uma política para trabalhar de casa. Foram definidos os critérios para aderir, as regras que devem ser seguidas, quais equipamentos são necessários e como será avaliado o desempenho.',
    content: `DECISÃO ADMINISTRATIVA Nº 019/2026

APROVAÇÃO DE POLÍTICA INSTITUCIONAL DE HOME OFFICE

Considerando a necessidade de adequação às novas modalidades de trabalho e a importância da flexibilização das condições de trabalho, decide-se pela aprovação de política institucional de trabalho remoto (home office).

DEFINIÇÃO DE CRITÉRIOS:
Foram definidos critérios para adesão ao regime de home office, incluindo natureza das funções, adequação do ambiente de trabalho e avaliação de desempenho do colaborador.

REGRAS DE ADESÃO:
Foi estabelecido processo de adesão ao home office, incluindo solicitação do colaborador, avaliação da viabilidade e formalização mediante acordo individual de trabalho.

EQUIPAMENTOS NECESSÁRIOS:
Foi definido que a instituição fornecerá os equipamentos necessários para realização do trabalho remoto, incluindo computador, acesso à internet e ferramentas de comunicação.

AVALIAÇÃO DE DESEMPENHO:
Foi estabelecido sistema de avaliação de desempenho específico para trabalho remoto, garantindo acompanhamento adequado das atividades desenvolvidas.

CONCLUSÃO:
A política de home office aprovada contribuirá para a flexibilização das condições de trabalho e melhoria da qualidade de vida dos colaboradores, mantendo a produtividade e eficiência organizacional.`,
    categories: ['Decisão', 'Recursos Humanos'],
    highlightText: 'Decisão'
  },
  {
    id: 'MIN-009-2026',
    date: '22-03-2026',
    vigencia: '22-03-2026',
    title: 'Minuta - Reunião de Finanças - Análise de Desempenho Financeiro',
    summary: 'Registro das discussões sobre análise de desempenho financeiro do primeiro trimestre, revisão de orçamentos, projeções para o próximo período e estratégias de otimização de custos.',
    summarySimplified: 'Esta minuta registra a reunião de finanças sobre o desempenho financeiro. Foram analisados os resultados do primeiro trimestre, revisados os orçamentos e discutidas formas de reduzir custos.',
    content: `MINUTA DE REUNIÃO DO DEPARTAMENTO DE FINANÇAS

Data: 22 de março de 2026
Participantes: Equipe de Finanças e Diretoria

DELIBERAÇÕES:

1. ANÁLISE DE DESEMPENHO FINANCEIRO
   Foi apresentada análise de desempenho financeiro do primeiro trimestre, verificando-se o cumprimento das metas estabelecidas e identificando-se oportunidades de melhoria.

2. REVISÃO DE ORÇAMENTOS
   Foram revisados os orçamentos aprovados, verificando-se a necessidade de ajustes e realocação de recursos para garantir o cumprimento dos objetivos institucionais.

3. PROJEÇÕES PARA O PRÓXIMO PERÍODO
   Foram apresentadas projeções financeiras para o próximo período, considerando cenários otimistas e conservadores, visando planejamento adequado das atividades.

CONCLUSÃO:
A análise de desempenho financeiro foi concluída e as estratégias de otimização de custos serão implementadas conforme planejamento estabelecido.`,
    categories: ['Minuta', 'Finanças'],
    highlightText: 'Minuta - Reunião de Finanças'
  },
  {
    id: 'INF-053-2026',
    date: '25-03-2026',
    vigencia: '25-03-2026',
    title: 'Informativo Jurídico - Proteção de Dados em Sistemas de Gestão',
    summary: 'Orientação sobre proteção de dados pessoais em sistemas de gestão empresarial, medidas de segurança necessárias, auditoria de acessos e conformidade com a LGPD.',
    summarySimplified: 'Este informativo explica como proteger dados pessoais nos sistemas de gestão da empresa. Fala sobre medidas de segurança necessárias, como controlar quem acessa os dados e seguir a lei de proteção de dados.',
    content: `INFORMATIVO JURÍDICO Nº 053/2026

PROTEÇÃO DE DADOS EM SISTEMAS DE GESTÃO

Considerando o disposto na Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e a necessidade de proteção de dados pessoais em sistemas de gestão empresarial, este informativo estabelece as diretrizes jurídicas sobre o tema.

MEDIDAS DE SEGURANÇA NECESSÁRIAS:
Os sistemas de gestão empresarial devem implementar medidas técnicas e administrativas adequadas para proteção de dados pessoais, incluindo criptografia, controle de acesso e backup seguro de dados.

AUDITORIA DE ACESSOS:
É essencial implementar sistema de auditoria de acessos aos dados pessoais, registrando quem acessou, quando e quais dados foram consultados, garantindo rastreabilidade e conformidade com a LGPD.

CONFORMIDADE COM A LGPD:
Os sistemas de gestão devem estar em conformidade com a LGPD, observando os princípios de finalidade, adequação, necessidade e transparência no tratamento de dados pessoais.

CONCLUSÃO:
A implementação de medidas adequadas de proteção de dados em sistemas de gestão é essencial para garantir a conformidade com a LGPD e evitar responsabilização por violação de dados pessoais.`,
    categories: ['Informativo Jurídico', 'LGPD'],
    highlightText: 'Informativo Jurídico'
  }
];

export const totalDocuments = 3000;
export const showingDocuments = 10;
