var J=Object.defineProperty;var G=(t,a,e)=>a in t?J(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var y=(t,a,e)=>(G(t,typeof a!="symbol"?a+"":a,e),e);import{j as w,p as H,k as m,e as i,i as V,I as b,n as T,q as P,v as R,R as N,x as K,y as Q,z as X,A as Y,B as Z,C as ee,D as te,E as ae,F as re,G as $,H as se,J as ne,K as oe,L as ie,M as le,N as ce,O as de,P as ue,Q as he,S as fe,T as ve,U as pe,W as C,X as ge,Y as ye,Z as be,_ as we,$ as me,a0 as ke,a as Oe,a1 as xe}from"./index.e2c7bcbb.js";class O{constructor(a){let{x:e,y:r,width:s,height:n}=a;this.x=e,this.y=r,this.width=s,this.height=n}get top(){return this.y}get bottom(){return this.y+this.height}get left(){return this.x}get right(){return this.x+this.width}}function Te(t,a){return{x:{before:Math.max(0,a.left-t.left),after:Math.max(0,t.right-a.right)},y:{before:Math.max(0,a.top-t.top),after:Math.max(0,t.bottom-a.bottom)}}}function $e(t){const a=t.getBoundingClientRect(),e=getComputedStyle(t),r=e.transform;if(r){let s,n,l,o,c;if(r.startsWith("matrix3d("))s=r.slice(9,-1).split(/, /),n=+s[0],l=+s[5],o=+s[12],c=+s[13];else if(r.startsWith("matrix("))s=r.slice(7,-1).split(/, /),n=+s[0],l=+s[3],o=+s[4],c=+s[5];else return new O(a);const u=e.transformOrigin,h=a.x-o-(1-n)*parseFloat(u),f=a.y-c-(1-l)*parseFloat(u.slice(u.indexOf(" ")+1)),d=n?a.width/n:t.offsetWidth+1,k=l?a.height/l:t.offsetHeight+1;return new O({x:h,y:f,width:d,height:k})}else return new O(a)}function Be(t,a,e){if(typeof t.animate>"u")return{finished:Promise.resolve()};const r=t.animate(a,e);return typeof r.finished>"u"&&(r.finished=new Promise(s=>{r.onfinish=()=>{s(r)}})),r}const _e="cubic-bezier(0.4, 0, 0.2, 1)",Me="cubic-bezier(0.0, 0, 0.2, 1)",De="cubic-bezier(0.4, 0, 1, 1)";class je{constructor(a){y(this,"fetchOptions");y(this,"errorMessage","Welp. That web call did not work. Going want to check console for more info.");y(this,"baseUrl","http://127.0.0.1:3001");this.fetchOptions={headers:new Headers({db_url:a,Accept:"application/json","Content-Type":"application/json"})}}async getKeys(a=""){try{return await(await fetch(this.baseUrl+`/keys?prefix=${a}`,this.fetchOptions)).json()}catch(e){throw alert(this.errorMessage),console.error("There was an error getting the keys for the prefix: "+a),console.error(e),e}}async getValue(a){try{return await(await fetch(this.baseUrl+`/key?name=${a}`,this.fetchOptions)).json()}catch(e){throw alert(this.errorMessage),console.error("There was an error getting the value of the key: "+a),console.error(e),e}}async setValue(a,e){try{const r={updatedValue:e},s={headers:this.fetchOptions.headers,method:"POST",body:JSON.stringify(r)};await fetch(this.baseUrl+`/key?name=${a}`,s)}catch(r){throw alert(this.errorMessage),console.error("There was an error setting the value of the key: "+a),console.error(e),console.error(r),r}}async deleteKey(a){try{await fetch(this.baseUrl+`/delete/key?name=${a}`,this.fetchOptions)}catch(e){throw alert(this.errorMessage),console.error("There was an error deleting the value of the key: "+a),console.error(e),e}}async getAll(){try{return await(await fetch(this.baseUrl+"/keys/all",this.fetchOptions)).json()}catch(a){throw alert(this.errorMessage),console.error("There was an error getting all the values."),console.error(a),a}}async addDatabase(a){try{const e={dbUrl:a},r={headers:this.fetchOptions.headers,method:"POST",body:JSON.stringify(e)};await fetch(this.baseUrl+"/api/database/add",r)}catch(e){throw alert(this.errorMessage),console.error(e),e}}async listDatabases(){try{const a=await fetch(this.baseUrl+"/api/database/list",this.fetchOptions);try{return await a.json()}catch{throw console.error(a.body),new Error}}catch(a){throw console.error(a),alert(this.errorMessage),console.error("There was an error getting the databases from supabase. Guess you can call this a supa-problem"),console.error(a),a}}async createABackup(a){try{const e=await fetch(this.baseUrl+`/api/database/backup/add?id=${a}`,this.fetchOptions),r=await e.json();if(e.status!==200)throw new Error(r);return r}catch(e){throw alert(this.errorMessage),console.error("There was an error creating a back up of the databases."),console.error(e),e}}async deleteDatabase(a){try{const e=await fetch(this.baseUrl+`/api/database/delete?id=${a}`,this.fetchOptions),r=await e.json();if(e.status!==200)throw new Error(r);return r}catch(e){throw alert(this.errorMessage),console.error("There was an error creating a back up of the databases."),console.error(e),e}}async listBackups(a){try{const e=await fetch(this.baseUrl+`/api/database/backups?id=${a}`,this.fetchOptions);try{if(e.status!==200){const r=await e.json();throw console.error(r),new Error}return await e.json()}catch{throw new Error}}catch(e){throw alert(this.errorMessage),console.error(e),e}}async deleteBackup(a){try{const e=await fetch(this.baseUrl+`/api/database/backup/delete?id=${a}`,this.fetchOptions);return this.handleWebRequest(e)}catch(e){throw alert(this.errorMessage),console.error(e),e}}async restoreBackup(a){try{const e=await fetch(this.baseUrl+`/api/database/backup/restore?id=${a}`,this.fetchOptions);return this.handleWebRequest(e)}catch(e){throw alert(this.errorMessage),console.error(e),e}}async getBackup(a){try{const e=await fetch(this.baseUrl+`/api/database/backup/get?id=${a}`,this.fetchOptions);return this.handleWebRequest(e)}catch(e){throw alert(this.errorMessage),console.error(e),e}}async handleWebRequest(a){try{if(a.status!==200){const e=await a.json();throw console.error(e),new Error}return await a.json()}catch{throw new Error}}}const Pe=w({name:"VCardActions",setup(t,a){let{slots:e}=a;return H({VBtn:{variant:"text"}}),m(()=>{var r;return i("div",{class:"v-card-actions"},[(r=e.default)==null?void 0:r.call(e)])}),{}}}),Ce=V("v-card-subtitle"),Ve=V("v-card-title"),Ae=w({name:"VCardItem",props:{appendAvatar:String,appendIcon:b,prependAvatar:String,prependIcon:b,subtitle:String,title:String,...T()},setup(t,a){let{slots:e}=a;return m(()=>{var r,s,n,l,o;const c=!!(t.prependAvatar||t.prependIcon||e.prepend),u=!!(t.appendAvatar||t.appendIcon||e.append),h=!!(t.title||e.title),f=!!(t.subtitle||e.subtitle);return i("div",{class:"v-card-item"},[c&&i(P,{key:"prepend",defaults:{VAvatar:{density:t.density,icon:t.prependIcon,image:t.prependAvatar},VIcon:{density:t.density,icon:t.prependIcon}}},{default:()=>{var d;return[i("div",{class:"v-card-item__prepend"},[(d=(r=e.prepend)==null?void 0:r.call(e))!=null?d:i(R,null,null)])]}}),i("div",{class:"v-card-item__content"},[h&&i(Ve,{key:"title"},{default:()=>{var d;return[(d=(s=e.title)==null?void 0:s.call(e))!=null?d:t.title]}}),f&&i(Ce,{key:"subtitle"},{default:()=>{var d;return[(d=(n=e.subtitle)==null?void 0:n.call(e))!=null?d:t.subtitle]}}),(l=e.default)==null?void 0:l.call(e)]),u&&i(P,{key:"append",defaults:{VAvatar:{density:t.density,icon:t.appendIcon,image:t.appendAvatar},VIcon:{density:t.density,icon:t.appendIcon}}},{default:()=>{var d;return[i("div",{class:"v-card-item__append"},[(d=(o=e.append)==null?void 0:o.call(e))!=null?d:i(R,null,null)])]}})])}),{}}}),Se=V("v-card-text"),Ue=w({name:"VCard",directives:{Ripple:N},props:{appendAvatar:String,appendIcon:b,disabled:Boolean,flat:Boolean,hover:Boolean,image:String,link:{type:Boolean,default:void 0},prependAvatar:String,prependIcon:b,ripple:Boolean,subtitle:String,text:String,title:String,...K(),...Q(),...T(),...X(),...Y(),...Z(),...ee(),...te(),...ae(),...re(),...$(),...se({variant:"elevated"})},setup(t,a){let{attrs:e,slots:r}=a;const{themeClasses:s}=ne(t),{borderClasses:n}=oe(t),{colorClasses:l,colorStyles:o,variantClasses:c}=ie(t),{densityClasses:u}=le(t),{dimensionStyles:h}=ce(t),{elevationClasses:f}=de(t),{loaderClasses:d}=ue(t),{locationStyles:k}=he(t),{positionClasses:B}=fe(t),{roundedClasses:_}=ve(t),p=pe(t,e),M=C(()=>t.link!==!1&&p.isLink.value),g=C(()=>!t.disabled&&t.link!==!1&&(t.link||p.isClickable.value));return m(()=>{var A,S,I;const D=M.value?"a":t.tag,j=!!(r.title||t.title),U=!!(r.subtitle||t.subtitle),E=j||U,L=!!(r.append||t.appendAvatar||t.appendIcon),W=!!(r.prepend||t.prependAvatar||t.prependIcon),z=!!(r.image||t.image),q=E||W||L,F=!!(r.text||t.text);return ge(i(D,{class:["v-card",{"v-card--disabled":t.disabled,"v-card--flat":t.flat,"v-card--hover":t.hover&&!(t.disabled||t.flat),"v-card--link":g.value},s.value,n.value,l.value,u.value,f.value,d.value,B.value,_.value,c.value],style:[o.value,h.value,k.value],href:p.href.value,onClick:g.value&&p.navigate,tabindex:t.disabled?-1:void 0},{default:()=>[z&&i(P,{key:"image",defaults:{VImg:{cover:!0,src:t.image}}},{default:()=>{var v;return[i("div",{class:"v-card__image"},[(v=(A=r.image)==null?void 0:A.call(r))!=null?v:i(be,null,null)])]}}),i(we,{name:"v-card",active:!!t.loading,color:typeof t.loading=="boolean"?void 0:t.loading},{default:r.loader}),q&&i(Ae,{key:"item",prependAvatar:t.prependAvatar,prependIcon:t.prependIcon,title:t.title,subtitle:t.subtitle,appendAvatar:t.appendAvatar,appendIcon:t.appendIcon},{default:r.item,prepend:r.prepend,title:r.title,subtitle:r.subtitle,append:r.append}),F&&i(Se,{key:"text"},{default:()=>{var v;return[(v=(S=r.text)==null?void 0:S.call(r))!=null?v:t.text]}}),(I=r.default)==null?void 0:I.call(r),r.actions&&i(Pe,null,{default:r.actions}),me(g.value,"v-card")]}),[[ye("ripple"),g.value]])}),{}}}),x=Symbol("Forwarded refs");function Ee(t){for(var a=arguments.length,e=new Array(a>1?a-1:0),r=1;r<a;r++)e[r-1]=arguments[r];return t[x]=e,new Proxy(t,{get(s,n){if(Reflect.has(s,n))return Reflect.get(s,n);for(const l of e)if(l.value&&Reflect.has(l.value,n)){const o=Reflect.get(l.value,n);return typeof o=="function"?o.bind(l.value):o}},getOwnPropertyDescriptor(s,n){const l=Reflect.getOwnPropertyDescriptor(s,n);if(l)return l;if(!(typeof n=="symbol"||n.startsWith("__"))){for(const o of e){if(!o.value)continue;const c=Reflect.getOwnPropertyDescriptor(o.value,n);if(c)return c;if("_"in o.value&&"setupState"in o.value._){const u=Reflect.getOwnPropertyDescriptor(o.value._.setupState,n);if(u)return u}}for(const o of e){let c=o.value&&Object.getPrototypeOf(o.value);for(;c;){const u=Reflect.getOwnPropertyDescriptor(c,n);if(u)return u;c=Object.getPrototypeOf(c)}}for(const o of e){const c=o.value&&o.value[x];if(!c)continue;const u=c.slice();for(;u.length;){const h=u.shift(),f=Reflect.getOwnPropertyDescriptor(h.value,n);if(f)return f;const d=h.value&&h.value[x];d&&u.push(...d)}}}}})}const Le=w({name:"VContainer",props:{fluid:{type:Boolean,default:!1},...$()},setup(t,a){let{slots:e}=a;return m(()=>i(t.tag,{class:["v-container",{"v-container--fluid":t.fluid}]},e)),{}}}),We=ke({eager:Boolean},"lazy");function ze(t,a){const e=Oe(!1),r=C(()=>e.value||t.eager||a.value);xe(a,()=>e.value=!0);function s(){t.eager||(e.value=!1)}return{isBooted:e,hasContent:r,onAfterLeave:s}}export{O as B,Le as V,je as W,Ve as a,Ce as b,Se as c,Ue as d,Pe as e,Ee as f,Be as g,Me as h,De as i,Te as j,Ae as k,We as m,$e as n,_e as s,ze as u};