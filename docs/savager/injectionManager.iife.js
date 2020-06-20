(function(){"use strict";return function(){class e{constructor(){this._registrar={}}get(e){return this._registrar[e]}replace(e){const{url:t,exposure:r,id:n}=this._parseNode(e);if(this.get(n))return Promise.resolve(this._replace(e,n));if("internal"===r){return e.getRootNode().getElementById(n)?Promise.resolve("Reference found in root, replacement halted."):this._embedInternal(e,{id:n})}return"external"===r?this._embedExternal(e,{id:n,url:t}):Promise.reject("Could not find asset reference. Ensure the reference sheet or external url exist before executing this script")}_replace(e,t){const r=this.get(t).cloneNode(!0),n=e.parentNode;return n.setAttribute("replace",""),n.removeAttribute("onerror"),n.removeAttribute("onanimationstart"),this._assignClone(r,n),e.remove(),n}_assignClone(e,t){[...e.attributes].forEach(({name:e,value:r})=>{!t.hasAttribute(e)&&t.setAttribute(e,r)}),[...e.children].forEach(e=>{!t.querySelector(e.tagName)&&t.appendChild(e)})}register(e,t,r){return this._registrar[t]=r,this._replace(e,t)}_embedInternal(e,{id:t}){const r=document.getElementById(t);if(r){const n=r.cloneNode(!0);return Promise.resolve(this.register(e,t,this._transformSymbol(n)))}return Promise.reject(`Symbol '${t}' not found in document.`)}_embedExternal(e,{id:t,url:r}){return window.fetch(r).then(e=>e.text()).then(r=>{const n=(new DOMParser).parseFromString(r,"image/svg+xml").querySelector("symbol");if(n)return this.register(e,t,this._transformSymbol(n));throw new Error("Malformed external reference, please ensure <symbol/> assets.")}).catch(e=>console.error(e))}_parseNode(e){const t=e.getAttribute("href");if(!t)return{};const[r,n]=t.split("#");let s=e.getAttribute("exposure");return s||(s=r?"external":"internal"),{url:t,exposure:s,id:n}}_transformSymbol(e){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.children&&[...e.children].forEach(e=>t.appendChild(e)),e.hasAttributes()&&[...e.attributes].forEach(({name:e,value:r})=>t.setAttribute(e,r)),t}}"undefined"!=typeof window&&(window.svgInjectionManager=new e)}}())();