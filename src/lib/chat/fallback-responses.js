import {
  company,
  workingHours,
  services,
  productCategories,
  faq,
  about,
  recruitment,
  quoteRequest,
  sitePages,
  certifications,
  partners,
} from '@/data/aqualab-knowledge'
import { detectLanguage } from './detect-language'

const OFF_TOPIC_KEYWORDS = [
  'bitcoin', 'crypto', 'president', 'weather', 'football', 'recipe', 'python code',
  'javascript', 'chatgpt', 'openai', 'google', 'apple', 'microsoft', 'movie',
  'météo', 'politique', 'religion', 'blague', 'joke',
]

const STOP_WORDS = new Set([
  'quels', 'quel', 'quelle', 'comment', 'where', 'what', 'comment', 'vos', 'nos',
  'les', 'des', 'une', 'the', 'and', 'pour', 'avec', 'dans', 'sur', 'chez',
  'sont', 'est', 'être', 'propos', 'about', 'your', 'vous', 'nous',
])

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function significantWords(text) {
  return normalizeText(text)
    .split(' ')
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
}

function isOffTopic(text) {
  const lower = text.toLowerCase()
  if (OFF_TOPIC_KEYWORDS.some((k) => lower.includes(k))) return true
  if (/^\d+\s*[+\-*/x×]\s*\d+\s*=?\s*\??$/.test(lower.trim())) return true
  if (/^[0-9+\-*/=.?\s]+$/.test(lower.trim()) && /[+\-*/]/.test(lower)) return true
  return false
}

function isGreeting(text) {
  return /^(bonjour|salut|hello|hi|coucou|bonsoir|hey|مرحبا|السلام)/i.test(text.trim())
}

/** Match FAQ only when the question is clearly similar (not a single shared word). */
function matchFaq(text) {
  const normalized = normalizeText(text)
  let best = null
  let bestScore = 0

  for (const item of faq) {
    const qWords = significantWords(item.q)
    if (qWords.length === 0) continue

    const matches = qWords.filter((w) => normalized.includes(w)).length
    const score = matches / qWords.length

    if (matches >= 2 && score >= 0.5 && score > bestScore) {
      best = item
      bestScore = score
    }
  }

  return best
}

function buildProductsAnswer(lang) {
  const list = productCategories.map((p) => `- **${p.title}** (${p.group})`).join('\n')
  if (lang === 'ar') {
    return `نقدم مجموعة واسعة من المعدات:\n\n${list}\n\n📍 تصفح الكatalog: ${sitePages.products}`
  }
  if (lang === 'en') {
    return `We offer a wide range of equipment:\n\n${list}\n\n📍 Browse our catalog: ${sitePages.products}`
  }
  return `Nous proposons une gamme complète d'équipements :\n\n${list}\n\n📍 Consultez le catalogue : ${sitePages.products}`
}

function buildServicesAnswer(lang) {
  const list = services.map((s) => `- **${s.title}** — ${s.desc}`).join('\n')
  if (lang === 'ar') return `خدماتنا:\n\n${list}\n\n📍 ${sitePages.services}`
  if (lang === 'en') return `Our services:\n\n${list}\n\n📍 ${sitePages.services}`
  return `Nos services :\n\n${list}\n\n📍 En savoir plus : ${sitePages.services}`
}

function buildAboutAnswer(lang) {
  if (lang === 'ar') {
    return `**${company.name}** — ${about.description}\n\n- **الرسالة:** ${about.mission}\n- **الرؤية:** ${about.vision}\n- **القيم:** ${about.values}\n\n📍 ${sitePages.about}`
  }
  if (lang === 'en') {
    return `**${company.name}** — ${about.description}\n\n- **Mission:** ${about.mission}\n- **Vision:** ${about.vision}\n- **Values:** ${about.values}\n\n📍 ${sitePages.about}`
  }
  return `**${company.name}** — ${about.description}\n\n- **Mission :** ${about.mission}\n- **Vision :** ${about.vision}\n- **Valeurs :** ${about.values}\n\n📍 ${sitePages.about}`
}

