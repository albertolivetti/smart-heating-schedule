function t(t,e,s,i){var a,o=arguments.length,r=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(r=(o<3?a(r):o>3?a(e,s,r):a(e,s))||r);return o>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=a.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&a.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,i)},n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,b=g?g.emptyScript:"",y=m.reactiveElementPolyfillSupport,f=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:a}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);a?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),a=e.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const o=a.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,a){if(void 0!==t){const o=this.constructor;if(!1===i&&(a=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??v)(a,e)||s.useDefault&&s.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==a||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,y?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,z=w.trustedTypes,A=z?z.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,O=`<${C}>`,H=document,P=()=>H.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,L="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,I=/>/g,V=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,R=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,Z=H.createTreeWalker(H,129);function X(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let a,o=2===e?"<svg>":3===e?"<math>":"",r=D;for(let e=0;e<s;e++){const s=t[e];let n,l,d=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===D?"!--"===l[1]?r=N:void 0!==l[1]?r=I:void 0!==l[2]?(j.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=V):void 0!==l[3]&&(r=V):r===V?">"===l[0]?(r=a??D,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?V:'"'===l[3]?R:U):r===R||r===U?r=V:r===N||r===I?r=D:(r=V,a=void 0);const h=r===V&&t[e+1].startsWith("/>")?" ":"";o+=r===D?s+O:d>=0?(i.push(n),s.slice(0,d)+S+s.slice(d)+E+h):s+E+(-2===d?e:h)}return[X(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,o=0;const r=t.length-1,n=this.parts,[l,d]=K(t,e);if(this.el=J.createElement(l,s),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Z.nextNode())&&n.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=d[o++],s=i.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?et:"?"===r[1]?st:"@"===r[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:a}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=z?z.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),Z.nextNode(),n.push({type:2,index:++a});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===C)n.push({type:2,index:a});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)n.push({type:7,index:a}),t+=E.length-1}a++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===F)return e;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const o=M(e)?void 0:e._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(t),a._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(e=G(t,a._$AS(t,e.values),a,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??H).importNode(e,!0);Z.currentNode=i;let a=Z.nextNode(),o=0,r=0,n=s[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new Y(a,a.nextSibling,this,t):1===n.type?e=new n.ctor(a,n.name,n.strings,this,t):6===n.type&&(e=new at(a,this,t)),this._$AV.push(e),n=s[++r]}o!==n?.index&&(a=Z.nextNode(),o++)}return Z.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),M(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(X(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const a of t)i===e.length?e.push(s=new Y(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(a),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,a){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const a=this.strings;let o=!1;if(void 0===a)t=G(this,t,e,0),o=!M(t)||t!==this._$AH&&t!==F,o&&(this._$AH=t);else{const i=t;let r,n;for(t=a[0],r=0;r<a.length-1;r++)n=G(this,i[s+r],e,r),n===F&&(n=this._$AH[r]),o||=!M(n)||n!==this._$AH[r],n===W?t=W:t!==W&&(t+=(n??"")+a[r+1]),this._$AH[r]=n}o&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends tt{constructor(t,e,s,i,a){super(t,e,s,i,a),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===F)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,a=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(J,Y),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class nt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let a=i._$litPart$;if(void 0===a){const t=s?.renderBefore??null;i._$litPart$=a=new Y(e.insertBefore(P(),t),t,void 0,s??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");const dt={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:v},ct=(t=dt,e,s)=>{const{kind:i,metadata:a}=s;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const a=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,a,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const a=this[i];e.call(this,s),this.requestUpdate(i,a,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut="smart_heating_schedule",mt=(t,e,s)=>t.callWS({type:`${ut}/room/save`,entity_id:e,...s}),gt=(t,e)=>t.callWS({type:`${ut}/seasons/save`,seasons:e}),bt=(t,e,s)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:s}))},yt=(t,e)=>{bt(t,"hass-notification",{message:e})};let ft;const _t=(t,e)=>{const s=t.states[e]?.attributes.friendly_name;if(s)return s;const i=t.entities?.[e]?.device_id,a=i?t.devices?.[i]:void 0;return a?.name_by_user||a?.name||e},vt=t=>e=>{customElements.get(t)||customElements.define(t,e)},xt={title:"Heating schedule",loading:"Loading…",not_loaded:"The seasonal heating schedule is not set up. Add the integration under Settings → Devices & services.",read_only:"Only administrators can change schedules.",away:{label:"Away",active:"Away is on",preset:"The thermostat uses its away preset. The schedule resumes when you turn Away off.",temperature:"The thermostat keeps {temperature}. The schedule resumes when you turn Away off."},entity:{label:"Entity controlled by the schedule",add:"Add thermostat",choose:"Choose the thermostat to schedule",none_title:"Choose what to schedule",none_text:"Pick the climate entity of your boiler or thermostat. The schedule sets its temperature and turns it off outside the seasons.",no_thermostats:"All climate entities already have a schedule.",enabled:"Schedule active",remove:"Remove schedule",remove_text:"Stop scheduling {name} and delete its programs?",measured:"Measured {temperature}"},seasons:{title:"Seasons",subtitle:"Dates repeat every year and apply to all thermostats.",reset:"From Home Assistant",reset_title:"Use Home Assistant's seasons",reset_text:"Replace your seasons with winter, spring, summer and autumn as Home Assistant defines them. Programs of seasons that no longer exist are deleted.",new:"New",edit:"Edit {name}",select:"Show {name}",today:"today",outside:"Outside the seasons ({ranges}) heating is off",always:"The seasons cover the whole year",programs_one:"1 program",programs:"{count} programs",programs_none:"no programs: off"},season_dialog:{new:"New season",edit:"Edit season",name:"Name",color:"Color",start:"Start",end:"End",year:"The year is ignored: the season repeats every year.",wraps:"Runs across new year.",overlap:"Overlaps with {name}.",delete:"Delete season",delete_text:"Delete {name} and the programs in it?"},now:{title:"Now",scheduled:"requested",off:"Off",season:"Season",program:"Program",block:"Current block",next:"Next change",next_season:"Next season",none:"None",manual_hint:"If you change the temperature by hand, it holds until the next block."},programs:{title:"Programs · {season}",hint:"Tap a day to move it here. Tap a block to change its temperature, drag the dividers to change the times.",new:"Program",new_name:"New program",every_day:"Every day",no_days:"No day selected",empty:"No programs in this season: heating is off.",uncovered:"No program on {days}: heating is off on those days.",duplicate:"Duplicate {name}",delete:"Delete {name}",delete_text:"Delete the program {name}?",rename:"Rename {name}",name:"Name",copy:"{name} (copy)",day_mine:"{day}: in this program",day_other:"{day}: in {program}, tap to move it here",day_free:"{day}: no program"},block:{hint:"Tap a block on the bar to edit it.",split:"Split",delete:"Delete block",close:"Close",lower:"Lower by {step}",raise:"Raise by {step}",off:"Off",start:"Start",end:"End",earlier:"{what} 15 minutes earlier",later:"{what} 15 minutes later",divider:"Change at {time}: drag, or use the left and right arrow keys"},status:{until:"{temperature} until {time}",off_until:"Off until {time}",constant:"{temperature}",constant_off:"Off",disabled:"Schedule is off",pending:"Waiting for the thermostat",error:"Could not update the thermostat: {error}"},room:{overridden:"Changed by hand",resume:"Back to the schedule"},common:{cancel:"Cancel",save:"Save",add:"Add",delete:"Delete",close:"Close",replace:"Replace"},error:{save:"Could not save: {error}",resume:"Could not restore the schedule: {error}"}},$t={en:xt,it:{title:"Cronotermostato",loading:"Caricamento…",not_loaded:"Il cronotermostato stagionale non è configurato. Aggiungi l'integrazione in Impostazioni → Dispositivi e servizi.",read_only:"Solo gli amministratori possono modificare la programmazione.",away:{label:"Assenza",active:"Assenza attiva",preset:"Il termostato usa il suo preset Fuori casa. Il programma riprende quando disattivi l'Assenza.",temperature:"Il termostato tiene {temperature}. Il programma riprende quando disattivi l'Assenza."},entity:{label:"Entità comandata dalla programmazione",add:"Aggiungi termostato",choose:"Scegli il termostato da programmare",none_title:"Scegli cosa programmare",none_text:"Seleziona l'entità climate della caldaia o del termostato. Il programma ne imposta la temperatura e la spegne fuori stagione.",no_thermostats:"Tutte le entità climate hanno già una programmazione.",enabled:"Programmazione attiva",remove:"Rimuovi programmazione",remove_text:"Smettere di programmare {name} ed eliminare i suoi programmi?",measured:"Misurata {temperature}"},seasons:{title:"Stagioni",subtitle:"Le date si ripetono ogni anno e valgono per tutti i termostati.",reset:"Da Home Assistant",reset_title:"Usa le stagioni di Home Assistant",reset_text:"Sostituisce le tue stagioni con inverno, primavera, estate e autunno come li definisce Home Assistant. I programmi delle stagioni che non esistono più vengono eliminati.",new:"Nuova",edit:"Modifica {name}",select:"Mostra {name}",today:"oggi",outside:"Fuori stagione ({ranges}) la caldaia resta spenta",always:"Le stagioni coprono tutto l'anno",programs_one:"1 programma",programs:"{count} programmi",programs_none:"nessun programma: spento"},season_dialog:{new:"Nuova stagione",edit:"Modifica stagione",name:"Nome",color:"Colore",start:"Inizio",end:"Fine",year:"L'anno non conta: la stagione si ripete ogni anno.",wraps:"Attraversa il capodanno.",overlap:"Si sovrappone a {name}.",delete:"Elimina stagione",delete_text:"Eliminare {name} e i suoi programmi?"},now:{title:"Adesso",scheduled:"richiesti",off:"Spento",season:"Stagione",program:"Programma",block:"Fascia attuale",next:"Prossimo cambio",next_season:"Prossima stagione",none:"Nessuno",manual_hint:"Se cambi la temperatura a mano, vale fino al prossimo cambio di fascia."},programs:{title:"Programmi · {season}",hint:"Tocca un giorno per spostarlo qui. Tocca una fascia per la temperatura, trascina i separatori per gli orari.",new:"Programma",new_name:"Nuovo programma",every_day:"Tutti i giorni",no_days:"Nessun giorno selezionato",empty:"Nessun programma in questa stagione: la caldaia resta spenta.",uncovered:"Nessun programma per {days}: in quei giorni la caldaia resta spenta.",duplicate:"Duplica {name}",delete:"Elimina {name}",delete_text:"Eliminare il programma {name}?",rename:"Rinomina {name}",name:"Nome",copy:"{name} (copia)",day_mine:"{day}: in questo programma",day_other:"{day}: in {program}, tocca per spostarlo qui",day_free:"{day}: senza programma"},block:{hint:"Tocca una fascia nella barra per modificarla.",split:"Dividi",delete:"Elimina fascia",close:"Chiudi",lower:"Diminuisci di {step}",raise:"Aumenta di {step}",off:"Spento",start:"Inizio",end:"Fine",earlier:"{what} 15 minuti prima",later:"{what} 15 minuti dopo",divider:"Cambio alle {time}: trascina, oppure usa le frecce sinistra e destra"},status:{until:"{temperature} fino alle {time}",off_until:"Spento fino alle {time}",constant:"{temperature}",constant_off:"Spento",disabled:"Programmazione disattivata",pending:"In attesa del termostato",error:"Impossibile aggiornare il termostato: {error}"},room:{overridden:"Modificato a mano",resume:"Torna al programma"},common:{cancel:"Annulla",save:"Salva",add:"Aggiungi",delete:"Elimina",close:"Chiudi",replace:"Sostituisci"},error:{save:"Impossibile salvare: {error}",resume:"Impossibile ripristinare il programma: {error}"}}},wt=(t,e)=>{let s=t;for(const t of e.split("."))s=s?.[t];return"string"==typeof s?s:void 0},kt=t=>{const e=$t[t]??$t[t.split("-")[0]];return(t,s)=>{let i=wt(e,t)??wt(xt,t)??t;for(const[t,e]of Object.entries(s??{}))i=i.replaceAll(`{${t}}`,e);return i}},zt=r`
  :host {
    color: var(--primary-text-color);
  }
  ha-card {
    display: block;
  }
  ha-card:not(:defined) {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
  }
  .text-button {
    background: none;
    border: none;
    border-radius: 8px;
    color: var(--primary-color);
    cursor: pointer;
    font: inherit;
    font-weight: 500;
    padding: 8px 10px;
  }
  .text-button:hover:not([disabled]),
  .text-button:focus-visible {
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    outline: none;
  }
  .text-button[disabled] {
    color: var(--disabled-text-color);
    cursor: default;
  }
  .text-button.danger {
    color: var(--error-color);
  }
  .text-button.danger:hover:not([disabled]) {
    background: color-mix(in srgb, var(--error-color) 10%, transparent);
  }
  .filled-button {
    background: var(--primary-color);
    border: none;
    border-radius: 20px;
    color: var(--text-primary-color, #fff);
    cursor: pointer;
    font: inherit;
    font-weight: 500;
    padding: 10px 20px;
  }
  .filled-button[disabled] {
    background: var(--disabled-color, var(--disabled-text-color));
    cursor: default;
  }
  .filled-button.danger {
    background: var(--error-color);
  }
  ha-icon-button.primary {
    color: var(--primary-color);
  }
  .secondary {
    color: var(--secondary-text-color);
  }
  .error {
    color: var(--error-color);
  }
  .switch-fallback {
    accent-color: var(--primary-color);
    height: 20px;
    width: 36px;
  }
  .visually-hidden {
    clip: rect(0 0 0 0);
    height: 1px;
    overflow: hidden;
    position: absolute;
    width: 1px;
  }
`,At=(t,e,s,i=!1)=>customElements.get("ha-switch")?B`<ha-switch
        .checked=${t}
        .disabled=${i}
        aria-label=${s}
        @change=${t=>e(t.target.checked)}
      ></ha-switch>`:B`<input
        type="checkbox"
        role="switch"
        class="switch-fallback"
        .checked=${t}
        ?disabled=${i}
        aria-label=${s}
        @change=${t=>e(t.target.checked)}
      />`,St=r`
  .toolbar {
    align-items: center;
    background: var(--app-header-background-color);
    border-bottom: var(--app-header-border-bottom, none);
    box-sizing: border-box;
    color: var(--app-header-text-color, #fff);
    display: flex;
    font-size: 20px;
    gap: 4px;
    height: var(--header-height, 56px);
    padding: 0 12px;
    position: sticky;
    top: 0;
    z-index: 4;
  }
  .toolbar .title {
    flex: 1;
    margin-inline-start: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .toolbar ha-icon-button {
    color: inherit;
  }
`;var Et="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",Ct="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",Ot="M19,13H5V11H19V13Z",Ht="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z",Pt="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Mt="M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z";let Tt=class extends nt{constructor(){super(...arguments),this.heading="",this.open=!1,this._previousFocus=null,this._keydown=t=>{"Escape"===t.key&&this.open&&(t.stopPropagation(),this._close())}}_close(){bt(this,"closed")}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydown)}updated(t){t.has("open")&&(this.open?(this._previousFocus=document.activeElement,this.renderRoot.querySelector(".surface")?.focus()):this._previousFocus instanceof HTMLElement&&this._previousFocus.focus())}render(){return this.open?B`
      <div class="scrim" @click=${this._close}></div>
      <div class="surface" role="dialog" aria-modal="true" aria-labelledby="heading" tabindex="-1">
        <h2 id="heading">${this.heading}</h2>
        <div class="content"><slot></slot></div>
        <div class="actions">
          <slot name="secondary"></slot>
          <span class="spacer"></span>
          <slot name="actions"></slot>
        </div>
      </div>
    `:W}static{this.styles=r`
    :host {
      display: contents;
    }
    .scrim {
      background: var(--dialog-scrim-color, rgba(0, 0, 0, 0.4));
      inset: 0;
      position: fixed;
      z-index: 100;
    }
    .surface {
      background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
      border-radius: var(--ha-dialog-border-radius, 24px);
      box-shadow: var(--ha-dialog-box-shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
      box-sizing: border-box;
      color: var(--primary-text-color);
      display: flex;
      flex-direction: column;
      left: 50%;
      max-height: calc(100% - 32px);
      max-width: 440px;
      outline: none;
      padding: 24px;
      position: fixed;
      top: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% - 32px);
      z-index: 101;
    }
    h2 {
      font-size: 22px;
      font-weight: 400;
      margin: 0 0 16px;
    }
    .content {
      /* Scroll edge to edge, so rows with a hover background that sticks out
         a little (lists) never cause a horizontal scrollbar. */
      margin: 0 -24px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 24px;
    }
    .actions {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 24px;
    }
    .spacer {
      flex: 1;
    }
  `}};t([ht()],Tt.prototype,"heading",void 0),t([ht({type:Boolean,reflect:!0})],Tt.prototype,"open",void 0),Tt=t([vt("shs-dialog")],Tt);const Lt=15,Dt=1440,Nt=["mon","tue","wed","thu","fri","sat","sun"],It=t=>{const[e,s]=t.split(":").map(Number);return 60*e+s},Vt=t=>`${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`,Ut=t=>t.map((e,s)=>({start:It(e.start),end:s+1<t.length?It(t[s+1].start):Dt,temperature:e.temperature})),Rt=(t,e)=>{if(t.length<=1)return t;const s=Ut(t),i=s[e];return e>0?s[e-1]={...s[e-1],end:i.end}:s[1]={...s[1],start:0},(t=>t.filter(t=>t.end>t.start).sort((t,e)=>t.start-e.start).map(t=>({start:Vt(t.start),temperature:t.temperature})))(s.filter((t,s)=>s!==e))},jt=(t,e,s)=>{if(e<=0||e>=t.length)return t;const i=Ut(t),a=i[e-1].start+Lt,o=i[e].end-Lt,r=Math.round(s/Lt)*Lt,n=Math.min(o,Math.max(a,r));return t.map((t,s)=>s===e?{...t,start:Vt(n)}:t)},Bt=(t,e,s)=>t.map((t,i)=>i===e?{...t,temperature:s}:t),Ft=t=>{const e=t.locale.time_format;if("12"===e)return!0;if("24"===e)return!1;const s="system"===e?void 0:t.locale.language;return new Intl.DateTimeFormat(s,{hour:"numeric"}).resolvedOptions().hour12??!1},Wt=(t,e,s=!1)=>{if(!e&&s&&t===Dt)return"24:00";const i=t%Dt,a=Math.floor(i/60),o=String(i%60).padStart(2,"0");if(e){return`${a%12||12}:${o} ${a<12?"AM":"PM"}`}return`${s?a:String(a).padStart(2,"0")}:${o}`},qt={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6},Zt=(t,e)=>{let s;try{s=new Intl.DateTimeFormat("en-US",{timeZone:e,weekday:"short",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(t)}catch{return Zt(t)}const i=t=>s.find(e=>e.type===t)?.value??"0";return{weekday:qt[i("weekday")]??0,minutes:60*Number(i("hour"))+Number(i("minute"))}},Xt=new Date(2024,0,1),Kt=(t,e,s="long")=>{const i=new Date(Xt);i.setDate(Xt.getDate()+e);const a=new Intl.DateTimeFormat(t,{weekday:s}).format(i);return a.charAt(0).toUpperCase()+a.slice(1)},Jt="°F",Gt={"°C":{min:5,max:30,step:.5},"°F":{min:41,max:86,step:1}},Qt=t=>Gt[t]??Gt["°C"],Yt=(t,e)=>{const s=Qt(e),i=t?.attributes??{};return{min:Number(i.min_temp??s.min),max:Number(i.max_temp??s.max),step:Number(i.target_temp_step||s.step)}},te=t=>t===Jt?68:20,ee=(t,e)=>{const s=Math.round(t/e.step)*e.step;return Math.min(e.max,Math.max(e.min,Number(s.toFixed(2))))},se=(t,e,s=Qt(e).step,i=!1,a)=>{const o=((t,e)=>e<1?e<.1?2:1:t===Jt?0:1)(e,s);return`${new Intl.NumberFormat(a,{minimumFractionDigits:i?0:o,maximumFractionDigits:o}).format(t)}°`},ie=[[12,[245,222,140]],[16,[248,206,84]],[19,[250,194,43]],[21,[248,168,48]],[23,[244,128,52]],[25,[236,90,50]],[28,[222,56,46]]],ae="#8a9bab",oe=([t,e,s])=>`#${[t,e,s].map(t=>Math.round(t).toString(16).padStart(2,"0")).join("")}`,re=(t,e)=>{if(null===t)return`var(--shs-color-off, ${ae})`;const s=((t,e)=>e===Jt?5*(t-32)/9:t)(t,e);return`var(--shs-color-${Math.round(s)}, ${(t=>{if(null===t)return ae;if(t<=ie[0][0])return oe(ie[0][1]);for(let e=1;e<ie.length;e++){const[s,i]=ie[e];if(t<=s){const[a,o]=ie[e-1],r=(t-a)/(s-a);return oe(o.map((t,e)=>t+(i[e]-t)*r))}}return oe(ie[ie.length-1][1])})(s)})`};let ne=class extends nt{constructor(){super(...arguments),this.blocks=[],this.unit="°C",this.limits={min:5,max:30,step:.5},this.canTurnOff=!0,this.language="en",this.h12=!1,this.readOnly=!1,this.now=null,this._selected=null,this._drag=null,this._width=0,this._resize=new ResizeObserver(t=>{this._width=t[0]?.contentRect.width??0})}connectedCallback(){super.connectedCallback(),this._resize.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resize.disconnect()}willUpdate(t){t.has("blocks")&&null!==this._selected&&this._selected>=this.blocks.length&&(this._selected=this.blocks.length-1)}get _step(){return Math.max(this.limits.step,this.unit===Jt?1:.5)}get _blocks(){return this._drag?.blocks??this.blocks}_emit(t,e=!0){bt(this,"blocks-changed",{blocks:t,final:e})}_select(t){this._selected=this._selected===t?null:t}_minutesAt(t){const e=this.renderRoot.querySelector(".track").getBoundingClientRect();return(t-e.left)/e.width*Dt}_pointerDown(t,e){if(this.readOnly||t.button>0)return;t.preventDefault();const s=t.currentTarget;s.setPointerCapture?.(t.pointerId),s.focus();const i=this.blocks;this._drag={index:e,blocks:i};const a=t=>{if(!this._drag)return;const s=jt(i,e,this._minutesAt(t.clientX));s[e].start!==this._drag.blocks[e].start&&(this._drag={index:e,blocks:s})},o=()=>{s.removeEventListener("pointermove",a),s.removeEventListener("pointerup",o),s.removeEventListener("pointercancel",o);const t=this._drag?.blocks??i;this._drag=null,t[e].start!==i[e].start&&this._emit(t)};s.addEventListener("pointermove",a),s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o)}_dividerKey(t,e,s){const i={ArrowLeft:-15,ArrowDown:-15,ArrowRight:Lt,ArrowUp:Lt}[t.key];i&&!this.readOnly&&(t.preventDefault(),this._emit(jt(this.blocks,e,s+i)))}_changeTemperature(t,e){const s=this.blocks[t].temperature??te(this.unit),i={...this.limits,step:this._step};this._emit(Bt(this.blocks,t,ee(s+e*this._step,i)))}_toggleOff(t,e){const s=e?null:ee(te(this.unit),{...this.limits,step:this._step});this._emit(Bt(this.blocks,t,s))}_split(t){const e=((t,e)=>{const s=Ut(t)[e];if(!s||s.end-s.start<30)return null;const i=Math.round((s.start+s.end)/2/Lt)*Lt,a=[...t];return a.splice(e+1,0,{start:Vt(i),temperature:s.temperature}),a})(this.blocks,t);e&&(this._selected=t+1,this._emit(e))}_delete(t){this._selected=Math.max(0,t-1),this._emit(Rt(this.blocks,t))}_time(t){return t!==Dt||this.h12?Wt(t,this.h12):"24:00"}_label(t,e=!0){return null===t?this.localize("block.off"):se(t,this.unit,this._step,e,this.language)}render(){const t=Ut(this._blocks),e=t.slice(1).map((t,e)=>({index:e+1,minutes:t.start})),s=this._selected,i=t=>this._drag?.index===t||t===s||null!==s&&t===s+1,a=this._width?40/this._width*Dt:0,o=[];for(const t of e){const e=o[o.length-1];if(e&&t.minutes-e.minutes<a){if(!i(t.index)||i(e.index))continue;o.pop()}o.push(t)}return B`
      <div class="labels" aria-hidden="true">
        ${o.map(({index:t,minutes:e})=>B`<span class=${i(t)?"active":""} style="left:${e/Dt*100}%"
              >${Wt(e,this.h12)}</span
            >`)}
      </div>
      <div class="track">
        <div class="bar">
          ${t.map((t,e)=>{const i=this._label(t.temperature),a=`${this._time(t.start)} – ${this._time(t.end)}`;return B`<button
              class="block ${e===s?"selected":""} ${null===t.temperature?"off":""}"
              style="left:${t.start/Dt*100}%;width:${(t.end-t.start)/Dt*100}%;--block-color:${re(t.temperature,this.unit)}"
              aria-pressed=${e===s}
              aria-label="${a}, ${i}"
              @click=${()=>this._select(e)}
            >
              <span>${i}</span>
            </button>`})}
        </div>
        ${this.readOnly?W:e.map(({index:t,minutes:e})=>B`<button
                class="divider ${i(t)?"active":""}"
                style="left:${e/Dt*100}%"
                aria-label=${this.localize("block.divider",{time:Wt(e,this.h12)})}
                @pointerdown=${e=>this._pointerDown(e,t)}
                @keydown=${s=>this._dividerKey(s,t,e)}
              >
                <span></span>
              </button>`)}
        ${null===this.now?W:B`<div class="now" style="left:${this.now/Dt*100}%" aria-hidden="true"></div>`}
      </div>
      <div class="ticks" aria-hidden="true">
        ${[0,360,720,1080,Dt].map(t=>B`<span>${Wt(t,this.h12,!0)}</span>`)}
      </div>
      ${null===s||this.readOnly?this.readOnly?W:B`<p class="hint secondary">${this.localize("block.hint")}</p>`:this._renderEditor(t,s)}
    `}_renderEditor(t,e){const s=t[e];if(!s)return W;const i=null===s.temperature,a=0===e,o=e===t.length-1,r=se(this._step,this.unit,this._step,!0,this.language),n=this.localize("block.start"),l=this.localize("block.end"),d=`${this._time(s.start)} – ${this._time(s.end)}`,c=s.temperature;return B`<div class="editor" style="--block-color:${re(s.temperature,this.unit)}">
      <div class="editor-header">
        <span class="swatch"></span>
        <span class="range">${d}</span>
        <button
          class="outlined"
          ?disabled=${s.end-s.start<30}
          @click=${()=>this._split(e)}
        >
          <ha-svg-icon .path=${"M18,16V13H15V22H13V2H15V11H18V8L22,12L18,16M2,12L6,16V13H9V22H11V2H9V11H6V8L2,12Z"}></ha-svg-icon>${this.localize("block.split")}
        </button>
        <button
          class="outlined icon danger"
          ?disabled=${t.length<2}
          aria-label=${this.localize("block.delete")}
          title=${this.localize("block.delete")}
          @click=${()=>this._delete(e)}
        >
          <ha-svg-icon .path=${Ct}></ha-svg-icon>
        </button>
        <button
          class="plain icon"
          aria-label=${this.localize("block.close")}
          title=${this.localize("block.close")}
          @click=${()=>this._selected=null}
        >
          <ha-svg-icon .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}></ha-svg-icon>
        </button>
      </div>
      <div class="controls">
        <div class="group">
          <button
            class="round"
            ?disabled=${i||null!==c&&c<=this.limits.min}
            aria-label=${this.localize("block.lower",{step:r})}
            @click=${()=>this._changeTemperature(e,-1)}
          >
            <ha-svg-icon .path=${Ot}></ha-svg-icon>
          </button>
          <span class="temperature" aria-live="polite">${this._label(c,!1)}</span>
          <button
            class="round"
            ?disabled=${i||null!==c&&c>=this.limits.max}
            aria-label=${this.localize("block.raise",{step:r})}
            @click=${()=>this._changeTemperature(e,1)}
          >
            <ha-svg-icon .path=${Pt}></ha-svg-icon>
          </button>
          <label class="off">
            <input
              type="checkbox"
              .checked=${i}
              @change=${t=>this._toggleOff(e,t.target.checked)}
            />${this.localize("block.off")}
          </label>
        </div>
        ${this._renderTime(n,s.start,a,t=>this._emit(jt(this.blocks,e,t)))}
        ${this._renderTime(l,s.end,o,t=>this._emit(jt(this.blocks,e+1,t)))}
      </div>
    </div>`}_renderTime(t,e,s,i){return B`<div class="group time">
      <span class="time-label secondary">${t}</span>
      <button
        class="outlined small"
        ?disabled=${s}
        aria-label=${this.localize("block.earlier",{what:t})}
        @click=${()=>i(e-Lt)}
      >
        <ha-svg-icon .path=${Ot}></ha-svg-icon>
      </button>
      <span class="time-value">${this._time(e)}</span>
      <button
        class="outlined small"
        ?disabled=${s}
        aria-label=${this.localize("block.later",{what:t})}
        @click=${()=>i(e+Lt)}
      >
        <ha-svg-icon .path=${Pt}></ha-svg-icon>
      </button>
    </div>`}static{this.styles=[zt,r`
      :host {
        display: block;
        user-select: none;
        -webkit-user-select: none;
      }
      .labels,
      .track,
      .ticks {
        margin: 0 10px;
      }
      .labels {
        height: 16px;
        position: relative;
      }
      .labels span {
        color: var(--secondary-text-color);
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .labels span.active {
        color: var(--primary-text-color);
        font-weight: 700;
      }
      .track {
        height: 44px;
        position: relative;
        touch-action: none;
      }
      .bar {
        background: var(--divider-color);
        border-radius: 8px;
        inset: 0;
        overflow: hidden;
        position: absolute;
      }
      .block {
        align-items: center;
        background: color-mix(
          in srgb,
          var(--block-color) var(--shs-block-mix, 45%),
          var(--ha-card-background, var(--card-background-color, #fff))
        );
        border: none;
        border-inline-end: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
        bottom: 0;
        box-sizing: border-box;
        color: color-mix(in srgb, var(--block-color) var(--shs-text-mix, 100%), black);
        container-type: inline-size;
        cursor: pointer;
        display: flex;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        justify-content: center;
        overflow: hidden;
        padding: 0;
        position: absolute;
        top: 0;
        white-space: nowrap;
      }
      .block.off {
        font-weight: 500;
      }
      .block.selected {
        box-shadow: inset 0 0 0 3px var(--primary-text-color);
      }
      .block:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      @container (max-width: 34px) {
        .block span {
          visibility: hidden;
        }
      }
      .divider {
        align-items: center;
        background: none;
        border: none;
        cursor: ew-resize;
        display: flex;
        height: 56px;
        justify-content: center;
        padding: 0;
        position: absolute;
        top: -6px;
        touch-action: none;
        transform: translateX(-50%);
        width: 28px;
      }
      .divider span {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 2px solid var(--primary-text-color);
        border-radius: 5px;
        box-sizing: border-box;
        height: 34px;
        width: 8px;
      }
      .divider.active span {
        background: var(--primary-text-color);
        width: 12px;
      }
      .divider:focus-visible span {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .now {
        background: var(--primary-color);
        bottom: -4px;
        pointer-events: none;
        position: absolute;
        top: -4px;
        transform: translateX(-1px);
        width: 2px;
      }
      .ticks {
        color: var(--secondary-text-color);
        display: flex;
        font-size: 11px;
        justify-content: space-between;
        margin-top: 4px;
      }
      .hint {
        font-size: 12px;
        margin: 8px 0 0;
      }
      .editor {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
        padding: 8px 12px 10px;
      }
      .editor-header {
        align-items: center;
        display: flex;
        gap: 6px;
      }
      .swatch {
        background: var(--block-color);
        border-radius: 3px;
        flex-shrink: 0;
        height: 12px;
        width: 12px;
      }
      .range {
        flex: 1;
        font-size: 13px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        min-width: 0;
      }
      .controls {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
      }
      .group {
        align-items: center;
        display: flex;
        gap: 6px;
      }
      .temperature {
        font-size: 19px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        min-width: 4.2em;
        text-align: center;
      }
      .off {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-size: 13px;
        font-weight: 600;
        gap: 6px;
        margin-inline-start: 4px;
        min-height: 40px;
      }
      .off input {
        accent-color: var(--primary-color);
        height: 18px;
        margin: 0;
        width: 18px;
      }
      .time-label {
        font-size: 12px;
        margin-inline-end: 2px;
        min-width: 2.6em;
      }
      .time-value {
        font-size: 13px;
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        min-width: 3.2em;
        text-align: center;
      }
      button.round,
      button.outlined,
      button.plain {
        align-items: center;
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 1px solid var(--divider-color);
        color: var(--primary-text-color);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 12px;
        font-weight: 600;
        gap: 4px;
        justify-content: center;
        padding: 0 10px;
      }
      button.round {
        border-radius: 50%;
        height: 40px;
        padding: 0;
        width: 40px;
      }
      button.outlined {
        border-radius: 8px;
        height: 36px;
      }
      button.small {
        padding: 0;
        width: 34px;
      }
      button.icon {
        padding: 0;
        width: 36px;
      }
      button.plain {
        background: none;
        border-color: transparent;
        border-radius: 8px;
        color: var(--secondary-text-color);
        height: 36px;
      }
      button.danger {
        color: var(--error-color);
      }
      button[disabled] {
        cursor: default;
        opacity: 0.4;
      }
      button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }
      ha-svg-icon {
        --mdc-icon-size: 18px;
      }
    `]}};t([ht({attribute:!1})],ne.prototype,"blocks",void 0),t([ht()],ne.prototype,"unit",void 0),t([ht({attribute:!1})],ne.prototype,"limits",void 0),t([ht({type:Boolean})],ne.prototype,"canTurnOff",void 0),t([ht()],ne.prototype,"language",void 0),t([ht({type:Boolean})],ne.prototype,"h12",void 0),t([ht({type:Boolean})],ne.prototype,"readOnly",void 0),t([ht({attribute:!1})],ne.prototype,"now",void 0),t([ht({attribute:!1})],ne.prototype,"localize",void 0),t([pt()],ne.prototype,"_selected",void 0),t([pt()],ne.prototype,"_drag",void 0),t([pt()],ne.prototype,"_width",void 0),ne=t([vt("shs-timeline-editor")],ne);let le=class extends nt{constructor(){super(...arguments),this.others=[],this.days=[...Nt],this.unit="°C",this.limits={min:5,max:30,step:.5},this.canTurnOff=!0,this.language="en",this.h12=!1,this.readOnly=!1,this.now=null}_dayName(t,e="long"){const s=Nt.indexOf(t);return"narrow"===e?new Intl.DateTimeFormat(this.language,{weekday:"narrow"}).format(new Date(2024,0,1+s)):Kt(this.language,s,e)}_daysLabel(){const{days:t}=this.program;return 7===t.length?this.localize("programs.every_day"):t.length?this.days.filter(e=>t.includes(e)).map(t=>this._dayName(t,"short")).join(" · "):this.localize("programs.no_days")}render(){const t=this.program.name;return B`
      <ha-card>
        <div class="header">
          <div class="title">
            <h3>${t}</h3>
            <span class="secondary">${this._daysLabel()}</span>
          </div>
          ${this.readOnly?W:B`<ha-icon-button
                  .path=${Ht}
                  .label=${this.localize("programs.rename",{name:t})}
                  @click=${()=>bt(this,"rename")}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"}
                  .label=${this.localize("programs.duplicate",{name:t})}
                  @click=${()=>bt(this,"duplicate")}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${Ct}
                  .label=${this.localize("programs.delete",{name:t})}
                  @click=${()=>bt(this,"delete")}
                ></ha-icon-button>`}
        </div>

        <div class="days" role="group" aria-label=${this._daysLabel()}>
          ${this.days.map(t=>{const e=this.program.days.includes(t),s=e?void 0:this.others.find(e=>e.days.includes(t)),i=this._dayName(t),a=e?this.localize("programs.day_mine",{day:i}):s?this.localize("programs.day_other",{day:i,program:s.name}):this.localize("programs.day_free",{day:i});return B`<button
              class="day ${e?"mine":s?"other":"free"}"
              aria-pressed=${e}
              aria-label=${a}
              title=${a}
              ?disabled=${this.readOnly}
              @click=${()=>bt(this,"day-toggled",{day:t})}
            >
              ${this._dayName(t,"narrow")}
            </button>`})}
        </div>

        <shs-timeline-editor
          .blocks=${this.program.blocks}
          .unit=${this.unit}
          .limits=${this.limits}
          .canTurnOff=${this.canTurnOff}
          .language=${this.language}
          .h12=${this.h12}
          .readOnly=${this.readOnly}
          .now=${this.now}
          .localize=${this.localize}
        ></shs-timeline-editor>
      </ha-card>
    `}static{this.styles=[zt,r`
      :host {
        display: block;
      }
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 8px 12px 12px;
      }
      .header {
        align-items: center;
        display: flex;
        gap: 0;
      }
      .title {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
      }
      h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .title .secondary {
        font-size: 12px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .days {
        display: flex;
        gap: 4px;
        max-width: 360px;
      }
      .day {
        border-radius: 20px;
        box-sizing: border-box;
        cursor: pointer;
        flex: 1 1 0;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        height: 38px;
        min-width: 0;
        padding: 0;
      }
      .day.mine {
        background: var(--primary-color);
        border: 2px solid var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .day.other {
        background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        border: 2px solid transparent;
        color: var(--secondary-text-color);
      }
      .day.free {
        background: none;
        border: 2px dashed var(--warning-color, #b4410b);
        color: var(--warning-color, #b4410b);
      }
      .day:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .day[disabled] {
        cursor: default;
      }
    `]}};t([ht({attribute:!1})],le.prototype,"program",void 0),t([ht({attribute:!1})],le.prototype,"others",void 0),t([ht({attribute:!1})],le.prototype,"days",void 0),t([ht()],le.prototype,"unit",void 0),t([ht({attribute:!1})],le.prototype,"limits",void 0),t([ht({type:Boolean})],le.prototype,"canTurnOff",void 0),t([ht()],le.prototype,"language",void 0),t([ht({type:Boolean})],le.prototype,"h12",void 0),t([ht({type:Boolean})],le.prototype,"readOnly",void 0),t([ht({attribute:!1})],le.prototype,"now",void 0),t([ht({attribute:!1})],le.prototype,"localize",void 0),le=t([vt("shs-program-card")],le);let de=class extends nt{constructor(){super(...arguments),this.entityId="",this._busy=!1}async _resume(){this._busy=!0;try{await(t=this.hass,e=this.entityId,t.callWS({type:`${ut}/room/resume`,entity_id:e}))}catch(t){yt(this,this.localize("error.resume",{error:t?.message??String(t)}))}finally{this._busy=!1}var t,e}render(){return B`
      <span class="secondary">${this.localize("room.overridden")}</span>
      <button class="text-button" ?disabled=${this._busy} @click=${this._resume}>
        <ha-svg-icon .path=${"M18,11V12.5C21.19,12.5 23.09,16.05 21.33,18.71L20.24,17.62C21.06,15.96 19.85,14 18,14V15.5L15.75,13.25L18,11M18,22V20.5C14.81,20.5 12.91,16.95 14.67,14.29L15.76,15.38C14.94,17.04 16.15,19 18,19V17.5L20.25,19.75L18,22M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14C13.36,20.45 12.86,19.77 12.5,19H5V8H19V10.59C19.71,10.7 20.39,10.94 21,11.31V5A2,2 0 0,0 19,3Z"}></ha-svg-icon>${this.localize("room.resume")}
      </button>
    `}static{this.styles=[zt,r`
      :host {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 4px 8px;
        justify-content: space-between;
      }
      .secondary {
        font-size: 14px;
      }
      .text-button {
        align-items: center;
        display: inline-flex;
        gap: 6px;
        margin-inline-end: -10px;
      }
      ha-svg-icon {
        --mdc-icon-size: 18px;
      }
    `]}};t([ht({attribute:!1})],de.prototype,"hass",void 0),t([ht()],de.prototype,"entityId",void 0),t([ht({attribute:!1})],de.prototype,"localize",void 0),t([pt()],de.prototype,"_busy",void 0),de=t([vt("shs-resume-row")],de);const ce=[31,29,31,30,31,30,31,31,30,31,30,31],he=366,pe=t=>{const[e,s]=t.split("-").map(Number);return[e,s]},ue=([t,e])=>`${String(t).padStart(2,"0")}-${String(e).padStart(2,"0")}`,me=([t,e])=>ce.slice(0,t-1).reduce((t,e)=>t+e,0)+e,ge=t=>{let e=t,s=0;for(;e>ce[s];)e-=ce[s],s++;return[s+1,e]},be=(t,e)=>t[0]-e[0]||t[1]-e[1],ye=t=>{const e=me(pe(t.start)),s=me(pe(t.end));return e<=s?[[e,s]]:[[e,he],[1,s]]},fe=(t,e,s="long")=>{const[i,a]=pe(t);return new Intl.DateTimeFormat(e,{day:"numeric",month:s}).format(new Date(2024,i-1,a))},_e=()=>Math.random().toString(36).slice(2,10),ve=["#2f6fca","#23794a","#b7791f","#a85b14","#7a4cc2","#b23a48"];let xe=class extends nt{constructor(){super(...arguments),this.seasons=[],this.selected=null,this.today=null,this.language="en"}render(){const t=(e=this.language,Array.from({length:12},(t,s)=>new Intl.DateTimeFormat(e,{month:"narrow"}).format(new Date(2024,s,1))));var e;const s=ce.map(t=>t/he);return B`
      <div class="months" aria-hidden="true">
        ${t.map((t,e)=>B`<span style="width:${100*s[e]}%">${t}</span>`)}
      </div>
      <div class="bar">
        ${this.seasons.flatMap(t=>ye(t).map(([e,s])=>{const i=(s-e+1)/he;return B`<button
              class=${t.id===this.selected?"selected":""}
              style="left:${(e-1)/he*100}%;width:${100*i}%;background:${t.color??"#607d8b"}"
              aria-label=${this.localize("seasons.select",{name:t.name})}
              aria-pressed=${t.id===this.selected}
              @click=${()=>bt(this,"select",{id:t.id})}
            >
              <span>${t.name}</span>
            </button>`}))}
        ${null===this.today?W:B`<div class="today" style="left:${(this.today-.5)/he*100}%"></div>`}
      </div>
    `}static{this.styles=r`
    :host {
      display: block;
    }
    .months {
      color: var(--secondary-text-color);
      display: flex;
      font-size: 10px;
      margin-bottom: 4px;
      text-align: center;
    }
    .months span {
      overflow: hidden;
    }
    .bar {
      background: var(--divider-color);
      border-radius: 8px;
      height: 34px;
      position: relative;
    }
    button {
      border: none;
      border-radius: 6px;
      bottom: 0;
      color: #fff;
      container-type: inline-size;
      cursor: pointer;
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      overflow: hidden;
      padding: 0;
      position: absolute;
      top: 0;
      white-space: nowrap;
    }
    button.selected {
      outline: 2px solid var(--primary-text-color);
      outline-offset: 2px;
      z-index: 1;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    @container (max-width: 56px) {
      button span {
        visibility: hidden;
      }
    }
    .today {
      background: var(--primary-text-color);
      border-radius: 1px;
      bottom: -6px;
      pointer-events: none;
      position: absolute;
      top: -6px;
      transform: translateX(-1px);
      width: 2px;
      z-index: 2;
    }
  `}};t([ht({attribute:!1})],xe.prototype,"seasons",void 0),t([ht()],xe.prototype,"selected",void 0),t([ht({attribute:!1})],xe.prototype,"today",void 0),t([ht()],xe.prototype,"language",void 0),t([ht({attribute:!1})],xe.prototype,"localize",void 0),xe=t([vt("shs-season-bar")],xe);let $e=class extends nt{constructor(){super(...arguments),this.open=!1,this.heading="",this.description="",this.emptyText="",this.confirmLabel="",this.multiple=!1,this.entityIds=[],this._selected=new Set}willUpdate(t){t.has("open")&&this.open&&(this._selected=new Set)}_toggle(t,e){const s=new Set(this._selected);e?s.add(t):s.delete(t),this._selected=s}_pick(t){bt(this,"picked",{entityIds:t})}render(){const t=[...this.entityIds].sort((t,e)=>_t(this.hass,t).localeCompare(_t(this.hass,e)));return B`<shs-dialog .open=${this.open} .heading=${this.heading} @closed=${()=>bt(this,"closed")}>
      ${this.description?B`<p class="secondary">${this.description}</p>`:W}
      ${t.length?B`<ul>
            ${t.map(t=>{const e=((t,e)=>{const s=t.entities?.[e],i=s?.area_id??(s?.device_id?t.devices?.[s.device_id]?.area_id:void 0);return i?t.areas?.[i]?.name:void 0})(this.hass,t),s=B`<span class="name">${_t(this.hass,t)}</span>
                <span class="secondary">${e?`${e} · `:""}${t}</span>`;return B`<li>
                ${this.multiple?B`<label class="item">
                      <input
                        type="checkbox"
                        .checked=${this._selected.has(t)}
                        @change=${e=>this._toggle(t,e.target.checked)}
                      />
                      <span class="text">${s}</span>
                    </label>`:B`<button class="item" @click=${()=>this._pick([t])}>
                      <ha-svg-icon .path=${Mt}></ha-svg-icon>
                      <span class="text">${s}</span>
                    </button>`}
              </li>`})}
          </ul>`:B`<p class="secondary">${this.emptyText}</p>`}
      <button slot="actions" class="text-button" @click=${()=>bt(this,"closed")}>
        ${this.localize("common.cancel")}
      </button>
      ${this.multiple?B`<button
            slot="actions"
            class="filled-button"
            ?disabled=${!this._selected.size}
            @click=${()=>this._pick([...this._selected])}
          >
            ${this.confirmLabel}
          </button>`:W}
    </shs-dialog>`}static{this.styles=[zt,r`
      p {
        margin: 0 0 12px;
      }
      ul {
        list-style: none;
        margin: 0 -8px;
        padding: 0;
      }
      .item {
        align-items: center;
        background: none;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
        color: inherit;
        cursor: pointer;
        display: flex;
        font: inherit;
        gap: 16px;
        padding: 10px 8px;
        text-align: start;
        width: 100%;
      }
      .item:hover,
      .item:focus-visible {
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        outline: none;
      }
      input {
        accent-color: var(--primary-color);
        height: 18px;
        width: 18px;
      }
      ha-svg-icon {
        color: var(--state-climate-heat-color, var(--state-icon-color));
        flex-shrink: 0;
      }
      .text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .text .secondary {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `]}};t([ht({attribute:!1})],$e.prototype,"hass",void 0),t([ht({type:Boolean})],$e.prototype,"open",void 0),t([ht()],$e.prototype,"heading",void 0),t([ht()],$e.prototype,"description",void 0),t([ht()],$e.prototype,"emptyText",void 0),t([ht()],$e.prototype,"confirmLabel",void 0),t([ht({type:Boolean})],$e.prototype,"multiple",void 0),t([ht({attribute:!1})],$e.prototype,"entityIds",void 0),t([ht({attribute:!1})],$e.prototype,"localize",void 0),t([pt()],$e.prototype,"_selected",void 0),$e=t([vt("shs-entity-picker-dialog")],$e);const we=2024,ke=t=>`2024-${t}`,ze=t=>t.slice(5);let Ae=class extends nt{constructor(){super(...arguments),this.open=!1,this.season=null,this.seasons=[],this._draft={id:"",name:"",start:"10-15",end:"04-15",color:ve[0]}}willUpdate(t){t.has("open")&&this.open&&(this._draft=this.season?{...this.season}:{id:_e(),name:"",start:"10-15",end:"04-15",color:ve[this.seasons.length%ve.length]})}_set(t){this._draft={...this._draft,...t}}render(){const t=this._draft,e=((t,e)=>{const s=new Set;for(const[e,i]of ye(t))for(let t=e;t<=i;t++)s.add(t);return e.find(e=>e.id!==t.id&&ye(e).some(([t,e])=>{for(let i=t;i<=e;i++)if(s.has(i))return!0;return!1}))})(t,this.seasons),s=t.name.trim().length>0&&!e;return B`<shs-dialog
      .open=${this.open}
      .heading=${this.localize(this.season?"season_dialog.edit":"season_dialog.new")}
      @closed=${()=>bt(this,"closed")}
    >
      <div class="form">
        <label class="field">
          <span>${this.localize("season_dialog.name")}</span>
          <input
            type="text"
            maxlength="50"
            .value=${t.name}
            @input=${t=>this._set({name:t.target.value})}
          />
        </label>
        <div class="field">
          <span id="color-label">${this.localize("season_dialog.color")}</span>
          <div class="colors" role="radiogroup" aria-labelledby="color-label">
            ${ve.map(e=>B`<button
                role="radio"
                aria-checked=${t.color===e}
                aria-label=${e}
                class=${t.color===e?"selected":""}
                style="background:${e}"
                @click=${()=>this._set({color:e})}
              ></button>`)}
          </div>
        </div>
        <div class="dates">
          <label class="field">
            <span>${this.localize("season_dialog.start")}</span>
            <input
              type="date"
              min="${we}-01-01"
              max="${we}-12-31"
              .value=${ke(t.start)}
              @change=${t=>{const e=t.target.value;e&&this._set({start:ze(e)})}}
            />
          </label>
          <label class="field">
            <span>${this.localize("season_dialog.end")}</span>
            <input
              type="date"
              min="${we}-01-01"
              max="${we}-12-31"
              .value=${ke(t.end)}
              @change=${t=>{const e=t.target.value;e&&this._set({end:ze(e)})}}
            />
          </label>
        </div>
        <p class="secondary note">
          ${this.localize("season_dialog.year")}
          ${i=t,be(pe(i.start),pe(i.end))>0?this.localize("season_dialog.wraps"):W}
        </p>
        ${e?B`<p class="error note" role="alert">
              ${this.localize("season_dialog.overlap",{name:e.name})}
            </p>`:W}
      </div>
      ${this.season?B`<button
            slot="secondary"
            class="text-button danger"
            @click=${()=>bt(this,"delete",{season:this.season})}
          >
            ${this.localize("season_dialog.delete")}
          </button>`:W}
      <button slot="actions" class="text-button" @click=${()=>bt(this,"closed")}>
        ${this.localize("common.cancel")}
      </button>
      <button
        slot="actions"
        class="filled-button"
        ?disabled=${!s}
        @click=${()=>bt(this,"save",{season:{...t,name:t.name.trim()}})}
      >
        ${this.localize("common.save")}
      </button>
    </shs-dialog>`;var i}static{this.styles=[zt,r`
      .form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .field {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
      }
      input[type="text"],
      input[type="date"] {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        color-scheme: light dark;
        font: inherit;
        font-weight: 400;
        height: 44px;
        padding: 0 10px;
        width: 100%;
      }
      .dates {
        display: flex;
        gap: 12px;
      }
      .colors {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .colors button {
        border: 3px solid transparent;
        border-radius: 50%;
        cursor: pointer;
        height: 36px;
        width: 36px;
      }
      .colors button.selected {
        border-color: var(--primary-text-color);
      }
      .note {
        font-size: 13px;
        margin: 0;
      }
    `]}};t([ht({type:Boolean})],Ae.prototype,"open",void 0),t([ht({attribute:!1})],Ae.prototype,"season",void 0),t([ht({attribute:!1})],Ae.prototype,"seasons",void 0),t([ht({attribute:!1})],Ae.prototype,"localize",void 0),t([pt()],Ae.prototype,"_draft",void 0),Ae=t([vt("shs-season-dialog")],Ae);const Se=(t,e,s)=>{const{status:i}=t;if(!t.enabled)return{text:e("status.disabled"),error:!1};if(i.last_error)return{text:e("status.error",{error:i.last_error}),error:!0};if(i.pending)return{text:e("status.pending"),error:!1};const a=null===i.temperature?null:se(i.temperature,s.unit,s.step,!1,s.language);if(!i.end)return null===a?{text:e("status.constant_off"),error:!1}:{text:e("status.constant",{temperature:a}),error:!1};const o=(r=i.end,n=s.h12,l=s.timeZone,Wt(Zt(new Date(r),l).minutes,n));var r,n,l;return null===a?{text:e("status.off_until",{time:o}),error:!1}:{text:e("status.until",{temperature:a,time:o}),error:!1}},Ee=t=>{try{const e=new Intl.DateTimeFormat("en-US",{timeZone:t,month:"numeric",day:"numeric"}).formatToParts(new Date),s=t=>Number(e.find(e=>e.type===t)?.value);return[s("month"),s("day")]}catch{const t=new Date;return[t.getMonth()+1,t.getDate()]}};let Ce=class extends nt{constructor(){super(...arguments),this.narrow=!1,this._drafts={},this._addOpen=!1,this._removeOpen=!1,this._resetOpen=!1,this._seasonDialog=null,this._deleteSeason=null,this._deleteProgram=null,this._rename=null,this._timers=new Map,this._inflight=new Set}disconnectedCallback(){super.disconnectedCallback();for(const t of[...this._timers.keys()])this._flush(t)}willUpdate(t){if(!t.has("state"))return;const e=Object.fromEntries(Object.entries(this._drafts).filter(([t])=>this._timers.has(t)||this._inflight.has(t)));Object.keys(e).length!==Object.keys(this._drafts).length&&(this._drafts=e),!this._room&&this.state.rooms.length&&(this._entityId=this.state.rooms[0].entity_id),this._season||(this._seasonId=this.state.season??this.state.seasons[0]?.id)}get _readOnly(){return!this.hass.user?.is_admin}get _room(){return this.state.rooms.find(t=>t.entity_id===this._entityId)}get _season(){return this.state.seasons.find(t=>t.id===this._seasonId)}_key(t){return`${this._entityId}|${t}`}_programs(t,e){return this._drafts[`${t.entity_id}|${e}`]??t.programs[e]??[]}_error(t){yt(this,this.localize("error.save",{error:t?.message??String(t)}))}async _call(t){try{await t}catch(t){this._error(t)}}_setPrograms(t,e,s=700){const i=this._key(t);this._drafts={...this._drafts,[i]:e};const a=this._timers.get(i);void 0!==a&&clearTimeout(a),this._timers.set(i,window.setTimeout(()=>this._flush(i),s))}async _flush(t){const e=this._timers.get(t);void 0!==e&&clearTimeout(e),this._timers.delete(t);const s=this._drafts[t];if(!s)return;const[i,a]=t.split("|");this._inflight.add(t);try{await mt(this.hass,i,{programs:{[a]:s}})}catch(t){this._error(t)}finally{if(this._inflight.delete(t),!this._timers.has(t)){const{[t]:e,...s}=this._drafts;this._drafts=s}}}_updateProgram(t,e,s,i,a){this._setPrograms(t,e.map(t=>t.id===s?{...t,...i}:t),a)}_toggleDay(t,e,s,i){const a=!e.find(t=>t.id===s).days.includes(i);this._setPrograms(t,e.map(t=>{return t.id===s?{...t,days:a?(e=[...t.days,i],Nt.filter(t=>e.includes(t))):t.days.filter(t=>t!==i)}:a?{...t,days:t.days.filter(t=>t!==i)}:t;var e}),0)}_addProgram(t,e){const s=((t,e)=>e.filter(e=>!t.some(t=>t.days.includes(e))))(e,Nt),i=this.localize(7===s.length?"programs.every_day":"programs.new_name");var a;this._setPrograms(t,[...e,{id:_e(),name:i,days:s,blocks:(a=this.state.unit,a===Jt?[{start:"00:00",temperature:63},{start:"06:30",temperature:68},{start:"22:30",temperature:63}]:[{start:"00:00",temperature:17},{start:"06:30",temperature:20},{start:"22:30",temperature:17}])}],0)}_duplicate(t,e,s){const i={id:_e(),name:this.localize("programs.copy",{name:s.name}).slice(0,50),days:[],blocks:s.blocks.map(t=>({...t}))},a=e.indexOf(s);this._setPrograms(t,[...e.slice(0,a+1),i,...e.slice(a+1)],0)}async _saveSeason(t){this._seasonDialog=null;const e=this.state.seasons.some(e=>e.id===t.id),s=e?this.state.seasons.map(e=>e.id===t.id?t:e):[...this.state.seasons,t];await this._call(gt(this.hass,s)),this._seasonId=t.id}async _removeSeason(t){this._deleteSeason=null,await this._call(gt(this.hass,this.state.seasons.filter(e=>e.id!==t.id))),this._seasonId===t.id&&(this._seasonId=void 0)}async _addRoom(t){this._addOpen=!1;try{await((t,e)=>t.callWS({type:`${ut}/room/add`,entity_id:e}))(this.hass,t),this._entityId=t}catch(t){this._error(t)}}async _removeRoom(){this._removeOpen=!1;const t=this._entityId;this._entityId=void 0,await this._call(((t,e)=>t.callWS({type:`${ut}/room/remove`,entity_id:e}))(this.hass,t))}render(){const t=this.narrow||"always_hidden"===this.hass.dockedSidebar,e=this._room;return B`
      <div class="toolbar">
        ${t?B`<ha-icon-button
              .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
              .label=${"Menu"}
              @click=${()=>bt(this,"hass-toggle-menu")}
            ></ha-icon-button>`:W}
        <div class="title">${this.localize("title")}</div>
        <label class="away">
          <span>${this.localize("away.label")}</span>
          ${At(this.state.away,t=>this._call(((t,e)=>t.callWS({type:`${ut}/away/set`,away:e}))(this.hass,t)),this.localize("away.label"))}
        </label>
      </div>

      <div class="content">
        ${this._readOnly?B`<p class="secondary notice">${this.localize("read_only")}</p>`:W}
        ${e?this._renderEntity(e):this._renderEmpty()} ${this._renderSeasons()}
        ${e?B`<div class="columns">
              ${this._renderNow(e)}
              <section class="programs">${this._renderPrograms(e)}</section>
            </div>`:W}
      </div>
      ${this._renderDialogs(e)}
    `}_renderEmpty(){return B`<ha-card class="empty">
      <ha-svg-icon .path=${Mt}></ha-svg-icon>
      <h2>${this.localize("entity.none_title")}</h2>
      <p class="secondary">${this.localize("entity.none_text")}</p>
      ${this._readOnly?W:B`<button class="filled-button" @click=${()=>this._addOpen=!0}>
            ${this.localize("entity.add")}
          </button>`}
    </ha-card>`}_renderEntity(t){const e=this.hass.states[t.entity_id],s=e?.attributes.current_temperature,i=this.state.unit;return B`<ha-card class="entity">
      <div class="entity-main">
        <label class="field-label" for="entity">${this.localize("entity.label")}</label>
        ${this.state.rooms.length>1?B`<select
              id="entity"
              .value=${t.entity_id}
              @change=${t=>this._entityId=t.target.value}
            >
              ${this.state.rooms.map(e=>B`<option value=${e.entity_id} ?selected=${e.entity_id===t.entity_id}>
                    ${_t(this.hass,e.entity_id)} · ${e.entity_id}
                  </option>`)}
            </select>`:B`<div id="entity" class="entity-name">
              ${_t(this.hass,t.entity_id)} <span class="secondary">· ${t.entity_id}</span>
            </div>`}
        ${"number"==typeof s?B`<span class="secondary small"
              >${this.localize("entity.measured",{temperature:se(s,i,.1,!1,this.hass.locale.language)})}</span
            >`:W}
      </div>
      <div class="entity-actions">
        <label class="switch-label">
          <span class="small">${this.localize("entity.enabled")}</span>
          ${At(t.enabled,e=>this._call(mt(this.hass,t.entity_id,{enabled:e})),this.localize("entity.enabled"),this._readOnly)}
        </label>
        ${this._readOnly?W:B`<ha-icon-button
                .path=${Pt}
                .label=${this.localize("entity.add")}
                @click=${()=>this._addOpen=!0}
              ></ha-icon-button>
              <ha-icon-button
                .path=${Ct}
                .label=${this.localize("entity.remove")}
                @click=${()=>this._removeOpen=!0}
              ></ha-icon-button>`}
      </div>
    </ha-card>`}_renderSeasons(){const t=this.hass.locale.language,e=me(Ee(this.hass.config.time_zone)),s=(t=>{const e=new Array(367).fill(!1);for(const s of t)for(const[t,i]of ye(s))for(let s=t;s<=i;s++)e[s]=!0;const s=[];let i=1;for(;i<=he;){if(e[i]){i++;continue}let t=i;for(;t+1<=he&&!e[t+1];)t++;s.push([i,t]),i=t+1}return s})(this.state.seasons),i=s.map(([e,s])=>`${fe(ue(ge(e)),t,"short")} – ${fe(ue(ge(s)),t,"short")}`).join(", "),a=this._room;return B`<ha-card class="seasons">
      <div class="section-header">
        <div class="heading">
          <h2>${this.localize("seasons.title")}</h2>
          <span class="secondary small">${this.localize("seasons.subtitle")}</span>
        </div>
        ${this._readOnly?W:B`<button class="outlined-button" @click=${()=>this._resetOpen=!0}>
                <ha-svg-icon .path=${"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"}></ha-svg-icon>${this.localize("seasons.reset")}
              </button>
              <button class="filled-button small" @click=${()=>this._seasonDialog={season:null}}>
                <ha-svg-icon .path=${Pt}></ha-svg-icon>${this.localize("seasons.new")}
              </button>`}
      </div>
      <shs-season-bar
        .seasons=${this.state.seasons}
        .selected=${this._seasonId??null}
        .today=${e}
        .language=${t}
        .localize=${this.localize}
        @select=${t=>this._seasonId=t.detail.id}
      ></shs-season-bar>
      <span class="secondary small">
        ${s.length?this.localize("seasons.outside",{ranges:i}):this.localize("seasons.always")}
      </span>
      <div class="season-list">
        ${this.state.seasons.map(e=>{const s=a?this._programs(a,e.id).length:0,i=a?0===s?this.localize("seasons.programs_none"):1===s?this.localize("seasons.programs_one"):this.localize("seasons.programs",{count:String(s)}):"",o=e.id===this._seasonId;return B`<div class="season ${o?"selected":""}" style="--season-color:${e.color??"#607d8b"}">
            <button class="season-select" aria-pressed=${o} @click=${()=>this._seasonId=e.id}>
              <span class="dot"></span>
              <span class="season-text">
                <span class="season-name"
                  >${e.name}
                  ${e.id===this.state.season?B`<span class="badge">${this.localize("seasons.today")}</span>`:W}</span
                >
                <span class="secondary small"
                  >${fe(e.start,t,"short")} → ${fe(e.end,t,"short")}${i?` · ${i}`:""}</span
                >
              </span>
            </button>
            ${this._readOnly?W:B`<ha-icon-button
                  .path=${Ht}
                  .label=${this.localize("seasons.edit",{name:e.name})}
                  @click=${()=>this._seasonDialog={season:e}}
                ></ha-icon-button>`}
          </div>`})}
      </div>
    </ha-card>`}_renderNow(t){const e=this.state.unit,s=this.hass.locale.language,i=Yt(this.hass.states[t.entity_id],e),a=t.status,o=this.state.seasons.find(t=>t.id===a.season),r=o?t.programs[o.id]?.find(t=>t.id===a.program):void 0,n=Se(t,this.localize,{unit:e,step:.5,h12:Ft(this.hass),language:s,timeZone:this.hass.config.time_zone}),l=this._nextSeason(),d=null===a.temperature?this.localize("now.off"):se(a.temperature,e,.5,!1,s),c=this.hass.states[t.entity_id]?.attributes.preset_modes?.includes("away")?this.localize("away.preset"):this.localize("away.temperature",{temperature:se(this.state.away_temperature,e,i.step,!1,s)});return B`<ha-card class="now">
      <div class="section-header">
        <h2>${this.localize("now.title")}</h2>
      </div>
      ${this.state.away?B`<div class="away-banner">
            <strong>${this.localize("away.active")}</strong>
            <span class="small">${c}</span>
          </div>`:B`<div class="big">
              <span class="value">${t.enabled?d:"—"}</span>
              <span class="${n.error?"error":"secondary"} small">${n.text}</span>
            </div>
            <dl>
              <div>
                <dt>${this.localize("now.season")}</dt>
                <dd>${o?.name??this.localize("now.none")}</dd>
              </div>
              <div>
                <dt>${this.localize("now.program")}</dt>
                <dd>${r?.name??this.localize("now.none")}</dd>
              </div>
              <div>
                <dt>${this.localize("now.next_season")}</dt>
                <dd>
                  ${l?`${l.name} · ${fe(l.start,s)}`:this.localize("now.none")}
                </dd>
              </div>
            </dl>`}
      ${t.enabled&&a.overridden?B`<shs-resume-row .hass=${this.hass} .entityId=${t.entity_id} .localize=${this.localize}></shs-resume-row>`:B`<span class="secondary small">${this.localize("now.manual_hint")}</span>`}
    </ha-card>`}_nextSeason(){const t=me(Ee(this.hass.config.time_zone));let e,s=1/0;for(const i of this.state.seasons){const a=(me(pe(i.start))-t+366)%366;a>0&&a<s&&(e=i,s=a)}return e}_renderPrograms(t){const e=this._season;if(!e)return W;const s=this._programs(t,e.id),i=this.hass.locale.language,a=this.state.unit,o=this.hass.states[t.entity_id],r=Yt(o,a),n=(t=>[...Nt.slice(t),...Nt.slice(0,t)])((t=>{const e=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],s=t.locale.first_weekday;if(s&&e.includes(s))return e.indexOf(s);try{const e=new Intl.Locale(t.locale.language),s=e.getWeekInfo?.()??e.weekInfo;if(s)return(s.firstDay+6)%7}catch{}return 0})(this.hass)),l=n.filter(t=>!s.some(e=>e.days.includes(t))),d=Zt(new Date,this.hass.config.time_zone),c=Ee(this.hass.config.time_zone),h=((t,e)=>{const s=pe(t.start),i=pe(t.end);return be(s,i)<=0?be(s,e)<=0&&be(e,i)<=0:be(e,s)>=0||be(e,i)<=0})(e,c);return B`
      <div class="section-header">
        <div class="heading">
          <h2><span class="dot" style="--season-color:${e.color??"#607d8b"}"></span>${this.localize("programs.title",{season:e.name})}</h2>
          <span class="secondary small">${this.localize("programs.hint")}</span>
        </div>
        ${this._readOnly?W:B`<button class="filled-button small" @click=${()=>this._addProgram(e.id,s)}>
              <ha-svg-icon .path=${Pt}></ha-svg-icon>${this.localize("programs.new")}
            </button>`}
      </div>
      ${s.length?l.length?B`<div class="warning" role="status">
              <ha-svg-icon .path=${Et}></ha-svg-icon>${this.localize("programs.uncovered",{days:l.map(t=>Kt(i,Nt.indexOf(t))).join(", ")})}
            </div>`:W:B`<div class="warning" role="status">
            <ha-svg-icon .path=${Et}></ha-svg-icon>${this.localize("programs.empty")}
          </div>`}
      ${s.map(t=>B`<shs-program-card
          .program=${t}
          .others=${s.filter(e=>e.id!==t.id)}
          .days=${n}
          .unit=${a}
          .limits=${r}
          .canTurnOff=${(t=>!t||(t.attributes.hvac_modes??[]).includes("off"))(o)}
          .language=${i}
          .h12=${Ft(this.hass)}
          .readOnly=${this._readOnly}
          .now=${h&&t.days.includes(Nt[d.weekday])?d.minutes:null}
          .localize=${this.localize}
          @day-toggled=${i=>this._toggleDay(e.id,s,t.id,i.detail.day)}
          @blocks-changed=${i=>this._updateProgram(e.id,s,t.id,{blocks:i.detail.blocks})}
          @rename=${()=>this._rename={program:t,name:t.name}}
          @duplicate=${()=>this._duplicate(e.id,s,t)}
          @delete=${()=>this._deleteProgram=t}
        ></shs-program-card>`)}
    `}_renderDialogs(t){const e=this._season,s=t&&e?this._programs(t,e.id):[],i=new Set(this.state.rooms.map(t=>t.entity_id)),a=t?_t(this.hass,t.entity_id):"";return B`
      <shs-entity-picker-dialog
        .hass=${this.hass}
        .open=${this._addOpen}
        .heading=${this.localize("entity.choose")}
        .emptyText=${this.localize("entity.no_thermostats")}
        .entityIds=${Object.keys(this.hass.states).filter(t=>t.startsWith("climate.")&&!i.has(t))}
        .localize=${this.localize}
        @closed=${()=>this._addOpen=!1}
        @picked=${t=>this._addRoom(t.detail.entityIds[0])}
      ></shs-entity-picker-dialog>

      <shs-season-dialog
        .open=${null!==this._seasonDialog}
        .season=${this._seasonDialog?.season??null}
        .seasons=${this.state.seasons}
        .localize=${this.localize}
        @closed=${()=>this._seasonDialog=null}
        @save=${t=>this._saveSeason(t.detail.season)}
        @delete=${t=>{this._seasonDialog=null,this._deleteSeason=t.detail.season}}
      ></shs-season-dialog>

      ${this._confirm(this._removeOpen,this.localize("entity.remove"),this.localize("entity.remove_text",{name:a}),this.localize("common.delete"),()=>this._removeRoom(),()=>this._removeOpen=!1)}
      ${this._confirm(this._resetOpen,this.localize("seasons.reset_title"),this.localize("seasons.reset_text"),this.localize("common.replace"),async()=>{var t;this._resetOpen=!1,await this._call((t=this.hass,t.callWS({type:`${ut}/seasons/reset`})))},()=>this._resetOpen=!1)}
      ${this._confirm(null!==this._deleteSeason,this.localize("season_dialog.delete"),this.localize("season_dialog.delete_text",{name:this._deleteSeason?.name??""}),this.localize("common.delete"),()=>this._removeSeason(this._deleteSeason),()=>this._deleteSeason=null)}
      ${this._confirm(null!==this._deleteProgram,this.localize("programs.delete",{name:this._deleteProgram?.name??""}),this.localize("programs.delete_text",{name:this._deleteProgram?.name??""}),this.localize("common.delete"),()=>{const t=this._deleteProgram.id;this._deleteProgram=null,e&&this._setPrograms(e.id,s.filter(e=>e.id!==t),0)},()=>this._deleteProgram=null)}

      <shs-dialog
        .open=${null!==this._rename}
        .heading=${this._rename?this.localize("programs.rename",{name:this._rename.program.name}):""}
        @closed=${()=>this._rename=null}
      >
        <label class="field">
          <span>${this.localize("programs.name")}</span>
          <input
            type="text"
            maxlength="50"
            .value=${this._rename?.name??""}
            @input=${t=>this._rename&&(this._rename={...this._rename,name:t.target.value})}
          />
        </label>
        <button slot="actions" class="text-button" @click=${()=>this._rename=null}>
          ${this.localize("common.cancel")}
        </button>
        <button
          slot="actions"
          class="filled-button"
          ?disabled=${!this._rename?.name.trim()}
          @click=${()=>{const t=this._rename;this._rename=null,e&&this._updateProgram(e.id,s,t.program.id,{name:t.name.trim()},0)}}
        >
          ${this.localize("common.save")}
        </button>
      </shs-dialog>
    `}_confirm(t,e,s,i,a,o){return B`<shs-dialog .open=${t} .heading=${e} @closed=${o}>
      <p>${s}</p>
      <button slot="actions" class="text-button" @click=${o}>${this.localize("common.cancel")}</button>
      <button slot="actions" class="filled-button danger" @click=${a}>${i}</button>
    </shs-dialog>`}static{this.styles=[zt,St,r`
      :host {
        display: block;
        font-size: 13px;
      }
      .toolbar .title {
        font-size: 18px;
      }
      .away {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        gap: 8px;
        margin-inline-end: 4px;
      }
      .content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 0 auto;
        max-width: 1180px;
        padding: 12px 12px 32px;
      }
      ha-card {
        padding: 12px 14px;
      }
      h2 {
        align-items: center;
        display: flex;
        font-size: 15px;
        font-weight: 600;
        gap: 8px;
        margin: 0;
      }
      .small {
        font-size: 12px;
      }
      .notice {
        margin: 0;
        text-align: center;
      }
      .section-header {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .heading {
        display: flex;
        flex: 1 1 200px;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .filled-button.small,
      .outlined-button {
        align-items: center;
        display: inline-flex;
        font-size: 13px;
        gap: 6px;
        min-height: 36px;
        padding: 0 14px;
      }
      .outlined-button {
        background: none;
        border: 1px solid var(--divider-color);
        border-radius: 18px;
        color: var(--primary-text-color);
        cursor: pointer;
        font: inherit;
        font-weight: 500;
      }
      .filled-button ha-svg-icon,
      .outlined-button ha-svg-icon {
        --mdc-icon-size: 18px;
      }
      .empty {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 28px 16px;
        text-align: center;
      }
      .empty ha-svg-icon {
        color: var(--secondary-text-color);
        --mdc-icon-size: 44px;
      }
      .empty p {
        margin: 0 0 8px;
        max-width: 480px;
      }
      .entity {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
      }
      .entity-main {
        display: flex;
        flex: 1 1 260px;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }
      .field-label {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
      }
      .entity-name {
        font-size: 15px;
        font-weight: 600;
      }
      select,
      .field input {
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        font: inherit;
        height: 40px;
        padding: 0 10px;
        width: 100%;
      }
      .entity-actions {
        align-items: center;
        display: flex;
        gap: 4px;
      }
      .switch-label {
        align-items: center;
        display: flex;
        gap: 8px;
        margin-inline-end: 4px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .seasons {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .season-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .season {
        align-items: center;
        border: 2px solid var(--divider-color);
        border-radius: 10px;
        display: flex;
        flex: 1 1 150px;
        gap: 2px;
        min-width: 0;
        padding: 2px 2px 2px 10px;
      }
      .season.selected {
        border-color: var(--season-color);
      }
      .season-select {
        align-items: center;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        display: flex;
        flex: 1;
        font: inherit;
        gap: 8px;
        min-height: 44px;
        min-width: 0;
        padding: 0;
        text-align: start;
      }
      .season-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .season-name {
        align-items: center;
        display: flex;
        font-weight: 600;
        gap: 6px;
      }
      .dot {
        background: var(--season-color);
        border-radius: 50%;
        flex-shrink: 0;
        height: 10px;
        width: 10px;
      }
      .badge {
        background: color-mix(in srgb, var(--primary-color) 15%, transparent);
        border-radius: 999px;
        color: var(--primary-color);
        font-size: 10px;
        font-weight: 600;
        padding: 1px 6px;
      }
      .columns {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .now {
        box-sizing: border-box;
        display: flex;
        flex: 1 1 260px;
        flex-direction: column;
        gap: 10px;
      }
      .big {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .big .value {
        font-size: 30px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      dl {
        display: grid;
        gap: 8px 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 0;
      }
      dt {
        color: var(--secondary-text-color);
        font-size: 11px;
      }
      dd {
        font-weight: 600;
        margin: 0;
      }
      .away-banner {
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
      }
      .programs {
        display: flex;
        flex: 999 1 520px;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
      }
      .warning {
        align-items: center;
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        border-radius: 10px;
        display: flex;
        font-size: 12px;
        gap: 8px;
        padding: 8px 12px;
      }
      .warning ha-svg-icon {
        color: var(--warning-color, #ff9800);
        flex-shrink: 0;
        --mdc-icon-size: 18px;
      }
      .field {
        display: flex;
        flex-direction: column;
        font-size: 13px;
        font-weight: 600;
        gap: 6px;
      }
    `]}};t([ht({attribute:!1})],Ce.prototype,"hass",void 0),t([ht({attribute:!1})],Ce.prototype,"state",void 0),t([ht({type:Boolean})],Ce.prototype,"narrow",void 0),t([ht({attribute:!1})],Ce.prototype,"localize",void 0),t([pt()],Ce.prototype,"_entityId",void 0),t([pt()],Ce.prototype,"_seasonId",void 0),t([pt()],Ce.prototype,"_drafts",void 0),t([pt()],Ce.prototype,"_addOpen",void 0),t([pt()],Ce.prototype,"_removeOpen",void 0),t([pt()],Ce.prototype,"_resetOpen",void 0),t([pt()],Ce.prototype,"_seasonDialog",void 0),t([pt()],Ce.prototype,"_deleteSeason",void 0),t([pt()],Ce.prototype,"_deleteProgram",void 0),t([pt()],Ce.prototype,"_rename",void 0),Ce=t([vt("shs-main-view")],Ce);let Oe=class extends nt{constructor(){super(...arguments),this.narrow=!1,this._ready=!1}connectedCallback(){super.connectedCallback(),(ft??=(async()=>{if(customElements.get("ha-card")&&customElements.get("ha-switch"))return;const t=window.loadCardHelpers;if(t)try{const e=await t();e.createCardElement({type:"entities",entities:[]}),e.createRowElement?.({entity:"input_boolean.smart_heating_schedule_preload"}),await Promise.race([Promise.all(["ha-card","ha-switch","ha-icon-button"].map(t=>customElements.whenDefined(t))),new Promise(t=>setTimeout(t,3e3))])}catch{}})(),ft).then(()=>this._ready=!0),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.then(t=>t()).catch(()=>{}),this._unsubscribe=void 0}willUpdate(t){t.has("hass")&&this.hass&&(!this._unsubscribe&&this.isConnected&&this._subscribe(),this.toggleAttribute("dark",Boolean(this.hass.themes?.darkMode)),this.hass.locale.language!==this._language&&(this._language=this.hass.locale.language,this._localize=kt(this._language)))}_subscribe(){var t,e;this._unsubscribe=(t=this.hass,e=t=>{this._state=t,this._error=void 0},t.connection.subscribeMessage(e,{type:`${ut}/subscribe`})),this._unsubscribe.catch(t=>{this._error="not_loaded"===t?.code?this._localize("not_loaded"):t?.message??String(t)})}render(){const t=this._localize??kt("en");return this._error?B`<div class="message"><ha-card class="padded">${this._error}</ha-card></div>`:this._state&&this._ready?B`<shs-main-view
      .hass=${this.hass}
      .state=${this._state}
      .narrow=${this.narrow}
      .localize=${t}
    ></shs-main-view>`:B`<div class="message secondary">${t("loading")}</div>`}static{this.styles=[zt,r`
      :host {
        background: var(--primary-background-color);
        display: block;
        height: 100%;
        overflow-y: auto;
        /* Light themes: darker block text and lighter block backgrounds. */
        --shs-text-mix: 55%;
        --shs-block-mix: 38%;
        --shs-block-list-mix: 14%;
      }
      :host([dark]) {
        --shs-text-mix: 100%;
        --shs-block-mix: 42%;
        --shs-block-list-mix: 18%;
      }
      .message {
        margin: 0 auto;
        max-width: 600px;
        padding: 32px 16px;
        text-align: center;
      }
      .padded {
        padding: 16px;
      }
    `]}};t([ht({attribute:!1})],Oe.prototype,"hass",void 0),t([ht({type:Boolean,reflect:!0})],Oe.prototype,"narrow",void 0),t([ht({attribute:!1})],Oe.prototype,"route",void 0),t([ht({attribute:!1})],Oe.prototype,"panel",void 0),t([pt()],Oe.prototype,"_state",void 0),t([pt()],Oe.prototype,"_error",void 0),t([pt()],Oe.prototype,"_ready",void 0),Oe=t([vt("smart-heating-schedule-panel")],Oe);export{Oe as SmartHeatingSchedulePanel};
