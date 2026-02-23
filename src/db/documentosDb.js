/**
 * Persistência local de documentos com IndexedDB (Dexie).
 * Indicado para armazenar metadados e arquivos (PDF como Blob).
 */

import Dexie from 'dexie';

export const db = new Dexie('PortalJuridicoDB');

db.version(1).stores({
  documents: 'id'
});

/**
 * Remove todos os documentos mockados do banco de dados.
 * Documentos mockados são identificados por IDs que começam com 'MIN-', 'INF-', 'DEC-', 'CON-', 'LIC-'
 */
async function removerDocumentosMockados() {
  try {
    const todosDocumentos = await db.documents.toArray();
    const idsMockados = todosDocumentos
      .filter((doc) => {
        const id = doc.id || '';
        return id.startsWith('MIN-') || 
               id.startsWith('INF-') || 
               id.startsWith('DEC-') || 
               id.startsWith('CON-') || 
               id.startsWith('LIC-');
      })
      .map((doc) => doc.id);
    
    if (idsMockados.length > 0) {
      await db.documents.bulkDelete(idsMockados);
      console.log(`Removidos ${idsMockados.length} documentos mockados do banco de dados.`);
    }
    
    return idsMockados.length;
  } catch (error) {
    console.error('Erro ao remover documentos mockados:', error);
    return 0;
  }
}

/**
 * Inicializa o banco de dados.
 * Não popula com dados mockados - apenas documentos criados manualmente serão exibidos.
 * Remove documentos mockados existentes se houver.
 */
export async function initDb() {
  await db.open();
  // Remover documentos mockados se existirem
  await removerDocumentosMockados();
}

/**
 * Retorna todos os documentos (metadados + pdfBlob quando existir).
 * Não cria object URLs aqui; a tela de visualização resolve pdfBlob para URL.
 */
export async function getAllDocuments() {
  return db.documents.toArray();
}

/**
 * Salva um novo documento (metadados e opcionalmente o PDF como Blob).
 * @param {Object} doc - documento com id, title, date, summary, etc. e opcionalmente pdfBlob (Blob/File)
 */
export async function addDocument(doc) {
  const toStore = { ...doc };
  if (doc.pdfBlob != null) {
    toStore.pdfBlob = doc.pdfBlob;
    delete toStore.pdfUrl;
  }
  // Garantir que classificacaoSigilo sempre tenha um valor padrão
  if (!toStore.classificacaoSigilo) {
    toStore.classificacaoSigilo = 'interno';
  }
  await db.documents.add(toStore);
}

/**
 * Atualiza um documento existente (ex.: edição ou nova associação de grupos).
 * @param {string} id - id do documento
 * @param {Object} updates - campos a atualizar (ex.: gruposAutorizados, usuariosAutorizados)
 */
export async function updateDocument(id, updates) {
  // Garantir que classificacaoSigilo sempre tenha um valor padrão se estiver sendo atualizado
  if (updates.classificacaoSigilo === undefined || updates.classificacaoSigilo === null) {
    // Não alterar se não foi especificado
  } else if (!updates.classificacaoSigilo) {
    updates.classificacaoSigilo = 'interno';
  }
  await db.documents.update(id, updates);
}
