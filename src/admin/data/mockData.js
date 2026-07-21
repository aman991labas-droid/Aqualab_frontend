import { categories as blogCategories, articles } from '../../data/articles'

// Blog categories — same model as src/data/articles.js ({ id, label })
// Excludes the filter-only "all" entry from admin CRUD.
export const initialBlogCategories = blogCategories.filter((c) => c.id !== 'all')

export const initialMainCategories = [
  { id: 'laboratoire', label: 'Laboratoire', sortOrder: 0 },
  { id: 'industriel', label: 'Industriel', sortOrder: 1 },
]

export const initialPartners = [
  { id: 1, name: 'Leica Microsystems', specialty: 'Microscopie', url: 'https://www.leica-microsystems.com/', logo: '/images/partners/leica_logo.png', sortOrder: 0, preserveContrast: false, isActive: true },
  { id: 2, name: 'Tinius Olsen', specialty: 'Essais mécaniques', url: 'https://www.tiniusolsen.com/', logo: '/images/partners/to_logo.png', sortOrder: 1, preserveContrast: false, isActive: true },
  { id: 3, name: 'Metkon', specialty: 'Métallographie', url: 'https://www.metkon.com/', logo: '/images/partners/metkon_logo.png', sortOrder: 2, preserveContrast: false, isActive: true },
  { id: 4, name: 'Vogel Germany', specialty: 'Métrologie', url: 'https://www.vogel.de/', logo: '/images/partners/vogel_logo.png', sortOrder: 3, preserveContrast: false, isActive: true },
  { id: 5, name: 'Climats', specialty: 'Simulation climatique', url: 'https://www.climats.com/', logo: '/images/partners/climats_logo.png', sortOrder: 4, preserveContrast: false, isActive: true },
  { id: 6, name: 'Desco', specialty: 'Automatisation industrielle', url: 'https://www.desco.com/', logo: '/images/partners/desco_logo.png', sortOrder: 5, preserveContrast: false, isActive: true },
  { id: 7, name: 'Fetefilter', specialty: 'Filtration', url: 'https://www.fetefilter.com/', logo: '/images/partners/fetefilter_logo.png', sortOrder: 6, preserveContrast: false, isActive: true },
  { id: 8, name: 'Vaisala', specialty: 'Météorologie', url: 'https://www.vaisala.com/', logo: '/images/partners/vaisala_logo.png', sortOrder: 7, preserveContrast: false, isActive: true },
  { id: 9, name: 'Baltimore Aircoil Company', specialty: 'Refroidissement industriel', url: 'https://www.baltimoreaircoil.com/', logo: '/images/partners/bac_logo.png', sortOrder: 8, preserveContrast: true, isActive: true },
]

// Articles — same model as src/data/articles.js
export const initialArticles = articles.map((a) => ({ ...a, author: { ...a.author } }))

