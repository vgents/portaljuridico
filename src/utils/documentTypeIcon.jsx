/**
 * Ícones por tipo de documento para exibição em cards e listas.
 * Permite diferenciar visualmente Informativo Jurídico, Orçamento, Minuta, etc.
 */
import {
  FileTextOutlined,
  DollarOutlined,
  EditOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  ShoppingOutlined,
  TeamOutlined
} from '@ant-design/icons';

const TIPO_PARA_ICONE = {
  'Informativo Jurídico': FileTextOutlined,
  'Orçamento': DollarOutlined,
  'Minuta': EditOutlined,
  'Decisão': CheckCircleOutlined,
  'Contratos': FileDoneOutlined,
  'Licitações': ShoppingOutlined,
  'Parcerias': TeamOutlined
};

/**
 * Retorna o componente de ícone do Ant Design para o tipo do documento.
 * @param {Object} doc - Documento com propriedade tipo ou categories[0]
 * @returns {React.Component} Componente de ícone (ex.: FileTextOutlined)
 */
export function getDocumentTypeIcon(doc) {
  if (!doc) return FileTextOutlined;
  const tipo = (doc.tipo || doc.categories?.[0] || '').trim();
  if (!tipo) return FileTextOutlined;
  return TIPO_PARA_ICONE[tipo] || FileTextOutlined;
}

export default getDocumentTypeIcon;
