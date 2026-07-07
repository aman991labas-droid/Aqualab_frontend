/**
 * Active link check — mirrors react-router NavLink behavior.
 */
export function isNavLinkActive(pathname, href, end = false) {
  if (end || href === '/') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}
