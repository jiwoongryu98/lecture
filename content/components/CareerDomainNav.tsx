import './CareerDomainNav.css';

const domains = [
  { id: 'product', label: 'AI 제품·활용' },
  { id: 'model', label: 'AI 모델 개발' },
  { id: 'infra', label: 'AI 컴퓨팅·인프라' },
] as const;

export function CareerDomainNav({ active }: { active: typeof domains[number]['id'] }) {
  return <div className="career-domain-nav" role="group" aria-label="하고 싶은 일에 따라 준비할 경험" data-domain={active}>
    {domains.map(({ id, label }) => <span key={id} aria-current={id === active ? 'location' : undefined}>{label}</span>)}
  </div>;
}