// Product catalog — same nested structure as src/pages/Products.jsx
// Tab: { id, label, categories: [{ title, partner, items: string[] }] }
export const initialProductTabs = [
  {
    id: 'laboratoire',
    label: 'Laboratoire',
    categories: [
      {
        title: 'Inspection & Microscopie',
        partner: 'Leica Microsystems — Wetzlar, Allemagne',
        items: [
          'Stéréomicroscopes série M (M60, M80, M125, M165)',
          'Stéréomicroscopes Ivesta 3 (ESD, T, avec éclairage)',
          'Microscopes numériques DVM série',
          'Microscopes inversés (DMIL, DMi1, DMi8)',
          'Microscopes polarisants (DM2500P, DM4P)',
          'Microscopes confocaux STELLARIS',
        ],
      },
      {
        title: 'Métallographie',
        partner: 'Metkon / Presi',
        items: [
          'Tronçonneuses de précision (MICRACUT 201, 101)',
          'Polisseuses automatiques et semi-auto (FORCIPOL, SAPHIR)',
          'Enrobeuses à chaud (OPAL 430, 460)',
          'Enrobeuses à froid EPOVAC',
          "Systèmes d'analyse d'image",
        ],
      },
      {
        title: 'Essais Mécaniques',
        partner: 'Tinius Olsen',
        items: [
          'Machines de traction/compression 1 kN à 5 kN (Benchtop)',
          'Machines de traction 5 kN à 300 kN (Floor Model)',
          'Melt Flow Index (MFI 10, MP600)',
          'Duromètres Rockwell, Vickers, Brinell',
          'Machines de flexion 3 et 4 points',
        ],
      },
      {
        title: 'Simulation Climatique',
        partner: 'Climats',
        items: [
          'Chambres de choc thermique SCAL',
          'Enceintes climatiques EXCAL²',
          "Enceintes d'essais LabCal",
          'Simulateurs de vieillissement UV',
          "Chambres d'humidité et de brouillard salin",
        ],
      },
      {
        title: 'Métrologie',
        partner: 'Vogel Germany',
        items: [
          'Pieds à coulisse digital, vernier et à cadran',
          'Micromètres extérieurs et intérieurs',
          'Calibres et jauges de profondeur',
          'Comparateurs et indicateurs de cadran',
          'Niveaux à bulles et de précision',
          "Rapporteurs d'angles digitaux",
        ],
      },
    ],
  },
  {
    id: 'industriel',
    label: 'Industriel',
    categories: [
      {
        title: 'Équipements Salle Blanche',
        partner: 'Divers fabricants',
        items: [
          'Cabinets de biosécurité de classe II',
          'Hottes à flux laminaire horizontal et vertical',
          'Sas de décontamination',
          'Systèmes de monitoring particulaire',
          'Vêtements et équipements EPI salle blanche',
        ],
      },
      {
        title: 'Équipements ESD',
        partner: 'Solutions antistatiques',
        items: [
          'Tables de travail antistatiques ESD',
          'Tapis et revêtements de sol ESD',
          'Bracelets antistatiques et testeurs',
          'Chaussures ESD certifiées',
          'Ioniseurs de bureau et en ligne',
        ],
      },
      {
        title: "Filtration d'Air",
        partner: 'Solutions de filtration',
        items: [
          'Filtres HEPA H13/H14 haute efficacité',
          'Filtres à charbon actif',
          'Préfiltres G4/F7',
          'Systèmes de filtration sur mesure',
          "Purificateurs d'air industriels",
        ],
      },
      {
        title: 'Mesures Industrielles',
        partner: 'Instrumentation industrielle',
        items: [
          'Capteurs de pression et de débit',
          'Transmetteurs de température',
          "Analyseurs de qualité d'eau",
          'Débitmètres (électromagnétique, ultrason)',
          "Systèmes d'acquisition de données",
        ],
      },
      {
        title: 'Solutions de Refroidissement',
        partner: 'Systèmes thermiques',
        items: [
          'Refroidisseurs à eau (chillers) industriels',
          'Tours de refroidissement',
          'Échangeurs thermiques à plaques',
          'Systèmes de régulation thermique',
          'Cryostats et bains thermostatés',
        ],
      },
      {
        title: "Traitement d'Air",
        partner: 'CVC & traitement d\'air',
        items: [
          'Centrales de traitement d\'air (CTA)',
          'Unités de ventilation double flux',
          'Déshumidificateurs industriels',
          'Humidificateurs à vapeur',
          'Systèmes de récupération de chaleur',
        ],
      },
    ],
  },
]

export const initialContactMessages = [
  {
    id: 'msg-1',
    name: 'Karim Bennani',
    email: 'karim@labo.ma',
    tel: '0661122334',
    company: 'Labo Analyses Casablanca',
    message: 'Bonjour, nous souhaitons obtenir un devis pour une gamme de microscopes stéréo Leica.',
    submittedAt: '2026-07-05 14:30',
    readAt: null,
    isRead: false,
  },
  {
    id: 'msg-2',
    name: 'Nadia Fassi',
    email: 'nadia.fassi@industrie.ma',
    tel: '',
    company: 'MetalPro Industries',
    message: 'Pouvez-vous nous contacter pour une démonstration de machines d\'essais mécaniques ?',
    submittedAt: '2026-07-03 09:15',
    readAt: '2026-07-03 10:00',
    isRead: true,
  },
]

// Candidatures spontanées — fields from Recrutement.jsx + admin status
export const initialApplications = [
  {
    id: 'app-1',
    name: 'Yassine El Amrani',
    email: 'yassine@example.com',
    tel: '0612345678',
    jobType: 'Ingénierie & Technique',
    cvFile: 'cv-yassine.pdf',
    cvUrl: '#',
    message: 'Passionné par les technologies de laboratoire, je souhaite rejoindre votre équipe technique.',
    submittedAt: '2026-06-20',
    status: 'new',
  },
  {
    id: 'app-2',
    name: 'Salma Benali',
    email: 'salma@example.com',
    tel: '0623456789',
    jobType: 'Commercial B2B',
    cvFile: 'cv-salma.pdf',
    cvUrl: '#',
    message: 'Expérimentée en vente de solutions industrielles, je suis motivée par votre développement.',
    submittedAt: '2026-06-22',
    status: 'under_review',
  },
]
