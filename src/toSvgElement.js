let elem;
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