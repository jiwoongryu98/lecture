export interface SlideMetadata {
  id: string;
  title: string;
  section: string;
  subsection?: string;
  maxStep: number;
}
export interface SlideDefinition extends SlideMetadata { number: string }

export interface Position { index: number; step: number }

// Shared links retain their original indices, with the removed second slide reserved.
const removedSlideIndex = 2;

export function toLinkIndex(index: number) {
  return index < removedSlideIndex ? index : index + 1;
}

export function createDeckRules(slides: readonly SlideDefinition[]) {
  if (!slides.length) throw new Error('A presentation requires at least one slide');
  const initialPosition: Position = { index: 1, step: 0 };

  function isPosition(value: unknown): value is Position {
    if (!value || typeof value !== 'object') return false;
    const p = value as Record<string, unknown>;
    const slide = typeof p.index === 'number' && Number.isSafeInteger(p.index) ? slides[p.index - 1] : undefined;
    return !!slide && typeof p.step === 'number' && Number.isInteger(p.step)
      && p.step >= 0 && p.step <= slide.maxStep;
  }

  function move(position: Position, direction: 1 | -1): Position {
    const index = position.index - 1;
    const slide = slides[index];
    if (direction === 1) {
      if (position.step < slide.maxStep) return { ...position, step: position.step + 1 };
      return index < slides.length - 1 ? { index: index + 2, step: 0 } : position;
    }
    if (position.step > 0) return { ...position, step: position.step - 1 };
    return index > 0 ? { index: index, step: slides[index - 1].maxStep } : position;
  }

  function positionFromSearch(search: string): Position {
    const params = new URLSearchParams(search);
    const rawIndex = params.get('index');
    const linkIndex = rawIndex !== null && /^\d+$/.test(rawIndex) ? Number(rawIndex) : 0;
    if (linkIndex === removedSlideIndex && slides.length >= removedSlideIndex) {
      return { index: removedSlideIndex, step: 0 };
    }
    const index = linkIndex > removedSlideIndex ? linkIndex - 1 : linkIndex;
    const position = { index, step: Number(params.get('step') ?? 0) };
    return isPosition(position) ? position : initialPosition;
  }

  return { initialPosition, isPosition, move, positionFromSearch };
}

export function groupSections(slides: readonly SlideDefinition[]) {
  const groups: { title: string; slides: SlideDefinition[] }[] = [];
  for (const slide of slides) {
    const previous = groups.at(-1);
    if (previous?.title === slide.section) previous.slides.push(slide);
    else groups.push({ title: slide.section, slides: [slide] });
  }
  return groups;
}
