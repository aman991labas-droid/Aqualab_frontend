/**
 * Catalogue produits — source de données centralisée.
 * Structure compatible avec une future API Laravel :
 * GET /api/categories  → productGroups
 * GET /api/categories/{slug} → getCategoryBySlug(slug)
 */

import { buildCanonicalPath } from './seo'
import { normalizeProductItem as normalizeItem } from '@/lib/products'

export { SITE_URL } from './seo'

/** @deprecated Prefer `@/lib/products` — re-export for static catalogue */
export function normalizeProductItem(item) {
    const normalized = normalizeItem(item)
    return {
        name: normalized.name,
        image: normalized.image,
        imageAlt: normalized.imageAlt,
        images: normalized.images,
        details: normalized.details,
    }
}

/** Logos partenaires par slug catégorie — Laravel: champ partner_logo en base */
export const PARTNER_LOGOS = {
    'inspection-microscopie-leica': '/images/partners/leica_logo.png',
    'metallographie-metkon': '/images/partners/metkon_logo.png',
    'essais-mecaniques-tinius-olsen': '/images/partners/to_logo.png',
    'simulation-climatique-climats': '/images/partners/climats_logo.png',
    'metrologie-vogel': '/images/partners/vogel_logo.png',
    'filtration-air': '/images/partners/fetefilter_logo.png',
    'solutions-refroidissement': '/images/partners/bac_logo.png',
    'mesures-industrielles': '/images/partners/vaisala_logo.png',
}

/** Chemin image catégorie par convention — remplacer par category.image quand ajouté */
export function getCategoryImagePath(slug) {
    return `/images/products/${slug}.jpg`
}

export const productGroups = [
    {
        id: 'laboratoire',
        label: 'Laboratoire',
    },
    {
        id: 'industriel',
        label: 'Industriel',
    },
]

