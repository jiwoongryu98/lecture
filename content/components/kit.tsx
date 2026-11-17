import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { references, type ReferenceName } from '../references';
import './kit.css';
export { reveal } from '../../src/presentation/slide';
export type { SlideProps } from '../../src/presentation/slide';

export function Heading({ eyebrow, children, subtitle }: { eyebrow: ReactNode; children: ReactNode; subtitle?: ReactNode }) {
  return <header className="industry-heading">
    <p className="industry-eyebrow">{eyebrow}</p>
    <h1 id="slide-title">{children}</h1>
    {subtitle && <p className="industry-subtitle">{subtitle}</p>}
  </header>;
}

export function ReferenceLink({ to, className = '', children, ...props }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: ReferenceName }) {
  return <a {...props} className={`reference-link ${className}`.trim()} href={references[to]}
    target="_blank" rel="noopener noreferrer" title={`${to} 공식 자료 · 새 탭에서 열기`}>{children}</a>;
}

export function Takeaway({ children }: { children: ReactNode }) {
  return <p className="industry-takeaway">{children}</p>;
}
