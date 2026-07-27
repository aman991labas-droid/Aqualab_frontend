/**
 * Base de connaissances Aqualab — utilisée par l'assistant IA.
 */

export const company = {
  name: 'Aqualab Technologie',
  legalName: 'Aqualab Technologie S.A.R.L',
  founded: 2006,
  capital: '2M DH',
  location: '409, Ambassadeur Ben Aicha, Roches Noires, Casablanca – Maroc',
  phone: '05 22 30 96 50',
  phoneIntl: '+212522309650',
  email: 'info@aqualab.ma',
  website: 'https://aqualab.ma',
  linkedin: 'https://www.linkedin.com/company/aqualab-technologie/',
  employees: 32,
  revenue: '62M DH',
  storage: '1200 m²',
  expertise: '18+ ans',
}

export const workingHours = {
  weekdays: 'Lundi – Vendredi : 8h30 – 17h30',
  saturday: 'Samedi : 9h00 – 12h30',
  sunday: 'Dimanche : Fermé',
  note: 'Les interventions SAV peuvent être planifiées sur rendez-vous en dehors de ces horaires.',
}

export const history = [
  { year: 2006, title: 'Fondation', desc: "Création d'Aqualab Technologie S.A.R.L à Casablanca." },
  { year: 2010, title: 'Développement', desc: 'Extension du portefeuille et premiers partenariats exclusifs.' },
  { year: 2015, title: 'Leader national', desc: 'Acteur majeur de la distribution industrielle et scientifique au Maroc.' },
  { year: 2020, title: 'Expansion', desc: 'Capacité de stockage portée à 1200 m².' },
  { year: 2026, title: 'Excellence continue', desc: '32 experts, 62M DH de CA, partenariats exclusifs mondiaux.' },
]

export const about = {
  mission: 'Fournir des solutions industrielles et scientifiques de haute qualité pour accompagner le développement du tissu industriel marocain.',
  vision: "Être le partenaire de référence en équipements scientifiques et industriels au Maroc et en Afrique du Nord à l'horizon 2030.",
  values: 'Excellence, intégrité, réactivité et engagement client.',
  description:
    "Aqualab Technologie est une société marocaine spécialisée dans l'importation, la distribution et l'installation de matériels industriels, scientifiques et de laboratoire depuis 2006.",
}

export const services = [
  {
    title: 'Installation & Mise en service',
    desc: 'Installation complète, calibration, tests et remise de documentation technique.',
  },
  {
    title: 'Maintenance & SAV',
    desc: 'Maintenance préventive et corrective par techniciens certifiés, pièces d\'origine.',
  },
  {
    title: 'Formation produit',
    desc: 'Formations sur site ou en salle, sessions pratiques, attestation délivrée.',
  },
  {
    title: 'Assistance technique',
    desc: 'Hotline, support email/visio, télémaintenance et documentation en ligne.',
  },
  {
    title: 'Disponibilité de stock',
    desc: 'Stock local de consommables, pièces détachées et équipements, livraison nationale.',
  },
]

export const productCategories = [
  { slug: 'inspection-microscopie-leica', title: 'Inspection & Microscopie', group: 'Laboratoire', partner: 'Leica Microsystems' },
  { slug: 'metallographie-metkon', title: 'Métallographie', group: 'Laboratoire', partner: 'Metkon' },
  { slug: 'essais-mecaniques-tinius-olsen', title: 'Essais Mécaniques', group: 'Laboratoire', partner: 'Tinius Olsen' },
  { slug: 'simulation-climatique-climats', title: 'Simulation Climatique', group: 'Laboratoire', partner: 'Climats' },
  { slug: 'metrologie-vogel', title: 'Métrologie', group: 'Laboratoire', partner: 'Vogel Germany' },
  { slug: 'equipements-salle-blanche', title: 'Équipements Salle Blanche', group: 'Industriel' },
  { slug: 'equipements-esd', title: 'Équipements ESD', group: 'Industriel' },
  { slug: 'filtration-air', title: "Filtration d'Air", group: 'Industriel' },
  { slug: 'mesures-industrielles', title: 'Mesures Industrielles', group: 'Industriel' },
  { slug: 'solutions-refroidissement', title: 'Solutions de Refroidissement', group: 'Industriel' },
  { slug: 'traitement-air', title: "Traitement d'Air", group: 'Industriel' },
]

