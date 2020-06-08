var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var t=function(e,t,r){return e(r={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&r.path)}},r.exports),r.exports}((function(t){var r,n;r=e,n=function(){function e(e){var t=[];if(0===e.length)return"";if("string"!=typeof e[0])throw new TypeError("Url must be a string. Received "+e[0]);if(e[0].match(/^[^/:]+:\/*$/)&&e.length>1){var r=e.shift();e[0]=r+e[0]}e[0].match(/^file:\/\/\//)?e[0]=e[0].replace(/^([^/:]+):\/*/,"$1:///"):e[0]=e[0].replace(/^([^/:]+):\/*/,"$1://");for(var n=0;n<e.length;n++){var s=e[n];if("string"!=typeof s)throw new TypeError("Url must be a string. Received "+s);""!==s&&(n>0&&(s=s.replace(/^[\/]+/,"")),s=n<e.length-1?s.replace(/[\/]+$/,""):s.replace(/[\/]+$/,"/"),t.push(s))}var o=t.join("/"),i=(o=o.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return o=i.shift()+(i.length>0?"?":"")+i.join("&")}return function(){return e("object"==typeof arguments[0]?arguments[0]:[].slice.call(arguments))}},t.exports?t.exports=n():r.urljoin=n()}));class r{constructor(){this._registrar={}}get(e){return this._registrar[e]}replace(e){const{url:t,exposure:r,id:n}=this._parseNode(e);if(this.get(n))return Promise.resolve(this._replace(e,n));if("internal"===r){const t=e.getRootNode();if(t.getElementById(n))return Promise.resolve("Reference found in root, replacement halted.");if(e.getRootNode({composed:!0})!==t)return this._embedInternal(e,{id:n})}return"external"===r?this._embedExternal(e,{id:n,url:t}):Promise.reject("Could not find asset reference. Ensure the reference sheet or external url exist before executing this script")}_replace(e,t){const r=this.get(t);if(r){const t=r.cloneNode(!0);t.removeAttribute("id"),t.setAttribute("replaced","");const n=e.parentNode;return n.hasAttributes()&&[...n.attributes].forEach(({name:e,value:r})=>t.setAttribute(e,r)),n.replaceWith(t),t}}register(e,t,r){return this._registrar[t]=r,this._replace(e,t)}_embedInternal(e,{id:t}){const r=document.getElementById(t);if(r){const n=r.cloneNode(!0);return Promise.resolve(this.register(e,t,this._transformSymbol(n)))}return Promise.reject(`Symbol "${t}" not found in document.`)}_embedExternal(e,{id:t,url:r}){return fetch(r).then(e=>e.text()).then(r=>{const n=(new DOMParser).parseFromString(r,"image/svg+xml").querySelector("symbol");if(n)return this.register(e,t,this._transformSymbol(n));throw new Error("Malformed external reference, please ensure '<symbol/>' assets.")}).catch(e=>console.error(e))}_parseNode(e){const t=e.getAttribute("href"),[r,n]=t.split("#");let s=e.getAttribute("exposure");return s||(s=Boolean(r)?"external":"internal"),{url:t,exposure:s,id:n}}_transformSymbol(e){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return e.children&&[...e.children].forEach(e=>t.appendChild(e)),e.hasAttributes()&&[...e.attributes].forEach(({name:e,value:r})=>t.setAttribute(e,r)),t}}const n="window.svgInjectionManager && window.svgInjectionManager.replace(this)",s=()=>{if("undefined"!=typeof window)return window.svgInjectionManager=new r,window.svgInjectionManager};class o{constructor(e,t){this._symbols={},this._options=Object.assign({},t),this.storeSymbols(e)}prepareAssets(e,r){const{externalUrl:o,inject:c,classNames:l,toElement:u}=r||this._options,p={xmlns:"http://www.w3.org/2000/svg"},f={inject:c?s:Function.prototype};l&&(p.class=[].concat(l).filter(Boolean).join(" "));let d=e=>e;u&&(d="function"==typeof u?u:a);const g=[].concat(e).reduce((function(e,r){const s=Object.assign({exposure:"internal"},p),a={href:"#"+r};if(o){s.exposure="external";const e="string"==typeof o?o:"";a.href=t(e,r+".svg",a.href)}let l="";c&&(l="<style>@keyframes nodeInserted { to { opacity: 1; } }</style>",a.style="animation: nodeInserted .1ms",a.onanimationstart=n,a.onerror=n);const u=`<svg ${i(s)}>${l}<use ${i(a)}/></svg>`;return Object.assign(e,{[r]:u})}),{}),m=this._symbols;let h=Object.keys(g).reduce((function(e,t){return m&&m[t]?e+m[t].replace(/<\/?svg ?[^>]*>/gim,""):e}),"");if(f.assets=Object.entries(g).reduce((function(e,[t,r]){return Object.assign(e,{[t]:d(r)})}),{}),h&&!o){const{sheet:e}=function(e){const t="savager-"+Math.random().toString(36).substr(2,9);return{sheet:`<svg id="${t}" xmlns="http://www.w3.org/2000/svg" style="display:none;">${e}</svg>`}}(h);f.sheet=d(e)}return f}storeSymbols(e){return this._symbols=Object.assign({},this._symbols,e),this}}function i(e){return Object.entries(e).map(([e,t])=>`${e}="${t}"`).join(" ")}function a(e){if("undefined"!=typeof document&&document.createElement){const t=document.createElement("template");return t.innerHTML=e,t.content}return e}async function c(e){if(!e)return{};if("string"==typeof e){if("undefined"!=typeof window||!require)throw new Error("Can only create symbols using path within node environment.");const t=require("path"),r=require("fs");try{const n=await r.promises.readdir(e),s=await Promise.all(n.map(async n=>({[t.parse(n).name]:(await r.promises.readFile(t.resolve(e,n))).toString()})));return c(s.reduce((e,t)=>Object.assign(e,t),{}))}catch(e){throw new Error(e)}}return"object"==typeof e?Object.entries(e).reduce((e,[t,r])=>Object.assign(e,{[t]:l(r,t)}),{}):void 0}function l(e,t){let r='xmlns="http://www.w3.org/2000/svg"';const n=e.replace(/(xmlns=.[^"']+)./gim,e=>(r=e,"")).replace(/(<\/?)svg/gim,"$1symbol").replace(/<symbol/,`<symbol id="${t}"`);return`<svg ${r}>${n}</svg>`.replace(/\r?\n|\r|/g,"").replace(/ {2,}/g," ")}const u=o;export default o;export{u as Savager,c as createSymbols};
