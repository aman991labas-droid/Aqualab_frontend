export const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'laboratoire', label: 'Laboratoire' },
    { id: 'industriel', label: 'Industriel' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'actualites', label: 'Actualités' },
]

export const articles = [
    {
        id: 1,
        slug: 'guide-analyse-qualite-eau',
        title: "Guide complet : Analyse de la qualité de l'eau en laboratoire",
        excerpt: "Découvrez les méthodes et équipements essentiels pour réaliser des analyses précises de la qualité de l'eau conformément aux normes internationales.",
        content: `
## Introduction

L'analyse de la qualité de l'eau est un processus essentiel pour garantir la sécurité et la conformité aux normes environnementales. Dans cet article, nous explorons les meilleures pratiques et équipements pour des analyses précises.

## Paramètres clés à analyser

### Paramètres physiques
- **Turbidité** : Mesure de la clarté de l'eau
- **pH** : Acidité ou basicité de l'eau
- **Conductivité électrique** : Concentration en ions
- **Température** : Influence sur les réactions chimiques

### Paramètres chimiques
- Demande chimique en oxygène (DCO)
- Demande biologique en oxygène (DBO5)
- Nitrates et phosphates
- Métaux lourds

## Équipements recommandés

Pour des analyses fiables, nous recommandons une gamme complète d'équipements certifiés, incluant des spectrophotomètres, des analyseurs multiparamètres et des équipements de filtration.

## Conclusion

Une analyse rigoureuse de la qualité de l'eau nécessite des équipements adaptés et des procédures standardisées. Aqualab Technologie vous accompagne dans le choix des meilleures solutions.
    `,
        category: 'laboratoire',
        image: '/images/blog/water-analysis.jpg',
        author: { name: 'Équipe Aqualab', avatar: '/images/team/expert.jpg' },
        date: '2026-06-15',
        readTime: 6,
        featured: true,
        relatedProductSlugs: ['mesures-industrielles', 'filtration-air'],
    },
    {
        id: 2,
        slug: 'microscopes-leica-applications-industrielles',
        title: "Microscopes Leica : Applications industrielles et scientifiques au Maroc",
        excerpt: "Explorez les applications des microscopes Leica Microsystems dans les laboratoires industriels et de recherche au Maroc.",
        content: `
## Leica Microsystems au service de l'industrie marocaine

En tant que distributeur exclusif de Leica Microsystems au Maroc, Aqualab Technologie vous propose une gamme complète de microscopes adaptés à vos besoins industriels et scientifiques.

## Applications industrielles

### Contrôle qualité
Les stéréomicroscopes Leica permettent un contrôle visuel précis des composants électroniques, pièces mécaniques et matériaux.

### Analyse métallurgique
Les microscopes polarisants offrent une analyse détaillée de la microstructure des métaux et alliages.

## Gammes disponibles

- **Série M** : Stéréomicroscopes pour inspection et assemblage
- **Ivesta 3** : Solution polyvalente pour les laboratoires industriels
- **DVM** : Microscopes numériques pour documentation

## Conclusion

Choisir un microscope Leica, c'est investir dans la précision et la durabilité. Contactez nos experts pour trouver la solution adaptée à votre application.
    `,
        category: 'laboratoire',
        image: '/images/blog/microscope.jpg',
        author: { name: 'Dr. Sami Idrissi', avatar: '/images/team/expert2.jpg' },
        date: '2026-06-01',
        readTime: 5,
        featured: false,
        relatedProductSlugs: ['inspection-microscopie-leica', 'metallographie-metkon'],
    },
    {
        id: 3,
        slug: 'maintien-equipement-laboratoire',
        title: "Maintenance préventive : Prolongez la vie de vos équipements de laboratoire",
        excerpt: "Les bonnes pratiques de maintenance préventive pour assurer la durabilité et la performance de vos équipements scientifiques.",
        content: `
## L'importance de la maintenance préventive

La maintenance préventive est bien plus économique que la maintenance corrective. Elle permet de détecter les anomalies avant qu'elles ne deviennent des pannes coûteuses.

## Plan de maintenance recommandé

### Vérifications quotidiennes
- État visuel des équipements
- Nettoyage des optiques et surfaces
- Vérification des niveaux de fluides

### Entretien mensuel
- Calibration des instruments de mesure
- Lubrification des pièces mobiles
- Mise à jour des logiciels

## Notre service SAV

L'équipe technique d'Aqualab Technologie propose des contrats de maintenance adaptés à vos besoins, avec des interventions préventives planifiées.

## Bénéfices

- Réduction des pannes imprévues de 70%
- Prolongation de la durée de vie des équipements
- Maintien de la précision des mesures
- Conformité aux normes ISO
    `,
        category: 'expertise',
        image: '/images/blog/maintenance.jpg',
        author: { name: 'Équipe Technique', avatar: '/images/team/tech.jpg' },
        date: '2026-05-20',
        readTime: 7,
        featured: false,
        relatedProductSlugs: ['inspection-microscopie-leica', 'essais-mecaniques-tinius-olsen', 'metrologie-vogel'],
    },
    {
        id: 4,
        slug: 'essais-mecaniques-tinius-olsen',
        title: "Essais mécaniques avec Tinius Olsen : précision et fiabilité",
        excerpt: "Les machines de tests mécaniques Tinius Olsen offrent une précision exceptionnelle pour vos essais de traction, compression et flexion.",
        content: `
## Tinius Olsen : L'excellence en tests mécaniques

Depuis plus d'un siècle, Tinius Olsen est synonyme de précision dans les tests mécaniques. En tant que distributeur au Maroc, Aqualab Technologie vous propose toute la gamme.

## Types d'essais disponibles

### Traction et compression
- Machines de bureau : 1 kN à 5 kN
- Machines de sol : 5 kN à 300 kN
- Tests selon normes ISO, ASTM, DIN

### Melt Flow Index
- Mesure de l'indice de fluidité
- Conformité aux normes ISO 1133 et ASTM D1238

## Applications sectorielles

- Industrie plastique et caoutchouc
- Industrie textile
- Industrie automobile
- Recherche et développement

## Conclusion

Investir dans des équipements Tinius Olsen, c'est garantir des résultats fiables et reproductibles pour vos contrôles qualité.
    `,
        category: 'laboratoire',
        image: '/images/blog/testing.jpg',
        author: { name: 'Équipe Aqualab', avatar: '/images/team/expert.jpg' },
        date: '2026-05-05',
        readTime: 4,
        featured: false,
        relatedProductSlugs: ['essais-mecaniques-tinius-olsen'],
    },
    {
        id: 5,
        slug: 'solutions-salle-blanche-industrie',
        title: "Solutions salle blanche pour l'industrie pharmaceutique et électronique",
        excerpt: "Comment choisir les bons équipements pour votre salle blanche ? Guide complet pour l'industrie pharmaceutique et électronique.",
        content: `
## Les salles blanches : un environnement contrôlé critique

Les salles blanches ou salles propres sont des environnements où le niveau de contamination est contrôlé selon des normes strictes (ISO 14644).

## Équipements essentiels

### Systèmes de filtration
- Filtres HEPA H13/H14 pour air ultra-pur
- Systèmes de monitoring particulaire
- Cabinets de biosécurité classe II

### Gestion antistatique (ESD)
- Tables de travail ESD
- Ioniseurs pour neutraliser les charges
- Équipements de protection individuels ESD

## Classification des salles blanches

Chaque industrie a ses exigences spécifiques. Nous accompagnons nos clients dans la qualification de leurs salles blanches selon les normes ISO et GMP.

## Notre accompagnement

Aqualab Technologie ne se contente pas de fournir des équipements. Nous assurons l'installation, la qualification et la maintenance de vos salles blanches.
    `,
        category: 'industriel',
        image: '/images/blog/cleanroom.jpg',
        author: { name: 'Dr. Fatima Benali', avatar: '/images/team/expert3.jpg' },
        date: '2026-04-18',
        readTime: 8,
        featured: true,
        relatedProductSlugs: ['equipements-salle-blanche', 'equipements-esd', 'filtration-air'],
    },
    {
        id: 6,
        slug: 'metrologie-instrument-mesure',
        title: "Métrologie industrielle : choisir les bons instruments de mesure",
        excerpt: "Les instruments de métrologie Vogel Germany garantissent des mesures précises et traçables pour votre contrôle qualité.",
        content: `
## La métrologie : fondement du contrôle qualité

La métrologie est la science de la mesure. Dans l'industrie, des mesures précises sont essentielles pour garantir la qualité et la conformité des produits.

## Gamme Vogel Germany

Aqualab Technologie propose toute la gamme Vogel pour vos besoins métrologiques :

### Instruments de mesure linéaire
- Pieds à coulisse digitaux (0,01 mm de résolution)
- Micromètres extérieurs et intérieurs
- Jauges de profondeur et de hauteur

### Instruments angulaires
- Rapporteurs d'angles digitaux
- Niveaux à bulles de précision
- Équerre de précision

## Calibration et traçabilité

Nos instruments sont calibrés et livrés avec des certificats traçables aux étalons nationaux, répondant aux exigences ISO 9001.

## Conseil personnalisé

Contactez nos experts pour obtenir une recommandation adaptée à votre application et à vos exigences métrologiques.
    `,
        category: 'expertise',
        image: '/images/blog/metrology.jpg',
        author: { name: 'Équipe Technique', avatar: '/images/team/tech.jpg' },
        date: '2026-03-30',
        readTime: 5,
        featured: false,
        relatedProductSlugs: ['metrologie-vogel'],
    },
]

/** Retourne un article par slug — futur: GET /api/articles/{slug} */
export function getArticleBySlug(slug) {
    return articles.find(a => a.slug === slug) ?? null
}

/** Produits liés à un article — futur: champ API article.related_products */
export function getRelatedProducts(article) {
    if (!article?.relatedProductSlugs?.length) return []
    // Lazy import avoided — resolved by caller via getCategoriesForSlugs
    return article.relatedProductSlugs
}

/** Articles qui mentionnent une catégorie produit — futur: GET /api/categories/{slug}/articles */
export function getArticlesForProduct(productSlug) {
    return articles.filter(a => a.relatedProductSlugs?.includes(productSlug))
}