export const productGroups = [
  { id: 'laboratoire', label: 'Laboratoire' },
  { id: 'industriel', label: 'Industriel' },
]

export const partners = [
  { name: 'Leica Microsystems', specialty: 'Microscopie', url: 'https://www.leica-microsystems.com/', exclusive: true },
  { name: 'Tinius Olsen', specialty: 'Essais mécaniques', url: 'https://www.tiniusolsen.com/', exclusive: true },
  { name: 'Metkon', specialty: 'Métallographie', url: 'https://www.metkon.com/', exclusive: true },
  { name: 'Vogel Germany', specialty: 'Métrologie', url: 'https://www.vogel.de/', exclusive: true },
  { name: 'Climats', specialty: 'Simulation climatique', url: 'https://www.climats.com/', exclusive: true },
  { name: 'Desco', specialty: 'Automatisation industrielle', url: 'https://www.desco.com/', exclusive: false },
  { name: 'Fetefilter', specialty: 'Filtration', url: 'https://www.fetefilter.com/', exclusive: false },
  { name: 'Vaisala', specialty: 'Météorologie & instrumentation', url: 'https://www.vaisala.com/', exclusive: false },
  { name: 'Baltimore Aircoil Company (BAC)', specialty: 'Refroidissement industriel', url: 'https://www.baltimoreaircoil.com/', exclusive: false },
]

export const laboratoryAnalyses = [
  'Analyse de la qualité de l\'eau (pH, turbidité, conductivité, DCO, DBO5)',
  'Analyse métallographique et microstructure des matériaux',
  'Essais mécaniques (traction, compression, dureté Rockwell/Vickers/Brinell)',
  'Simulation climatique et essais environnementaux',
  'Contrôle dimensionnel et métrologie industrielle',
  'Analyses en salle blanche et contrôle de contamination',
]

export const certifications = [
  'Distribution de marques certifiées et reconnues internationalement (ISO, ASTM)',
  'Techniciens certifiés pour installation, étalonnage et maintenance',
  'Instruments calibrés avec certificats traçables (ISO 9001)',
  'Conformité aux normes internationales pour essais mécaniques et environnementaux',
  'Partenariats exclusifs avec fabricants agréés (Leica, Metkon, Tinius Olsen, Climats, Vogel, etc.)',
]

export const recruitment = {
  description:
    'Aqualab recrute des ingénieurs, techniciens supérieurs et profils commerciaux. Candidatures spontanées acceptées.',
  domains: 'Technique, Commercial, Administratif',
  process: 'Analyse du CV → Entretien RH → Entretien Technique',
  page: '/recrutement',
}

export const quoteRequest = {
  methods: [
    'Formulaire de contact sur /contact',
    'Email à info@aqualab.ma',
    'Téléphone au 05 22 30 96 50',
  ],
  info: 'Précisez le type d\'équipement, la quantité et votre secteur d\'activité pour un devis personnalisé.',
}

