const VALID_PATTERNS = [
  'cv',
  'c.v',
  'curriculum',
  'vitae',
  'resume',
  'résumé',
  'candidature',
  'candidat',
  'parcours',
  'professionnel',
]

const SUSPICIOUS_PATTERNS = [
  'rapport',
  'report',
  'pfa',
  'pfe',
  'pfc',
  'projet',
  'project',
  'stage',
  'memoire',
  'mémoire',
  'memoir',
  'dissertation',
  'these',
  'thèse',
  'thesis',
  'tp',
  'td',
  'examen',
  'devoir',
  'assignment',
  'presentation',
  'powerpoint',
  'slide',
  'soutenance',
  'recherche',
  'etude',
  'étude',
  'fiche',
  'certificat',
  'attestation',
  'bulletin',
  'releve',
  'relevé',
  'facture',
  'invoice',
]

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx']

function normalizeFilename(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  return base.toLowerCase().replace(/[_\-.+]/g, ' ')
}

function matchesPattern(text, pattern) {
  const regex = new RegExp(`\\b${pattern.replace('.', '\\.')}\\b`, 'i')
  return regex.test(text)
}

export function analyzeCvFilename(filename) {
  const name = (filename || '').trim()

  if (!name) {
    return {
      status: 'missing',
      label: 'Aucun CV',
      score_adjustment: 0,
      max_score: 45,
      concern: 'Aucun CV fourni',
      strength: null,
    }
  }

  const normalized = normalizeFilename(name)
  const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : ''

  if (extension && !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      status: 'suspicious',
      label: 'Format de fichier invalide',
      score_adjustment: -25,
      max_score: 30,
      concern: `Format de fichier non accepté pour un CV (${extension})`,
      strength: null,
    }
  }

  if (SUSPICIOUS_PATTERNS.some((pattern) => matchesPattern(normalized, pattern))) {
    return {
      status: 'suspicious',
      label: 'Fichier suspect',
      score_adjustment: -30,
      max_score: 35,
      concern: `Le fichier « ${name} » ne semble pas être un CV (rapport/projet détecté)`,
      strength: null,
    }
  }

  if (VALID_PATTERNS.some((pattern) => matchesPattern(normalized, pattern))) {
    return {
      status: 'valid',
      label: 'CV valide',
      score_adjustment: 25,
      max_score: null,
      concern: null,
      strength: 'CV joint à la candidature',
    }
  }

  return {
    status: 'unknown',
    label: 'Fichier non identifié',
    score_adjustment: 5,
    max_score: 55,
    concern: `Le nom du fichier « ${name} » ne confirme pas qu'il s'agit d'un CV`,
    strength: 'Un fichier a été joint',
  }
}

function finalizeScore(result, cvAnalysis) {
  let score = result.score

  if (cvAnalysis.max_score != null) {
    score = Math.min(score, cvAnalysis.max_score)
  }
  if (cvAnalysis.status === 'suspicious' && score > 35) {
    score = 35
  }

  let strengths = [...result.strengths]
  if (cvAnalysis.strength && !strengths.includes(cvAnalysis.strength)) {
    strengths.push(cvAnalysis.strength)
  }
  if (cvAnalysis.status === 'suspicious') {
    strengths = strengths.filter((s) => !s.toLowerCase().includes('cv joint'))
  }

  let concerns = [...result.concerns]
  if (cvAnalysis.concern && !concerns.includes(cvAnalysis.concern)) {
    concerns.push(cvAnalysis.concern)
  }

  score = Math.min(100, Math.max(0, score))
  let priority = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
  if (cvAnalysis.status === 'suspicious') {
    priority = 'low'
  }

  return {
    score,
    priority,
    summary: result.summary,
    strengths,
    concerns,
    cv_status: cvAnalysis.status,
    cv_label: cvAnalysis.label,
  }
}

