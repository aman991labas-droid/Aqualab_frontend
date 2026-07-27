'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, title, onClose, children, width = '680px' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="admin-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            className="admin-modal"
            style={{ maxWidth: width }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="admin-modal__head">
              <h3>{title}</h3>
              <button onClick={onClose} aria-label="Fermer">
                ×
              </button>
            </div>
            <div className="admin-modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

