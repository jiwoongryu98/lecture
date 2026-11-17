declare module 'virtual:slide-catalog' {
  const slides: readonly import('./presentation').SlideDefinition[];
  export default slides;
}
