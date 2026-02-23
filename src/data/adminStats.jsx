// Dados mockados para o dashboard administrativo

// Estatísticas gerais
export const adminStats = {
  totalAcessos: 12450,
  totalGrupos: 8,
  totalDocumentos: 25,
  totalTags: 15,
  totalCategorias: 12,
  totalAssuntos: 15,
  totalUsuarios: 87
};

// Dados de acesso por período (para gráfico)
export const accessData = {
  semana: [
    { date: '06/02', acessos: 320 },
    { date: '07/02', acessos: 450 },
    { date: '08/02', acessos: 380 },
    { date: '09/02', acessos: 520 },
    { date: '10/02', acessos: 490 },
    { date: '11/02', acessos: 610 },
    { date: '12/02', acessos: 580 }
  ],
  mes: [
    { date: 'Sem 1', acessos: 2100 },
    { date: 'Sem 2', acessos: 2450 },
    { date: 'Sem 3', acessos: 2800 },
    { date: 'Sem 4', acessos: 3100 }
  ],
  semestre: [
    { date: 'Jan', acessos: 18500 },
    { date: 'Fev', acessos: 22100 },
    { date: 'Mar', acessos: 19800 },
    { date: 'Abr', acessos: 0 },
    { date: 'Mai', acessos: 0 },
    { date: 'Jun', acessos: 0 }
  ],
  ano: [
    { date: '2024', acessos: 45200 },
    { date: '2025', acessos: 52100 },
    { date: '2026', acessos: 12450 }
  ]
};

// Lista de grupos mockados
export const gruposMock = [
  { id: 1, nome: 'Gerência Jurídica', usuarios: 12, documentos: 15 },
  { id: 2, nome: 'Diretoria', usuarios: 8, documentos: 5 },
  { id: 3, nome: 'Recursos Humanos', usuarios: 15, documentos: 8 },
  { id: 4, nome: 'Compras', usuarios: 6, documentos: 4 },
  { id: 5, nome: 'TI', usuarios: 10, documentos: 3 },
  { id: 6, nome: 'Financeiro', usuarios: 9, documentos: 7 },
  { id: 7, nome: 'Marketing', usuarios: 7, documentos: 2 },
  { id: 8, nome: 'Operacional', usuarios: 20, documentos: 6 }
];

// Lista de categorias mockadas
export const categoriasMock = [
  'Minuta',
  'Informativo Jurídico',
  'Decisão',
  'Diretoria',
  'Trabalhista',
  'Contratos',
  'Compras',
  'LGPD',
  'Imóveis',
  'Recursos Humanos',
  'Licitações',
  'Parcerias'
];

// Lista de tags mockadas
export const tagsMock = [
  'Orçamento',
  'Trabalho Remoto',
  'Contratos',
  'TI',
  'LGPD',
  'Aluguel',
  'RH',
  'Licitações',
  'Parcerias',
  'Segurança',
  'Marketing',
  'Sustentabilidade',
  'Consultoria',
  'Cultura',
  'Infraestrutura'
];
