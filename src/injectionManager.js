
function internalDectection(root) {
  if (root !== useNode.getRootNode({ composed:true })) {
    internalInjection(useNode);
  }
}

function internalInjection(useNode) {
  const { manager } = window;
  const { id } = parseHref(useNode);

  if (manager.isRegistered(id)) {
    manager.replace(useNode, id);
    return;
  }

  const symbolReference = document.getElementById(id);
  if (symbolReference) {
    const symbol = symbolReference.cloneNode(true);
    manager.register(useNode, id, transformSymbol(symbol));
  } else {
    console.error(`Symbol (${id}) not found in document`);
  }
}

// Node is found from use.addEventListener('error', (ev) => { ev.target })
function externalDectection(root) {
  root.addEventListener('error', (ev) => {
    if (ev.target.tagName.toLowerCase() === 'use') {
      externalInjection(ev.target);
    }
  })
}

function externalInjection(useNode) {
  const { manager } = window;
  const { url, id } = parseHref(useNode);

  if (manager.isRegistered(id)) {
    manager.replace(useNode, id);
    return;
  }
  
  fetch(url).then((res) => res.text()).then((text) => {
    const symbol = new DOMParser().parseFromString(text, 'image/svg+xml');
    manager.register(useNode, id, transformSymbol(symbol));
  }).catch((err) => console.error(err));
}

function transformSymbol(symbol) {
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.append(symbol.children);
  symbol.hasAttributes() && [...symbol.attributes].forEach(({ name, value }) => svg.setAttribute(name, value));
  return svg;
}

function parseHref(useNode) {
  const url = useNode.getAttribute('xlink:href');
  return { url, id: url.split('#')[1] };
}