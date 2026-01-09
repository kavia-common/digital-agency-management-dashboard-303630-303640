import React, { useEffect, useRef } from 'react';
import { CheckCircle, Shield, Sparkles } from 'lucide-react';
import Icon from '../components/Icon';
import './AuthLayout.css';
import { getApiModeLabel } from '../services/api/mode';

// PUBLIC_INTERFACE
/**
 * AuthLayout renders the two-panel authentication layout.
 * Left panel: brand/marketing copy. Right panel: provided auth form content.
 * @param {Object} props
 * @param {string} props.title - Page title (e.g., "Welcome back")
 * @param {string} props.subtitle - Page subtitle
 * @param {React.ReactNode} props.children - Form panel content
 * @param {React.ReactNode} [props.footer] - Optional footer (links)
 * @returns {JSX.Element}
 */
function AuthLayout({ title, subtitle, children, footer }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let raf = 0;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / Math.max(1, rect.width);
      const dy = (e.clientY - cy) / Math.max(1, rect.height);

      const px = Math.max(-1, Math.min(1, dx)) * 10;
      const py = Math.max(-1, Math.min(1, dy)) * 10;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--parallax-x', `${px}px`);
        el.style.setProperty('--parallax-y', `${py}px`);
      });
    };

    const onLeave = () => {
      el.style.setProperty('--parallax-x', `0px`);
      el.style.setProperty('--parallax-y', `0px`);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="auth2-page" ref={rootRef}>
      {/* Background motion */}
      <div className="auth2-bg" aria-hidden="true">
        <div className="auth2-bgParallax">
          <div className="auth2-blob auth2-blob-1" />
          <div className="auth2-blob auth2-blob-2" />
          <div className="auth2-grid" />
        </div>
      </div>

      <div className="auth2-container">
        {/* Left: Brand panel */}
        <section className="auth2-panel auth2-panel-left" aria-label="Product highlights">
          <div className="auth2-brand">
            <div className="auth2-logo" aria-hidden="true">
              <span className="auth2-logo-mark" />
              <span className="auth2-logo-text">KAVIA</span>
            </div>

            <h1 className="auth2-brand-title">Manage projects. Delight clients.</h1>
            <p className="auth2-brand-subtitle">
              A modern dashboard for digital agencies — built for clarity, speed, and collaboration.
            </p>
          </div>

          <div className="auth2-benefits">
            <div className="auth2-benefit">
              <div className="auth2-benefit-icon">
                <Icon icon={CheckCircle} size={20} />
              </div>
              <div>
                <h3 className="auth2-benefit-title">Clear delivery cadence</h3>
                <p className="auth2-benefit-desc">Track milestones, tasks, and client deliverables in one place.</p>
              </div>
            </div>

            <div className="auth2-benefit">
              <div className="auth2-benefit-icon">
                <Icon icon={Shield} size={20} />
              </div>
              <div>
                <h3 className="auth2-benefit-title">Secure by default</h3>
                <p className="auth2-benefit-desc">Token-based sessions with secure, authenticated API access.</p>
              </div>
            </div>

            <div className="auth2-benefit">
              <div className="auth2-benefit-icon">
                <Icon icon={Sparkles} size={20} />
              </div>
              <div>
                <h3 className="auth2-benefit-title">Polished experience</h3>
                <p className="auth2-benefit-desc">Smooth transitions, crisp typography, and responsive layout.</p>
              </div>
            </div>
          </div>

          <div className="auth2-badge" aria-label="API mode">
            <span className="auth2-badge-dot" aria-hidden="true" />
            <span className="auth2-badge-text">{getApiModeLabel()}</span>
          </div>
        </section>

        {/* Right: Form panel */}
        <section className="auth2-panel auth2-panel-right" aria-label="Authentication form">
          <div className="auth2-formShell">
            <header className="auth2-formHeader">
              <h2 className="auth2-title">{title}</h2>
              {subtitle ? <p className="auth2-subtitle">{subtitle}</p> : null}
            </header>

            <div className="auth2-formBody">{children}</div>

            {footer ? <footer className="auth2-footer">{footer}</footer> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;
