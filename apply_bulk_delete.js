const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/admin/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const skip = ['ProductsPage.jsx', 'ProductCategoriesPage.jsx', 'DashboardPage.jsx', 'LoginPage.jsx'];

for (const file of files) {
  if (skip.includes(file)) continue;

  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('DataTable')) continue;

  console.log('Processing', file);

  // 1. Add state
  if (!content.includes('deletingMultiple')) {
    content = content.replace(
      /const \[deleting, setDeleting\] = useState\(null\)/,
      `const [deleting, setDeleting] = useState(null)\n  const [deletingMultiple, setDeletingMultiple] = useState(false)\n  const [selectedIds, setSelectedIds] = useState([])`
    );
  }

  // 2. Add selection handlers
  if (!content.includes('const onSelect =')) {
    const handlerCode = `
  const onSelect = (id, checked) => {
    if (checked) setSelectedIds(prev => [...prev, id])
    else setSelectedIds(prev => prev.filter(i => i !== id))
  }

  const onSelectAll = (checked, currentRows) => {
    if (checked) {
      const newIds = currentRows.map(r => r.id).filter(id => !selectedIds.includes(id))
      setSelectedIds(prev => [...prev, ...newIds])
    } else {
      const rowIds = currentRows.map(r => r.id)
      setSelectedIds(prev => prev.filter(id => !rowIds.includes(id)))
    }
  }
`;
    // Insert before "const rows ="
    content = content.replace(/(\s*)(const rows = filtered\.slice)/, `$1${handlerCode}$1$2`);
  }

  // 3. Update delete function
  // Find delete function name and the service call
  // Match both `const deleteItem = async () => {` and `const remove = async () => {`
  const deleteFuncMatch = content.match(/const (deleteItem|remove) = async \(\) => \{\s*if \(!deleting\).*?\s*.*?set(Submitting|ActionLoading)\(true\)\s*try \{\s*(await [a-zA-Z]+\.delete[a-zA-Z]+\(.*?\))/s);

  if (deleteFuncMatch && !content.includes('if (deletingMultiple) {')) {
    const funcName = deleteFuncMatch[1];
    const setLoadingState = `set${deleteFuncMatch[2]}`;
    const serviceCall = deleteFuncMatch[3]; // e.g. await applicationService.deleteApplication(deleting.id)
    
    // Replace deleting.id with id
    const bulkServiceCall = serviceCall.replace(/deleting\.id/g, 'id');

    const newDeleteFunc = `const ${funcName} = async () => {
    if (!deleting && !deletingMultiple) return
    ${setLoadingState}(true)
    try {
      if (deletingMultiple) {
        for (const id of selectedIds) {
          ${bulkServiceCall}
        }
        Toast.success('Éléments supprimés.')
        setDeletingMultiple(false)
        setSelectedIds([])
      } else {
        ${serviceCall}
        Toast.success('Élément supprimé.')
        setDeleting(null)
      }
      load()`;
      
    content = content.replace(deleteFuncMatch[0], newDeleteFunc);
  }

  // 4. Add UI elements
  // The button
  if (!content.includes('Supprimer la sélection')) {
    const buttonHtml = `
      {selectedIds.length > 0 && (
        <div className="admin-actions" style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={() => setDeletingMultiple(true)}>
            Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {rows.length === 0 ? (`;
    content = content.replace(/\{\s*rows\.length === 0 \? \(/, buttonHtml);
  }

  // Update DataTable props
  if (!content.includes('selectable')) {
    content = content.replace(
      /<DataTable\s+columns=\{\[/,
      `<DataTable\n            selectable\n            selectedIds={selectedIds}\n            onSelect={onSelect}\n            onSelectAll={onSelectAll}\n            columns={[`
    );
  }

  // Update ConfirmationDialog
  if (!content.includes('deletingMultiple ?')) {
    content = content.replace(
      /<ConfirmationDialog\s*open=\{\!\!deleting\}\s*title="(.*?)"\s*message=\{deleting \? (.*?) : ''\}\s*onCancel=\{\(\) => setDeleting\(null\)\}/,
      `<ConfirmationDialog
        open={!!deleting || deletingMultiple}
        title={deletingMultiple ? "Supprimer la sélection ?" : "$1"}
        message={deletingMultiple ? \`Cette action supprimera \${selectedIds.length} élément(s).\` : (deleting ? $2 : '')}
        onCancel={() => { setDeleting(null); setDeletingMultiple(false); }}`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', file);
}
