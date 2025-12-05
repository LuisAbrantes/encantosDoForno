/**
 * Configurações centralizadas da aplicação
 * Facilita manutenção e diferentes ambientes (dev/prod)
 */

// ============================================================
// AMBIENTE
// ============================================================
const isDevelopment = import.meta.env?.DEV ?? true;

// ============================================================
// API
// ============================================================
export const API_CONFIG = Object.freeze({
  BASE_URL: import.meta.env?.VITE_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000,
  RETRIES: isDevelopment ? 0 : 2,
});

// ============================================================
// POLLING
// ============================================================
export const POLLING = Object.freeze({
  QUEUE_CLIENT: 10000, // 10 segundos para cliente
  QUEUE_ADMIN: 5000, // 5 segundos para admin
  TABLES_ADMIN: 10000, // 10 segundos para mesas
  DASHBOARD: 30000, // 30 segundos para dashboard
});

// ============================================================
// VALIDAÇÃO
// ============================================================
export const VALIDATION = Object.freeze({
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    PATTERN: /^\d{10,15}$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  PARTY_SIZE: {
    MIN: 1,
    MAX: 20,
  },
  TABLE_CAPACITY: {
    MIN: 1,
    MAX: 20,
  },
});

// ============================================================
// MENSAGENS
// ============================================================
export const MESSAGES = Object.freeze({
  // Fila
  QUEUE_CLOSED: "A fila está fechada no momento. Volte mais tarde!",
  QUEUE_FULL:
    "A fila está cheia no momento. Tente novamente em alguns minutos.",
  ALREADY_IN_QUEUE: "Este telefone já está na fila.",
  SUCCESS_JOIN: "Você entrou na fila! Fique atento ao seu celular.",
  CONFIRM_LEAVE: "Deseja sair da fila?",

  // Genéricas
  ERROR_GENERIC: "Ocorreu um erro. Tente novamente.",
  ERROR_NETWORK: "Erro de conexão. Verifique sua internet.",
  ERROR_TIMEOUT: "O servidor demorou muito para responder. Tente novamente.",

  // Confirmações
  CONFIRM_DELETE: "Tem certeza que deseja excluir?",
  CONFIRM_NO_SHOW: "Confirma que o cliente não compareceu?",

  // Sucesso
  SUCCESS_SAVE: "Salvo com sucesso!",
  SUCCESS_DELETE: "Removido com sucesso!",
});

// ============================================================
// STATUS CONFIGS
// ============================================================
export const QUEUE_STATUS_CONFIG = Object.freeze({
  waiting: {
    label: "Aguardando",
    color: "bg-gray-100 text-gray-800",
    bgClass: "border-gray-200 bg-white",
    icon: "⏳",
  },
  called: {
    label: "Chamado",
    color: "bg-green-100 text-green-800",
    bgClass: "border-green-500 bg-green-50 shadow-lg",
    icon: "📢",
  },
  seated: {
    label: "Sentado",
    color: "bg-blue-100 text-blue-800",
    bgClass: "border-blue-200 bg-blue-50",
    icon: "✅",
  },
  no_show: {
    label: "Não compareceu",
    color: "bg-red-100 text-red-800",
    bgClass: "border-red-200 bg-red-50",
    icon: "❌",
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-gray-200 text-gray-600",
    bgClass: "border-gray-300 bg-gray-100",
    icon: "🚫",
  },
});

export const TABLE_STATUS_CONFIG = Object.freeze({
  available: {
    label: "Disponível",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-300",
    bgColor: "bg-green-50",
    icon: "✅",
  },
  occupied: {
    label: "Ocupada",
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-300",
    bgColor: "bg-red-50",
    icon: "🍽️",
  },
  reserved: {
    label: "Reservada",
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-300",
    bgColor: "bg-blue-50",
    icon: "📅",
  },
  maintenance: {
    label: "Manutenção",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-300",
    bgColor: "bg-yellow-50",
    icon: "🔧",
  },
});

export const PRIORITY_CONFIG = Object.freeze({
  normal: { label: "Normal", color: "bg-gray-100 text-gray-700" },
  vip: { label: "VIP", color: "bg-purple-100 text-purple-800" },
  reservation: { label: "Reserva", color: "bg-blue-100 text-blue-800" },
});

// ============================================================
// LOCALIZAÇÕES DE MESA
// ============================================================
export const TABLE_LOCATIONS = Object.freeze([
  "Interno",
  "Externo",
  "Varanda",
  "VIP",
  "Mezanino",
]);

// ============================================================
// HELPERS
// ============================================================

/**
 * Formata telefone para exibição
 */
export const formatPhone = (phone) => {
  const cleaned = String(phone).replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};

/**
 * Sanitiza telefone para envio
 */
export const sanitizePhone = (phone) => {
  return String(phone).replace(/\D/g, "");
};

/**
 * Formata tempo em minutos para exibição
 */
export const formatWaitTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Formata data/hora para exibição
 */
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Gera link de WhatsApp
 */
export const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = sanitizePhone(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
};

// ============================================================
// CONFIGURAÇÕES DO RESTAURANTE (LEGADO)
// ============================================================

// Restaurant Configuration Constants
export const RESTAURANT_CONFIG = {
  name: "Encantos do Forno",
  location: "Jacareí/SP",
  phone: "(12) 99261-1931",
  email: "contato@encantosdoforno.com.br",
  whatsapp: "https://wa.me/5512992611931",
  schedule: {
    weekdays: {
      days: "Quarta à Sexta",
      hours: "6h30 às 15h",
    },
    weekend: {
      days: "Sábado e Domingo",
      hours: "7h às 11h e 19h às 22h",
    },
  },
};

// Image Assets
export const IMAGES = {
  hero: "/fogo.jpg",
  placeholder:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
};

// Social Media Links
export const SOCIAL_MEDIA = {
  instagram: "https://www.instagram.com/encantosdofornojcr/",
  facebook: "https://www.facebook.com/people/Encantos-do-Forno/61575225126843/",
  whatsapp: RESTAURANT_CONFIG.whatsapp,
};

// Restaurant Address
export const ADDRESS = {
  street: "Avenida Edmundo de Souza, 225",
  neighborhood: "Jardim América",
  city: "Jacareí",
  state: "SP",
  zipCode: "12322-050",
  mapUrl:
    "https://www.google.com/maps/search/Avenida+Edmundo+de+Souza+225+Jardim+America+Jacarei+SP+12322050",
};

export default {
  API_CONFIG,
  POLLING,
  VALIDATION,
  MESSAGES,
  QUEUE_STATUS_CONFIG,
  TABLE_STATUS_CONFIG,
  PRIORITY_CONFIG,
  TABLE_LOCATIONS,
  RESTAURANT_CONFIG,
  IMAGES,
  SOCIAL_MEDIA,
  ADDRESS,
};