function buildHoursAnswer(lang) {
  if (lang === 'ar') {
    return `**ساعات العمل — Aqualab Technologie**\n\n🕐 ${workingHours.weekdays}\n🕐 ${workingHours.saturday}\n🚫 ${workingHours.sunday}\n\n${workingHours.note}\n\n📍 ${sitePages.contact}`
  }
  if (lang === 'en') {
    return `**Opening hours — Aqualab Technologie**\n\n🕐 ${workingHours.weekdays}\n🕐 ${workingHours.saturday}\n🚫 ${workingHours.sunday}\n\n${workingHours.note}\n\n📍 ${sitePages.contact}`
  }
  return `**Horaires d'ouverture — Aqualab Technologie**\n\n🕐 ${workingHours.weekdays}\n🕐 ${workingHours.saturday}\n🚫 ${workingHours.sunday}\n\n${workingHours.note}\n\n📍 ${sitePages.contact}`
}

function buildContactAnswer(lang) {
  if (lang === 'ar') {
    return `**الاتصال بـ Aqualab**\n\n📍 ${company.location}\n📞 ${company.phone}\n✉️ ${company.email}\n\n**ساعات العمل:**\n- ${workingHours.weekdays}\n- ${workingHours.saturday}\n- ${workingHours.sunday}\n\n📍 ${sitePages.contact}`
  }
  if (lang === 'en') {
    return `**Contact Aqualab**\n\n📍 ${company.location}\n📞 ${company.phone}\n✉️ ${company.email}\n\n**Hours:**\n- ${workingHours.weekdays}\n- ${workingHours.saturday}\n- ${workingHours.sunday}\n\n📍 ${sitePages.contact}`
  }
  return `**Contact Aqualab**\n\n📍 ${company.location}\n📞 ${company.phone}\n✉️ ${company.email}\n\n**Horaires :**\n- ${workingHours.weekdays}\n- ${workingHours.saturday}\n- ${workingHours.sunday}\n\n📍 ${sitePages.contact}`
}

function buildQuoteAnswer(lang) {
  const methods = quoteRequest.methods.map((m) => `- ${m}`).join('\n')
  if (lang === 'ar') return `**طلب عرض سعر:**\n\n${methods}\n\n${quoteRequest.info}`
  if (lang === 'en') return `**Request a quote:**\n\n${methods}\n\n${quoteRequest.info}`
  return `**Demander un devis :**\n\n${methods}\n\n${quoteRequest.info}`
}

function buildRecruitmentAnswer(lang) {
  if (lang === 'ar') {
    return `**التوظيف**\n\n${recruitment.description}\n\n- **المجالات:** ${recruitment.domains}\n- **العملية:** ${recruitment.process}\n\n📍 ${recruitment.page}`
  }
  if (lang === 'en') {
    return `**Careers**\n\n${recruitment.description}\n\n- **Areas:** ${recruitment.domains}\n- **Process:** ${recruitment.process}\n\n📍 ${recruitment.page}`
  }
  return `**Recrutement**\n\n${recruitment.description}\n\n- **Domaines :** ${recruitment.domains}\n- **Processus :** ${recruitment.process}\n\n📍 ${recruitment.page}`
}

function buildCertificationsAnswer(lang) {
  const list = certifications.map((c) => `- ${c}`).join('\n')
  if (lang === 'ar') return `**الشهادات والاعتمادات:**\n\n${list}`
  if (lang === 'en') return `**Certifications & accreditations:**\n\n${list}`
  return `**Certifications & accréditations :**\n\n${list}`
}

function findPartnerInText(text) {
  const normalized = normalizeText(text)
  return partners.find((p) => {
    const nameParts = normalizeText(p.name).split(' ').filter((w) => w.length > 3)
    return nameParts.some((part) => normalized.includes(part))
      || normalized.includes(normalizeText(p.name))
  })
}

