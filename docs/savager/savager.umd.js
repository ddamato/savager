!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).Savager={})}(this,(function(e){"use strict";const t="window.svgInjectionManager && window.svgInjectionManager.replace(this)";class n{constructor(e,t){this._symbols={},this._options=Object.assign({},t),this.storeSymbols(e)}prepareAssets(e,n){const{externalUrl:r,inject:o,classNames:i,toElement:a}=n||this._options,c=i?`class="${[].concat(i).filter(Boolean).join(" ")}"`:"";let l=e=>e;a&&(l="function"==typeof a?a:s);const u=[].concat(e).reduce((function(e,n){const s={href:"#"+n};let i="internal";r&&(s.href=`${"string"==typeof r?r:""}${n}.svg`+s.href,i="external");let a="";o&&(a="<style>@keyframes nodeInserted { to { opacity: 1; } }</style>",s.style="animation: nodeInserted .1ms",s.onanimationstart=t,s.onerror=t);const l=`<svg ${[c,i].filter(Boolean).join(" ")}>${a}<use ${Object.entries(s).map(([e,t])=>`${e}="${t}"`).join(" ")}/></svg>`;return Object.assign(e,{[n]:l})}),{}),f=this._symbols;let m=Object.keys(u).reduce((function(e,t){return f&&f[t]?e+f[t].replace(/<\/?svg ?[^>]*>/gim,""):e}),"");const d=Object.entries(u).reduce((e,[t,n])=>Object.assign(e,{[t]:l(n)}),{});if(m&&!r){const{sheet:e}=function(e){const t="savager-"+Math.random().toString(36).substr(2,9);return{sheet:`<svg id="${t}" xmlns="http://www.w3.org/2000/svg" style="display:none;">${e}</svg>`}}(m);return{assets:d,sheet:l(e)}}return{assets:d}}storeSymbols(e){return this._symbols=Object.assign({},this._symbols,e),this}}function s(e){if("undefined"!=typeof document&&document.createElement){const t=document.createElement("template");return t.innerHTML=e,t.content}return e}function r(e,t){let n='xmlns="http://www.w3.org/2000/svg"';const s=e.replace(/(xmlns=.[^"']+)./gim,e=>(n=e,"")).replace(/(<\/?)svg/gim,"$1symbol").replace(/<symbol/,`<symbol id="${t}"`);return`<svg ${n}>${s}</svg>`.replace(/\r?\n|\r|/g,"").replace(/ {2,}/g," ")}const o=n;e.Savager=o,e.createSymbols=async function e(t){if(!t)return{};if("string"==typeof t){if("undefined"!=typeof window||!require)throw new Error("Can only create symbols using path within node environment.");const n=require("path"),s=require("fs");try{const r=await s.promises.readdir(t),o=await Promise.all(r.map(async e=>({[n.parse(e).name]:(await s.promises.readFile(n.resolve(t,e))).toString()})));return e(o.reduce((e,t)=>Object.assign(e,t),{}))}catch(e){throw new Error(e)}}return"object"==typeof t?Object.entries(t).reduce((e,[t,n])=>Object.assign(e,{[t]:r(n,t)}),{}):void 0},e.default=n,Object.defineProperty(e,"__esModule",{value:!0})}));