export function generateArticleContentFallback({ title, categoryLabel }) {
  const category = categoryLabel || 'laboratoire et industrie'
  const topic = (title || '').toLowerCase()

  const excerpt = `Découvrez notre analyse sur ${title} : méthodes, équipements et bonnes pratiques pour les professionnels du secteur ${category} au Maroc.`

  let content = [
    `## Introduction\n\n${title} est un sujet clé pour les laboratoires et industries marocaines. Aqualab Technologie vous présente les points essentiels à connaître pour optimiser vos analyses et garantir des résultats fiables.`,
    `## Contexte et enjeux\n\nDans un environnement où la qualité et la conformité aux normes sont primordiales, les équipements adaptés et les procédures rigoureuses font toute la différence. Que vous travailliez en ${category}, la maîtrise de ce domaine est indispensable.`,
    '## Points clés\n\n- **Précision** : des mesures fiables pour des décisions éclairées\n- **Conformité** : respect des normes internationales en vigueur\n- **Performance** : équipements adaptés à vos applications spécifiques\n- **Accompagnement** : formation et support technique par nos experts',
    `## Solutions Aqualab\n\nAqualab Technologie distribue une gamme complète d'équipements certifiés pour répondre à vos besoins en ${category}. Nos ingénieurs vous conseillent dans le choix, l'installation et la maintenance de vos instruments.`,
    `## Conclusion\n\nPour aller plus loin sur « ${title} », contactez l'équipe Aqualab Technologie. Nous vous accompagnons dans la sélection des meilleures solutions adaptées à votre activité.`,
  ].join('\n\n')

  if (topic.includes('eau') || topic.includes('qualité')) {
    content = content.replace(
      '## Points clés\n\n- **Précision**',
      '## Paramètres essentiels\n\n- **pH et conductivité** : indicateurs fondamentaux\n- **Turbidité** : clarté et qualité visuelle de l\'eau\n- **DCO/DBO** : charge organique et impact environnemental\n\n## Points clés\n\n- **Précision**'
    )
  }

  if (topic.includes('microscope') || topic.includes('microscop')) {
    content = content.replace(
      '## Points clés\n\n- **Précision**',
      '## Applications\n\n- **Contrôle qualité** : inspection visuelle des composants\n- **Recherche** : observation et documentation d\'échantillons\n- **Industrie** : analyse métallurgique et matériaux\n\n## Points clés\n\n- **Précision**'
    )
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return {
    excerpt,
    content,
    read_time: readTime,
    source: 'template',
    ai_enabled: false,
  }
}

export function scoreApplicationFallback(application) {
  const cvAnalysis = analyzeCvFilename(application.cvFile)
  let score = cvAnalysis.score_adjustment
  const strengths = []
  const concerns = []

  if (cvAnalysis.strength) strengths.push(cvAnalysis.strength)
  if (cvAnalysis.concern) concerns.push(cvAnalysis.concern)

  const messageLength = (application.message || '').trim().length
  if (messageLength >= 150) {
    score += 25
    strengths.push('Lettre de motivation détaillée')
  } else if (messageLength >= 80) {
    score += 15
    strengths.push('Motivation exprimée clairement')
  } else if (messageLength >= 30) {
    score += 8
  } else {
    concerns.push('Message de motivation très court')
  }

  if (application.jobType) {
    score += 15
    strengths.push(`Type de poste précisé (${application.jobType})`)
  } else {
    concerns.push('Type de poste non précisé')
  }

  if (application.tel) score += 5

  const email = (application.email || '').toLowerCase()
  if (email && !/@(gmail|yahoo|hotmail|outlook|live)\./.test(email)) {
    score += 10
    strengths.push('Email professionnel')
  }

  if (cvAnalysis.status === 'valid') {
    const keywords = ['expérience', 'experience', 'motiv', 'laboratoire', 'technique', 'commercial', 'ingénieur', 'diplôme']
    const messageLower = (application.message || '').toLowerCase()
    const keywordHits = keywords.filter((kw) => messageLower.includes(kw)).length
    score += Math.min(keywordHits * 5, 20)
    if (keywordHits >= 2) {
      strengths.push('Profil aligné avec le secteur laboratoire/industrie')
    }
  }

  score = Math.min(100, Math.max(0, score))

  let summary
  if (cvAnalysis.status === 'suspicious') {
    summary = 'Candidature rejetée ou à faible priorité — le fichier joint ne semble pas être un CV.'
  } else if (cvAnalysis.status === 'missing') {
    summary = 'Candidature incomplète — aucun CV fourni.'
  } else if (cvAnalysis.status === 'valid') {
    summary = score >= 70
      ? 'Candidature prometteuse avec CV valide à traiter en priorité.'
      : score >= 40
        ? 'Candidature avec CV valide nécessitant une revue approfondie.'
        : 'CV valide mais profil peu convaincant pour le moment.'
  } else {
    summary = 'Candidature avec fichier ambigu — vérifier manuellement le document joint.'
  }

  return {
    ...finalizeScore({ score, summary, strengths, concerns }, cvAnalysis),
    source: 'rules',
    ai_enabled: false,
  }
}

export function cvStatusLabel(status) {
  return {
    valid: 'CV valide',
    suspicious: 'Fichier suspect',
    missing: 'Sans CV',
    unknown: 'Fichier ambigu',
  }[status] || status
}

export function cvStatusClass(status) {
  return {
    valid: 'admin-cv-status--valid',
    suspicious: 'admin-cv-status--suspicious',
    missing: 'admin-cv-status--missing',
    unknown: 'admin-cv-status--unknown',
  }[status] || ''
}

export function generateProductDescriptionFallback({ title, partner, categoryLabel, tabId, items = [] }) {
  const category = categoryLabel || tabId || 'laboratoire'
  const seoTitle = title && partner ? `${title} - ${partner}` : title
  const shortDesc =
    title && partner
      ? `Gamme ${title} de ${partner} pour applications ${category} professionnelles au Maroc.`
      : `Équipements ${category} de haute qualité distribués par Aqualab Technologie.`
  const seoDescription = shortDesc.slice(0, 155)
  const description = [
    `Aqualab Technologie propose la gamme ${title}${partner ? ` de la marque ${partner}` : ''}, adaptée aux exigences des laboratoires et industries au Maroc.`,
    "Nos experts vous accompagnent dans le choix, l'installation et la maintenance de vos équipements pour garantir des performances optimales.",
    items.length > 0 ? 'Découvrez ci-dessous les modèles disponibles avec leurs caractéristiques principales.' : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const generatedItems = items.map((item) => {
    const name = (item.name || '').trim()
    const existing = (item.details || '').trim()
    if (!name) return { details: '' }
    if (existing) return { details: existing }
    return {
      details: `${name} — solution ${category} de ${partner || 'référence'} intégrée à la gamme ${title}. Idéal pour les applications professionnelles exigeant précision et fiabilité.`,
    }
  })

  return {
    seo_title: seoTitle,
    seo_description: seoDescription,
    short_desc: shortDesc,
    description,
    items: generatedItems,
    source: 'template',
    ai_enabled: false,
  }
}

export function priorityLabel(priority) {
  return { high: 'Haute', medium: 'Moyenne', low: 'Basse' }[priority] || priority
}

export function priorityClass(priority) {
  return { high: 'admin-priority--high', medium: 'admin-priority--medium', low: 'admin-priority--low' }[priority] || ''
}
