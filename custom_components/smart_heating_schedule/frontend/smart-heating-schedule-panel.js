function e(e,t,s,i){var a,o=arguments.length,r=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(o<3?a(r):o>3?a(t,s,r):a(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;let o=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&a.set(t,e))}return e}toString(){return this.cssText}};const r=e=>new o("string"==typeof e?e:e+"",void 0,i),n=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new o(s,e,i)},l=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return r(t)})(e):e,{is:d,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:m}=Object,g=globalThis,f=g.trustedTypes,b=f?f.emptyScript:"",y=g.reactiveElementPolyfillSupport,_=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?b:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},x=(e,t)=>!d(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const o=i?.call(this);a?.call(this,t),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),a=t.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=i;const o=a.fromAttribute(t,e.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(void 0!==e){const o=this.constructor;if(!1===i&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??x)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==a||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[_("elementProperties")]=new Map,w[_("finalized")]=new Map,y?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,z=e=>e,A=k.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+E,H=`<${O}>`,M=document,T=()=>M.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,L=Array.isArray,V="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,I=/>/g,U=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),Z=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,X=M.createTreeWalker(M,129);function K(e,t){if(!L(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}class J{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0;const r=e.length-1,n=this.parts,[l,d]=((e,t)=>{const s=e.length-1,i=[];let a,o=2===t?"<svg>":3===t?"<math>":"",r=D;for(let t=0;t<s;t++){const s=e[t];let n,l,d=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===D?"!--"===l[1]?r=N:void 0!==l[1]?r=I:void 0!==l[2]?(B.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=U):void 0!==l[3]&&(r=U):r===U?">"===l[0]?(r=a??D,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?U:'"'===l[3]?j:R):r===j||r===R?r=U:r===N||r===I?r=D:(r=U,a=void 0);const h=r===U&&e[t+1].startsWith("/>")?" ":"";o+=r===D?s+H:d>=0?(i.push(n),s.slice(0,d)+C+s.slice(d)+E+h):s+E+(-2===d?t:h)}return[K(e,o+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]})(e,t);if(this.el=J.createElement(l,s),X.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=X.nextNode())&&n.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(C)){const t=d[o++],s=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?te:"?"===r[1]?se:"@"===r[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(E)&&(n.push({type:6,index:a}),i.removeAttribute(e));if(B.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],T()),X.nextNode(),n.push({type:2,index:++a});i.append(e[t],T())}}}else if(8===i.nodeType)if(i.data===O)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)n.push({type:7,index:a}),e+=E.length-1}a++}}static createElement(e,t){const s=M.createElement("template");return s.innerHTML=e,s}}function Q(e,t,s=e,i){if(t===Z)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const o=P(t)?void 0:t._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=Q(e,a._$AS(e,t.values),a,i)),t}class G{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);X.currentNode=i;let a=X.nextNode(),o=0,r=0,n=s[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Y(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new ae(a,this,e)),this._$AV.push(t),n=s[++r]}o!==n?.index&&(a=X.nextNode(),o++)}return X.currentNode=M,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),P(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==Z&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>L(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=J.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new G(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new J(e)),t}k(e){L(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new Y(this.O(T()),this.O(T()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=z(e).nextSibling;z(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(e,t=this,s,i){const a=this.strings;let o=!1;if(void 0===a)e=Q(this,e,t,0),o=!P(e)||e!==this._$AH&&e!==Z,o&&(this._$AH=e);else{const i=e;let r,n;for(e=a[0],r=0;r<a.length-1;r++)n=Q(this,i[s+r],t,r),n===Z&&(n=this._$AH[r]),o||=!P(n)||n!==this._$AH[r],n===q?e=q:e!==q&&(e+=(n??"")+a[r+1]),this._$AH[r]=n}o&&!i&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class se extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class ie extends ee{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??q)===Z)return;const s=this._$AH,i=e===q&&s!==q||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const oe={I:Y},re=k.litHtmlPolyfillSupport;re?.(J,Y),(k.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;let le=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new Y(t.insertBefore(T(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}};le._$litElement$=!0,le.finalized=!0,ne.litElementHydrateSupport?.({LitElement:le});const de=ne.litElementPolyfillSupport;de?.({LitElement:le}),(ne.litElementVersions??=[]).push("4.2.2");const ce={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:x},he=(e=ce,t,s)=>{const{kind:i,metadata:a}=s;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),o.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const a=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,a,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const a=this[i];t.call(this,s),this.requestUpdate(i,a,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function pe(e){return(t,s)=>"object"==typeof s?he(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function ue(e){return pe({...e,state:!0,attribute:!1})}const me="smart_heating_schedule",ge=(e,t,s)=>e.callWS({type:`${me}/room/save`,entity_id:t,...s}),fe=(e,t)=>e.callWS({type:`${me}/seasons/save`,seasons:t}),be=(e,t,s)=>{e.dispatchEvent(new CustomEvent(t,{bubbles:!0,composed:!0,detail:s}))},ye=(e,t)=>{be(e,"hass-notification",{message:t})};let _e;const ve=(e,t)=>{const s=e.states[t]?.attributes.friendly_name;if(s)return s;const i=e.entities?.[t]?.device_id,a=i?e.devices?.[i]:void 0;return a?.name_by_user||a?.name||t},xe=e=>t=>{customElements.get(e)||customElements.define(e,t)},$e={title:"Heating schedule",loading:"Loading…",not_loaded:"The seasonal heating schedule is not set up. Add the integration under Settings → Devices & services.",read_only:"Only administrators can change schedules.",away:{label:"Away",active:"Away is on",preset:"The thermostat uses its away preset. The schedule resumes when you turn Away off.",temperature:"The thermostat keeps {temperature}. The schedule resumes when you turn Away off."},entity:{label:"Entity controlled by the schedule",add:"Add thermostat",choose:"Choose the thermostat to schedule",none_title:"Choose what to schedule",none_text:"Pick the climate entity of your boiler or thermostat. The schedule sets its temperature and turns it off outside the seasons.",no_thermostats:"All climate entities already have a schedule.",enabled:"Schedule active",remove:"Remove schedule",remove_text:"Stop scheduling {name} and delete its programs?",measured:"Measured {temperature}"},seasons:{title:"Seasons",subtitle:"Dates repeat every year and apply to all thermostats.",reset:"From Home Assistant",reset_title:"Use Home Assistant's seasons",reset_text:"Replace your seasons with winter, spring, summer and autumn as Home Assistant defines them. Programs of seasons that no longer exist are deleted.",new:"New",edit:"Edit {name}",select:"Show {name}",today:"today",outside:"Outside the seasons ({ranges}) heating is off",always:"The seasons cover the whole year",programs_one:"1 program",programs:"{count} programs",programs_none:"no programs: off"},season_dialog:{new:"New season",edit:"Edit season",name:"Name",color:"Color",start:"Start",end:"End",year:"The year is ignored: the season repeats every year.",wraps:"Runs across new year.",overlap:"Overlaps with {name}.",delete:"Delete season",delete_text:"Delete {name} and the programs in it?"},now:{title:"Now",scheduled:"requested",off:"Off",season:"Season",program:"Program",block:"Current block",next:"Next change",next_season:"Next season",none:"None",manual:"Scheduled temperature: {scheduled}",manual_off:"The schedule has the heating off now",manual_hint:"If you change the temperature by hand, it holds until the next block."},programs:{title:"Programs · {season}",legend:"Temperature colours",hint:"Tap a day to move it here. Tap a block to change its temperature and times.",new:"Program",new_name:"New program",every_day:"Every day",no_days:"No day selected",empty:"No programs in this season: heating is off.",uncovered:"No program on {days}: heating is off on those days.",duplicate:"Duplicate {name}",delete:"Delete {name}",delete_text:"Delete the program {name}?",rename:"Rename {name}",name:"Name",copy:"{name} (copy)",day_mine:"{day}: in this program",day_other:"{day}: in {program}, tap to move it here",day_free:"{day}: no program"},block:{hint:"Tap a block on the bar to edit it; use ‹ › to reach short blocks.",hint_touch:"Tap a block to edit it; − and + change its times. Use ‹ › to reach short blocks.",previous:"Previous block",next:"Next block",split:"Split",delete:"Delete block",close:"Close",lower:"Lower by {step}",raise:"Raise by {step}",off:"Off",start:"Start",end:"End",earlier:"{what} 15 minutes earlier",later:"{what} 15 minutes later",divider:"Change at {time}: drag, or use the left and right arrow keys",name:"Name",name_placeholder:"Optional, e.g. Wake up"},status:{until:"{temperature} until {time}",off_until:"Off until {time}",constant:"{temperature}",constant_off:"Off",named:"{name} · {status}",disabled:"Schedule is off",pending:"Waiting for the thermostat",error:"Could not update the thermostat: {error}"},room:{overridden:"Manual change",overridden_until:"It lasts until the next block, at {time}: then the schedule takes over again.",overridden_hint:"It lasts until the next block: then the schedule takes over again.",resume:"Back to the schedule"},common:{cancel:"Cancel",save:"Save",add:"Add",delete:"Delete",close:"Close",replace:"Replace"},error:{save:"Could not save: {error}",resume:"Could not restore the schedule: {error}"}},we={en:$e,it:{title:"Cronotermostato",loading:"Caricamento…",not_loaded:"Il cronotermostato stagionale non è configurato. Aggiungi l'integrazione in Impostazioni → Dispositivi e servizi.",read_only:"Solo gli amministratori possono modificare la programmazione.",away:{label:"Fuori casa",active:"Fuori casa attivo",preset:"Il termostato usa il suo preset Fuori casa. Il programma riprende quando disattivi Fuori casa.",temperature:"Il termostato tiene {temperature}. Il programma riprende quando disattivi Fuori casa."},entity:{label:"Entità comandata dalla programmazione",add:"Aggiungi termostato",choose:"Scegli il termostato da programmare",none_title:"Scegli cosa programmare",none_text:"Seleziona l'entità climate della caldaia o del termostato. Il programma ne imposta la temperatura e la spegne fuori stagione.",no_thermostats:"Tutte le entità climate hanno già una programmazione.",enabled:"Programmazione attiva",remove:"Rimuovi programmazione",remove_text:"Smettere di programmare {name} ed eliminare i suoi programmi?",measured:"Misurata {temperature}"},seasons:{title:"Stagioni",subtitle:"Le date si ripetono ogni anno e valgono per tutti i termostati.",reset:"Da Home Assistant",reset_title:"Usa le stagioni di Home Assistant",reset_text:"Sostituisce le tue stagioni con inverno, primavera, estate e autunno come li definisce Home Assistant. I programmi delle stagioni che non esistono più vengono eliminati.",new:"Nuova",edit:"Modifica {name}",select:"Mostra {name}",today:"oggi",outside:"Fuori stagione ({ranges}) la caldaia resta spenta",always:"Le stagioni coprono tutto l'anno",programs_one:"1 programma",programs:"{count} programmi",programs_none:"nessun programma: spento"},season_dialog:{new:"Nuova stagione",edit:"Modifica stagione",name:"Nome",color:"Colore",start:"Inizio",end:"Fine",year:"L'anno non conta: la stagione si ripete ogni anno.",wraps:"Attraversa il capodanno.",overlap:"Si sovrappone a {name}.",delete:"Elimina stagione",delete_text:"Eliminare {name} e i suoi programmi?"},now:{title:"Adesso",scheduled:"richiesti",off:"Spento",season:"Stagione",program:"Programma",block:"Fascia attuale",next:"Prossimo cambio",next_season:"Prossima stagione",none:"Nessuno",manual:"Temperatura del programma: {scheduled}",manual_off:"Secondo il programma la caldaia sarebbe spenta",manual_hint:"Se cambi la temperatura a mano, vale fino al prossimo cambio di fascia."},programs:{title:"Programmi · {season}",legend:"Colori delle temperature",hint:"Tocca un giorno per spostarlo qui. Tocca una fascia per cambiarne temperatura e orari.",new:"Programma",new_name:"Nuovo programma",every_day:"Tutti i giorni",no_days:"Nessun giorno selezionato",empty:"Nessun programma in questa stagione: la caldaia resta spenta.",uncovered:"Nessun programma per {days}: in quei giorni la caldaia resta spenta.",duplicate:"Duplica {name}",delete:"Elimina {name}",delete_text:"Eliminare il programma {name}?",rename:"Rinomina {name}",name:"Nome",copy:"{name} (copia)",day_mine:"{day}: in questo programma",day_other:"{day}: in {program}, tocca per spostarlo qui",day_free:"{day}: senza programma"},block:{hint:"Tocca una fascia nella barra per modificarla; con ‹ › raggiungi anche quelle più strette.",hint_touch:"Tocca una fascia per modificarla: con − e + cambi gli orari, con ‹ › passi alle fasce vicine.",previous:"Fascia precedente",next:"Fascia successiva",split:"Dividi",delete:"Elimina fascia",close:"Chiudi",lower:"Diminuisci di {step}",raise:"Aumenta di {step}",off:"Spento",start:"Inizio",end:"Fine",earlier:"{what} 15 minuti prima",later:"{what} 15 minuti dopo",divider:"Cambio alle {time}: trascina, oppure usa le frecce sinistra e destra",name:"Nome",name_placeholder:"Facoltativo, es. Risveglio"},status:{until:"{temperature} fino alle {time}",off_until:"Spento fino alle {time}",constant:"{temperature}",constant_off:"Spento",named:"{name} · {status}",disabled:"Programmazione disattivata",pending:"In attesa del termostato",error:"Impossibile aggiornare il termostato: {error}"},room:{overridden:"Modifica manuale",overridden_until:"Vale fino al prossimo cambio di fascia, alle {time}: poi il programma riprende.",overridden_hint:"Vale fino al prossimo cambio di fascia: poi il programma riprende.",resume:"Torna al programma"},common:{cancel:"Annulla",save:"Salva",add:"Aggiungi",delete:"Elimina",close:"Chiudi",replace:"Sostituisci"},error:{save:"Impossibile salvare: {error}",resume:"Impossibile ripristinare il programma: {error}"}}},ke=(e,t)=>{let s=e;for(const e of t.split("."))s=s?.[e];return"string"==typeof s?s:void 0},ze=e=>{const t=we[e]??we[e.split("-")[0]];return(e,s)=>{let i=ke(t,e)??ke($e,e)??e;for(const[e,t]of Object.entries(s??{}))i=i.replaceAll(`{${e}}`,t);return i}},Ae=n`
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
`,Se=(e,t,s,i=!1)=>customElements.get("ha-switch")?F`<ha-switch
        .checked=${e}
        .disabled=${i}
        aria-label=${s}
        @change=${e=>t(e.target.checked)}
      ></ha-switch>`:F`<input
        type="checkbox"
        role="switch"
        class="switch-fallback"
        .checked=${e}
        ?disabled=${i}
        aria-label=${s}
        @change=${e=>t(e.target.checked)}
      />`,Ce=n`
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
`;var Ee="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",Oe="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",He="M19,13H5V11H19V13Z",Me="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z",Te="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Pe="M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z";const Le=2,Ve=e=>(...t)=>({_$litDirective$:e,values:t});let De=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const{I:Ne}=oe,Ie=e=>e,Ue=()=>document.createComment(""),Re=(e,t,s)=>{const i=e._$AA.parentNode,a=void 0===t?e._$AB:t._$AA;if(void 0===s){const t=i.insertBefore(Ue(),a),o=i.insertBefore(Ue(),a);s=new Ne(t,o,e,e.options)}else{const t=s._$AB.nextSibling,o=s._$AM,r=o!==e;if(r){let t;s._$AQ?.(e),s._$AM=e,void 0!==s._$AP&&(t=e._$AU)!==o._$AU&&s._$AP(t)}if(t!==a||r){let e=s._$AA;for(;e!==t;){const t=Ie(e).nextSibling;Ie(i).insertBefore(e,a),e=t}}}return s},je=(e,t,s=e)=>(e._$AI(t,s),e),Be={},Fe=(e,t=Be)=>e._$AH=t,Ze=e=>{e._$AR(),e._$AA.remove()},qe=Ve(class extends De{constructor(){super(...arguments),this.key=q}render(e,t){return this.key=e,t}update(e,[t,s]){return t!==this.key&&(Fe(e),this.key=t),s}}),We=(e,t,s)=>{const i=new Map;for(let a=t;a<=s;a++)i.set(e[a],a);return i},Xe=Ve(class extends De{constructor(e){if(super(e),e.type!==Le)throw Error("repeat() can only be used in text expressions")}dt(e,t,s){let i;void 0===s?s=t:void 0!==t&&(i=t);const a=[],o=[];let r=0;for(const t of e)a[r]=i?i(t,r):r,o[r]=s(t,r),r++;return{values:o,keys:a}}render(e,t,s){return this.dt(e,t,s).values}update(e,[t,s,i]){const a=(e=>e._$AH)(e),{values:o,keys:r}=this.dt(t,s,i);if(!Array.isArray(a))return this.ut=r,o;const n=this.ut??=[],l=[];let d,c,h=0,p=a.length-1,u=0,m=o.length-1;for(;h<=p&&u<=m;)if(null===a[h])h++;else if(null===a[p])p--;else if(n[h]===r[u])l[u]=je(a[h],o[u]),h++,u++;else if(n[p]===r[m])l[m]=je(a[p],o[m]),p--,m--;else if(n[h]===r[m])l[m]=je(a[h],o[m]),Re(e,l[m+1],a[h]),h++,m--;else if(n[p]===r[u])l[u]=je(a[p],o[u]),Re(e,a[h],a[p]),p--,u++;else if(void 0===d&&(d=We(r,u,m),c=We(n,h,p)),d.has(n[h]))if(d.has(n[p])){const t=c.get(r[u]),s=void 0!==t?a[t]:null;if(null===s){const t=Re(e,a[h]);je(t,o[u]),l[u]=t}else l[u]=je(s,o[u]),Re(e,a[h],s),a[t]=null;u++}else Ze(a[p]),p--;else Ze(a[h]),h++;for(;u<=m;){const t=Re(e,l[m+1]);je(t,o[u]),l[u++]=t}for(;h<=p;){const e=a[h++];null!==e&&Ze(e)}return this.ut=r,Fe(e,l),Z}}),Ke="°F",Je={"°C":{min:5,max:30,step:.5},"°F":{min:41,max:86,step:1}},Qe=e=>Je[e]??Je["°C"],Ge=(e,t)=>{const s=Qe(t),i=e?.attributes??{};return{min:Number(i.min_temp??s.min),max:Number(i.max_temp??s.max),step:Number(i.target_temp_step||s.step)}},Ye=e=>e===Ke?68:20,et=(e,t)=>{const s=Math.round(e/t.step)*t.step;return Math.min(t.max,Math.max(t.min,Number(s.toFixed(2))))},tt=(e,t,s=Qe(t).step,i=!1,a)=>{const o=((e,t)=>t<1?t<.1?2:1:e===Ke?0:1)(t,s);return`${new Intl.NumberFormat(a,{minimumFractionDigits:i?0:o,maximumFractionDigits:o}).format(e)}°`},st=[{name:"cold",upTo:16,color:"#a9cbee"},{name:"cool",upTo:18,color:"#f5cf9a"},{name:"warm",upTo:20,color:"#ef9f5c"},{name:"hot",upTo:1/0,color:"#e5794a"}],it="#d5d9df",at=(e,t)=>{if(null===e)return`var(--shs-color-off, ${it})`;const s=(i=((e,t)=>t===Ke?5*(e-32)/9:e)(e,t),st.find(e=>i<=e.upTo));var i;return`var(--shs-color-${s.name}, ${s.color})`};let ot=class extends le{constructor(){super(...arguments),this.heading="",this.open=!1,this._previousFocus=null,this._keydown=e=>{"Escape"===e.key&&this.open&&(e.stopPropagation(),this._close())}}_close(){be(this,"closed")}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._keydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._keydown)}updated(e){e.has("open")&&(this.open?(this._previousFocus=document.activeElement,this.renderRoot.querySelector(".surface")?.focus()):this._previousFocus instanceof HTMLElement&&this._previousFocus.focus())}render(){return this.open?F`
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
    `:q}static{this.styles=n`
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
  `}};e([pe()],ot.prototype,"heading",void 0),e([pe({type:Boolean,reflect:!0})],ot.prototype,"open",void 0),ot=e([xe("shs-dialog")],ot);const rt=15,nt=1440,lt=["mon","tue","wed","thu","fri","sat","sun"],dt=e=>{const[t,s]=e.split(":").map(Number);return 60*t+s},ct=e=>`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`,ht=e=>e.map((t,s)=>({start:dt(t.start),end:s+1<e.length?dt(e[s+1].start):nt,temperature:t.temperature,...t.name?{name:t.name}:{}})),pt=(e,t)=>{if(e.length<=1)return e;const s=ht(e),i=s[t];return t>0?s[t-1]={...s[t-1],end:i.end}:s[1]={...s[1],start:0},(e=>e.filter(e=>e.end>e.start).sort((e,t)=>e.start-t.start).map(e=>{const t={start:ct(e.start),temperature:e.temperature};return e.name&&(t.name=e.name),t}))(s.filter((e,s)=>s!==t))},ut=(e,t,s)=>{if(t<=0||t>=e.length)return e;const i=ht(e),a=i[t-1].start+rt,o=i[t].end-rt,r=Math.round(s/rt)*rt,n=Math.min(o,Math.max(a,r));return e.map((e,s)=>s===t?{...e,start:ct(n)}:e)},mt=(e,t,s)=>e.map((e,i)=>i===t?{...e,temperature:s}:e),gt=e=>{const t=e.locale.time_format;if("12"===t)return!0;if("24"===t)return!1;const s="system"===t?void 0:e.locale.language;return new Intl.DateTimeFormat(s,{hour:"numeric"}).resolvedOptions().hour12??!1},ft=(e,t,s=!1)=>{if(!t&&s&&e===nt)return"24:00";const i=e%nt,a=Math.floor(i/60),o=String(i%60).padStart(2,"0");if(t){return`${a%12||12}:${o} ${a<12?"AM":"PM"}`}return`${s?a:String(a).padStart(2,"0")}:${o}`},bt={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6},yt=(e,t)=>{let s;try{s=new Intl.DateTimeFormat("en-US",{timeZone:t,weekday:"short",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(e)}catch{return yt(e)}const i=e=>s.find(t=>t.type===e)?.value??"0";return{weekday:bt[i("weekday")]??0,minutes:60*Number(i("hour"))+Number(i("minute"))}},_t=(e,t,s)=>ft(yt(new Date(e),s).minutes,t),vt=new Date(2024,0,1),xt=(e,t,s="long")=>{const i=new Date(vt);i.setDate(vt.getDate()+t);const a=new Intl.DateTimeFormat(e,{weekday:s}).format(i);return a.charAt(0).toUpperCase()+a.slice(1)};let $t=class extends le{constructor(){super(...arguments),this.blocks=[],this.unit="°C",this.limits={min:5,max:30,step:.5},this.canTurnOff=!0,this.language="en",this.h12=!1,this.readOnly=!1,this.now=null,this._selected=null,this._drag=null,this._width=0,this._resize=new ResizeObserver(e=>{this._width=e[0]?.contentRect.width??0})}connectedCallback(){super.connectedCallback(),this._resize.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resize.disconnect()}willUpdate(e){e.has("blocks")&&null!==this._selected&&this._selected>=this.blocks.length&&(this._selected=this.blocks.length-1)}get _step(){return Math.max(this.limits.step,this.unit===Ke?1:.5)}get _blocks(){return this._drag?.blocks??this.blocks}_emit(e,t=!0){be(this,"blocks-changed",{blocks:e,final:t})}_select(e){this._selected=this._selected===e?null:e}get _touch(){return window.matchMedia?.("(pointer: coarse)").matches??!1}_tap(e,t){if(0===e.detail)return void this._select(t);const s=this.renderRoot.querySelector(".track").getBoundingClientRect(),i=14/s.width*nt,a=(e.clientX-s.left)/s.width*nt,o=ht(this.blocks);let r=t;for(const[e,t]of o.entries()){const s=t.start<=a+i&&t.end>=a-i,n=t.end-t.start;s&&n<o[r].end-o[r].start&&(r=e)}this._select(r)}_minutesAt(e){const t=this.renderRoot.querySelector(".track").getBoundingClientRect();return(e-t.left)/t.width*nt}_pointerDown(e,t){if(this.readOnly||e.button>0)return;e.preventDefault();const s=e.currentTarget;s.setPointerCapture?.(e.pointerId),s.focus();const i=this.blocks;this._drag={index:t,blocks:i};const a=e=>{if(!this._drag)return;const s=ut(i,t,this._minutesAt(e.clientX));s[t].start!==this._drag.blocks[t].start&&(this._drag={index:t,blocks:s})},o=()=>{s.removeEventListener("pointermove",a),s.removeEventListener("pointerup",o),s.removeEventListener("pointercancel",o);const e=this._drag?.blocks??i;this._drag=null,e[t].start!==i[t].start&&this.blocks.length===i.length&&this._emit(ut(this.blocks,t,dt(e[t].start)))};s.addEventListener("pointermove",a),s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o)}_dividerKey(e,t,s){const i={ArrowLeft:-15,ArrowDown:-15,ArrowRight:rt,ArrowUp:rt}[e.key];i&&!this.readOnly&&(e.preventDefault(),this._emit(ut(this.blocks,t,s+i)))}_changeTemperature(e,t){const s=this.blocks[e].temperature??Ye(this.unit),i={...this.limits,step:this._step};this._emit(mt(this.blocks,e,et(s+t*this._step,i)))}_toggleOff(e,t){const s=t?null:et(Ye(this.unit),{...this.limits,step:this._step});this._emit(mt(this.blocks,e,s))}_rename(e,t){(this.blocks[e].name??"")!==t.trim()&&this._emit(((e,t,s)=>e.map((e,i)=>{if(i!==t)return e;const a=s.trim().slice(0,30),{name:o,...r}=e;return a?{...r,name:a}:r}))(this.blocks,e,t))}_split(e){const t=((e,t)=>{const s=ht(e)[t];if(!s||s.end-s.start<30)return null;const i=Math.round((s.start+s.end)/2/rt)*rt,a=[...e];return a.splice(t+1,0,{start:ct(i),temperature:s.temperature}),a})(this.blocks,e);t&&(this._selected=e+1,this._emit(t))}_delete(e){this._selected=Math.max(0,e-1),this._emit(pt(this.blocks,e))}_time(e){return e!==nt||this.h12?ft(e,this.h12):"24:00"}_label(e,t=!0){return null===e?this.localize("block.off"):tt(e,this.unit,this._step,t,this.language)}render(){const e=ht(this._blocks),t=e.slice(1).map((e,t)=>({index:t+1,minutes:e.start})),s=this._selected,i=e=>this._drag?.index===e||e===s||null!==s&&e===s+1,a=this._width?40/this._width*nt:0,o=[];for(const e of t){const t=o[o.length-1];if(t&&e.minutes-t.minutes<a){if(!i(e.index)||i(t.index))continue;o.pop()}o.push(e)}return F`
      <div class="labels" aria-hidden="true">
        ${o.map(({index:e,minutes:t})=>F`<span class=${i(e)?"active":""} style="left:${t/nt*100}%"
              >${ft(t,this.h12)}</span
            >`)}
      </div>
      <div class="track">
        <div class="bar">
          ${e.map((e,t)=>{const i=this._label(e.temperature),a=`${this._time(e.start)} – ${this._time(e.end)}`,o=e.name?`${e.name}, `:"";return F`<button
              class="block ${t===s?"selected":""} ${null===e.temperature?"off":""}"
              style="left:${e.start/nt*100}%;width:${(e.end-e.start)/nt*100}%;--block-color:${at(e.temperature,this.unit)}"
              aria-pressed=${t===s}
              aria-label="${o}${a}, ${i}"
              title=${e.name??q}
              @click=${e=>this._tap(e,t)}
            >
              <span class="text"
                >${e.name?F`<span class="name">${e.name}</span>`:q}<span>${i}</span></span
              >
            </button>`})}
        </div>
        ${this.readOnly||this._touch?q:t.map(({index:e,minutes:t})=>F`<button
                class="divider ${i(e)?"active":""}"
                style="left:${t/nt*100}%"
                aria-label=${this.localize("block.divider",{time:ft(t,this.h12)})}
                @pointerdown=${t=>this._pointerDown(t,e)}
                @keydown=${s=>this._dividerKey(s,e,t)}
              >
                <span></span>
              </button>`)}
        ${null!==s&&e[s]?F`<div
              class="selection"
              aria-hidden="true"
              style="--center:${(e[s].start+e[s].end)/2/nt*100}%;--width:${(e[s].end-e[s].start)/nt*100}%"
            ></div>`:q}
        ${null===this.now?q:F`<div class="now" style="left:${this.now/nt*100}%" aria-hidden="true"></div>`}
      </div>
      <div class="ticks" aria-hidden="true">
        ${[0,6,12,18,24].map(e=>F`<span>${this.h12?ft(60*e,!0,!0):String(e).padStart(2,"0")}</span>`)}
      </div>
      ${null===s||this.readOnly?this.readOnly?q:F`<p class="hint secondary">${this.localize(this._touch?"block.hint_touch":"block.hint")}</p>`:this._renderEditor(e,s)}
    `}_renderEditor(e,t){const s=e[t];if(!s)return q;const i=null===s.temperature,a=0===t,o=t===e.length-1,r=tt(this._step,this.unit,this._step,!0,this.language),n=this.localize("block.start"),l=this.localize("block.end"),d=`${this._time(s.start)} – ${this._time(s.end)}`,c=s.temperature;return F`<div class="editor" style="--block-color:${at(s.temperature,this.unit)}">
      <div class="editor-header">
        <button
          class="plain icon"
          ?disabled=${a}
          aria-label=${this.localize("block.previous")}
          title=${this.localize("block.previous")}
          @click=${()=>this._selected=t-1}
        >
          <ha-svg-icon .path=${"M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"}></ha-svg-icon>
        </button>
        <span class="swatch"></span>
        <span class="range">${d}</span>
        <button
          class="plain icon"
          ?disabled=${o}
          aria-label=${this.localize("block.next")}
          title=${this.localize("block.next")}
          @click=${()=>this._selected=t+1}
        >
          <ha-svg-icon .path=${"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"}></ha-svg-icon>
        </button>
        <span class="spacer"></span>
        <button
          class="outlined split"
          aria-label=${this.localize("block.split")}
          title=${this.localize("block.split")}
          ?disabled=${s.end-s.start<30}
          @click=${()=>this._split(t)}
        >
          <ha-svg-icon .path=${"M18,16V13H15V22H13V2H15V11H18V8L22,12L18,16M2,12L6,16V13H9V22H11V2H9V11H6V8L2,12Z"}></ha-svg-icon
          ><span class="split-label">${this.localize("block.split")}</span>
        </button>
        <button
          class="outlined icon danger"
          ?disabled=${e.length<2}
          aria-label=${this.localize("block.delete")}
          title=${this.localize("block.delete")}
          @click=${()=>this._delete(t)}
        >
          <ha-svg-icon .path=${Oe}></ha-svg-icon>
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
      <label class="name-field">
        <span class="time-label secondary">${this.localize("block.name")}</span>
        <input
          type="text"
          maxlength=${30}
          .value=${s.name??""}
          placeholder=${this.localize("block.name_placeholder")}
          @change=${e=>this._rename(t,e.target.value)}
          @keydown=${e=>{"Enter"===e.key&&e.target.blur()}}
        />
      </label>
      <div class="controls">
        <div class="group temp">
          <button
            class="round"
            ?disabled=${i||null!==c&&c<=this.limits.min}
            aria-label=${this.localize("block.lower",{step:r})}
            @click=${()=>this._changeTemperature(t,-1)}
          >
            <ha-svg-icon .path=${He}></ha-svg-icon>
          </button>
          <span class="temperature" aria-live="polite">${this._label(c,!1)}</span>
          <button
            class="round"
            ?disabled=${i||null!==c&&c>=this.limits.max}
            aria-label=${this.localize("block.raise",{step:r})}
            @click=${()=>this._changeTemperature(t,1)}
          >
            <ha-svg-icon .path=${Te}></ha-svg-icon>
          </button>
          <label class="off">
            <input
              type="checkbox"
              .checked=${i}
              @change=${e=>this._toggleOff(t,e.target.checked)}
            />${this.localize("block.off")}
          </label>
        </div>
        ${this._renderTime(n,s.start,a,e=>this._emit(ut(this.blocks,t,e)))}
        ${this._renderTime(l,s.end,o,e=>this._emit(ut(this.blocks,t+1,e)))}
      </div>
    </div>`}_renderTime(e,t,s,i){return F`<div class="group time">
      <span class="time-label secondary">${e}</span>
      <button
        class="outlined small"
        ?disabled=${s}
        aria-label=${this.localize("block.earlier",{what:e})}
        @click=${()=>i(t-rt)}
      >
        <ha-svg-icon .path=${He}></ha-svg-icon>
      </button>
      <span class="time-value">${this._time(t)}</span>
      <button
        class="outlined small"
        ?disabled=${s}
        aria-label=${this.localize("block.later",{what:e})}
        @click=${()=>i(t+rt)}
      >
        <ha-svg-icon .path=${Te}></ha-svg-icon>
      </button>
    </div>`}static{this.styles=[Ae,n`
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
        height: 18px;
        position: relative;
      }
      .labels span {
        color: var(--secondary-text-color);
        font-size: 12px;
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
        height: 48px;
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
        background: var(--block-color);
        border: none;
        border-inline-end: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
        bottom: 0;
        box-sizing: border-box;
        color: var(--shs-block-text, ${r("#1f2a37")});
        container-type: inline-size;
        cursor: pointer;
        display: flex;
        font: inherit;
        font-size: 13px;
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
      /* Drawn over the bar with a minimum width, so even a 15 minute block shows as selected. */
      .selection {
        border: 3px solid var(--primary-text-color);
        border-radius: 6px;
        bottom: -3px;
        box-sizing: border-box;
        left: calc(var(--center) - max(var(--width), 14px) / 2);
        pointer-events: none;
        position: absolute;
        top: -3px;
        width: max(var(--width), 14px);
      }
      .block:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      .block .text {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
        max-width: 100%;
      }
      .block .name {
        font-size: 11px;
        font-weight: 500;
        overflow: hidden;
        padding: 0 4px;
        text-overflow: ellipsis;
      }
      @container (max-width: 64px) {
        .block .name {
          display: none;
        }
      }
      @container (max-width: 34px) {
        .block span {
          visibility: hidden;
        }
      }
      .name-field {
        align-items: center;
        display: flex;
        gap: 10px;
      }
      .name-field input {
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color);
        flex: 1;
        font: inherit;
        font-size: 16px;
        height: 36px;
        max-width: 320px;
        min-width: 0;
        padding: 0 10px;
        user-select: text;
        -webkit-user-select: text;
      }
      .name-field input:focus {
        border-color: var(--primary-color);
        outline: none;
      }
      .divider {
        align-items: center;
        background: none;
        border: none;
        cursor: ew-resize;
        display: flex;
        height: 60px;
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
        height: 38px;
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
        font-size: 12px;
        justify-content: space-between;
        margin-top: 6px;
      }
      .hint {
        font-size: 13px;
        margin: 10px 0 0;
      }
      .editor {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid var(--divider-color);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;
        padding: 10px 14px 12px;
      }
      .editor-header {
        align-items: center;
        display: flex;
        gap: 6px;
      }
      .spacer {
        flex: 1;
      }
      .swatch {
        background: var(--block-color);
        border-radius: 3px;
        flex-shrink: 0;
        height: 12px;
        width: 12px;
      }
      .editor {
        container-type: inline-size;
      }
      @container (max-width: 360px) {
        .split-label {
          display: none;
        }
        button.split {
          padding: 0;
          width: 36px;
        }
      }
      .range {
        white-space: nowrap;
        font-size: 14px;
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
        font-size: 22px;
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
      /* Phones: one full-width row for the temperature, one each for start and end. */
      @container (max-width: 520px) {
        .controls {
          align-items: stretch;
          flex-direction: column;
          gap: 10px;
        }
        .group {
          width: 100%;
        }
        .group.temp .temperature {
          flex: 1;
        }
        .group.temp button.round {
          height: 48px;
          width: 48px;
        }
        .group.time button.small {
          height: 44px;
          width: 56px;
        }
        .group.time .time-value {
          flex: 1;
          font-size: 16px;
        }
        .group.time .time-label {
          font-size: 13px;
          min-width: 3.6em;
        }
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
    `]}};e([pe({attribute:!1})],$t.prototype,"blocks",void 0),e([pe()],$t.prototype,"unit",void 0),e([pe({attribute:!1})],$t.prototype,"limits",void 0),e([pe({type:Boolean})],$t.prototype,"canTurnOff",void 0),e([pe()],$t.prototype,"language",void 0),e([pe({type:Boolean})],$t.prototype,"h12",void 0),e([pe({type:Boolean})],$t.prototype,"readOnly",void 0),e([pe({attribute:!1})],$t.prototype,"now",void 0),e([pe({attribute:!1})],$t.prototype,"localize",void 0),e([ue()],$t.prototype,"_selected",void 0),e([ue()],$t.prototype,"_drag",void 0),e([ue()],$t.prototype,"_width",void 0),$t=e([xe("shs-timeline-editor")],$t);let wt=class extends le{constructor(){super(...arguments),this.others=[],this.days=[...lt],this.unit="°C",this.limits={min:5,max:30,step:.5},this.canTurnOff=!0,this.language="en",this.h12=!1,this.readOnly=!1,this.now=null}_dayName(e,t="long"){const s=lt.indexOf(e);return"narrow"===t?new Intl.DateTimeFormat(this.language,{weekday:"narrow"}).format(new Date(2024,0,1+s)):xt(this.language,s,t)}_daysLabel(){const{days:e}=this.program;return 7===e.length?this.localize("programs.every_day"):e.length?this.days.filter(t=>e.includes(t)).map(e=>this._dayName(e,"short")).join(" · "):this.localize("programs.no_days")}render(){const e=this.program.name;return F`
      <ha-card>
        <div class="header">
          <div class="title">
            <h3>${e}</h3>
            <span class="secondary">${this._daysLabel()}</span>
          </div>
          ${this.readOnly?q:F`<ha-icon-button
                  .path=${Me}
                  .label=${this.localize("programs.rename",{name:e})}
                  @click=${()=>be(this,"rename")}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"}
                  .label=${this.localize("programs.duplicate",{name:e})}
                  @click=${()=>be(this,"duplicate")}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${Oe}
                  .label=${this.localize("programs.delete",{name:e})}
                  @click=${()=>be(this,"delete")}
                ></ha-icon-button>`}
        </div>

        <div class="days" role="group" aria-label=${this._daysLabel()}>
          ${this.days.map(e=>{const t=this.program.days.includes(e),s=t?void 0:this.others.find(t=>t.days.includes(e)),i=this._dayName(e),a=t?this.localize("programs.day_mine",{day:i}):s?this.localize("programs.day_other",{day:i,program:s.name}):this.localize("programs.day_free",{day:i});return F`<button
              class="day ${t?"mine":s?"other":"free"}"
              aria-pressed=${t}
              aria-label=${a}
              title=${a}
              ?disabled=${this.readOnly}
              @click=${()=>be(this,"day-toggled",{day:e})}
            >
              ${this._dayName(e,"narrow")}
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
    `}static{this.styles=[Ae,n`
      :host {
        display: block;
      }
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px 14px;
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
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .title .secondary {
        font-size: 13px;
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
        font-size: 13px;
        font-weight: 700;
        height: 40px;
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
    `]}};e([pe({attribute:!1})],wt.prototype,"program",void 0),e([pe({attribute:!1})],wt.prototype,"others",void 0),e([pe({attribute:!1})],wt.prototype,"days",void 0),e([pe()],wt.prototype,"unit",void 0),e([pe({attribute:!1})],wt.prototype,"limits",void 0),e([pe({type:Boolean})],wt.prototype,"canTurnOff",void 0),e([pe()],wt.prototype,"language",void 0),e([pe({type:Boolean})],wt.prototype,"h12",void 0),e([pe({type:Boolean})],wt.prototype,"readOnly",void 0),e([pe({attribute:!1})],wt.prototype,"now",void 0),e([pe({attribute:!1})],wt.prototype,"localize",void 0),wt=e([xe("shs-program-card")],wt);let kt=class extends le{constructor(){super(...arguments),this.entityId="",this.until="",this._busy=!1}async _resume(){this._busy=!0;try{await(e=this.hass,t=this.entityId,e.callWS({type:`${me}/room/resume`,entity_id:t}))}catch(e){ye(this,this.localize("error.resume",{error:e?.message??String(e)}))}finally{this._busy=!1}var e,t}render(){return F`
      <div class="text" role="status">
        <strong
          ><ha-svg-icon class="hand" .path=${"M21 7C21 5.62 19.88 4.5 18.5 4.5C18.33 4.5 18.16 4.5 18 4.55V4C18 2.62 16.88 1.5 15.5 1.5C15.27 1.5 15.04 1.53 14.83 1.59C14.46 .66 13.56 0 12.5 0C11.27 0 10.25 .89 10.04 2.06C9.87 2 9.69 2 9.5 2C8.12 2 7 3.12 7 4.5V10.39C6.66 10.08 6.24 9.85 5.78 9.73L5 9.5C4.18 9.29 3.31 9.61 2.82 10.35C2.44 10.92 2.42 11.66 2.67 12.3L5.23 18.73C6.5 21.91 9.57 24 13 24C17.42 24 21 20.42 21 16V7M19 16C19 19.31 16.31 22 13 22C10.39 22 8.05 20.41 7.09 18L4.5 11.45L5 11.59C5.5 11.71 5.85 12.05 6 12.5L7 15H9V4.5C9 4.22 9.22 4 9.5 4S10 4.22 10 4.5V12H12V2.5C12 2.22 12.22 2 12.5 2S13 2.22 13 2.5V12H15V4C15 3.72 15.22 3.5 15.5 3.5S16 3.72 16 4V12H18V7C18 6.72 18.22 6.5 18.5 6.5S19 6.72 19 7V16Z"}></ha-svg-icon>${this.localize("room.overridden")}</strong
        >
        <span class="detail"
          >${this.until?this.localize("room.overridden_until",{time:this.until}):this.localize("room.overridden_hint")}</span
        >
      </div>
      <button class="resume" ?disabled=${this._busy} @click=${this._resume}>
        <ha-svg-icon .path=${"M18,11V12.5C21.19,12.5 23.09,16.05 21.33,18.71L20.24,17.62C21.06,15.96 19.85,14 18,14V15.5L15.75,13.25L18,11M18,22V20.5C14.81,20.5 12.91,16.95 14.67,14.29L15.76,15.38C14.94,17.04 16.15,19 18,19V17.5L20.25,19.75L18,22M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14C13.36,20.45 12.86,19.77 12.5,19H5V8H19V10.59C19.71,10.7 20.39,10.94 21,11.31V5A2,2 0 0,0 19,3Z"}></ha-svg-icon>${this.localize("room.resume")}
      </button>
    `}static{this.styles=[Ae,n`
      :host {
        --shs-manual: var(--warning-color, #ff9800);
        background: color-mix(in srgb, var(--shs-manual) 14%, transparent);
        border-inline-start: 4px solid var(--shs-manual);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px 12px;
      }
      .text {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      strong {
        align-items: center;
        color: color-mix(in srgb, var(--shs-manual) 70%, var(--primary-text-color));
        display: inline-flex;
        font-size: 15px;
        gap: 6px;
      }
      .detail {
        font-size: 13px;
        line-height: 1.35;
      }
      .resume {
        align-items: center;
        align-self: flex-start;
        background: var(--shs-manual);
        border: none;
        border-radius: 18px;
        color: #1f2a37;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        gap: 6px;
        min-height: 36px;
        padding: 0 14px;
      }
      .resume:hover:not([disabled]),
      .resume:focus-visible {
        filter: brightness(0.94);
        outline: none;
      }
      .resume[disabled] {
        cursor: default;
        opacity: 0.6;
      }
      ha-svg-icon {
        --mdc-icon-size: 18px;
      }
    `]}};e([pe({attribute:!1})],kt.prototype,"hass",void 0),e([pe()],kt.prototype,"entityId",void 0),e([pe({attribute:!1})],kt.prototype,"localize",void 0),e([pe()],kt.prototype,"until",void 0),e([ue()],kt.prototype,"_busy",void 0),kt=e([xe("shs-resume-row")],kt);const zt=[31,29,31,30,31,30,31,31,30,31,30,31],At=366,St=e=>{const[t,s]=e.split("-").map(Number);return[t,s]},Ct=([e,t])=>`${String(e).padStart(2,"0")}-${String(t).padStart(2,"0")}`,Et=([e,t])=>zt.slice(0,e-1).reduce((e,t)=>e+t,0)+t,Ot=e=>{let t=e,s=0;for(;t>zt[s];)t-=zt[s],s++;return[s+1,t]},Ht=(e,t)=>e[0]-t[0]||e[1]-t[1],Mt=e=>{const t=Et(St(e.start)),s=Et(St(e.end));return t<=s?[[t,s]]:[[t,At],[1,s]]},Tt=(e,t,s="long")=>{const[i,a]=St(e);return new Intl.DateTimeFormat(t,{day:"numeric",month:s}).format(new Date(2024,i-1,a))},Pt=()=>Math.random().toString(36).slice(2,10),Lt=["#2f6fca","#23794a","#b7791f","#a85b14","#7a4cc2","#b23a48"];let Vt=class extends le{constructor(){super(...arguments),this.seasons=[],this.selected=null,this.today=null,this.language="en"}render(){const e=(t=this.language,Array.from({length:12},(e,s)=>new Intl.DateTimeFormat(t,{month:"narrow"}).format(new Date(2024,s,1))));var t;const s=zt.map(e=>e/At);return F`
      <div class="months" aria-hidden="true">
        ${e.map((e,t)=>F`<span style="width:${100*s[t]}%">${e}</span>`)}
      </div>
      <div class="bar">
        ${this.seasons.flatMap(e=>Mt(e).map(([t,s])=>{const i=(s-t+1)/At;return F`<button
              class=${e.id===this.selected?"selected":""}
              style="left:${(t-1)/At*100}%;width:${100*i}%;background:${e.color??"#607d8b"}"
              aria-label=${this.localize("seasons.select",{name:e.name})}
              aria-pressed=${e.id===this.selected}
              @click=${()=>be(this,"select",{id:e.id})}
            >
              <span>${e.name}</span>
            </button>`}))}
        ${null===this.today?q:F`<div class="today" style="left:${(this.today-.5)/At*100}%"></div>`}
      </div>
    `}static{this.styles=n`
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
  `}};e([pe({attribute:!1})],Vt.prototype,"seasons",void 0),e([pe()],Vt.prototype,"selected",void 0),e([pe({attribute:!1})],Vt.prototype,"today",void 0),e([pe()],Vt.prototype,"language",void 0),e([pe({attribute:!1})],Vt.prototype,"localize",void 0),Vt=e([xe("shs-season-bar")],Vt);let Dt=class extends le{constructor(){super(...arguments),this.open=!1,this.heading="",this.description="",this.emptyText="",this.confirmLabel="",this.multiple=!1,this.entityIds=[],this._selected=new Set}willUpdate(e){e.has("open")&&this.open&&(this._selected=new Set)}_toggle(e,t){const s=new Set(this._selected);t?s.add(e):s.delete(e),this._selected=s}_pick(e){be(this,"picked",{entityIds:e})}render(){const e=[...this.entityIds].sort((e,t)=>ve(this.hass,e).localeCompare(ve(this.hass,t)));return F`<shs-dialog .open=${this.open} .heading=${this.heading} @closed=${()=>be(this,"closed")}>
      ${this.description?F`<p class="secondary">${this.description}</p>`:q}
      ${e.length?F`<ul>
            ${e.map(e=>{const t=((e,t)=>{const s=e.entities?.[t],i=s?.area_id??(s?.device_id?e.devices?.[s.device_id]?.area_id:void 0);return i?e.areas?.[i]?.name:void 0})(this.hass,e),s=F`<span class="name">${ve(this.hass,e)}</span>
                <span class="secondary">${t?`${t} · `:""}${e}</span>`;return F`<li>
                ${this.multiple?F`<label class="item">
                      <input
                        type="checkbox"
                        .checked=${this._selected.has(e)}
                        @change=${t=>this._toggle(e,t.target.checked)}
                      />
                      <span class="text">${s}</span>
                    </label>`:F`<button class="item" @click=${()=>this._pick([e])}>
                      <ha-svg-icon .path=${Pe}></ha-svg-icon>
                      <span class="text">${s}</span>
                    </button>`}
              </li>`})}
          </ul>`:F`<p class="secondary">${this.emptyText}</p>`}
      <button slot="actions" class="text-button" @click=${()=>be(this,"closed")}>
        ${this.localize("common.cancel")}
      </button>
      ${this.multiple?F`<button
            slot="actions"
            class="filled-button"
            ?disabled=${!this._selected.size}
            @click=${()=>this._pick([...this._selected])}
          >
            ${this.confirmLabel}
          </button>`:q}
    </shs-dialog>`}static{this.styles=[Ae,n`
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
    `]}};e([pe({attribute:!1})],Dt.prototype,"hass",void 0),e([pe({type:Boolean})],Dt.prototype,"open",void 0),e([pe()],Dt.prototype,"heading",void 0),e([pe()],Dt.prototype,"description",void 0),e([pe()],Dt.prototype,"emptyText",void 0),e([pe()],Dt.prototype,"confirmLabel",void 0),e([pe({type:Boolean})],Dt.prototype,"multiple",void 0),e([pe({attribute:!1})],Dt.prototype,"entityIds",void 0),e([pe({attribute:!1})],Dt.prototype,"localize",void 0),e([ue()],Dt.prototype,"_selected",void 0),Dt=e([xe("shs-entity-picker-dialog")],Dt);const Nt=2024,It=e=>`2024-${e}`,Ut=e=>e.slice(5);let Rt=class extends le{constructor(){super(...arguments),this.open=!1,this.season=null,this.seasons=[],this._draft={id:"",name:"",start:"10-15",end:"04-15",color:Lt[0]}}willUpdate(e){e.has("open")&&this.open&&(this._draft=this.season?{...this.season}:{id:Pt(),name:"",start:"10-15",end:"04-15",color:Lt[this.seasons.length%Lt.length]})}_set(e){this._draft={...this._draft,...e}}render(){const e=this._draft,t=((e,t)=>{const s=new Set;for(const[t,i]of Mt(e))for(let e=t;e<=i;e++)s.add(e);return t.find(t=>t.id!==e.id&&Mt(t).some(([e,t])=>{for(let i=e;i<=t;i++)if(s.has(i))return!0;return!1}))})(e,this.seasons),s=e.name.trim().length>0&&!t;return F`<shs-dialog
      .open=${this.open}
      .heading=${this.localize(this.season?"season_dialog.edit":"season_dialog.new")}
      @closed=${()=>be(this,"closed")}
    >
      <div class="form">
        <label class="field">
          <span>${this.localize("season_dialog.name")}</span>
          <input
            type="text"
            maxlength="50"
            .value=${e.name}
            @input=${e=>this._set({name:e.target.value})}
          />
        </label>
        <div class="field">
          <span id="color-label">${this.localize("season_dialog.color")}</span>
          <div class="colors" role="radiogroup" aria-labelledby="color-label">
            ${Lt.map(t=>F`<button
                role="radio"
                aria-checked=${e.color===t}
                aria-label=${t}
                class=${e.color===t?"selected":""}
                style="background:${t}"
                @click=${()=>this._set({color:t})}
              ></button>`)}
          </div>
        </div>
        <div class="dates">
          <label class="field">
            <span>${this.localize("season_dialog.start")}</span>
            <input
              type="date"
              min="${Nt}-01-01"
              max="${Nt}-12-31"
              .value=${It(e.start)}
              @change=${e=>{const t=e.target.value;t&&this._set({start:Ut(t)})}}
            />
          </label>
          <label class="field">
            <span>${this.localize("season_dialog.end")}</span>
            <input
              type="date"
              min="${Nt}-01-01"
              max="${Nt}-12-31"
              .value=${It(e.end)}
              @change=${e=>{const t=e.target.value;t&&this._set({end:Ut(t)})}}
            />
          </label>
        </div>
        <p class="secondary note">
          ${this.localize("season_dialog.year")}
          ${i=e,Ht(St(i.start),St(i.end))>0?this.localize("season_dialog.wraps"):q}
        </p>
        ${t?F`<p class="error note" role="alert">
              ${this.localize("season_dialog.overlap",{name:t.name})}
            </p>`:q}
      </div>
      ${this.season?F`<button
            slot="secondary"
            class="text-button danger"
            @click=${()=>be(this,"delete",{season:this.season})}
          >
            ${this.localize("season_dialog.delete")}
          </button>`:q}
      <button slot="actions" class="text-button" @click=${()=>be(this,"closed")}>
        ${this.localize("common.cancel")}
      </button>
      <button
        slot="actions"
        class="filled-button"
        ?disabled=${!s}
        @click=${()=>be(this,"save",{season:{...e,name:e.name.trim()}})}
      >
        ${this.localize("common.save")}
      </button>
    </shs-dialog>`;var i}static{this.styles=[Ae,n`
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
    `]}};e([pe({type:Boolean})],Rt.prototype,"open",void 0),e([pe({attribute:!1})],Rt.prototype,"season",void 0),e([pe({attribute:!1})],Rt.prototype,"seasons",void 0),e([pe({attribute:!1})],Rt.prototype,"localize",void 0),e([ue()],Rt.prototype,"_draft",void 0),Rt=e([xe("shs-season-dialog")],Rt);const jt=e=>{try{const t=new Intl.DateTimeFormat("en-US",{timeZone:e,month:"numeric",day:"numeric"}).formatToParts(new Date),s=e=>Number(t.find(t=>t.type===e)?.value);return[s("month"),s("day")]}catch{const e=new Date;return[e.getMonth()+1,e.getDate()]}};let Bt=class extends le{constructor(){super(...arguments),this.narrow=!1,this._drafts={},this._addOpen=!1,this._removeOpen=!1,this._resetOpen=!1,this._seasonDialog=null,this._deleteSeason=null,this._deleteProgram=null,this._rename=null,this._timers=new Map,this._inflight=new Map}disconnectedCallback(){super.disconnectedCallback();for(const e of[...this._timers.keys()])this._flush(e)}willUpdate(e){if(!e.has("state"))return;const t=Object.fromEntries(Object.entries(this._drafts).filter(([e])=>this._timers.has(e)||this._inflight.has(e)));Object.keys(t).length!==Object.keys(this._drafts).length&&(this._drafts=t),!this._room&&this.state.rooms.length&&(this._entityId=this.state.rooms[0].entity_id),this._season||(this._seasonId=this.state.season??this.state.seasons[0]?.id)}get _readOnly(){return!this.hass.user?.is_admin}get _room(){return this.state.rooms.find(e=>e.entity_id===this._entityId)}get _season(){return this.state.seasons.find(e=>e.id===this._seasonId)}_key(e){return`${this._entityId}|${e}`}_programs(e,t){return this._drafts[`${e.entity_id}|${t}`]??e.programs[t]??[]}_error(e){ye(this,this.localize("error.save",{error:e?.message??String(e)}))}async _call(e){try{await e}catch(e){this._error(e)}}_setPrograms(e,t,s=700){const i=this._key(e);this._drafts={...this._drafts,[i]:t};const a=this._timers.get(i);void 0!==a&&clearTimeout(a),this._timers.set(i,window.setTimeout(()=>this._flush(i),s))}async _flush(e){const t=this._timers.get(e);void 0!==t&&clearTimeout(t),this._timers.delete(e);const s=this._drafts[e];if(!s)return;const[i,a]=e.split("|");this._inflight.set(e,(this._inflight.get(e)??0)+1);try{await ge(this.hass,i,{programs:{[a]:s}})}catch(e){this._error(e)}finally{const t=(this._inflight.get(e)??1)-1;if(t>0?this._inflight.set(e,t):this._inflight.delete(e),!this._timers.has(e)&&!this._inflight.has(e)){const{[e]:t,...s}=this._drafts;this._drafts=s}}}_updateProgram(e,t,s,i,a){this._setPrograms(e,t.map(e=>e.id===s?{...e,...i}:e),a)}_toggleDay(e,t,s,i){const a=!t.find(e=>e.id===s).days.includes(i);this._setPrograms(e,t.map(e=>{return e.id===s?{...e,days:a?(t=[...e.days,i],lt.filter(e=>t.includes(e))):e.days.filter(e=>e!==i)}:a?{...e,days:e.days.filter(e=>e!==i)}:e;var t}),0)}_addProgram(e,t){const s=((e,t)=>t.filter(t=>!e.some(e=>e.days.includes(t))))(t,lt),i=this.localize(7===s.length?"programs.every_day":"programs.new_name");var a;this._setPrograms(e,[...t,{id:Pt(),name:i,days:s,blocks:(a=this.state.unit,a===Ke?[{start:"00:00",temperature:63},{start:"06:30",temperature:68},{start:"22:30",temperature:63}]:[{start:"00:00",temperature:17},{start:"06:30",temperature:20},{start:"22:30",temperature:17}])}],0)}_duplicate(e,t,s){const i={id:Pt(),name:this.localize("programs.copy",{name:s.name}).slice(0,50),days:[],blocks:s.blocks.map(e=>({...e}))},a=t.indexOf(s);this._setPrograms(e,[...t.slice(0,a+1),i,...t.slice(a+1)],0)}async _saveSeason(e){this._seasonDialog=null;const t=this.state.seasons.some(t=>t.id===e.id),s=t?this.state.seasons.map(t=>t.id===e.id?e:t):[...this.state.seasons,e];await this._call(fe(this.hass,s)),this._seasonId=e.id}_discard(e){const t={...this._drafts};for(const s of new Set([...Object.keys(t),...this._timers.keys()])){const[i,a]=s.split("|");if(!e(i,a))continue;const o=this._timers.get(s);void 0!==o&&clearTimeout(o),this._timers.delete(s),delete t[s]}this._drafts=t}async _removeSeason(e){this._deleteSeason=null,this._discard((t,s)=>s===e.id),await this._call(fe(this.hass,this.state.seasons.filter(t=>t.id!==e.id))),this._seasonId===e.id&&(this._seasonId=void 0)}async _addRoom(e){this._addOpen=!1;try{await((e,t)=>e.callWS({type:`${me}/room/add`,entity_id:t}))(this.hass,e),this._entityId=e}catch(e){this._error(e)}}async _removeRoom(){this._removeOpen=!1;const e=this._entityId;this._entityId=void 0,this._discard(t=>t===e),await this._call(((e,t)=>e.callWS({type:`${me}/room/remove`,entity_id:t}))(this.hass,e))}render(){const e=this.narrow||"always_hidden"===this.hass.dockedSidebar,t=this._room;return F`
      <div class="toolbar">
        ${e?F`<ha-icon-button
              .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
              .label=${"Menu"}
              @click=${()=>be(this,"hass-toggle-menu")}
            ></ha-icon-button>`:q}
        <div class="title">${this.localize("title")}</div>
        <label class="away">
          <span>${this.localize("away.label")}</span>
          ${Se(this.state.away,e=>this._call(((e,t)=>e.callWS({type:`${me}/away/set`,away:t}))(this.hass,e)),this.localize("away.label"))}
        </label>
      </div>

      <div class="content">
        ${this._readOnly?F`<p class="secondary notice">${this.localize("read_only")}</p>`:q}
        ${t?this._renderEntity(t):this._renderEmpty()} ${this._renderSeasons()}
        ${t?F`<div class="columns">
              ${this._renderNow(t)}
              <section class="programs">${this._renderPrograms(t)}</section>
            </div>`:q}
      </div>
      ${this._renderDialogs(t)}
    `}_renderEmpty(){return F`<ha-card class="empty">
      <ha-svg-icon .path=${Pe}></ha-svg-icon>
      <h2>${this.localize("entity.none_title")}</h2>
      <p class="secondary">${this.localize("entity.none_text")}</p>
      ${this._readOnly?q:F`<button class="filled-button" @click=${()=>this._addOpen=!0}>
            ${this.localize("entity.add")}
          </button>`}
    </ha-card>`}_renderEntity(e){const t=this.hass.states[e.entity_id],s=t?.attributes.current_temperature,i=this.state.unit;return F`<ha-card class="entity">
      <div class="entity-main">
        <label class="field-label" for="entity">${this.localize("entity.label")}</label>
        ${this.state.rooms.length>1?F`<select
              id="entity"
              .value=${e.entity_id}
              @change=${e=>this._entityId=e.target.value}
            >
              ${this.state.rooms.map(t=>F`<option value=${t.entity_id} ?selected=${t.entity_id===e.entity_id}>
                    ${ve(this.hass,t.entity_id)} · ${t.entity_id}
                  </option>`)}
            </select>`:F`<div id="entity" class="entity-name">
              ${ve(this.hass,e.entity_id)} <span class="secondary">· ${e.entity_id}</span>
            </div>`}
        ${"number"==typeof s?F`<span class="secondary small"
              >${this.localize("entity.measured",{temperature:tt(s,i,.1,!1,this.hass.locale.language)})}</span
            >`:q}
      </div>
      <div class="entity-actions">
        <label class="switch-label">
          <span class="small">${this.localize("entity.enabled")}</span>
          ${Se(e.enabled,t=>this._call(ge(this.hass,e.entity_id,{enabled:t})),this.localize("entity.enabled"),this._readOnly)}
        </label>
        ${this._readOnly?q:F`<ha-icon-button
                .path=${Te}
                .label=${this.localize("entity.add")}
                @click=${()=>this._addOpen=!0}
              ></ha-icon-button>
              <ha-icon-button
                .path=${Oe}
                .label=${this.localize("entity.remove")}
                @click=${()=>this._removeOpen=!0}
              ></ha-icon-button>`}
      </div>
    </ha-card>`}_renderSeasons(){const e=this.hass.locale.language,t=Et(jt(this.hass.config.time_zone)),s=(e=>{const t=new Array(367).fill(!1);for(const s of e)for(const[e,i]of Mt(s))for(let s=e;s<=i;s++)t[s]=!0;const s=[];let i=1;for(;i<=At;){if(t[i]){i++;continue}let e=i;for(;e+1<=At&&!t[e+1];)e++;s.push([i,e]),i=e+1}return s})(this.state.seasons),i=s.map(([t,s])=>`${Tt(Ct(Ot(t)),e,"short")} – ${Tt(Ct(Ot(s)),e,"short")}`).join(", "),a=this._room;return F`<ha-card class="seasons">
      <div class="section-header">
        <div class="heading">
          <h2>${this.localize("seasons.title")}</h2>
          <span class="secondary small">${this.localize("seasons.subtitle")}</span>
        </div>
        ${this._readOnly?q:F`<button class="outlined-button" @click=${()=>this._resetOpen=!0}>
                <ha-svg-icon .path=${"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"}></ha-svg-icon>${this.localize("seasons.reset")}
              </button>
              <button class="filled-button small" @click=${()=>this._seasonDialog={season:null}}>
                <ha-svg-icon .path=${Te}></ha-svg-icon>${this.localize("seasons.new")}
              </button>`}
      </div>
      <shs-season-bar
        .seasons=${this.state.seasons}
        .selected=${this._seasonId??null}
        .today=${t}
        .language=${e}
        .localize=${this.localize}
        @select=${e=>this._seasonId=e.detail.id}
      ></shs-season-bar>
      <span class="secondary small">
        ${s.length?this.localize("seasons.outside",{ranges:i}):this.localize("seasons.always")}
      </span>
      <div class="season-list">
        ${this.state.seasons.map(t=>{const s=a?this._programs(a,t.id).length:0,i=a?0===s?this.localize("seasons.programs_none"):1===s?this.localize("seasons.programs_one"):this.localize("seasons.programs",{count:String(s)}):"",o=t.id===this._seasonId;return F`<div class="season ${o?"selected":""}" style="--season-color:${t.color??"#607d8b"}">
            <button class="season-select" aria-pressed=${o} @click=${()=>this._seasonId=t.id}>
              <span class="dot"></span>
              <span class="season-text">
                <span class="season-name"
                  >${t.name}
                  ${t.id===this.state.season?F`<span class="badge">${this.localize("seasons.today")}</span>`:q}</span
                >
                <span class="secondary small"
                  >${Tt(t.start,e,"short")} → ${Tt(t.end,e,"short")}${i?` · ${i}`:""}</span
                >
              </span>
            </button>
            ${this._readOnly?q:F`<ha-icon-button
                  .path=${Me}
                  .label=${this.localize("seasons.edit",{name:t.name})}
                  @click=${()=>this._seasonDialog={season:t}}
                ></ha-icon-button>`}
          </div>`})}
      </div>
    </ha-card>`}_renderNow(e){const t=this.state.unit,s=this.hass.locale.language,i=Ge(this.hass.states[e.entity_id],t),a=e.status,o=this.state.seasons.find(e=>e.id===a.season),r=o?e.programs[o.id]?.find(e=>e.id===a.program):void 0,n=((e,t,s)=>{const{status:i}=e;if(!e.enabled)return{text:t("status.disabled"),error:!1};if(i.last_error)return{text:t("status.error",{error:i.last_error}),error:!0};if(i.pending)return{text:t("status.pending"),error:!1};const a=null===i.temperature?null:tt(i.temperature,s.unit,s.step,!1,s.language);if(!i.end)return null===a?{text:t("status.constant_off"),error:!1}:{text:t("status.constant",{temperature:a}),error:!1};const o=_t(i.end,s.h12,s.timeZone);return null===a?{text:t("status.off_until",{time:o}),error:!1}:{text:t("status.until",{temperature:a,time:o}),error:!1}})(e,this.localize,{unit:t,step:.5,h12:gt(this.hass),language:s,timeZone:this.hass.config.time_zone}),l=this._nextSeason(),d=gt(this.hass),c=this.hass.config.time_zone,h=e=>e?_t(e,d,c):null,p=(e,t)=>e?this.localize("status.named",{name:e,status:t}):t,u=p(a.name,a.start||a.end?`${h(a.start)??"…"} – ${h(a.end)??"…"}`:this.localize("now.none")),m=null===a.end?this.localize("now.none"):`${h(a.end)} → ${p(a.next_name,null===a.next_temperature?this.localize("now.off"):tt(a.next_temperature,t,.5,!1,s))}`,g=null===a.temperature?this.localize("now.off"):tt(a.temperature,t,.5,!1,s),f=this.hass.states[e.entity_id]?.attributes.preset_modes?.includes("away")?this.localize("away.preset"):this.localize("away.temperature",{temperature:tt(this.state.away_temperature,t,i.step,!1,s)}),b=e.enabled&&a.overridden&&!this.state.away;return F`<ha-card class="now ${b?"overridden":""}">
      <div class="section-header">
        <h2>${this.localize("now.title")}</h2>
      </div>
      ${b?F`<shs-resume-row
            .hass=${this.hass}
            .entityId=${e.entity_id}
            .localize=${this.localize}
            .until=${h(a.end)??""}
          ></shs-resume-row>`:q}
      ${this.state.away?F`<div class="away-banner">
            <strong>${this.localize("away.active")}</strong>
            <span class="small">${f}</span>
          </div>`:F`<div class="big">
              ${b?F`<span class="value manual">${this._actualTarget(e)??g}</span>
                    <span class="secondary small"
                      >${null===a.temperature?this.localize("now.manual_off"):this.localize("now.manual",{scheduled:g})}</span
                    >`:F`<span class="value">${e.enabled?g:"—"}</span>
                    <span class="${n.error?"error":"secondary"} small">${n.text}</span>`}
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
                <dt>${this.localize("now.block")}</dt>
                <dd>${u}</dd>
              </div>
              <div>
                <dt>${this.localize("now.next")}</dt>
                <dd>${m}</dd>
              </div>
              <div>
                <dt>${this.localize("now.next_season")}</dt>
                <dd>
                  ${l?`${l.name} · ${Tt(l.start,s)}`:this.localize("now.none")}
                </dd>
              </div>
            </dl>`}
      ${b?q:F`<span class="secondary small">${this.localize("now.manual_hint")}</span>`}
    </ha-card>`}_actualTarget(e){const t=this.hass.states[e.entity_id];if(!t)return null;if("off"===t.state)return this.localize("now.off");const s=t.attributes.temperature;return"number"==typeof s?tt(s,this.state.unit,.5,!1,this.hass.locale.language):null}_nextSeason(){const e=Et(jt(this.hass.config.time_zone));let t,s=1/0;for(const i of this.state.seasons){const a=(Et(St(i.start))-e+366)%366;a>0&&a<s&&(t=i,s=a)}return t}_renderPrograms(e){const t=this._season;if(!t)return q;const s=this._programs(e,t.id),i=this.hass.locale.language,a=this.state.unit,o=this.hass.states[e.entity_id],r=Ge(o,a),n=(e=>[...lt.slice(e),...lt.slice(0,e)])((e=>{const t=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],s=e.locale.first_weekday;if(s&&t.includes(s))return t.indexOf(s);try{const t=new Intl.Locale(e.locale.language),s=t.getWeekInfo?.()??t.weekInfo;if(s)return(s.firstDay+6)%7}catch{}return 0})(this.hass)),l=n.filter(e=>!s.some(t=>t.days.includes(e))),d=yt(new Date,this.hass.config.time_zone),c=jt(this.hass.config.time_zone),h=((e,t)=>{const s=St(e.start),i=St(e.end);return Ht(s,i)<=0?Ht(s,t)<=0&&Ht(t,i)<=0:Ht(t,s)>=0||Ht(t,i)<=0})(t,c);return F`
      <div class="section-header">
        <div class="heading">
          <h2><span class="dot" style="--season-color:${t.color??"#607d8b"}"></span>${this.localize("programs.title",{season:t.name})}</h2>
          <span class="secondary small">${this.localize("programs.hint")}</span>
        </div>
        ${this._readOnly?q:F`<button class="filled-button small" @click=${()=>this._addProgram(t.id,s)}>
              <ha-svg-icon .path=${Te}></ha-svg-icon>${this.localize("programs.new")}
            </button>`}
      </div>
      <div class="legend" aria-label=${this.localize("programs.legend")}>
        ${this._legend(a,i).map(({color:e,label:t})=>F`<span><span class="swatch" style="background:${e}"></span>${t}</span>`)}
      </div>
      ${s.length?l.length?F`<div class="warning" role="status">
              <ha-svg-icon .path=${Ee}></ha-svg-icon>${this.localize("programs.uncovered",{days:l.map(e=>xt(i,lt.indexOf(e))).join(", ")})}
            </div>`:q:F`<div class="warning" role="status">
            <ha-svg-icon .path=${Ee}></ha-svg-icon>${this.localize("programs.empty")}
          </div>`}
      ${qe(`${e.entity_id}|${t.id}`,Xe(s,e=>e.id,e=>F`<shs-program-card
          .program=${e}
          .others=${s.filter(t=>t.id!==e.id)}
          .days=${n}
          .unit=${a}
          .limits=${r}
          .canTurnOff=${(e=>!e||(e.attributes.hvac_modes??[]).includes("off"))(o)}
          .language=${i}
          .h12=${gt(this.hass)}
          .readOnly=${this._readOnly}
          .now=${h&&e.days.includes(lt[d.weekday])?d.minutes:null}
          .localize=${this.localize}
          @day-toggled=${i=>this._toggleDay(t.id,s,e.id,i.detail.day)}
          @blocks-changed=${i=>this._updateProgram(t.id,s,e.id,{blocks:i.detail.blocks})}
          @rename=${()=>this._rename={program:e,name:e.name}}
          @duplicate=${()=>this._duplicate(t.id,s,e)}
          @delete=${()=>this._deleteProgram=e}
        ></shs-program-card>`))}
    `}_legend(e,t){const s=e===Ke,i=i=>tt(s?Math.round(9*i/5+32):i,e,1,!0,t),a=st.map((e,t)=>{const s=st[t-1],a=s?e.upTo===1/0?`≥${i(s.upTo+1)}`:`${i(s.upTo+1).replace("°","")}–${i(e.upTo)}`:`≤${i(e.upTo)}`;return{color:`var(--shs-color-${e.name}, ${e.color})`,label:a}});return[...a,{color:`var(--shs-color-off, ${it})`,label:this.localize("block.off")}]}_renderDialogs(e){const t=this._season,s=e&&t?this._programs(e,t.id):[],i=new Set(this.state.rooms.map(e=>e.entity_id)),a=e?ve(this.hass,e.entity_id):"";return F`
      <shs-entity-picker-dialog
        .hass=${this.hass}
        .open=${this._addOpen}
        .heading=${this.localize("entity.choose")}
        .emptyText=${this.localize("entity.no_thermostats")}
        .entityIds=${Object.keys(this.hass.states).filter(e=>e.startsWith("climate.")&&!i.has(e))}
        .localize=${this.localize}
        @closed=${()=>this._addOpen=!1}
        @picked=${e=>this._addRoom(e.detail.entityIds[0])}
      ></shs-entity-picker-dialog>

      <shs-season-dialog
        .open=${null!==this._seasonDialog}
        .season=${this._seasonDialog?.season??null}
        .seasons=${this.state.seasons}
        .localize=${this.localize}
        @closed=${()=>this._seasonDialog=null}
        @save=${e=>this._saveSeason(e.detail.season)}
        @delete=${e=>{this._seasonDialog=null,this._deleteSeason=e.detail.season}}
      ></shs-season-dialog>

      ${this._confirm(this._removeOpen,this.localize("entity.remove"),this.localize("entity.remove_text",{name:a}),this.localize("common.delete"),()=>this._removeRoom(),()=>this._removeOpen=!1)}
      ${this._confirm(this._resetOpen,this.localize("seasons.reset_title"),this.localize("seasons.reset_text"),this.localize("common.replace"),async()=>{var e;this._resetOpen=!1,await this._call((e=this.hass,e.callWS({type:`${me}/seasons/reset`})))},()=>this._resetOpen=!1)}
      ${this._confirm(null!==this._deleteSeason,this.localize("season_dialog.delete"),this.localize("season_dialog.delete_text",{name:this._deleteSeason?.name??""}),this.localize("common.delete"),()=>this._removeSeason(this._deleteSeason),()=>this._deleteSeason=null)}
      ${this._confirm(null!==this._deleteProgram,this.localize("programs.delete",{name:this._deleteProgram?.name??""}),this.localize("programs.delete_text",{name:this._deleteProgram?.name??""}),this.localize("common.delete"),()=>{const e=this._deleteProgram.id;this._deleteProgram=null,t&&this._setPrograms(t.id,s.filter(t=>t.id!==e),0)},()=>this._deleteProgram=null)}

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
            @input=${e=>this._rename&&(this._rename={...this._rename,name:e.target.value})}
          />
        </label>
        <button slot="actions" class="text-button" @click=${()=>this._rename=null}>
          ${this.localize("common.cancel")}
        </button>
        <button
          slot="actions"
          class="filled-button"
          ?disabled=${!this._rename?.name.trim()}
          @click=${()=>{const e=this._rename;this._rename=null,t&&this._updateProgram(t.id,s,e.program.id,{name:e.name.trim()},0)}}
        >
          ${this.localize("common.save")}
        </button>
      </shs-dialog>
    `}_confirm(e,t,s,i,a,o){return F`<shs-dialog .open=${e} .heading=${t} @closed=${o}>
      <p>${s}</p>
      <button slot="actions" class="text-button" @click=${o}>${this.localize("common.cancel")}</button>
      <button slot="actions" class="filled-button danger" @click=${a}>${i}</button>
    </shs-dialog>`}static{this.styles=[Ae,Ce,n`
      :host {
        display: block;
        font-size: 14px;
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
        gap: 16px;
        margin: 0 auto;
        max-width: 1180px;
        padding: 16px 16px 32px;
      }
      ha-card {
        padding: 14px 16px;
      }
      h2 {
        align-items: center;
        display: flex;
        font-size: 17px;
        font-weight: 600;
        gap: 8px;
        margin: 0;
      }
      .small {
        font-size: 13px;
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
        font-size: 14px;
        gap: 6px;
        min-height: 40px;
        padding: 0 16px;
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
        font-size: 13px;
        font-weight: 600;
      }
      .entity-name {
        font-size: 16px;
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
        gap: 12px;
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
        gap: 16px;
      }
      .now {
        box-sizing: border-box;
        display: flex;
        flex: 1 1 260px;
        flex-direction: column;
        gap: 12px;
      }
      .big {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .big .value {
        font-size: 34px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .now.overridden {
        box-shadow: inset 0 0 0 2px var(--warning-color, #ff9800);
      }
      .big .value.manual {
        color: color-mix(in srgb, var(--warning-color, #ff9800) 80%, var(--primary-text-color));
      }
      dl {
        display: grid;
        gap: 10px 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 0;
      }
      dt {
        color: var(--secondary-text-color);
        font-size: 12px;
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
        gap: 12px;
        min-width: 0;
      }
      .legend {
        color: var(--secondary-text-color);
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        gap: 4px 14px;
      }
      .legend > span {
        align-items: center;
        display: inline-flex;
        gap: 4px;
      }
      .swatch {
        border-radius: 3px;
        display: inline-block;
        height: 10px;
        width: 10px;
      }
      .warning {
        align-items: center;
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        border-radius: 10px;
        display: flex;
        font-size: 13px;
        gap: 8px;
        padding: 10px 12px;
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
    `]}};e([pe({attribute:!1})],Bt.prototype,"hass",void 0),e([pe({attribute:!1})],Bt.prototype,"state",void 0),e([pe({type:Boolean})],Bt.prototype,"narrow",void 0),e([pe({attribute:!1})],Bt.prototype,"localize",void 0),e([ue()],Bt.prototype,"_entityId",void 0),e([ue()],Bt.prototype,"_seasonId",void 0),e([ue()],Bt.prototype,"_drafts",void 0),e([ue()],Bt.prototype,"_addOpen",void 0),e([ue()],Bt.prototype,"_removeOpen",void 0),e([ue()],Bt.prototype,"_resetOpen",void 0),e([ue()],Bt.prototype,"_seasonDialog",void 0),e([ue()],Bt.prototype,"_deleteSeason",void 0),e([ue()],Bt.prototype,"_deleteProgram",void 0),e([ue()],Bt.prototype,"_rename",void 0),Bt=e([xe("shs-main-view")],Bt);let Ft=class extends le{constructor(){super(...arguments),this.narrow=!1,this._ready=!1}connectedCallback(){super.connectedCallback(),(_e??=(async()=>{if(customElements.get("ha-card")&&customElements.get("ha-switch"))return;const e=window.loadCardHelpers;if(e)try{const t=await e();t.createCardElement({type:"entities",entities:[]}),t.createRowElement?.({entity:"input_boolean.smart_heating_schedule_preload"}),await Promise.race([Promise.all(["ha-card","ha-switch","ha-icon-button"].map(e=>customElements.whenDefined(e))),new Promise(e=>setTimeout(e,3e3))])}catch{}})(),_e).then(()=>this._ready=!0),this.hass&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.then(e=>e()).catch(()=>{}),this._unsubscribe=void 0}willUpdate(e){e.has("hass")&&this.hass&&(!this._unsubscribe&&this.isConnected&&this._subscribe(),this.toggleAttribute("dark",Boolean(this.hass.themes?.darkMode)),this.hass.locale.language!==this._language&&(this._language=this.hass.locale.language,this._localize=ze(this._language)))}_subscribe(){var e,t;this._unsubscribe=(e=this.hass,t=e=>{this._state=e,this._error=void 0},e.connection.subscribeMessage(t,{type:`${me}/subscribe`})),this._unsubscribe.catch(e=>{this._error="not_loaded"===e?.code?this._localize("not_loaded"):e?.message??String(e)})}render(){const e=this._localize??ze("en");return this._error?F`<div class="message"><ha-card class="padded">${this._error}</ha-card></div>`:this._state&&this._ready?F`<shs-main-view
      .hass=${this.hass}
      .state=${this._state}
      .narrow=${this.narrow}
      .localize=${e}
    ></shs-main-view>`:F`<div class="message secondary">${e("loading")}</div>`}static{this.styles=[Ae,n`
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
    `]}};e([pe({attribute:!1})],Ft.prototype,"hass",void 0),e([pe({type:Boolean,reflect:!0})],Ft.prototype,"narrow",void 0),e([pe({attribute:!1})],Ft.prototype,"route",void 0),e([pe({attribute:!1})],Ft.prototype,"panel",void 0),e([ue()],Ft.prototype,"_state",void 0),e([ue()],Ft.prototype,"_error",void 0),e([ue()],Ft.prototype,"_ready",void 0),Ft=e([xe("smart-heating-schedule-panel")],Ft);export{Ft as SmartHeatingSchedulePanel};
