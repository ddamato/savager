var Savager=function(e){"use strict";const t=function(e){const t=document.getElementById(e);let r=document.getElementById("savager-mastersheet");r||(r=document.createElementNS("http://www.w3.org/2000/svg","svg"),r.id="savager-mastersheet",r.style.display="none",document.body.appendChild(r)),Array.prototype.slice.call(t.querySelectorAll("symbol")).forEach(e=>r.appendChild(e)),t.remove()}.toString();function r(e,t){for(var r=0,n=e.length-1;n>=0;n--){var s=e[n];"."===s?e.splice(n,1):".."===s?(e.splice(n,1),r++):r&&(e.splice(n,1),r--)}if(t)for(;r--;r)e.unshift("..");return e}var n=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,s=function(e){return n.exec(e).slice(1)};function o(){for(var e="",t=!1,n=arguments.length-1;n>=-1&&!t;n--){var s=n>=0?arguments[n]:"/";if("string"!=typeof s)throw new TypeError("Arguments to path.resolve must be strings");s&&(e=s+"/"+e,t="/"===s.charAt(0))}return(t?"/":"")+(e=r(c(e.split("/"),(function(e){return!!e})),!t).join("/"))||"."}function i(e){var t=a(e),n="/"===u(e,-1);return(e=r(c(e.split("/"),(function(e){return!!e})),!t).join("/"))||t||(e="."),e&&n&&(e+="/"),(t?"/":"")+e}function a(e){return"/"===e.charAt(0)}var l={extname:function(e){return s(e)[3]},basename:function(e,t){var r=s(e)[2];return t&&r.substr(-1*t.length)===t&&(r=r.substr(0,r.length-t.length)),r},dirname:function(e){var t=s(e),r=t[0],n=t[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},sep:"/",delimiter:":",relative:function(e,t){function r(e){for(var t=0;t<e.length&&""===e[t];t++);for(var r=e.length-1;r>=0&&""===e[r];r--);return t>r?[]:e.slice(t,r-t+1)}e=o(e).substr(1),t=o(t).substr(1);for(var n=r(e.split("/")),s=r(t.split("/")),i=Math.min(n.length,s.length),a=i,l=0;l<i;l++)if(n[l]!==s[l]){a=l;break}var c=[];for(l=a;l<n.length;l++)c.push("..");return(c=c.concat(s.slice(a))).join("/")},join:function(){var e=Array.prototype.slice.call(arguments,0);return i(c(e,(function(e,t){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e})).join("/"))},isAbsolute:a,normalize:i,resolve:o};function c(e,t){if(e.filter)return e.filter(t);for(var r=[],n=0;n<e.length;n++)t(e[n],n,e)&&r.push(e[n]);return r}var u="b"==="ab".substr(-1)?function(e,t,r){return e.substr(t,r)}:function(e,t,r){return t<0&&(t=e.length+t),e.substr(t,r)},p={};function f(e,t){const r=e.replace(/<\/?svg ?([^>]+)?>/i,"$1"),n=r.split(" ").filter(e=>!e.startsWith("xmlns")).unshift(`id="${t}"`);return`<svg xmlns="http://www.w3.org/2000/svg">${e.replace(r,"").replace(/(<\/?)svg/gim,"$1symbol").replace(/<symbol /i,"<symbol "+n.join(" "))}</svg>`}var m=Savager;return e.Savager=class{constructor(e,t){this._symbols={},this._externalUrl="";const{externalUrl:r}=t||{};this.storeSymbols(e).setExternalUrl(r)}prepareAssets(e,r){const{external:n,autoappend:s,consolidate:o,classNames:i}=r,a=`class="${[].concat(i).filter(Boolean).join(" ")}"`,l=[].concat(e).reduce((function(e,t){let r="#"+t,s="internal";n&&(r=`${this._externalUrl}${t}.svg`+r,s="external");const o=`<svg ${a} ${s}><use xlink:href="${r}"/></svg>`;return Object.assign(e,{[t]:o})}),{});let c=Object.keys(l).reduce((function(e,t){return Object.keys(this._symbols).length&&this._symbols[t]?e+this._symbols[t].replace(/<\/?svg ?[^>]*>/gim,""):e}),"");if(c){const{sheet:e,script:r}=function(e,r){const n="savager-"+Math.random().toString(36).substr(2,9),s=`(${t})('${n}')`,o=`<script type="text/javascript">${s}<\/script>`,i=`<svg id="${n}" xmlns="http://www.w3.org/2000/svg" style="display:none;" consolidate="false">${e}${o}</svg>`;return{sheet:!1===r?i.replace(o,""):i.replace('consolidate="false"',""),script:s}}(c,o);if("undefined"!=typeof document&&document.createElement&&s&&!n){!function(e,t){const r=document.createDocumentFragment(),n=document.createElement("template");if(n.innerHTML=e,r.appendChild(n.content),t){const e=document.createElement("script");e.setAttribute("autoappend",""),e.appendChild(document.createTextNode(t)),r.appendChild(e)}document.body.append(r)}(e,("boolean"!=typeof o||o)&&r)}return{assets:l,spritesheet:e}}return{assets:l}}storeSymbols(e){return this._symbols=Object.assign({},this._symbols,e),this}setExternalUrl(e){return e&&(this._externalUrl=e),this}},e.createSymbols=async function(e){if(!e)return{};if("string"==typeof e){if("undefined"!=typeof window)throw new Error("Can only create symbols using path within node environment.");try{const t=await p.promises.readdir(e),r=Promise.all(t.map(async e=>({[l.parse(e).name]:await p.promises.readFile(e)})));return createAssets(r)}catch(e){throw new Error(e)}}return"object"==typeof e?Object.entries(e).reduce((e,[t,r])=>Object.assign(e,{[t]:f(r,t)}),{}):void 0},e.default=m,e}({});
