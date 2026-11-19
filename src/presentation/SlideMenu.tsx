import { groupSections } from '../../shared/presentation';
import { useDeck } from './Deck';

export function SlideMenu({ expanded, index, onSelect, onClose }: {
  expanded: boolean; index: number; onSelect: (index: number) => void; onClose: () => void;
}) {
  const { slides } = useDeck();
  const sections = groupSections(slides);
  const numbers = new Map(slides.map((slide, index) => [slide.id, String(index + 1).padStart(2, '0')]));

  return <nav id="slide-menu" className="slide-menu" aria-label="슬라이드 목차" hidden={!expanded}>
    <div className="panel-heading"><h2>목차</h2><button onClick={onClose} aria-label="목차 닫기">×</button></div>
    {sections.map((section) => <section className="menu-section" key={section.title}>
      <h3><button onClick={() => onSelect(Number(section.slides[0].number))}>{section.title}</button></h3>
      <ol>{section.slides.map((slide, offset) => {
        const subsection = slide.subsection;
        const previous = section.slides[offset - 1]?.subsection;
        return <li key={slide.id}>
          {subsection && subsection !== previous && <button className="menu-subsection"
            onClick={() => onSelect(Number(slide.number))}>{subsection}</button>}
          <button className="menu-slide"
            aria-current={Number(slide.number) === index ? 'page' : undefined} onClick={() => onSelect(Number(slide.number))}>
            <span className="menu-number">{numbers.get(slide.id)}</span><span>{slide.title}</span>
          </button>
        </li>;
      })}</ol>
    </section>)}
  </nav>;
}
