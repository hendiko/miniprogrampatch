// miniprogrampatch v1.1.11 Thu May 09 2019  
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.miniprogrampatch=e():t.miniprogrampatch=e()}("undefined"!=typeof self?self:this,function(){return function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";var a=n(1),r=n(8);t.exports={patchComponent:r.patchComponent,patchPage:a.patchPage}},function(t,e,n){"use strict";e.__esModule=!0,e.patchPage=function(t,e){if(t.__patchPage)return t;var n=!1,u=(e||{}).debug,c=function(e){(e=Object.assign({},e)).__computed=(0,a.initializeComputed)(e.computed||{});var c=e,s=c.onLoad,f=c.watch;return e.onLoad=function(t){if(!this.$setData){this.__setData=this.setData,this.$setData=this.updateData=function(t,e){return(0,r.default)(t,e,{ctx:this})};var e=(0,a.evaluateComputed)(this,null,{initial:!0});this.__setData(e),this.__watch=(0,o.initializeWatchers)(this,f||{});try{n||(this.setData=this.$setData)}catch(t){n=!0,u&&(console.log(t),console.log("using this.$setData instead of this.setData to support watch and computed features."))}}(0,i.isFunction)(s)&&s.call(this,t)},t(e)};return c.__patchPage=!0,c};var a=n(2),r=function(t){return t&&t.__esModule?t:{default:t}}(n(6)),i=n(3),o=n(7)},function(t,e,n){"use strict";e.__esModule=!0,e.initializeComputed=function(t){var e=[],n=void 0,r=void 0;for(n in t)if(r=t[n],(0,a.isFunction)(r))e.push({name:n,require:[],fn:r});else if((0,a.isObject)(r)){var i=r,u=i.require,c=void 0===u?[]:u,s=i.fn;(0,a.isFunction)(s)&&e.push({name:n,require:c,fn:s})}e.length>1&&(e=function(t){var e=[],n=void 0,a=void 0,r=void 0,i=void 0,u=void 0,c=void 0;for(;t.length;){for(r in n=t.pop(),a=!1,e)if(o(e[r],n)){for(u in i=e.splice(r,e.length-r,n),n.require)(c=i.findIndex(function(t){return t.name===n.require[u]}))>-1&&t.push(i.splice(c,1)[0]);e=e.concat(i),a=!0;break}a||e.push(n)}return e}(e));return e},e.evaluateComputed=function(t,e,n){var o=(n||{}).initial,u={},c=t.__computed,s=void 0;if(c&&c.length)if(o)for(var f in c){var l=c[f],h=l.fn,d=l.require,p=l.name;s=d.reduce(function(e,n){var a=(0,r.getValueOfPath)(t.data,n),i=a.key,o=a.value;return e[n]=i?o:(0,r.getValueOfPath)(u,n).value,e},{}),u[p]=h.call(t,s)}else{var v=Object.keys(e);if(v.length){var _={},g=v.map(function(t){return _[t]=(0,i.pathToArray)(t)});for(var y in c){var m=c[y],h=m.fn,d=m.require,p=m.name;d.length&&function(){var e=!1,n=void 0,o=void 0;for(var c in d)if(n=d[c],o=_[n]||(_[n]=(0,i.pathToArray)(n)),~g.findIndex(function(t){return(0,a.hasIntersection)(o,t)})){g.push(_[p]||(_[p]=(0,i.pathToArray)(p))),e=!0;break}e&&(s=d.reduce(function(e,n){var a=(0,r.getValueOfPath)(u,n),i=a.key,o=a.value;return e[n]=i?o:(0,r.getValueOfPath)(t.__data||t.data,n).value,e},{}),u[p]=h.call(t,s))}()}}}return u};var a=n(3),r=n(4),i=n(5);function o(t,e){for(var n=e.name,a=0;a<t.require.length;a++)if((0,i.isSameRootOfPath)(t.require[a],n))return!0;return!1}},function(t,e,n){"use strict";e.__esModule=!0;var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.hasIntersection=function(t,e){return t[0]===e[0]};e.isObject=function(t){return null!==t&&"object"===(void 0===t?"undefined":a(t))},e.isFunction=function(t){return"function"==typeof t},e.isArray=function(t){return t&&t.constructor===Array}},function(t,e,n){"use strict";e.__esModule=!0,e.getValueOfPath=function(t,e){if(e+="",t.hasOwnProperty(e))return{key:!0,value:t[e],path:e};var n=(0,r.default)(e);e=(0,a.compactPath)((0,a.composePath)(n));var o=void 0,u=void 0,c=void 0;for(u=0;u<n.length;u++){if(c=n[u],!(0,i.isObject)(t)||!t.hasOwnProperty(c.key))return{key:!1,path:e};o=t[c.key],t=o}return{key:!0,value:o,path:e}},e.setValueOfPath=function(t,e,n){for(var a=(0,r.default)(e+""),i=void 0,u=void 0,c=0;c<a.length;c++){var s=a[c],f=s.key,l=s.type;o(t)!==l&&(t=i[u]=1===l?[]:{}),t=(i=t)[f],u=f}i[u]=n};var a=n(5),r=function(t){return t&&t.__esModule?t:{default:t}}(a),i=n(3);var o=function(t){return(0,i.isArray)(t)?1:(0,i.isObject)(t)?0:-1}},function(t,e,n){"use strict";function a(t,e){var n=void 0;switch(t){case 0:n="There should be digits inside [] in the path string";break;case 1:n="The path string should not start with []";break;default:n="Unknown error occurred when parsing path"}return new Error("[miniprogrampatch] "+n+": "+e)}e.__esModule=!0,e.default=p,e.isSameRootOfPath=function(t,e){return p(t)[0].key===p(e)[0].key},e.pathToArray=function(t){return p(t).map(function(t){return t.key})},e.formatPath=function(t){return _(v(p(t)))};var r=function(t){return!/^[^\[]*\]/.test(t)},i=function(t){return!t.startsWith("[")},o=function(t){return!/(.+)\[[^\]]+$/g.test(t)},u=function(t){return!/\[\]/.test(t)},c=function(t){return t.replace(/\.+/g,".")},s=function(t){return/^\.*(.*?)\.*$/g.exec(t)[1]},f=function(t){return t.replace(/\[[\[\.\d]*$/g,"")},l=function(t){return t.replace(/\s+/g," ")},h=function(t){return(t.match(/\]/g)||[]).length};function d(t){var e=s(t).split("."),n=[],a=void 0,r=void 0,i=void 0,o=void 0;for(i=0;i<e.length;i++){for(a=e[i],r=h(a),o=0;o<r;o++)n.push({type:1,key:0});(a=l(a.replace(/\]/g,"")))&&n.push({type:0,key:a})}return n}function p(t){return function t(e){var n=[];if(e){var r=e.startsWith("["),i=/^(\[[^\]]*\])|([^\[]+)/g.exec(e)[r?1:2],o=[];if(i.length<e.length&&(o=t(e.slice(i.length))),r){var u=/^\[([\d\.\[]+)\]/g.exec(i);if(!u)throw new a(0,e);var c=(u=u[1]).length+2;if(!(u=u.replace(/\.|\[/g,"")))throw new a(0,e);if(u*=1,isNaN(u))throw new a(0,e);n.push({type:1,key:u}),c<i.length&&(n=n.concat(d(i.slice(c))))}else n=d(i);return n.concat(o)}return n}(function(t){t=[c,l,s,f].reduce(function(t,e){return e(t)},t);for(var e=[r,i,o,u],n=0;n<e.length;n++)if(!e[n](t))throw new a(1===n?1:0,t);return t}(t))}var v=e.composePath=function(t){return t.map(function(t){return 0===t.type?t.key:"["+t.key+"]"}).join(".")},_=e.compactPath=function(t){return t.replace(/\.\[/g,"[").replace(/\]\./g,"]")}},function(t,e,n){"use strict";e.__esModule=!0;var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t};e.default=function(t,e,n){if(!(0,r.isObject)(t))return;var s=n.ctx,f=n.initial,l=s.__changing;s.__changing=!0,l||(s.__data=a({},s.data),s.__changed={},s.__unchanged={});for(var h=Object.keys(t),d={},p=void 0,v=void 0,_=void 0,g=0;g<h.length;g++)_=h[g],p=(0,u.getValueOfPath)(s.__data,_).value,v=t[_],p!==v?d[_]=v:s.__unchanged[_]=v;Object.assign(s.__changed,d),c(s.__data,t);var y=(0,i.evaluateComputed)(s,d,{initial:f});if(Object.assign(s.__changed,y),c(s.__data,y),l)return s.__data;var m={};for(var b in s.__changed){var O=(0,u.getValueOfPath)(s.__data,b),P=O.key,j=O.value;P&&(m[b]=j)}var D=Object.assign(s.__unchanged,m);s.__changing=!1,s.__data=null,s.__changed=null,s.__unchanged=null,s.__setData(D,e),(0,o.default)(s,m)};var r=n(3),i=n(2),o=function(t){return t&&t.__esModule?t:{default:t}}(n(7)),u=n(4);function c(t,e){for(var n in e)(0,u.setValueOfPath)(t,n,e[n])}},function(t,e,n){"use strict";e.__esModule=!0,e.initializeWatchers=function(t,e){var n={},o=void 0,u=void 0;for(u in e)o=e[u],(0,a.isFunction)(o)&&(n[u]={cb:o,value:(0,r.getValueOfPath)(t.data,u).value,path:(0,i.pathToArray)(u)});return n},e.default=function(t,e){var n=t.__watch,o=n?Object.keys(n):[],u=Object.keys(e),c={},s=void 0;if(o.length&&u.length){var f=function(o){var u=s=n[o],f=u.cb,l=u.value,h=u.path;for(var d in e)(0,a.hasIntersection)(h,c[d]||(c[d]=(0,i.pathToArray)(d)))&&function(){var e=(0,r.getValueOfPath)(t.data,o).value;e!==l&&(s.value=e,setTimeout(function(){return f.call(t,e,l)}))}()};for(var l in n)f(l)}};var a=n(3),r=n(4),i=n(5)},function(t,e,n){"use strict";e.__esModule=!0,e.patchComponent=function(t,e){if(t.__patchComponent)return t;var n=!1,c=(e||{}).debug,s=function(e){(e=Object.assign({},e)).properties=function(t){var e=function(e){var n=t[e];((0,i.isFunction)(n)||null===n)&&(n=t[e]={type:n});var r=n,o=r.observer;n.observer=function(t,n,r){var c,s,f=(0,a.evaluateComputed)(this,((c={})[e]=t,c));Object.keys(f).length&&this.$setData(f),(0,u.default)(this,((s={})[e]=t,s)),(0,i.isFunction)(o)&&o.call(this,t,n,r)}};for(var n in t)e(n);return t}(e.properties||{});var s=e,f=s.attached,l=s.created,h=s.watch,d=s.lifetimes;(0,i.isObject)(d)&&(d.hasOwnProperty("attached")&&(f=d.attached),d.hasOwnProperty("created")&&(l=d.created));var p=function(){this.$setData||(this.$setData=this.updateData=function(){return this.setData.apply(this,arguments)}),(0,i.isFunction)(l)&&l.apply(this,arguments)},v=function(){if(!this.$setData||!this.$setData.__attached){this.__setData=this.setData,this.$setData=this.updateData=function(t,e){return(0,r.default)(t,e,{ctx:this})},this.$setData.__attached=!0,this.__computed=(0,a.initializeComputed)(e.computed||{});var t=(0,a.evaluateComputed)(this,null,{initial:!0});this.__setData(t),this.__watch=(0,o.initializeWatchers)(this,h||{});try{n||(this.setData=this.$setData)}catch(t){n=!0,c&&(console.log(t),console.log("using this.$setData instead of this.setData to support watch and computed features."))}}(0,i.isFunction)(f)&&f.apply(this,arguments)};return e.lifetimes?(e.lifetimes.attached=v,e.lifetimes.created=p):(e.attached=v,e.created=p),t(e)};return s.__patchComponent=!0,s};var a=n(2),r=c(n(6)),i=n(3),o=n(7),u=c(o);function c(t){return t&&t.__esModule?t:{default:t}}}])});