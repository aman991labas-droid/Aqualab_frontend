'use client'

import { ArrowDownUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DataTable({ columns, rows, sortKey, sortDir, onSort, actions, selectable, selectedIds = [], onSelect, onSelectAll, allSelectableRows }) {
  const selectScope = allSelectableRows ?? rows
  const allSelected = selectScope.length > 0 && selectScope.every((row) => selectedIds.includes(row.id))
  const someSelected = selectScope.some((row) => selectedIds.includes(row.id))

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked, selectScope)}
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key}>
                {col.sortable ? (
                  <button className="admin-sort" onClick={() => onSort(col.key)}>
                    {col.label}
                    <ArrowDownUp size={14} />
                    {sortKey === col.key ? ` (${sortDir})` : ''}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {rows.map((row) => (
              <motion.tr
                key={row.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {selectable && (
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) => onSelect && onSelect(row.id, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                ))}
                {actions && <td className="admin-table__actions">{actions(row)}</td>}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

