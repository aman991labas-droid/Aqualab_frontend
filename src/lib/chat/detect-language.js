/**
 * Détection simple de la langue (fr / ar / en).
 * Le français est la langue par défaut.
 */

const ENGLISH_PATTERN = /\b(the|what|how|where|when|your|our|is|are|do|can|please|about|services|products|contact|quote|hours|laboratory)\b/i
const FRENCH_PATTERN = /\b(quel|quels|comment|où|vos|notre|proposez|devis|horaires|services|produits|laboratoire|à propos|bonjour|merci)\b/i

export function detectLanguage(text = '') {
  const sample = text.trim()
  if (!sample) return 'fr'

  if (/[\u0600-\u06FF\u0750-\u077F]/.test(sample)) return 'ar'
  if (ENGLISH_PATTERN.test(sample) && !FRENCH_PATTERN.test(sample)) return 'en'
  if (FRENCH_PATTERN.test(sample)) return 'fr'

  return 'fr'
}

export const uiStrings = {
  fr: {
    title: 'Assistant Aqualab',
    subtitle: 'Posez vos questions sur nos services',
    placeholder: 'Écrivez votre message…',
    send: 'Envoyer',
    close: 'Fermer le chat',
    open: 'Ouvrir l\'assistant Aqualab',
    clear: 'Effacer',
    copy: 'Copier',
    copied: 'Copié !',
    regenerate: 'Regénérer',
    suggestions: 'Questions suggérées',
    typing: 'Aqualab répond…',
    loading: 'Chargement…',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    offTopic:
      'Je suis l\'assistant Aqualab et je réponds uniquement aux questions concernant Aqualab Technologie (services, produits, contact, recrutement, etc.). Comment puis-je vous aider ?',
    welcome: 'Bonjour ! Je suis l\'assistant **Aqualab Technologie**. Je peux vous renseigner sur nos services, produits, partenaires, actualités, contact et recrutement.',
  },
  ar: {
    title: 'مساعد Aqualab',
    subtitle: 'اطرح أسئلتك حول خدماتنا',
    placeholder: 'اكتب رسالتك…',
    send: 'إرسال',
    close: 'إغلاق المحادثة',
    open: 'فتح مساعد Aqualab',
    clear: 'مسح',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    regenerate: 'إعادة التوليد',
    suggestions: 'أسئلة مقترحة',
    typing: 'Aqualab يجيب…',
    loading: 'جاري التحميل…',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    offTopic:
      'أنا مساعد Aqualab وأجيب فقط على الأسئلة المتعلقة بـ Aqualab Technologie (الخدمات، المنتجات، الاتصال، التوظيف، إلخ). كيف يمكنني مساعدتك؟',
    welcome: 'مرحباً! أنا مساعد **Aqualab Technologie**. يمكنني مساعدتك بخصوص خدماتنا ومنتجاتنا وأخبارنا والتواصل والتوظيف.',
  },
  en: {
    title: 'Aqualab Assistant',
    subtitle: 'Ask about our services',
    placeholder: 'Type your message…',
    send: 'Send',
    close: 'Close chat',
    open: 'Open Aqualab assistant',
    clear: 'Clear',
    copy: 'Copy',
    copied: 'Copied!',
    regenerate: 'Regenerate',
    suggestions: 'Suggested questions',
    typing: 'Aqualab is typing…',
    loading: 'Loading…',
    error: 'An error occurred. Please try again.',
    offTopic:
      'I am the Aqualab assistant and I only answer questions about Aqualab Technologie (services, products, contact, careers, etc.). How can I help you?',
    welcome: 'Hello! I\'m the **Aqualab Technologie** assistant. I can help with our services, products, news, contact and careers.',
  },
}

export function getUiStrings(lang) {
  return uiStrings[lang] ?? uiStrings.fr
}
