/**
 * Converts markdown-like article content to HTML.
 * Laravel: replace with sanitized HTML from API when available.
 */
export function renderArticleContent(content) {
    return content
        .trim()
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>(\n|$))+/g, m => `<ul>${m}</ul>`)
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|l])/gm, '')
        .replace(/<p><\/p>/g, '')
}