export const faq = [
  {
    q: 'Quels services proposez-vous ?',
    a: 'Installation, maintenance SAV, formation, assistance technique et disponibilité de stock pour vos équipements.',
  },
  {
    q: 'Comment demander un devis ?',
    a: 'Via le formulaire de contact, par email (info@aqualab.ma) ou par téléphone au 05 22 30 96 50.',
  },
  {
    q: 'Où se trouve votre laboratoire ?',
    a: '409, Ambassadeur Ben Aicha, Roches Noires, Casablanca – Maroc.',
  },
  {
    q: 'Quels sont vos horaires ?',
    a: 'Lundi–Vendredi 8h30–17h30, Samedi 9h00–12h30. Dimanche fermé.',
  },
  {
    q: 'Livrez-vous dans tout le Maroc ?',
    a: 'Oui, livraison nationale avec stock permanent à Casablanca.',
  },
  {
    q: 'Proposez-vous de la maintenance ?',
    a: 'Oui, contrats de maintenance préventive et interventions correctives par techniciens certifiés.',
  },
  {
    q: 'Comment postuler chez Aqualab ?',
    a: 'Envoyez CV et lettre de motivation via la page Recrutement (/recrutement).',
  },
  {
    q: 'Qui sont vos partenaires ?',
    a: 'Aqualab distribue des marques leaders : Leica Microsystems (microscopie), Metkon (métallographie), Tinius Olsen (essais mécaniques), Climats (simulation climatique), Vogel Germany (métrologie), Desco, Fetefilter, Vaisala et Baltimore Aircoil Company (BAC).',
  },
]

export const sitePages = {
  home: '/',
  about: '/a-propos',
  services: '/services',
  products: '/produits',
  news: '/actualites',
  contact: '/contact',
  recruitment: '/recrutement',
}

export const SUGGESTED_QUESTIONS = [
  'Quels services proposez-vous ?',
  'Comment demander un devis ?',
  'Où se trouve votre laboratoire ?',
  'Quels sont vos horaires ?',
  'Qui sont vos partenaires ?',
  'Voir les produits',
  'À propos d\'Aqualab',
]

/** Compacte la base de connaissances pour le prompt système */
export function buildKnowledgeContext() {
  const products = productCategories.map((p) => `- ${p.title} (${p.group})${p.partner ? ` — ${p.partner}` : ''}`).join('\n')
  const svc = services.map((s) => `- ${s.title}: ${s.desc}`).join('\n')
  const hist = history.map((h) => `- ${h.year}: ${h.title} — ${h.desc}`).join('\n')
  const faqText = faq.map((f) => `Q: ${f.q}\nR: ${f.a}`).join('\n\n')
  const certs = certifications.map((c) => `- ${c}`).join('\n')
  const analyses = laboratoryAnalyses.map((a) => `- ${a}`).join('\n')
  const partnersText = partners.map((p) => `- **${p.name}** — ${p.specialty}${p.exclusive ? ' (partenaire exclusif au Maroc)' : ''}`).join('\n')

  return `
ENTREPRISE: ${company.name} (${company.legalName})
Fondée en ${company.founded} | ${company.employees} employés | CA ${company.revenue} | Stock ${company.storage}
Adresse: ${company.location}
Téléphone: ${company.phone} | Email: ${company.email}
LinkedIn: ${company.linkedin}

HORAIRES:
- ${workingHours.weekdays}
- ${workingHours.saturday}
- ${workingHours.sunday}
${workingHours.note}

À PROPOS:
${about.description}
Mission: ${about.mission}
Vision: ${about.vision}
Valeurs: ${about.values}

HISTORIQUE:
${hist}

SERVICES:
${svc}

CATÉGORIES PRODUITS (${productGroups.map((g) => g.label).join(', ')}):
${products}

ANALYSES DE LABORATOIRE (équipements distribués):
${analyses}

CERTIFICATIONS & ACCRÉDITATIONS:
${certs}

PARTENAIRES & MARQUES DISTRIBUÉES:
${partnersText}
Aqualab est distributeur exclusif de plusieurs marques internationales au Maroc.

RECRUTEMENT:
${recruitment.description}
Domaines: ${recruitment.domains}
Processus: ${recruitment.process}

DEMANDE DE DEVIS:
${quoteRequest.methods.join('\n')}
${quoteRequest.info}

PAGES DU SITE:
Accueil ${sitePages.home} | À propos ${sitePages.about} | Services ${sitePages.services}
Produits ${sitePages.products} | Actualités ${sitePages.news} | Contact ${sitePages.contact}
Recrutement ${sitePages.recruitment}

FAQ:
${faqText}
`.trim()
}
