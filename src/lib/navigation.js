/** Shared navigation links — single source of truth for Navbar & Footer */

export const mainNavLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Produits', path: '/produits' },
  { label: 'À Propos', path: '/a-propos' },
  { label: 'Actualités', path: '/actualites' },
  { label: 'Recrutement', path: '/recrutement' },
]

export const footerNavLinks = [
  ...mainNavLinks,
  { label: 'Contact', path: '/contact' },
]
