const e="window.svgInjectionManager && window.svgInjectionManager.replace(this)";class t{constructor(e,t){this._symbols={},this._options=Object.assign({},t),this.storeSymbols(e)}prepareAssets(t,n){const{externalUrl:r,inject:o,classNames:i,toElement:a}=n||this._options,c=i?`class="${[].concat(i).filter(Boolean).join(" ")}"`:"";let l=e=>e;a&&(l="function"==typeof a?a:s);const u=[].concat(t).reduce((function(t,s){const n={href:"#"+s};let i="internal";r&&(n.href=`${"string"==typeof r?r:""}${s}.svg`+n.href,i="external");let a="";o&&(a="<style>@keyframes nodeInserted { to { opacity: 1; } }</style>",n.style="animation: nodeInserted .1ms",n.onanimationstart=e,n.onerror=e);const l=`<svg ${[c,i].filter(Boolean).join(" ")}>${a}<use ${Object.entries(n).map(([e,t])=>`${e}="${t}"`).join(" ")}/></svg>`;return Object.assign(t,{[s]:l})}),{}),m=this._symbols;let g=Object.keys(u).reduce((function(e,t){return m&&m[t]?e+m[t].replace(/<\/?svg ?[^>]*>/gim,""):e}),"");const p=Object.entries(u).reduce((e,[t,s])=>Object.assign(e,{[t]:l(s)}),{});if(g&&!r){const{sheet:e}=function(e){const t="savager-"+Math.random().toString(36).substr(2,9);return{sheet:`<svg id="${t}" xmlns="http://www.w3.org/2000/svg" style="display:none;">${e}</svg>`}}(g);return{assets:p,sheet:l(e)}}return{assets:p}}storeSymbols(e){return this._symbols=Object.assign({},this._symbols,e),this}}function s(e){if("undefined"!=typeof document&&document.createElement){const t=document.createElement("template");return t.innerHTML=e,t.content}return e}async function n(e){if(!e)return{};if("string"==typeof e){if("undefined"!=typeof window||!require)throw new Error("Can only create symbols using path within node environment.");const t=require("path"),s=require("fs");try{const r=await s.promises.readdir(e),o=await Promise.all(r.map(async n=>({[t.parse(n).name]:(await s.promises.readFile(t.resolve(e,n))).toString()})));return n(o.reduce((e,t)=>Object.assign(e,t),{}))}catch(e){throw new Error(e)}}return"object"==typeof e?Object.entries(e).reduce((e,[t,s])=>Object.assign(e,{[t]:r(s,t)}),{}):void 0}function r(e,t){let s='xmlns="http://www.w3.org/2000/svg"';const n=e.replace(/(xmlns=.[^"']+)./gim,e=>(s=e,"")).replace(/(<\/?)svg/gim,"$1symbol").replace(/<symbol/,`<symbol id="${t}"`);return`<svg ${s}>${n}</svg>`.replace(/\r?\n|\r|/g,"").replace(/ {2,}/g," ")}const o=t;export default t;export{o as Savager,n as createSymbols};
