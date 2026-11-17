import './ProductUsageNav.css';

type ProductUsageRoute = 'product' | 'tool' | 'api';

const routes: { id: ProductUsageRoute; label: string }[] = [
  { id: 'product', label: '완성된 제품' },
  { id: 'tool', label: '작업 도구' },
  { id: 'api', label: 'API 연결' },
];

/** A presentation locator, not an interactive navigation control. */
export function ProductUsageNav({ active }: { active?: ProductUsageRoute }) {
  return <div className="product-usage-nav" role="group" aria-label="AI를 활용하는 세 가지 방식">
    {routes.map(({ id, label }) => <span key={id}
      className={id === active ? 'product-usage-current' : undefined}
      aria-current={id === active ? 'location' : undefined}>
      {label}
    </span>)}
  </div>;
}
