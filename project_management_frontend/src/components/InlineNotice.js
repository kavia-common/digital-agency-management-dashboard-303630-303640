import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Icon from './Icon';
import Button from './Button';
import './InlineNotice.css';

// PUBLIC_INTERFACE
/**
 * InlineNotice shows a friendly error/info banner with optional retry action.
 * @param {{ title?: string, message: string, onRetry?: Function, variant?: 'error'|'info' }} props
 * @returns {JSX.Element|null}
 */
function InlineNotice({ title, message, onRetry, variant = 'error' }) {
  if (!message) return null;

  return (
    <div className={`inlineNotice inlineNotice-${variant}`} role="status" aria-live="polite">
      <div className="inlineNotice-icon" aria-hidden="true">
        <Icon icon={AlertTriangle} size={18} />
      </div>
      <div className="inlineNotice-body">
        {title ? <div className="inlineNotice-title">{title}</div> : null}
        <div className="inlineNotice-message">{message}</div>
      </div>
      {onRetry ? (
        <div className="inlineNotice-actions">
          <Button variant="outline" size="sm" onClick={onRetry}>
            <Icon icon={RefreshCw} size={16} />
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default InlineNotice;
