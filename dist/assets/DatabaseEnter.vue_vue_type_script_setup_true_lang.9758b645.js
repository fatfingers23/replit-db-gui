import{i as C,j as D,a as v,k as R,e as u,d as k,o as U,c as S,w as c,f as b,l as _,h as I,t as x,m as T,s as V,r as B}from"./index.e2c7bcbb.js";import{f as E,W as F,c as L,V as P,e as A,d as q}from"./lazy.f2ba3b05.js";import{m as N,c as W,V as $}from"./VTextField.e1883e3b.js";function w(t){this.message=t}w.prototype=new Error,w.prototype.name="InvalidCharacterError";var g=typeof window<"u"&&window.atob&&window.atob.bind(window)||function(t){var r=String(t).replace(/=+$/,"");if(r.length%4==1)throw new w("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,a,l=0,i=0,d="";a=r.charAt(i++);~a&&(n=l%4?64*n+a:a,l++%4)?d+=String.fromCharCode(255&n>>(-2*l&6)):0)a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a);return d};function H(t){var r=t.replace(/-/g,"+").replace(/_/g,"/");switch(r.length%4){case 0:break;case 2:r+="==";break;case 3:r+="=";break;default:throw"Illegal base64url string!"}try{return function(n){return decodeURIComponent(g(n).replace(/(.)/g,function(a,l){var i=l.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}(r)}catch{return g(r)}}function f(t){this.message=t}function O(t,r){if(typeof t!="string")throw new f("Invalid token specified");var n=(r=r||{}).header===!0?0:1;try{return JSON.parse(H(t.split(".")[n]))}catch(a){throw new f("Invalid token specified: "+a.message)}}f.prototype=new Error,f.prototype.name="InvalidTokenError";const j=C("v-code"),J=D({name:"VForm",props:{...N()},emits:{"update:modelValue":t=>!0,submit:t=>!0},setup(t,r){let{slots:n,emit:a}=r;const l=W(t),i=v();function d(o){o.preventDefault(),l.reset()}function p(o){const e=o,s=l.validate();e.then=s.then.bind(s),e.catch=s.catch.bind(s),e.finally=s.finally.bind(s),a("submit",e),e.defaultPrevented||s.then(m=>{let{valid:h}=m;if(h){var y;(y=i.value)==null||y.submit()}}),e.preventDefault()}return R(()=>{var o;return u("form",{ref:i,class:"v-form",novalidate:!0,onReset:d,onSubmit:p},[(o=n.default)==null?void 0:o.call(n,l)])}),E(l,i)}}),Y=C("flex-grow-1","div","VSpacer"),M=k({__name:"DatabaseEnter",props:{local:{type:Boolean,default:!0}},setup(t){const r=t,n=new F(""),a=v(""),l=v(!1);function i(o){let e;try{e=new URL(o)}catch{return!1}return e.protocol==="http:"||e.protocol==="https:"}const d={url:o=>i(o)||"This is not formatted as a url",required:o=>!!o||"Required."};async function p(o){if(o.preventDefault(),r.local)try{const m=new URL(a.value).pathname.split("/")[2],h=O(m);V.setDbUrl(a.value,h),await B.push({name:"db-view",params:{id:"local"}})}catch(e){alert("I have reason to believe that this is not a Replit db url. Check console for a tiny bit more info."),console.log(e)}else try{await n.addDatabase(a.value),V.userDatabases=await n.listDatabases()}catch(e){alert("I have reason to believe that this is not a Replit db url. Check console for a tiny bit more info."),console.log("Can also be an issue with the server."),console.log(e)}}return(o,e)=>(U(),S(q,{class:"mx-auto",title:"Enter your Replit DB URL",width:"75%"},{default:c(()=>[u(L,null,{default:c(()=>[b("You can find your Replit DB Url by typing the command below into your Replit shell.")]),_:1}),u(j,null,{default:c(()=>[b('echo "$REPLIT_DB_URL"')]),_:1}),u(J,{onSubmit:p,modelValue:l.value,"onUpdate:modelValue":e[1]||(e[1]=s=>l.value=s)},{default:c(()=>[u(P,null,{default:c(()=>[u($,{modelValue:a.value,"onUpdate:modelValue":e[0]||(e[0]=s=>a.value=s),color:"primary",rules:[d.url,d.required],label:"Data base url",variant:"underlined",autofocus:"",type:"url"},null,8,["modelValue","rules"])]),_:1}),u(_),u(A,null,{default:c(()=>[u(Y),u(I,{color:"success",type:"submit",disabled:!l.value},{default:c(()=>[b(x(t.local?"View Database":"Add a new database")+" ",1),u(T,{icon:"mdi-chevron-right",end:""})]),_:1},8,["disabled"])]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});export{M as _,O as o};
