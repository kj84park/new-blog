!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.lunr=t():e.lunr=t()}(this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,n){var i,r;!function(){var o=function(e){var t=new o.Index;return t.pipeline.add(o.trimmer,o.stopWordFilter,o.stemmer),e&&e.call(t,t),t};o.version="0.7.2",/*!
 * lunr.utils
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.utils={},o.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),o.utils.asString=function(e){return void 0===e||null===e?"":e.toString()},/*!
 * lunr.EventEmitter
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.EventEmitter=function(){this.events={}},o.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},o.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);this.events[e].splice(n,1),this.events[e].length||delete this.events[e]}},o.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)})}},o.EventEmitter.prototype.hasHandler=function(e){return e in this.events},/*!
 * lunr.tokenizer
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.tokenizer=function(e){if(!arguments.length||null==e||void 0==e)return[];if(Array.isArray(e))return e.map(function(e){return o.utils.asString(e).toLowerCase()});var t=o.tokenizer.seperator||o.tokenizer.separator;return e.toString().trim().toLowerCase().split(t)},o.tokenizer.seperator=!1,o.tokenizer.separator=/[\s\-]+/,o.tokenizer.load=function(e){var t=this.registeredFunctions[e];if(!t)throw new Error("Cannot load un-registered function: "+e);return t},o.tokenizer.label="default",o.tokenizer.registeredFunctions={default:o.tokenizer},o.tokenizer.registerFunction=function(e,t){t in this.registeredFunctions&&o.utils.warn("Overwriting existing tokenizer: "+t),e.label=t,this.registeredFunctions[t]=e},/*!
 * lunr.Pipeline
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.Pipeline=function(){this._stack=[]},o.Pipeline.registeredFunctions={},o.Pipeline.registerFunction=function(e,t){t in this.registeredFunctions&&o.utils.warn("Overwriting existing registered function: "+t),e.label=t,o.Pipeline.registeredFunctions[e.label]=e},o.Pipeline.warnIfFunctionNotRegistered=function(e){e.label&&e.label in this.registeredFunctions||o.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},o.Pipeline.load=function(e){var t=new o.Pipeline;return e.forEach(function(e){var n=o.Pipeline.registeredFunctions[e];if(!n)throw new Error("Cannot load un-registered function: "+e);t.add(n)}),t},o.Pipeline.prototype.add=function(){Array.prototype.slice.call(arguments).forEach(function(e){o.Pipeline.warnIfFunctionNotRegistered(e),this._stack.push(e)},this)},o.Pipeline.prototype.after=function(e,t){o.Pipeline.warnIfFunctionNotRegistered(t);var n=this._stack.indexOf(e);if(-1==n)throw new Error("Cannot find existingFn");n+=1,this._stack.splice(n,0,t)},o.Pipeline.prototype.before=function(e,t){o.Pipeline.warnIfFunctionNotRegistered(t);var n=this._stack.indexOf(e);if(-1==n)throw new Error("Cannot find existingFn");this._stack.splice(n,0,t)},o.Pipeline.prototype.remove=function(e){var t=this._stack.indexOf(e);-1!=t&&this._stack.splice(t,1)},o.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,i=this._stack.length,r=0;r<n;r++){for(var o=e[r],s=0;s<i&&(void 0!==(o=this._stack[s](o,r,e))&&""!==o);s++);void 0!==o&&""!==o&&t.push(o)}return t},o.Pipeline.prototype.reset=function(){this._stack=[]},o.Pipeline.prototype.toJSON=function(){return this._stack.map(function(e){return o.Pipeline.warnIfFunctionNotRegistered(e),e.label})},/*!
 * lunr.Vector
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.Vector=function(){this._magnitude=null,this.list=void 0,this.length=0},o.Vector.Node=function(e,t,n){this.idx=e,this.val=t,this.next=n},o.Vector.prototype.insert=function(e,t){this._magnitude=void 0;var n=this.list;if(!n)return this.list=new o.Vector.Node(e,t,n),this.length++;if(e<n.idx)return this.list=new o.Vector.Node(e,t,n),this.length++;for(var i=n,r=n.next;void 0!=r;){if(e<r.idx)return i.next=new o.Vector.Node(e,t,r),this.length++;i=r,r=r.next}return i.next=new o.Vector.Node(e,t,r),this.length++},o.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;for(var e,t=this.list,n=0;t;)e=t.val,n+=e*e,t=t.next;return this._magnitude=Math.sqrt(n)},o.Vector.prototype.dot=function(e){for(var t=this.list,n=e.list,i=0;t&&n;)t.idx<n.idx?t=t.next:t.idx>n.idx?n=n.next:(i+=t.val*n.val,t=t.next,n=n.next);return i},o.Vector.prototype.similarity=function(e){return this.dot(e)/(this.magnitude()*e.magnitude())},/*!
 * lunr.SortedSet
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.SortedSet=function(){this.length=0,this.elements=[]},o.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},o.SortedSet.prototype.add=function(){var e,t;for(e=0;e<arguments.length;e++)t=arguments[e],~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t);this.length=this.elements.length},o.SortedSet.prototype.toArray=function(){return this.elements.slice()},o.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},o.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},o.SortedSet.prototype.indexOf=function(e){for(var t=0,n=this.elements.length,i=n-t,r=t+Math.floor(i/2),o=this.elements[r];i>1;){if(o===e)return r;o<e&&(t=r),o>e&&(n=r),i=n-t,r=t+Math.floor(i/2),o=this.elements[r]}return o===e?r:-1},o.SortedSet.prototype.locationFor=function(e){for(var t=0,n=this.elements.length,i=n-t,r=t+Math.floor(i/2),o=this.elements[r];i>1;)o<e&&(t=r),o>e&&(n=r),i=n-t,r=t+Math.floor(i/2),o=this.elements[r];return o>e?r:o<e?r+1:void 0},o.SortedSet.prototype.intersect=function(e){for(var t=new o.SortedSet,n=0,i=0,r=this.length,s=e.length,a=this.elements,u=e.elements;;){if(n>r-1||i>s-1)break;a[n]!==u[i]?a[n]<u[i]?n++:a[n]>u[i]&&i++:(t.add(a[n]),n++,i++)}return t},o.SortedSet.prototype.clone=function(){var e=new o.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},o.SortedSet.prototype.union=function(e){var t,n,i;this.length>=e.length?(t=this,n=e):(t=e,n=this),i=t.clone();for(var r=0,o=n.toArray();r<o.length;r++)i.add(o[r]);return i},o.SortedSet.prototype.toJSON=function(){return this.toArray()},/*!
 * lunr.Index
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.Index=function(){this._fields=[],this._ref="id",this.pipeline=new o.Pipeline,this.documentStore=new o.Store,this.tokenStore=new o.TokenStore,this.corpusTokens=new o.SortedSet,this.eventEmitter=new o.EventEmitter,this.tokenizerFn=o.tokenizer,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},o.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},o.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},o.Index.load=function(e){e.version!==o.version&&o.utils.warn("version mismatch: current "+o.version+" importing "+e.version);var t=new this;return t._fields=e.fields,t._ref=e.ref,t.tokenizer(o.tokenizer.load(e.tokenizer)),t.documentStore=o.Store.load(e.documentStore),t.tokenStore=o.TokenStore.load(e.tokenStore),t.corpusTokens=o.SortedSet.load(e.corpusTokens),t.pipeline=o.Pipeline.load(e.pipeline),t},o.Index.prototype.field=function(e,t){var t=t||{},n={name:e,boost:t.boost||1};return this._fields.push(n),this},o.Index.prototype.ref=function(e){return this._ref=e,this},o.Index.prototype.tokenizer=function(e){return e.label&&e.label in o.tokenizer.registeredFunctions||o.utils.warn("Function is not a registered tokenizer. This may cause problems when serialising the index"),this.tokenizerFn=e,this},o.Index.prototype.add=function(e,t){var n={},i=new o.SortedSet,r=e[this._ref],t=void 0===t||t;this._fields.forEach(function(t){var r=this.pipeline.run(this.tokenizerFn(e[t.name]));n[t.name]=r;for(var o=0;o<r.length;o++){var s=r[o];i.add(s),this.corpusTokens.add(s)}},this),this.documentStore.set(r,i);for(var s=0;s<i.length;s++){for(var a=i.elements[s],u=0,l=0;l<this._fields.length;l++){var h=this._fields[l],c=n[h.name],f=c.length;if(f){for(var d=0,p=0;p<f;p++)c[p]===a&&d++;u+=d/f*h.boost}}this.tokenStore.add(a,{ref:r,tf:u})}t&&this.eventEmitter.emit("add",e,this)},o.Index.prototype.remove=function(e,t){var n=e[this._ref],t=void 0===t||t;if(this.documentStore.has(n)){var i=this.documentStore.get(n);this.documentStore.remove(n),i.forEach(function(e){this.tokenStore.remove(e,n)},this),t&&this.eventEmitter.emit("remove",e,this)}},o.Index.prototype.update=function(e,t){var t=void 0===t||t;this.remove(e,!1),this.add(e,!1),t&&this.eventEmitter.emit("update",e,this)},o.Index.prototype.idf=function(e){var t="@"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,t))return this._idfCache[t];var n=this.tokenStore.count(e),i=1;return n>0&&(i=1+Math.log(this.documentStore.length/n)),this._idfCache[t]=i},o.Index.prototype.search=function(e){var t=this.pipeline.run(this.tokenizerFn(e)),n=new o.Vector,i=[],r=this._fields.reduce(function(e,t){return e+t.boost},0);return t.some(function(e){return this.tokenStore.has(e)},this)?(t.forEach(function(e,t,s){var a=1/s.length*this._fields.length*r,u=this,l=this.tokenStore.expand(e).reduce(function(t,i){var r=u.corpusTokens.indexOf(i),s=u.idf(i),l=1,h=new o.SortedSet;if(i!==e){var c=Math.max(3,i.length-e.length);l=1/Math.log(c)}r>-1&&n.insert(r,a*s*l);for(var f=u.tokenStore.get(i),d=Object.keys(f),p=d.length,v=0;v<p;v++)h.add(f[d[v]].ref);return t.union(h)},new o.SortedSet);i.push(l)},this),i.reduce(function(e,t){return e.intersect(t)}).map(function(e){return{ref:e,score:n.similarity(this.documentVector(e))}},this).sort(function(e,t){return t.score-e.score})):[]},o.Index.prototype.documentVector=function(e){for(var t=this.documentStore.get(e),n=t.length,i=new o.Vector,r=0;r<n;r++){var s=t.elements[r],a=this.tokenStore.get(s)[e].tf,u=this.idf(s);i.insert(this.corpusTokens.indexOf(s),a*u)}return i},o.Index.prototype.toJSON=function(){return{version:o.version,fields:this._fields,ref:this._ref,tokenizer:this.tokenizerFn.label,documentStore:this.documentStore.toJSON(),tokenStore:this.tokenStore.toJSON(),corpusTokens:this.corpusTokens.toJSON(),pipeline:this.pipeline.toJSON()}},o.Index.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},/*!
 * lunr.Store
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.Store=function(){this.store={},this.length=0},o.Store.load=function(e){var t=new this;return t.length=e.length,t.store=Object.keys(e.store).reduce(function(t,n){return t[n]=o.SortedSet.load(e.store[n]),t},{}),t},o.Store.prototype.set=function(e,t){this.has(e)||this.length++,this.store[e]=t},o.Store.prototype.get=function(e){return this.store[e]},o.Store.prototype.has=function(e){return e in this.store},o.Store.prototype.remove=function(e){this.has(e)&&(delete this.store[e],this.length--)},o.Store.prototype.toJSON=function(){return{store:this.store,length:this.length}},/*!
 * lunr.stemmer
 * Copyright (C) 2016 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */
    o.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[aeiouy]",i="[^aeiou][^aeiouy]*",r=new RegExp("^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*"),o=new RegExp("^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*[aeiouy][aeiou]*[^aeiou][^aeiouy]*"),s=new RegExp("^([^aeiou][^aeiouy]*)?[aeiouy][aeiou]*[^aeiou][^aeiouy]*([aeiouy][aeiou]*)?$"),a=new RegExp("^([^aeiou][^aeiouy]*)?[aeiouy]"),u=/^(.+?)(ss|i)es$/,l=/^(.+?)([^s])s$/,h=/^(.+?)eed$/,c=/^(.+?)(ed|ing)$/,f=/.$/,d=/(at|bl|iz)$/,p=new RegExp("([^aeiouylsz])\\1$"),v=new RegExp("^"+i+n+"[^aeiouwxy]$"),m=/^(.+?[^aeiou])y$/,g=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,y=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,S=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,w=/^(.+?)(s|t)(ion)$/,x=/^(.+?)e$/,k=/ll$/,b=new RegExp("^"+i+n+"[^aeiouwxy]$");return function(n){var i,E,_,F,z,O,P;if(n.length<3)return n;if(_=n.substr(0,1),"y"==_&&(n=_.toUpperCase()+n.substr(1)),F=u,z=l,F.test(n)?n=n.replace(F,"$1$2"):z.test(n)&&(n=n.replace(z,"$1$2")),F=h,z=c,F.test(n)){var T=F.exec(n);F=r,F.test(T[1])&&(F=f,n=n.replace(F,""))}else if(z.test(n)){var T=z.exec(n);i=T[1],z=a,z.test(i)&&(n=i,z=d,O=p,P=v,z.test(n)?n+="e":O.test(n)?(F=f,n=n.replace(F,"")):P.test(n)&&(n+="e"))}if(F=m,F.test(n)){var T=F.exec(n);i=T[1],n=i+"i"}if(F=g,F.test(n)){var T=F.exec(n);i=T[1],E=T[2],F=r,F.test(i)&&(n=i+e[E])}if(F=y,F.test(n)){var T=F.exec(n);i=T[1],E=T[2],F=r,F.test(i)&&(n=i+t[E])}if(F=S,z=w,F.test(n)){var T=F.exec(n);i=T[1],F=o,F.test(i)&&(n=i)}else if(z.test(n)){var T=z.exec(n);i=T[1]+T[2],z=o,z.test(i)&&(n=i)}if(F=x,F.test(n)){var T=F.exec(n);i=T[1],F=o,z=s,O=b,(F.test(i)||z.test(i)&&!O.test(i))&&(n=i)}return F=k,z=o,F.test(n)&&z.test(n)&&(F=f,n=n.replace(F,"")),"y"==_&&(n=_.toLowerCase()+n.substr(1)),n}}(),o.Pipeline.registerFunction(o.stemmer,"stemmer"),/*!
 * lunr.stopWordFilter
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.generateStopWordFilter=function(e){var t=e.reduce(function(e,t){return e[t]=t,e},{});return function(e){if(e&&t[e]!==e)return e}},o.stopWordFilter=o.generateStopWordFilter(["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"]),o.Pipeline.registerFunction(o.stopWordFilter,"stopWordFilter"),/*!
 * lunr.trimmer
 * Copyright (C) 2016 Oliver Nightingale
 */
    o.trimmer=function(e){return e.replace(/^\W+/,"").replace(/\W+$/,"")},o.Pipeline.registerFunction(o.trimmer,"trimmer"),/*!
 * lunr.stemmer
 * Copyright (C) 2016 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */
    o.TokenStore=function(){this.root={docs:{}},this.length=0},o.TokenStore.load=function(e){var t=new this;return t.root=e.root,t.length=e.length,t},o.TokenStore.prototype.add=function(e,t,n){var n=n||this.root,i=e.charAt(0),r=e.slice(1);return i in n||(n[i]={docs:{}}),0===r.length?(n[i].docs[t.ref]=t,void(this.length+=1)):this.add(r,t,n[i])},o.TokenStore.prototype.has=function(e){if(!e)return!1;for(var t=this.root,n=0;n<e.length;n++){if(!t[e.charAt(n)])return!1;t=t[e.charAt(n)]}return!0},o.TokenStore.prototype.getNode=function(e){if(!e)return{};for(var t=this.root,n=0;n<e.length;n++){if(!t[e.charAt(n)])return{};t=t[e.charAt(n)]}return t},o.TokenStore.prototype.get=function(e,t){return this.getNode(e,t).docs||{}},o.TokenStore.prototype.count=function(e,t){return Object.keys(this.get(e,t)).length},o.TokenStore.prototype.remove=function(e,t){if(e){for(var n=this.root,i=0;i<e.length;i++){if(!(e.charAt(i)in n))return;n=n[e.charAt(i)]}delete n.docs[t]}},o.TokenStore.prototype.expand=function(e,t){var n=this.getNode(e),i=n.docs||{},t=t||[];return Object.keys(i).length&&t.push(e),Object.keys(n).forEach(function(n){"docs"!==n&&t.concat(this.expand(e+n,t))},this),t},o.TokenStore.prototype.toJSON=function(){return{root:this.root,length:this.length}},function(o,s){i=s,void 0!==(r="function"==typeof i?i.call(t,n,t,e):i)&&(e.exports=r)}(0,function(){return o})}()},function(e,t,n){const i=n(0);i.trimmer=function(e){return e.replace(/^\s+/,"").replace(/\s+$/,"")},i.init=function(e){return i.Index.load(e)},i.Pipeline.registerFunction(i.trimmer,"trimmer"),e.exports=i}])});
