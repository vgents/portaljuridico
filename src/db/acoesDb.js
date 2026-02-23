/**
 * Persistência local de histórico de ações dos colaboradores com IndexedDB (Dexie).
 */

import Dexie from 'dexie';

export const acoesDb = new Dexie('PortalJuridicoAcoesDB');

acoesDb.version(1).stores({
  acoes: '++id, userId, tipo, timestamp, recursoId'
});

/**
 * Tipos de ações possíveis
 */
export const TIPOS_ACAO = {
  CRIAR_DOCUMENTO: 'criar_documento',
  EDITAR_DOCUMENTO: 'editar_documento',
  PUBLICAR_DOCUMENTO: 'publicar_documento',
  REVOGAR_DOCUMENTO: 'revogar_documento',
  CRIAR_GRUPO: 'criar_grupo',
  EDITAR_GRUPO: 'editar_grupo',
  CRIAR_ASSUNTO: 'criar_assunto',
  EDITAR_ASSUNTO: 'editar_assunto',
  CRIAR_CATEGORIA: 'criar_categoria',
  EDITAR_CATEGORIA: 'editar_categoria',
  ADICIONAR_COLABORADOR: 'adicionar_colaborador',
  REMOVER_COLABORADOR: 'remover_colaborador'
};

/**
 * Registra uma ação no histórico
 * @param {Object} acao - { userId, nomeUsuario, tipo, descricao, recursoId?, recursoNome? }
 */
export async function registrarAcao(acao) {
  const registro = {
    userId: acao.userId,
    nomeUsuario: acao.nomeUsuario,
    tipo: acao.tipo,
    descricao: acao.descricao,
    recursoId: acao.recursoId || null,
    recursoNome: acao.recursoNome || null,
    timestamp: new Date().toISOString()
  };
  await acoesDb.acoes.add(registro);
}

/**
 * Retorna todas as ações ordenadas por timestamp (mais recentes primeiro)
 * @param {number} limit - Limite de registros (padrão: 50)
 */
export async function getAcoes(limit = 50) {
  return acoesDb.acoes
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Retorna ações de um usuário específico
 * @param {number} userId - ID do usuário
 * @param {number} limit - Limite de registros
 */
export async function getAcoesPorUsuario(userId, limit = 50) {
  return acoesDb.acoes
    .where('userId')
    .equals(userId)
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Retorna ações de um tipo específico
 * @param {string} tipo - Tipo da ação
 * @param {number} limit - Limite de registros
 */
export async function getAcoesPorTipo(tipo, limit = 50) {
  return acoesDb.acoes
    .where('tipo')
    .equals(tipo)
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Cria ações de exemplo se o banco estiver vazio
 */
async function seedAcoesSeVazio() {
  const count = await acoesDb.acoes.count();
  if (count === 0) {
    const agora = new Date();
    const acoesExemplo = [
      {
        userId: 1,
        nomeUsuario: 'Ana Silva',
        tipo: 'publicar_documento',
        descricao: 'Publicou um documento',
        recursoNome: 'Contrato de Prestação de Serviços',
        timestamp: new Date(agora.getTime() - 15 * 60000).toISOString()
      },
      {
        userId: 2,
        nomeUsuario: 'Carlos Mendes',
        tipo: 'criar_grupo',
        descricao: 'Criou um novo grupo',
        recursoNome: 'Grupo Jurídico Executivo',
        timestamp: new Date(agora.getTime() - 45 * 60000).toISOString()
      },
      {
        userId: 1,
        nomeUsuario: 'Ana Silva',
        tipo: 'editar_documento',
        descricao: 'Editou um documento',
        recursoNome: 'Decisão Judicial 2024/001',
        timestamp: new Date(agora.getTime() - 2 * 3600000).toISOString()
      },
      {
        userId: 5,
        nomeUsuario: 'Patrícia Costa',
        tipo: 'criar_assunto',
        descricao: 'Criou um novo assunto',
        recursoNome: 'Licitações Públicas',
        timestamp: new Date(agora.getTime() - 3 * 3600000).toISOString()
      },
      {
        userId: 2,
        nomeUsuario: 'Carlos Mendes',
        tipo: 'revogar_documento',
        descricao: 'Revogou um documento',
        recursoNome: 'Contrato Antigo 2023',
        timestamp: new Date(agora.getTime() - 5 * 3600000).toISOString()
      },
      {
        userId: 8,
        nomeUsuario: 'Ricardo Souza',
        tipo: 'criar_categoria',
        descricao: 'Criou uma nova categoria',
        recursoNome: 'Contratos Temporários',
        timestamp: new Date(agora.getTime() - 6 * 3600000).toISOString()
      },
      {
        userId: 1,
        nomeUsuario: 'Ana Silva',
        tipo: 'adicionar_colaborador',
        descricao: 'Adicionou um colaborador ao grupo',
        recursoNome: 'Grupo Jurídico',
        timestamp: new Date(agora.getTime() - 8 * 3600000).toISOString()
      },
      {
        userId: 2,
        nomeUsuario: 'Carlos Mendes',
        tipo: 'editar_grupo',
        descricao: 'Editou configurações do grupo',
        recursoNome: 'Grupo Administrativo',
        timestamp: new Date(agora.getTime() - 12 * 3600000).toISOString()
      },
      {
        userId: 5,
        nomeUsuario: 'Patrícia Costa',
        tipo: 'criar_documento',
        descricao: 'Criou um novo documento',
        recursoNome: 'Minuta de Contrato',
        timestamp: new Date(agora.getTime() - 24 * 3600000).toISOString()
      },
      {
        userId: 1,
        nomeUsuario: 'Ana Silva',
        tipo: 'editar_assunto',
        descricao: 'Editou um assunto',
        recursoNome: 'Direito Trabalhista',
        timestamp: new Date(agora.getTime() - 2 * 24 * 3600000).toISOString()
      }
    ];
    await acoesDb.acoes.bulkAdd(acoesExemplo);
  }
}

/**
 * Inicializa o banco de ações e cria dados de exemplo se estiver vazio
 */
export async function initAcoesDb() {
  await acoesDb.open();
  await seedAcoesSeVazio();
}
