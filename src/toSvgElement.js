let elem;
/**
 * The default function to create SVG DOM nodes as DocumentFragments
 * @param {String} svgString - SVG markup as a string
 * @returns {DocumentFragment} - A DocumentFragment for use in appendChild calls
 */
function toSvgElementFn(svgString) {
  if (typeof document !== 'undefined' && document.createElement) {
    if (!elem) {
      elem = document.createElement('div');
    }
    elem.innerHTML = svgString;
    const frag = document.createDocumentFragment();
    [...elem.children].forEach((child) => frag.appendChild(child));
    return frag;
  }
  return svgString;
}

export default toSvgElementFn;