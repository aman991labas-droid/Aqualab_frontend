'use client'

import { ArrowDownUp } from 'lucide-react'

export default function DataTable({ columns, rows, sortKey, sortDir, onSort, actions }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
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
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
              ))}
              {actions && <td className="admin-table__actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

