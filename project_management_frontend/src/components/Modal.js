import React, { useEffect, useMemo, useRef } from 'react';

/**
 * Returns all tabbable descendants of a root element.
 * This intentionally covers common interactive elements; it's not exhaustive, but works well for this app.
 */
function getTabbables(root) {
  if (!root) return [];
  const nodes = root.querySelectorAll(
    [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')
  );
  return Array.from(nodes).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

// PUBLIC_INTERFACE
/**
 * Modal provides an accessible dialog with focus trapping and Escape/backdrop closing.
 * Styling is provided by existing `.modalBackdrop` / `.modal` classes in AppPages.css.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {string} props.ariaLabel - Accessible label for the dialog.
 * @param {Function} props.onClose - Close handler (Esc, backdrop click).
 * @param {React.ReactNode} props.children - Modal content (should include header/body/footer).
 * @returns {JSX.Element|null}
 */
function Modal({ open, ariaLabel, onClose, children }) {
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    // Save focus and lock body scroll
    lastActiveRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first tabbable (or dialog)
    const t = setTimeout(() => {
      const tabbables = getTabbables(dialogRef.current);
      const target = tabbables[0] || dialogRef.current;
      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    }, reduceMotion ? 0 : 10);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const tabbables = getTabbables(dialogRef.current);
      if (tabbables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === dialogRef.current) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;

      // Restore focus to previously active element if still present
      const lastActive = lastActiveRef.current;
      if (lastActive && typeof lastActive.focus === 'function') {
        lastActive.focus();
      }
    };
  }, [open, onClose, reduceMotion]);

  if (!open) return null;

  const onBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true" aria-label={ariaLabel} onMouseDown={onBackdropMouseDown}>
      <div className="modal" ref={dialogRef} tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