export const productCategories = [
    {
        slug: 'inspection-microscopie-leica',
        title: 'Inspection & Microscopie',
        group: 'laboratoire',
        partner: 'Leica Microsystems — Wetzlar, Allemagne',
        shortDesc: 'Stéréomicroscopes, microscopes numériques, inversés et confocaux — gamme Leica Microsystems.',
        description: `Aqualab Technologie est distributeur exclusif de Leica Microsystems au Maroc. Nous proposons une gamme complète de microscopes pour l'inspection industrielle, le contrôle qualité, la recherche et l'analyse métallographique.

Nos stéréomicroscopes série M et Ivesta 3 sont reconnus pour leur précision optique et leur fiabilité en environnement de production. Les microscopes numériques DVM permettent une documentation et un contrôle entièrement digitalisés. Pour la recherche avancée, les microscopes confocaux STELLARIS offrent une résolution exceptionnelle.

Que vous soyez dans l'électronique, l'automobile, l'aéronautique ou la recherche académique, notre équipe technique vous accompagne dans le choix, l'installation et la formation de votre équipement microscopique.`,
        items: [
            'Stéréomicroscopes série M (M60, M80, M125, M165)',
            'Stéréomicroscopes Ivesta 3 (ESD, T, avec éclairage)',
            'Microscopes numériques DVM série',
            'Microscopes inversés (DMIL, DMi1, DMi8)',
            'Microscopes polarisants (DM2500P, DM4P)',
            'Microscopes confocaux STELLARIS',
        ],
        seo: {
            title: 'Microscopes Leica – Inspection & Microscopie | Aqualab Technologie Maroc',
            description: 'Distributeur exclusif Leica Microsystems au Maroc. Stéréomicroscopes, microscopes numériques, inversés et confocaux pour laboratoire et industrie. Devis à Casablanca.',
        },
    },
    {
        slug: 'metallographie-metkon',
        title: 'Métallographie',
        group: 'laboratoire',
        partner: 'Metkon ',
        shortDesc: 'Tronçonneuses, polisseuses et enrobeuses à chaud/froid — Metkon.',
        description: `La métallographie est essentielle pour l'analyse de la microstructure des matériaux. Aqualab Technologie distribue les équipements Metkon, références mondiales en préparation d'échantillons métallographiques.


Notre gamme couvre l'ensemble du processus : tronçonnage de précision, polissage automatique ou semi-automatique, enrobage à chaud ou à froid, et systèmes d'analyse d'image. Ces équipements sont utilisés dans les laboratoires de métallurgie, les industries sidérurgiques, automobiles et aéronautiques au Maroc.

Nous assurons l'installation, la mise en service et la formation de vos équipes sur l'ensemble de la chaîne de préparation métallographique.`,
        items: [
            'Tronçonneuses de précision (MICRACUT 201, 101)',
            'Polisseuses automatiques et semi-auto (FORCIPOL, SAPHIR)',
            'Enrobeuses à chaud (OPAL 430, 460)',
            'Enrobeuses à froid EPOVAC',
            'Systèmes d\'analyse d\'image',
        ],
        seo: {
            title: 'Métallographie Metkon – Équipements Laboratoire | Aqualab Maroc',
            description: 'Tronçonneuses, polisseuses et enrobeuses Metkon au Maroc. Équipements métallographie pour analyse microstructure. Installation et SAV à Casablanca.',
        },
    },
    {
        slug: 'essais-mecaniques-tinius-olsen',
        title: 'Essais Mécaniques',
        group: 'laboratoire',
        partner: 'Tinius Olsen',
        shortDesc: 'Machines de traction, MFI, duromètres — Tinius Olsen pour essais matériaux.',
        description: `Tinius Olsen est un leader mondial des machines d'essais mécaniques. Aqualab Technologie met à disposition au Maroc une gamme complète pour la caractérisation mécanique des matériaux : traction, compression, flexion, dureté et indice de fluidité.

Nos machines benchtop (1 à 5 kN) conviennent aux laboratoires R&D, tandis que les modèles floor (5 à 300 kN) répondent aux exigences des industries de production. Les duromètres Rockwell, Vickers et Brinell complètent l'offre pour les tests de dureté.

Conformité aux normes internationales ISO et ASTM. Installation, étalonnage et maintenance assurés par nos techniciens certifiés.`,
        items: [
            'Machines de traction/compression 1 kN à 5 kN (Benchtop)',
            'Machines de traction 5 kN à 300 kN (Floor Model)',
            'Melt Flow Index (MFI 10, MP600)',
            'Duromètres Rockwell, Vickers, Brinell',
            'Machines de flexion 3 et 4 points',
        ],
        seo: {
            title: 'Essais Mécaniques Tinius Olsen – Machines Traction & Duromètres | Aqualab Maroc',
            description: 'Machines de traction, compression, MFI et duromètres Tinius Olsen au Maroc. Essais mécaniques conformes ISO/ASTM. Devis et installation à Casablanca.',
        },
    },
    {
        slug: 'simulation-climatique-climats',
        title: 'Simulation Climatique',
        group: 'laboratoire',
        partner: 'Climats',
        shortDesc: 'Chambres climatiques, choc thermique et vieillissement UV — Climats.',
        description: `Les enceintes climatiques Climats permettent de simuler des conditions environnementales extrêmes pour tester la fiabilité de vos produits. Aqualab Technologie distribue la gamme complète Climats au Maroc.

Nos chambres de choc thermique SCAL, enceintes EXCAL² et LabCal couvrent les essais de température, humidité, cycle thermique et vieillissement accéléré. Les simulateurs UV complètent l'offre pour les tests de durabilité des matériaux exposés aux intempéries.

Industries concernées : automobile, électronique, aéronautique, pharmaceutique et BTP. Accompagnement complet de la sélection à la mise en service.`,
        items: [
            'Chambres de choc thermique SCAL',
            'Enceintes climatiques EXCAL²',
            'Enceintes d\'essais LabCal',
            'Simulateurs de vieillissement UV',
            'Chambres d\'humidité et de brouillard salin',
        ],
        seo: {
            title: 'Simulation Climatique Climats – Chambres d\'Essais | Aqualab Technologie Maroc',
            description: 'Chambres climatiques, choc thermique et vieillissement UV Climats au Maroc. Essais environnementaux pour industrie et laboratoire. Devis à Casablanca.',
        },
    },
    {
        slug: 'metrologie-vogel',
        title: 'Métrologie',
        group: 'laboratoire',
        partner: 'Vogel Germany',
        shortDesc: 'Pieds à coulisse, micromètres, calibres — instruments de mesure Vogel Germany.',
        description: `La métrologie industrielle exige des instruments de mesure fiables et traçables. Aqualab Technologie distribue les instruments Vogel Germany, reconnus pour leur précision et leur robustesse en environnement de production.

Notre catalogue comprend pieds à coulisse digital et vernier, micromètres intérieurs et extérieurs, calibres, comparateurs, niveaux de précision et rapporteurs d'angles. Ces instruments sont indispensables au contrôle qualité dans l'usinage, l'assemblage et la métrologie dimensionnelle.

Étalonnage et conseil technique disponibles. Stock permanent de pièces et consommables pour garantir la continuité de vos mesures.`,
        items: [
            'Pieds à coulisse digital, vernier et à cadran',
            'Micromètres extérieurs et intérieurs',
            'Calibres et jauges de profondeur',
            'Comparateurs et indicateurs de cadran',
            'Niveaux à bulles et de précision',
            'Rapporteurs d\'angles digitaux',
        ],
        seo: {
            title: 'Métrologie Vogel – Instruments de Mesure Industriels | Aqualab Maroc',
            description: 'Pieds à coulisse, micromètres et instruments de mesure Vogel Germany au Maroc. Métrologie dimensionnelle pour industrie et laboratoire. Devis Casablanca.',
        },
    },
    {
        slug: 'equipements-salle-blanche',
        title: 'Équipements Salle Blanche',
        group: 'industriel',
        partner: 'Divers fabricants',
        shortDesc: 'Cabinets biosécurité, hottes à flux laminaire, sas de décontamination.',
        description: `Les salles blanches exigent des équipements certifiés pour garantir un environnement contrôlé en particules et en contamination microbiologique. Aqualab Technologie fournit au Maroc l'ensemble des équipements nécessaires à la conception et à l'exploitation de salles blanches.

Notre offre inclut les cabinets de biosécurité classe II, hottes à flux laminaire horizontal et vertical, sas de décontamination, systèmes de monitoring particulaire et équipements EPI. Secteurs : pharmaceutique, biotechnologie, électronique, agroalimentaire et recherche médicale.

Conseil en aménagement, installation et qualification IQ/OQ disponibles sur demande.`,
        items: [
            'Cabinets de biosécurité de classe II',
            'Hottes à flux laminaire horizontal et vertical',
            'Sas de décontamination',
            'Systèmes de monitoring particulaire',
            'Vêtements et équipements EPI salle blanche',
        ],
        seo: {
            title: 'Équipements Salle Blanche – Hottes & Biosécurité | Aqualab Maroc',
            description: 'Cabinets biosécurité, hottes à flux laminaire et équipements salle blanche au Maroc. Solutions pharmaceutique, électronique et recherche. Devis Casablanca.',
        },
    },
    {
        slug: 'equipements-esd',
        title: 'Équipements ESD',
        group: 'laboratoire',
        partner: 'Solutions antistatiques',
        shortDesc: 'Tables, tapis et équipements antistatiques ESD pour environnements sensibles.',
        description: `La protection ESD (ElectroStatic Discharge) est critique dans l'électronique, l'aéronautique et toute industrie manipulant des composants sensibles. Aqualab Technologie propose une gamme complète de solutions antistatiques certifiées.

Tables de travail ESD, tapis et revêtements de sol, bracelets antistatiques avec testeurs, chaussures ESD certifiées et ioniseurs de bureau ou en ligne : nous couvrons l'intégralité des besoins de votre zone protégée EPA (Electrostatic Protected Area).

Audit ESD, conseil en aménagement et formation disponibles pour garantir la conformité aux normes IEC 61340.`,
        items: [
            'Tables de travail antistatiques ESD',
            'Tapis et revêtements de sol ESD',
            'Bracelets antistatiques et testeurs',
            'Chaussures ESD certifiées',
            'Ioniseurs de bureau et en ligne',
        ],
        seo: {
            title: 'Équipements ESD Antistatiques – Protection Électrostatique | Aqualab Maroc',
            description: 'Tables ESD, tapis antistatiques, bracelets et ioniseurs au Maroc. Solutions protection electrostatique pour électronique et industrie. Devis Casablanca.',
        },
    },
    {
        slug: 'filtration-air',
        title: 'Filtration d\'Air',
        group: 'industriel',
        partner: 'Solutions de filtration',
        shortDesc: 'Filtres HEPA H13/H14, charbon actif et systèmes de filtration industriels.',
        description: `La qualité de l'air est un enjeu majeur en industrie, en santé et en recherche. Aqualab Technologie distribue des systèmes de filtration d'air haute performance adaptés aux exigences les plus strictes.

Filtres HEPA H13/H14 haute efficacité, filtres à charbon actif pour les composés organiques volatils, préfiltres G4/F7 et purificateurs d'air industriels : notre gamme couvre la filtration en salle blanche, en laboratoire et en environnement industriel.

Dimensionnement sur mesure, installation et remplacement programmé des filtres pour garantir la performance de vos systèmes CVC et hottes.`,
        items: [
            'Filtres HEPA H13/H14 haute efficacité',
            'Filtres à charbon actif',
            'Préfiltres G4/F7',
            'Systèmes de filtration sur mesure',
            'Purificateurs d\'air industriels',
        ],
        seo: {
            title: 'Filtration d\'Air HEPA – Filtres Industriels | Aqualab Technologie Maroc',
            description: 'Filtres HEPA H13/H14, charbon actif et purification d\'air au Maroc. Filtration industrielle et salle blanche. Devis et installation Casablanca.',
        },
    },
    {
        slug: 'mesures-industrielles',
        title: 'Mesures Industrielles',
        group: 'industriel',
        partner: 'Instrumentation industrielle',
        shortDesc: 'Capteurs, transmetteurs, analyseurs et débitmètres pour l\'industrie.',
        description: `L'instrumentation industrielle permet le monitoring et le contrôle des paramètres critiques de vos processus. Aqualab Technologie propose capteurs, transmetteurs et analyseurs pour la pression, la température, le débit et la qualité de l'eau.

Nos débitmètres électromagnétiques et ultrasoniques, analyseurs de qualité d'eau et systèmes d'acquisition de données s'intègrent dans les installations industrielles, de traitement des eaux et de production agroalimentaire.

Conseil en sélection, installation sur site et maintenance préventive assurés par notre équipe technique.`,
        items: [
            'Capteurs de pression et de débit',
            'Transmetteurs de température',
            'Analyseurs de qualité d\'eau',
            'Débitmètres (électromagnétique, ultrason)',
            'Systèmes d\'acquisition de données',
        ],
        seo: {
            title: 'Mesures Industrielles – Capteurs & Analyseurs | Aqualab Maroc',
            description: 'Capteurs, transmetteurs, débitmètres et analyseurs qualité eau au Maroc. Instrumentation industrielle et process. Devis Casablanca.',
        },
    },
    {
        slug: 'solutions-refroidissement',
        title: 'Solutions de Refroidissement',
        group: 'industriel',
        partner: 'Systèmes thermiques',
        shortDesc: 'Chillers industriels, tours de refroidissement et échangeurs thermiques.',
        description: `Le refroidissement industriel est indispensable pour la stabilité des processus et la durabilité des équipements. Aqualab Technologie propose des solutions de thermorégulation adaptées aux laboratoires et à l'industrie lourde.

Refroidisseurs à eau (chillers) industriels, tours de refroidissement, échangeurs thermiques à plaques, systèmes de régulation thermique, cryostats et bains thermostatés : notre gamme couvre les besoins de refroidissement de précision à haute capacité.

Étude thermique, installation et contrats de maintenance disponibles pour garantir la performance énergétique de vos installations.`,
        items: [
            'Refroidisseurs à eau (chillers) industriels',
            'Tours de refroidissement',
            'Échangeurs thermiques à plaques',
            'Systèmes de régulation thermique',
            'Cryostats et bains thermostatés',
        ],
        seo: {
            title: 'Refroidissement Industriel – Chillers & Échangeurs | Aqualab Maroc',
            description: 'Chillers industriels, tours de refroidissement et échangeurs thermiques au Maroc. Solutions thermorégulation laboratoire et industrie. Devis Casablanca.',
        },
    },
    {
        slug: 'traitement-air',
        title: 'Traitement d\'Air',
        group: 'industriel',
        partner: 'CVC & traitement d\'air',
        shortDesc: 'Centrales de traitement d\'air, ventilation double flux et humidification.',
        description: `Le traitement d'air industriel garantit des conditions environnementales optimales pour la production, le stockage et le confort des opérateurs. Aqualab Technologie propose des solutions CVC et de traitement d'air pour l'industrie marocaine.

Centrales de traitement d'air (CTA), unités de ventilation double flux, déshumidificateurs et humidificateurs industriels, systèmes de récupération de chaleur : nous dimensionnons et installons des solutions adaptées à votre bâtiment et à vos contraintes process.

Étude énergétique, installation clé en main et maintenance préventive disponibles.`,
        items: [
            'Centrales de traitement d\'air (CTA)',
            'Unités de ventilation double flux',
            'Déshumidificateurs industriels',
            'Humidificateurs à vapeur',
            'Systèmes de récupération de chaleur',
        ],
        seo: {
            title: 'Traitement d\'Air Industriel – CTA & Ventilation | Aqualab Maroc',
            description: 'Centrales traitement d\'air, ventilation double flux et humidification industrielle au Maroc. Solutions CVC pour industrie. Devis Casablanca.',
        },
    },
]

/** Enrichit une catégorie avec logo partenaire et image — même shape qu'une réponse API Laravel */
function enrichCategory(category) {
    return {
        ...category,
        partnerLogo: category.partnerLogo ?? PARTNER_LOGOS[category.slug] ?? null,
        image: category.image ?? null,
    }
}

/** Retourne une catégorie par slug — même logique qu'un futur GET /api/categories/{slug} */
export function getCategoryBySlug(slug) {
    const category = productCategories.find(c => c.slug === slug)
    if (!category) return null
    return enrichCategory(category)
}

/** Retourne les catégories d'un groupe (laboratoire | industriel) */
export function getCategoriesByGroup(groupId) {
    return productCategories
        .filter(c => c.group === groupId)
        .map(enrichCategory)
}

/** URL canonique d'une catégorie */
export function getCategoryUrl(slug) {
    return buildCanonicalPath(`/produits/${slug}`)
}

/** Chemin React Router d'une catégorie */
export function getCategoryPath(slug) {
    return `/produits/${slug}`
}

/** Résout une liste de slugs en objets catégorie */
export function getCategoriesForSlugs(slugs = []) {
    return slugs.map(slug => getCategoryBySlug(slug)).filter(Boolean)
}