function buildPartnersAnswer(lang, specificPartner = null) {
  if (specificPartner) {
    const relatedProducts = productCategories
      .filter((p) => p.partner && normalizeText(p.partner).includes(normalizeText(specificPartner.name.split(' ')[0])))
      .map((p) => `- **${p.title}** (${p.group})`)
      .join('\n')

    if (lang === 'ar') {
      return `**${specificPartner.name}**\n\n- **التخصص:** ${specificPartner.specialty}\n- **الموقع:** ${specificPartner.url}\n${specificPartner.exclusive ? '- **الموزع الحصري في المغرب**\n' : ''}${relatedProducts ? `\n**المنتجات المرتبطة:**\n${relatedProducts}\n` : ''}\n📍 ${sitePages.products}`
    }
    if (lang === 'en') {
      return `**${specificPartner.name}**\n\n- **Specialty:** ${specificPartner.specialty}\n- **Website:** ${specificPartner.url}\n${specificPartner.exclusive ? '- **Exclusive distributor in Morocco**\n' : ''}${relatedProducts ? `\n**Related products:**\n${relatedProducts}\n` : ''}\n📍 ${sitePages.products}`
    }
    return `**${specificPartner.name}**\n\n- **Spécialité :** ${specificPartner.specialty}\n- **Site web :** ${specificPartner.url}\n${specificPartner.exclusive ? '- **Distributeur exclusif au Maroc**\n' : ''}${relatedProducts ? `\n**Produits associés :**\n${relatedProducts}\n` : ''}\n📍 ${sitePages.products}`
  }

  const list = partners.map((p) => {
    const badge = p.exclusive ? ' ⭐ exclusif Maroc' : ''
    return `- **${p.name}** — ${p.specialty}${badge}`
  }).join('\n')

  if (lang === 'ar') {
    return `**شركاء Aqualab Technologie:**\n\n${list}\n\nنوزع ماركات عالمية رائدة في المختبرات والصناعة.\n\n📍 ${sitePages.products}`
  }
  if (lang === 'en') {
    return `**Aqualab Technologie partners:**\n\n${list}\n\nWe distribute leading international brands for laboratories and industry.\n\n📍 ${sitePages.products}`
  }
  return `**Partenaires d'Aqualab Technologie :**\n\n${list}\n\nNous distribuons des marques internationales de référence pour le laboratoire et l'industrie.\n\n📍 ${sitePages.products}`
}

function buildOffTopicAnswer(lang) {
  if (lang === 'ar') {
    return 'أنا مساعد Aqualab وأجيب فقط على الأسئلة المتعلقة بـ Aqualab Technologie (منتجات، خدمات، اتصال، توظيف). كيف يمكنني مساعدتك؟'
  }
  if (lang === 'en') {
    return 'I am the Aqualab assistant and only answer questions about Aqualab Technologie (products, services, contact, careers). How can I help you?'
  }
  return 'Je suis l\'assistant Aqualab et je réponds uniquement aux questions sur Aqualab Technologie (produits, services, contact, recrutement). Je ne peux pas répondre aux calculs ou sujets hors sujet. Comment puis-je vous aider ?'
}

function buildWelcomeAnswer(lang) {
  if (lang === 'ar') {
    return `مرحباً! أنا مساعد **${company.name}**. يمكنني مساعدتك في:\n- الخدمات والمنتجات\n- معلومات الاتصال والساعات\n- التوظيف وطلبات عروض الأسعار\n\nكيف يمكنني مساعدتك؟`
  }
  if (lang === 'en') {
    return `Hello! I'm the **${company.name}** assistant. I can help with:\n- Services & products\n- Contact & hours\n- Careers & quotes\n\nHow can I help you?`
  }
  return `Bonjour ! Je suis l'assistant **${company.name}**. Je peux vous renseigner sur :\n- Nos services et produits\n- Nos partenaires et marques\n- Contact et horaires\n- Recrutement et devis\n\nComment puis-je vous aider ?`
}

