/**
 * Classificação de sigilo de documentos.
 * - pessoal: acesso concedido pessoalmente pelo Gerente da Área a usuários específicos (usuariosAutorizados)
 * - grupo: acesso permitido a todos os membros de um ou mais grupos (gruposAutorizados)
 * - interno: qualquer pessoa autenticada no sistema pode visualizar
 */

export const CLASSIFICACAO_SIGILO = {
  PESSOAL: 'pessoal',
  GRUPO: 'grupo',
  INTERNO: 'interno'
};

export const LABELS_SIGILO = {
  [CLASSIFICACAO_SIGILO.PESSOAL]: 'Restrito (acesso pessoal)',
  [CLASSIFICACAO_SIGILO.GRUPO]: 'Por grupo',
  [CLASSIFICACAO_SIGILO.INTERNO]: 'Interno (todos no sistema)'
};

/**
 * Retorna os IDs dos grupos dos quais o usuário é membro.
 * @param {number} userId - id do colaborador/usuário
 * @param {Array<{ id: number, membros: number[] }>} grupos - lista de grupos
 * @returns {number[]}
 */
export function gruposDoUsuario(userId, grupos) {
  if (!userId || !grupos || !Array.isArray(grupos)) return [];
  return grupos
    .filter((g) => g.membros && g.membros.includes(userId))
    .map((g) => g.id);
}

/**
 * Verifica se o usuário logado pode visualizar o documento com base na classificação de sigilo.
 * @param {Object} document - documento com classificacaoSigilo, usuariosAutorizados (pessoal), gruposAutorizados (grupo)
 * @param {Object} user - usuário logado { id: number }
 * @param {Array} grupos - lista de grupos (com id e membros)
 * @returns {boolean}
 */
export function podeVisualizarDocumento(document, user, grupos = []) {
  if (!user || user.id == null) return false;

  // Garantir que classificacaoSigilo sempre tenha um valor padrão
  const classificacao = document.classificacaoSigilo || CLASSIFICACAO_SIGILO.INTERNO;

  // Se for interno, qualquer usuário autenticado pode ver
  if (classificacao === CLASSIFICACAO_SIGILO.INTERNO) {
    return true;
  }

  // Se for grupo, verificar se o usuário pertence a algum dos grupos autorizados
  if (classificacao === CLASSIFICACAO_SIGILO.GRUPO) {
    const gruposDoc = document.gruposAutorizados || [];
    if (gruposDoc.length === 0) {
      // Se não há grupos definidos, tratar como interno (fallback)
      return true;
    }
    const gruposUsuario = gruposDoUsuario(user.id, grupos);
    return gruposDoc.some((gid) => gruposUsuario.includes(gid));
  }

  // Se for pessoal, verificar se o usuário está na lista de autorizados
  if (classificacao === CLASSIFICACAO_SIGILO.PESSOAL) {
    const autorizados = document.usuariosAutorizados || [];
    if (autorizados.length === 0) {
      // Se não há usuários autorizados, tratar como interno (fallback)
      return true;
    }
    return autorizados.includes(user.id);
  }

  // Fallback: se a classificação não for reconhecida, tratar como interno
  return true;
}

/**
 * Filtra uma lista de documentos para retornar apenas os que o usuário pode visualizar.
 */
export function filtrarDocumentosPorSigilo(documentos, user, grupos) {
  if (!user || user.id == null) return [];
  
  // Garantir que todos os documentos tenham classificacaoSigilo normalizado antes de filtrar
  const documentosNormalizados = documentos.map((doc) => ({
    ...doc,
    classificacaoSigilo: doc.classificacaoSigilo || 'interno'
  }));
  
  return documentosNormalizados.filter((doc) => podeVisualizarDocumento(doc, user, grupos));
}