/** Réponse rule-based quand Gemini n'est pas disponible */
export function generateFallbackResponse(userMessage) {
  const lang = detectLanguage(userMessage)
  const text = normalizeText(userMessage)

  if (isOffTopic(userMessage)) return buildOffTopicAnswer(lang)
  if (isGreeting(userMessage)) return buildWelcomeAnswer(lang)

  // Intents spécifiques AVANT le matching FAQ (évite les faux positifs)
  if (/horaire|heure|ouvert|ferme|ferme|open|close|schedule|ساع/.test(text)) {
    return buildHoursAnswer(lang)
  }
  if (/^a propos|about aqualab|about us|qui est|qui sommes|historique|histoire|mission|vision|من نحن/.test(text) || /\bpropos\b.*aqualab/.test(text)) {
    return buildAboutAnswer(lang)
  }
  const partnerMatch = findPartnerInText(userMessage)
  if (partnerMatch) {
    return buildPartnersAnswer(lang, partnerMatch)
  }
  if (/partenaire|partner|marque|brand|distributeur|distribu|fournisseur|leica|metkon|tinius|climats|vogel|desco|vaisala|fetefilter|baltimore|bac|شرك/.test(text)) {
    return buildPartnersAnswer(lang)
  }
  if (/recrut|carri|emploi|job|candid|postuler|postule|cv|travaill|توظيف|وظ/.test(text)) {
    return buildRecruitmentAnswer(lang)
  }
  if (/devis|quote|prix|tarif|عرض/.test(text)) {
    return buildQuoteAnswer(lang)
  }
  if (/contact|adresse|address|telephone|phone|email|localisation|location|laboratoire|lab|موقع|عنوان|appeler|joindre/.test(text)) {
    return buildContactAnswer(lang)
  }
  if (/produit|product|catalog|categor|voir les|equipment|equipement|منتج|microscope|microscop|metrolog|essai|filtration/.test(text)) {
    return buildProductsAnswer(lang)
  }
  if (/service|maintenance|sav|formation|installation|assistance|stock|خدم/.test(text)) {
    return buildServicesAnswer(lang)
  }
  if (/certif|accredit|iso|norme/.test(text)) {
    return buildCertificationsAnswer(lang)
  }
  if (/actualit|news|article|blog/.test(text)) {
    if (lang === 'ar') return `اطلع على آخر أخبارنا: ${sitePages.news}`
    if (lang === 'en') return `Browse our latest news: ${sitePages.news}`
    return `Consultez nos actualités et articles d'expertise : ${sitePages.news}`
  }
  if (/analys|laboratoire|essai|test|eau|qualite/.test(text)) {
    if (lang === 'ar') return `نوفر معدات للتحاليل المخبرية: مياه، ميكروبيولوجيا، اختبارات ميكانيكية، محاكاة مناخية والمزيد. ${sitePages.products}`
    if (lang === 'en') return `We supply equipment for laboratory analyses: water quality, metallography, mechanical testing, climatic simulation and more. ${sitePages.products}`
    return `Nous distribuons des équipements pour analyses de laboratoire : qualité de l'eau, métallographie, essais mécaniques, simulation climatique, etc. ${sitePages.products}`
  }

  const faqMatch = matchFaq(userMessage)
  if (faqMatch) return faqMatch.a

  return buildWelcomeAnswer(lang)
}

/** Simule le streaming en découpant la réponse */
export async function* streamFallbackResponse(userMessage) {
  const full = generateFallbackResponse(userMessage)
  const words = full.split(/(\s+)/)
  let buffer = ''

  for (const part of words) {
    buffer += part
    if (buffer.length >= 8 || part.includes('\n')) {
      yield buffer
      buffer = ''
      await new Promise((r) => setTimeout(r, 18))
    }
  }
  if (buffer) yield buffer
}
