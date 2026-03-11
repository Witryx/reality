(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,14633,e=>{"use strict";var a=e.i(43476),r=e.i(71645),t=e.i(75254);let i=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]),o=(0,t.default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]),n=(0,t.default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),s=["properties","howItWorks","about","contact"],d=({t:e,language:r,onLanguageChange:t,onNavigate:d,mobileOpen:l,onToggleMobile:p})=>(0,a.jsxs)("header",{className:"nav-shell",children:[(0,a.jsxs)("div",{className:"nav",children:[(0,a.jsxs)("div",{className:"nav-left",children:[(0,a.jsx)("div",{className:"brand-logo",children:(0,a.jsx)("img",{src:"/MAINLOGO.png",alt:"Egyptsko Ceska Reality logo"})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"brand-name",children:"Egyptsko Česká Reality"}),(0,a.jsx)("div",{style:{color:"var(--muted)",fontSize:13},children:"Hurghada · Nemovitosti"})]})]}),(0,a.jsx)("div",{className:"nav-links",children:s.map(r=>(0,a.jsx)("button",{className:"nav-link",onClick:()=>d(r),children:e.nav[r]},r))}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:14},children:[(0,a.jsx)("div",{className:"lang-switch",children:["cz","en","de"].map(e=>(0,a.jsx)("button",{className:`lang-btn ${r===e?"active":""}`,onClick:()=>t(e),children:e},e))}),(0,a.jsxs)("button",{className:"btn-primary",onClick:()=>d("contact"),style:{background:"linear-gradient(135deg, #0b2338, #0f7082 55%, #1fbac6 80%)",borderColor:"rgba(217,179,106,0.6)",boxShadow:"0 14px 30px rgba(7,23,40,0.24)"},children:[(0,a.jsx)(o,{size:16}),e.hero.cta1]}),(0,a.jsx)("button",{className:"menu-toggle",onClick:p,"aria-label":"Toggle menu",children:l?(0,a.jsx)(n,{size:18}):(0,a.jsx)(i,{size:18})})]})]}),l&&(0,a.jsxs)("div",{className:"nav-mobile",children:[s.map(r=>(0,a.jsx)("button",{className:"nav-link",style:{textAlign:"left",width:"100%"},onClick:()=>d(r),children:e.nav[r]},r)),(0,a.jsx)("div",{style:{display:"flex",gap:10,marginTop:10},children:["cz","en","de"].map(e=>(0,a.jsx)("button",{className:`lang-btn ${r===e?"active":""}`,onClick:()=>t(e),children:e},e))})]})]}),l=(0,t.default)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]),p=(0,t.default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),g=(0,t.default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),c=({t:e,language:r,onPrimaryCta:t,onSecondaryCta:i})=>(0,a.jsx)("section",{id:"top",className:"hero",children:(0,a.jsx)("div",{className:"container hero-grid single",children:(0,a.jsxs)("div",{className:"hero-copy",style:{textAlign:"center",margin:"0 auto"},children:[(0,a.jsx)("h1",{className:"display",children:e.hero.title}),(0,a.jsx)("p",{className:"subtitle",style:{textAlign:"center"},children:e.hero.subtitle}),(0,a.jsxs)("div",{className:"btn-row",style:{justifyContent:"center"},children:[(0,a.jsxs)("button",{className:"btn-primary",onClick:t,children:[e.hero.cta1,(0,a.jsx)(l,{size:16})]}),(0,a.jsx)("button",{className:"btn-secondary",onClick:i,children:e.hero.cta2})]}),(0,a.jsx)("div",{className:"hero-highlights",style:{justifyContent:"center"},children:e.hero.highlights.map(e=>(0,a.jsxs)("div",{className:"pill",style:{borderColor:"rgba(255,255,255,0.18)"},children:[(0,a.jsx)(p,{size:16,color:"#d9b45a"}),e]},e))}),(0,a.jsx)("div",{className:"hero-support",style:{justifyContent:"center"},children:["cz"===r?"Ověřené projekty":"de"===r?"Geprüfte Projekte":"Verified projects","cz"===r?"24/7 podpora":"de"===r?"24/7 Support":"24/7 support"].map(e=>(0,a.jsxs)("div",{className:"support-item",children:[(0,a.jsx)(g,{size:16,color:"#d9b45a"}),(0,a.jsx)("span",{children:e})]},e))})]})})}),x=(0,t.default)("bed",[["path",{d:"M2 4v16",key:"vw9hq8"}],["path",{d:"M2 8h18a2 2 0 0 1 2 2v10",key:"1dgv2r"}],["path",{d:"M2 17h20",key:"18nfp3"}],["path",{d:"M6 8v9",key:"1yriud"}]]),b=(0,t.default)("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]),h=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]),m=(0,t.default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]),f=(0,t.default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),u=(0,t.default)("maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]),y=(0,t.default)("maximize-2",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]]),v=({eyebrow:e,title:r,subtitle:t,align:i="center",tone:o="default"})=>{let n="light"===o;return(0,a.jsxs)("div",{className:"section-header",style:{textAlign:i},children:[e&&(0,a.jsx)("div",{className:"eyebrow",style:n?{color:"#d9b45a"}:void 0,children:e}),(0,a.jsx)("h2",{className:"title",style:n?{color:"#fff"}:void 0,children:r}),t&&(0,a.jsx)("p",{className:"subtitle",style:n?{color:"rgba(255,255,255,0.8)"}:void 0,children:t})]})},w={cz:"Nacitam nabidku...",en:"Loading listings...",de:"Angebote werden geladen..."},k={cz:"Nepodarilo se nacist nabidku.",en:"Failed to load listings.",de:"Angebote konnten nicht geladen werden."},j={cz:"Momentalne nic k zobrazeni.",en:"No listings to show right now.",de:"Keine Angebote verfuegbar."},z={cz:"Zadny obrazek",en:"No image",de:"Kein Bild"},N=({t:e,language:t="cz"})=>{let i,[s,d]=(0,r.useState)(null),[p,g]=(0,r.useState)(0),[c,N]=(0,r.useState)({active:[],sold:[]}),[C,A]=(0,r.useState)(!1),[S,M]=(0,r.useState)(""),[I,W]=(0,r.useState)(!1),[E,T]=(0,r.useState)(!1),P={cz:"CZ/EN · nejrychlejší spojení",en:"CZ/EN · fastest response",de:"CZ/EN · schnellste Verbindung"},$=e=>{if(Array.isArray(e))return e.filter(Boolean);if("string"==typeof e){try{let a=JSON.parse(e);if(Array.isArray(a))return a.filter(Boolean)}catch{}return e?[e]:[]}return[]},B=(e=[])=>{let a=[],r=[];return e.forEach(e=>{e?.sold?r.push(e):a.push(e)}),{active:a,sold:r}};(0,r.useEffect)(()=>(g(0),W(!1),T(!1),s?document.body.classList.add("detail-open"):document.body.classList.remove("detail-open"),()=>document.body.classList.remove("detail-open")),[s]),(0,r.useEffect)(()=>{let a=new AbortController;return(async()=>{A(!0),M("");try{let r=await fetch("/data/properties.json",{signal:a.signal});if(!r.ok)throw Error("load_failed");let i=await r.json().catch(()=>({})),o=(Array.isArray(i)?i:Array.isArray(i?.properties)?i.properties:[]).filter(e=>!e?.language||e.language===t||"all"===e.language),n=Array.isArray(e?.properties?.items)?e.properties.items:[],s=o.length?o:n;N(B(s))}catch(a){"AbortError"!==a.name&&(N(B(Array.isArray(e?.properties?.items)?e.properties.items:[])),M(k[t]||k.en))}finally{a.signal.aborted||A(!1)}})(),()=>a.abort()},[t,e]);let q=c.active,R=s?(e=>{let a;if(!e)return[];let r=(a=$(e.images)).length?a:e.image?[e.image]:[],t=e.media&&Array.isArray(e.media)?e.media.filter(e=>e&&"video"===e.type&&e.src).map(e=>e.src):(e=>{if(Array.isArray(e))return e.filter(e=>e&&((e="")=>/\.(mp4|webm|ogg|mov)$/i.test(e))(String(e)));if("string"==typeof e){try{let a=JSON.parse(e);if(Array.isArray(a))return a.filter(e=>e&&((e="")=>/\.(mp4|webm|ogg|mov)$/i.test(e))(String(e)))}catch{}return((e="")=>/\.(mp4|webm|ogg|mov)$/i.test(e))(e)?[e]:[]}return[]})(e.videos||e.video);return[...r.map(e=>({type:"image",src:e})),...t.map(e=>({type:"video",src:e}))]})(s):[],O=R.length,V=O>1,L=R[p]||R[0],F=L?.type!=="video",Y=L?.src,D=(0,r.useCallback)(()=>{O&&g(e=>(e+1)%O)},[O]),H=(0,r.useCallback)(()=>{O&&g(e=>(e-1+O)%O)},[O]);return(0,r.useEffect)(()=>{if(!E)return;let e=e=>{"Escape"===e.key&&T(!1),"ArrowRight"===e.key&&D(),"ArrowLeft"===e.key&&H()};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[D,H,E]),(0,a.jsxs)("section",{id:"properties",className:"section",style:{background:"linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))",borderTop:"1px solid rgba(217,179,106,0.3)"},children:[(0,a.jsxs)("div",{className:"container",children:[(0,a.jsx)(v,{eyebrow:e.nav.properties,title:e.properties.title,subtitle:e.properties.subtitle}),C&&(0,a.jsx)("div",{style:{textAlign:"center",color:"#6b7280",marginBottom:12},children:w[t]||w.en}),S&&(0,a.jsx)("div",{style:{textAlign:"center",color:"#b42318",marginBottom:12},children:S}),!q.length&&(0,a.jsx)("div",{style:{textAlign:"center",color:"#6b7280",marginBottom:12},children:j[t]||j.en}),(0,a.jsx)("div",{className:"listing-grid",children:q.map(r=>{let t,i;return(0,a.jsxs)("article",{className:"listing-card",children:[(0,a.jsxs)("div",{className:"listing-thumb",children:[(t=$(r.images)[0]||r.image,(0,a.jsx)("img",{src:t,alt:r.name})),(i=r.tag)?(0,a.jsx)("div",{className:"tag-chip",children:i}):null,(0,a.jsx)("div",{className:"price-tag",children:r.price})]}),(0,a.jsxs)("div",{className:"listing-body",children:[(0,a.jsx)("h3",{className:"listing-title",children:r.name}),(0,a.jsxs)("div",{className:"listing-meta",children:[(0,a.jsxs)("a",{className:"meta-chip",href:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.location)}`,target:"_blank",rel:"noreferrer",style:{textDecoration:"none",color:"inherit"},children:[(0,a.jsx)(f,{size:16,color:"#d9b45a"}),r.location]}),(0,a.jsxs)("span",{className:"meta-chip",children:[(0,a.jsx)(u,{size:16,color:"#d9b45a"}),r.sqm," ",e.properties.sqm]}),(0,a.jsxs)("span",{className:"meta-chip",children:[(0,a.jsx)(x,{size:16,color:"#d9b45a"}),r.rooms," ",e.properties.rooms]})]}),(0,a.jsxs)("button",{className:"btn-secondary",style:{width:"fit-content",marginTop:6},onClick:()=>d(r),children:[e.properties.detail,(0,a.jsx)(l,{size:15})]})]})]},r.id||r.name)})})]}),s&&(0,a.jsx)("div",{className:"detail-overlay",onClick:()=>d(null),children:(0,a.jsxs)("div",{className:"detail-modal",onClick:e=>e.stopPropagation(),children:[(0,a.jsx)("button",{className:"close-btn",onClick:()=>d(null),children:"x"}),(0,a.jsxs)("div",{className:"detail-grid",children:[(0,a.jsxs)("div",{className:"detail-image",children:[(0,a.jsxs)("div",{className:"detail-image-main",children:[V&&(0,a.jsx)("button",{className:"image-nav left",onClick:H,type:"button","aria-label":"cz"===t?"Predchozi fotka":"de"===t?"Vorheriges Foto":"Previous photo",children:(0,a.jsx)(b,{size:18})}),Y?"video"===L.type?(0,a.jsxs)("div",{className:"detail-video-frame",children:[(0,a.jsx)("video",{className:"detail-video",src:Y,controls:!0,playsInline:!0,preload:"metadata"}),(0,a.jsx)("span",{className:"media-badge",children:"Video"})]}):(0,a.jsxs)("button",{className:"image-frame",onClick:()=>Y&&T(!0),type:"button","aria-label":"cz"===t?"Zvetsit fotografii":"de"===t?"Foto vergroessern":"Expand photo",children:[(0,a.jsx)("img",{src:Y,alt:s.name}),(0,a.jsxs)("span",{className:"image-zoom-hint",children:[(0,a.jsx)(y,{size:16}),"cz"===t?"Zvetsit":"de"===t?"Vergroessern":"Expand"]})]}):(0,a.jsx)("div",{style:{padding:20,textAlign:"center",color:"#6b7280"},children:z[t]||z.en}),V&&(0,a.jsx)("button",{className:"image-nav right",onClick:D,type:"button","aria-label":"cz"===t?"Dalsi fotka":"de"===t?"Naechstes Foto":"Next photo",children:(0,a.jsx)(h,{size:18})})]}),V&&(0,a.jsx)("div",{className:"thumb-row",children:R.map((e,r)=>(0,a.jsx)("button",{className:`thumb-btn ${r===p?"active":""}`,onClick:()=>g(r),type:"button","aria-label":`Obrazek ${r+1}`,children:"video"===e.type?(0,a.jsxs)("div",{className:"thumb-video",children:[(0,a.jsx)("video",{src:e.src,muted:!0,playsInline:!0,preload:"metadata"}),(0,a.jsx)("span",{className:"thumb-badge",children:"Video"})]}):(0,a.jsx)("img",{src:e.src,alt:`${s.name} nahled ${r+1}`})},e.src+r))})]}),(0,a.jsxs)("div",{className:"detail-info",children:[(0,a.jsx)("div",{className:"eyebrow",style:{color:"var(--gold)"},children:s.location}),(0,a.jsx)("h3",{className:"title",style:{fontSize:"28px",margin:"10px 0 8px"},children:s.name}),(0,a.jsx)("p",{style:{color:"var(--gold)",fontWeight:700,marginBottom:10},children:s.price}),(0,a.jsxs)("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16},children:[(0,a.jsxs)("span",{className:"meta-chip",children:[(0,a.jsx)(u,{size:16,color:"#d9b45a"}),s.sqm," ",e.properties.sqm]}),(0,a.jsxs)("span",{className:"meta-chip",children:[(0,a.jsx)(x,{size:16,color:"#d9b45a"}),s.rooms," ",e.properties.rooms]}),(0,a.jsxs)("a",{className:"meta-chip",href:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.location)}`,target:"_blank",rel:"noreferrer",style:{textDecoration:"none"},children:[(0,a.jsx)(f,{size:16,color:"#d9b45a"}),s.location]})]}),(0,a.jsx)("div",{style:{display:"grid",gap:8,marginBottom:12},children:(i=s.longDescription||s.description||e.properties.subtitle)?((e="")=>String(e).replace(/\\n/g,"\n").split(/\n\s*\n/).map(e=>e.trim()).filter(Boolean).map((e,t)=>{let i=e.split(/\n+/).map(e=>e.trim()).filter(Boolean);return(0,a.jsx)("p",{style:{margin:0,lineHeight:1.6,color:"#1a2a38"},children:i.map((e,t)=>(0,a.jsxs)(r.default.Fragment,{children:[e,t<i.length-1?(0,a.jsx)("br",{}):null]},t))},t)}))(i):null}),(0,a.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,a.jsx)("a",{className:"btn-primary",href:"https://wa.me/420723063837",target:"_blank",rel:"noreferrer",style:{justifyContent:"center",textDecoration:"none",width:"100%",background:"linear-gradient(135deg, #25d366, #1ebe57 60%, #0f9f3d)",color:"#0b2338",borderColor:"rgba(12,140,65,0.6)",boxShadow:"0 14px 32px rgba(10, 157, 74, 0.3)"},children:"cz"===t?"Kontaktovat přes WhatsApp":"de"===t?"Über WhatsApp kontaktieren":"Contact via WhatsApp"}),(0,a.jsxs)("div",{className:"detail-contact-card",children:[(0,a.jsx)("div",{className:"detail-contact-icon",children:(0,a.jsx)(m,{size:18})}),(0,a.jsxs)("div",{className:"detail-contact-copy",children:[(0,a.jsx)("div",{className:"detail-contact-label",children:"cz"===t?"E-mail":"de"===t?"E-Mail":"Email"}),(0,a.jsx)("div",{className:"detail-contact-title",children:e?.contact?.info?.email||"Info@egyptskoceskareality.cz"}),(0,a.jsx)("div",{className:"detail-contact-note",children:"cz"===t?"Pokud nejste na WhatsAppu, napiste sem.":"de"===t?"Falls Sie kein WhatsApp nutzen, schreiben Sie hier.":"Not on WhatsApp? Email us here."})]})]}),(0,a.jsxs)("div",{className:"detail-contact-card",children:[(0,a.jsx)("div",{className:"detail-contact-icon",children:(0,a.jsx)(o,{size:18})}),(0,a.jsxs)("div",{className:"detail-contact-copy",children:[(0,a.jsx)("div",{className:"detail-contact-label",children:"cz"===t?"Telefonní číslo":"de"===t?"Telefonnummer":"Phone number"}),(0,a.jsx)("div",{className:"detail-contact-title",children:e?.contact?.info?.phone||"+420 723 063 837"}),(0,a.jsx)("div",{className:"detail-contact-note",children:P[t]||P.en})]})]})]})]})]})]})}),E&&F&&Y&&(0,a.jsx)("div",{className:"lightbox-overlay",onClick:()=>T(!1),children:(0,a.jsxs)("div",{className:"lightbox-body",onClick:e=>e.stopPropagation(),children:[(0,a.jsx)("button",{className:"lightbox-close",onClick:()=>T(!1),type:"button","aria-label":"cz"===t?"Zavrit nahled":"de"===t?"Vorschau schliessen":"Close preview",children:(0,a.jsx)(n,{size:18})}),V&&(0,a.jsx)("button",{className:"lightbox-nav left",onClick:H,type:"button","aria-label":"cz"===t?"Predchozi fotka":"de"===t?"Vorheriges Foto":"Previous photo",children:(0,a.jsx)(b,{size:22})}),(0,a.jsx)("img",{className:"lightbox-image",src:Y,alt:`${s.name} nahled`}),V&&(0,a.jsx)("button",{className:"lightbox-nav right",onClick:D,type:"button","aria-label":"cz"===t?"Dalsi fotka":"de"===t?"Naechstes Foto":"Next photo",children:(0,a.jsx)(h,{size:22})}),V&&(0,a.jsxs)("div",{className:"lightbox-counter",children:[p+1," / ",O]})]})})]})},C=({t:e})=>(0,a.jsxs)("section",{id:"howItWorks",className:"section",style:{background:"linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))",borderTop:"1px solid rgba(217,179,106,0.3)",position:"relative",overflow:"hidden"},children:[(0,a.jsx)("div",{style:{position:"absolute",inset:"-10% -20% auto auto",width:"420px",height:"420px",background:"radial-gradient(circle, rgba(31,186,198,0.12) 0%, transparent 60%), radial-gradient(circle at 40% 30%, rgba(217,179,106,0.14), transparent 70%)",filter:"blur(8px)"}}),(0,a.jsxs)("div",{className:"container",children:[(0,a.jsx)(v,{eyebrow:e.nav.howItWorks,title:e.howItWorks.title,subtitle:e.howItWorks.subtitle}),[e.howItWorks.steps.slice(0,3),e.howItWorks.steps.slice(3)].map((e,r)=>(0,a.jsx)("div",{className:"process-grid",style:{gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",marginBottom:16*(0===r)},children:e.map((e,t)=>(0,a.jsxs)("div",{className:"step-card",style:{border:"1px solid rgba(217,179,106,0.3)",background:"linear-gradient(145deg, rgba(255,252,245,0.94), rgba(244,228,205,0.92))",boxShadow:"0 18px 32px rgba(7,23,40,0.14)"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:8},children:[(0,a.jsx)("div",{className:"step-number",style:{background:"linear-gradient(135deg, #0b2338, #0f7082 65%, #1fbac6)",boxShadow:"0 8px 18px rgba(7,23,40,0.22)"},children:3*r+t+1}),(0,a.jsx)("div",{style:{height:2,flex:1,background:"linear-gradient(90deg, rgba(217,179,106,0.8), transparent)",borderRadius:999}})]}),(0,a.jsx)("h4",{style:{margin:"8px 0 6px",fontSize:18,color:"var(--navy)"},children:e.title}),(0,a.jsx)("p",{style:{margin:0,color:"var(--muted)",lineHeight:1.6},children:e.desc})]},e.title))},r))]})]}),A=(0,t.default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]),S=(0,t.default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]),M=(0,t.default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),I=(0,t.default)("heart-handshake",[["path",{d:"M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762",key:"17lmqv"}]]),W=({t:e,language:r})=>{let t=e.personal?.bullets||[];return(0,a.jsx)("section",{id:"about",className:"section",style:{background:"linear-gradient(180deg, rgba(247,236,220,0.95), rgba(239,214,176,0.9), rgba(246,236,220,0.96))",borderTop:"1px solid rgba(217,179,106,0.3)"},children:(0,a.jsxs)("div",{className:"container",children:[(0,a.jsx)(v,{eyebrow:e.nav.about,title:e.about.title,subtitle:e.about.subtitle}),(0,a.jsxs)("div",{style:{background:"linear-gradient(135deg, rgba(255,252,245,0.95), rgba(242,224,194,0.94))",border:"1px solid rgba(217,179,106,0.35)",borderRadius:24,padding:"34px",boxShadow:"0 28px 54px rgba(7,23,40,0.18)",display:"grid",gap:22},children:[(0,a.jsx)("div",{children:(0,a.jsx)("p",{style:{color:"#0c1b27",lineHeight:1.8,margin:0,whiteSpace:"pre-line"},children:e.about.story})}),t.length?(0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:12},children:t.map((e,r)=>(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:14,background:"linear-gradient(135deg, rgba(255,252,245,0.94), rgba(244,228,205,0.94))",border:"1px solid rgba(217,179,106,0.32)",boxShadow:"0 14px 28px rgba(7,23,40,0.12)"},children:[(0,a.jsx)("span",{style:{width:10,height:10,borderRadius:"50%",background:"linear-gradient(135deg, #1fbac6, #0b2338)",flexShrink:0}}),(0,a.jsx)("span",{style:{color:"var(--navy)"},children:e})]},`${e}-${r}`))}):null,(0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:12},children:[{icon:(0,a.jsx)(p,{size:18,color:"#0b2338"}),title:"cz"===r?"Transparentnost":"de"===r?"Transparenz":"Transparency",desc:"cz"===r?"Jasný proces a smlouvy":"de"===r?"Klarer Prozess und Verträge":"Clear process and contracts"},{icon:(0,a.jsx)(A,{size:18,color:"#0b2338"}),title:"cz"===r?"Osobní přístup":"de"===r?"Individuell":"Personal approach",desc:"cz"===r?"Každý klient je jedinečný":"de"===r?"Jeder Kunde ist einzigartig":"Every client is unique"},{icon:(0,a.jsx)(I,{size:18,color:"#0b2338"}),title:"cz"===r?"Důvěra":"de"===r?"Vertrauen":"Trust",desc:"cz"===r?"Prověření partneři a právníci":"de"===r?"Geprüfte Partner & Anwälte":"Vetted partners & lawyers"},{icon:(0,a.jsx)(S,{size:18,color:"#0b2338"}),title:"cz"===r?"Podpora 24/7":"Support 24/7",desc:"cz"===r?"Jsme tu, kdykoli potřebujete":"de"===r?"Immer erreichbar":"We are here anytime"},{icon:(0,a.jsx)(M,{size:18,color:"#0b2338"}),title:"cz"===r?"Kvalita":"de"===r?"Qualität":"Quality",desc:"cz"===r?"Pouze ověřené projekty":"de"===r?"Nur geprüfte Projekte":"Only verified projects"}].map(e=>(0,a.jsxs)("div",{className:"trust-card",style:{display:"flex",gap:12,alignItems:"center",background:"linear-gradient(135deg, rgba(255,252,245,0.96), rgba(242,224,194,0.92))",border:"1px solid rgba(217,179,106,0.3)",borderRadius:16,padding:"12px 14px",boxShadow:"0 16px 30px rgba(7,23,40,0.14)"},children:[(0,a.jsx)("div",{style:{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg, rgba(255,252,245,0.96), rgba(244,228,205,0.92))",border:"1px solid rgba(217,179,106,0.3)",display:"grid",placeItems:"center"},children:e.icon}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontWeight:700,color:"var(--navy)"},children:e.title}),(0,a.jsx)("div",{style:{fontSize:13,color:"var(--muted)"},children:e.desc})]})]},e.title))})]})]})})},E=(0,t.default)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]),T={cz:"Jsme často přímo v Egyptě, proto doporučujeme WhatsApp pro hovory i zprávy. Pokud by hlavní makléř nebyl dostupný, zavolejte prosím na české číslo níže.",en:"We are often on the ground in Egypt, so WhatsApp is best for calls or messages. If the lead agent is unavailable, please call the Czech number below.",de:"Wir sind häufig direkt in Ägypten, daher am besten per WhatsApp anrufen oder schreiben. Wenn der Hauptmakler nicht erreichbar ist, rufen Sie bitte die tschechische Nummer unten an."},P={cz:"CZ/EN · nejrychlejší spojení",en:"CZ/EN · fastest response",de:"CZ/EN · schnellste Verbindung"},$=({t:e,language:r})=>(0,a.jsx)("section",{id:"contact",className:"section",style:{background:"radial-gradient(120% 120% at 12% 10%, rgba(217,179,106,0.22), transparent 55%), radial-gradient(120% 90% at 86% 8%, rgba(31,186,198,0.18), transparent 52%), linear-gradient(160deg, #041021 0%, #0b2338 50%, #0f7082 100%)",color:"#f4efe4",position:"relative",overflow:"hidden"},children:(0,a.jsxs)("div",{className:"container",children:[(0,a.jsx)(v,{eyebrow:e.nav.contact,title:e.contact.title,subtitle:e.contact.subtitle,tone:"light"}),(0,a.jsx)("div",{className:"contact-grid",children:(0,a.jsxs)("div",{className:"contact-card",style:{background:"linear-gradient(145deg, rgba(255,252,245,0.14), rgba(31,186,198,0.08))",color:"#f4efe4",borderColor:"rgba(217,179,106,0.4)",boxShadow:"0 22px 48px rgba(0,0,0,0.28)",padding:"22px 22px 18px"},children:[(0,a.jsx)("div",{className:"contact-actions",style:{justifyContent:"center"},children:(0,a.jsxs)("a",{className:"btn-primary",href:"https://wa.me/420723063837",target:"_blank",rel:"noreferrer",style:{background:"linear-gradient(135deg, #25d366, #1ebe57 60%, #0f9f3d)",color:"#0b2338",boxShadow:"0 14px 32px rgba(10, 157, 74, 0.3)",textDecoration:"none",border:"1px solid rgba(12,140,65,0.4)",minWidth:220,justifyContent:"center"},children:[(0,a.jsx)(E,{size:16}),"cz"===r?"Napište na WhatsApp":"de"===r?"WhatsApp schreiben":"Message on WhatsApp"]})}),(0,a.jsxs)("div",{className:"email-spotlight",children:[(0,a.jsx)("div",{className:"email-icon",children:(0,a.jsx)(m,{size:20})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"eyebrow",style:{color:"#fbe7c3",letterSpacing:1.5,marginBottom:6},children:"cz"===r?"E-mail":"de"===r?"E-Mail":"Email"}),(0,a.jsx)("div",{className:"email-address",children:e.contact.info.email}),(0,a.jsx)("div",{className:"email-note",children:"cz"===r?"Pokud nejste na WhatsAppu, napište sem.":"de"===r?"Falls Sie kein WhatsApp nutzen, schreiben Sie hier.":"Not on WhatsApp? Email us here."})]})]}),(0,a.jsxs)("div",{className:"phone-spotlight",children:[(0,a.jsx)("div",{className:"phone-icon",children:(0,a.jsx)(o,{size:20})}),(0,a.jsxs)("div",{style:{display:"grid",gap:4},children:[(0,a.jsx)("div",{className:"eyebrow",style:{color:"#fbe7c3",letterSpacing:1.5},children:"cz"===r?"Telefonní číslo":"de"===r?"Telefonnummer":"Phone number"}),(0,a.jsx)("a",{className:"phone-number",href:`tel:${e.contact.info.phone.replace(/\s+/g,"")}`,children:e.contact.info.phone}),(0,a.jsx)("div",{className:"phone-note",children:P[r]})]})]}),(0,a.jsx)("div",{className:"contact-note",children:T[r]||T.en})]})})]})}),B=({t:e,onNavigate:r})=>(0,a.jsx)("footer",{className:"footer",children:(0,a.jsxs)("div",{className:"container",children:[(0,a.jsxs)("div",{className:"footer-grid",children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:12},children:[(0,a.jsx)("div",{className:"brand-logo",children:(0,a.jsx)("img",{src:"/MAINLOGO.png",alt:"Egyptsko Ceska Reality logo"})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"brand-name",style:{color:"#f6efdd"},children:"Egyptsko Česká Reality"}),(0,a.jsx)("div",{style:{fontSize:13,color:"#d8e4f2"},children:"Hurghada · Nemovitosti"})]})]}),(0,a.jsx)("p",{style:{color:"#f6efdd",lineHeight:1.7,maxWidth:420},children:e.footer.tagline})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{style:{fontSize:14,textTransform:"uppercase",letterSpacing:2,color:"#d9b45a"},children:"Menu"}),(0,a.jsx)("div",{style:{display:"grid",gap:8,marginTop:10},children:["properties","howItWorks","about","contact"].map(t=>(0,a.jsx)("button",{onClick:()=>r(t),className:"nav-link",style:{textAlign:"left",width:"fit-content",padding:0,color:"#d8e4f2"},children:e.nav[t]},t))})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{style:{fontSize:14,textTransform:"uppercase",letterSpacing:2,color:"#d9b45a"},children:"Contact"}),(0,a.jsxs)("div",{style:{display:"grid",gap:10,marginTop:10},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10,color:"#f6efdd"},children:[(0,a.jsx)(o,{size:16,color:"#d9b45a"}),e.contact.info.phone]}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10,color:"#f6efdd"},children:[(0,a.jsx)(m,{size:16,color:"#d9b45a"}),e.contact.info.email]})]})]})]}),(0,a.jsx)("div",{style:{borderTop:"1px solid rgba(255,255,255,0.16)",paddingTop:18,color:"#d8e4f2",fontSize:13},children:e.footer.rights})]})}),q=()=>(0,a.jsx)("a",{className:"whatsapp",href:"https://wa.me/420722140302",target:"_blank",rel:"noreferrer","aria-label":"Chat on WhatsApp",children:(0,a.jsx)(E,{size:26,color:"#ffffff"})});var R=e.i(67561);let O="#d9b45a",V="#f0d9a0",L=`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

  :root {
    --navy: #0b2338;
    --navy-deep: #071728;
    --sky: #1fbac6;
    --sand: #f2dfc3;
    --sand-deep: #e6c79d;
    --cream: #f8f1e4;
    --mint: #f4ece0;
    --text: #0c1b27;
    --muted: #4d5b66;
    --accent: ${O};
    --accent-soft: ${V};
    --gold: ${O};
    --gold-soft: ${V};
    --border: rgba(11, 35, 56, 0.12);
    --card: #fffaf1;
    --shadow: 0 30px 70px rgba(7, 23, 40, 0.16);
    --gradient: linear-gradient(135deg, #0b2338 0%, #11606e 45%, #1fbac6 70%, #f0c77b 100%);
    --hero-overlay: linear-gradient(120deg, rgba(7,28,41,0.82) 0%, rgba(9,74,92,0.72) 50%, rgba(29,186,198,0.55) 100%);
    --soft-gradient: radial-gradient(circle at 18% 18%, rgba(217,179,106,0.16), transparent 40%), radial-gradient(circle at 82% 12%, rgba(31,186,198,0.14), transparent 48%);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    margin: 0;
    background:
      radial-gradient(120% 80% at 12% 18%, rgba(31,186,198,0.14), transparent 48%),
      radial-gradient(120% 80% at 84% 10%, rgba(217,179,106,0.14), transparent 52%),
      radial-gradient(140% 110% at 30% 86%, rgba(12,53,82,0.08), transparent 62%),
      linear-gradient(180deg, #f9f2e6 0%, #f0dfc4 36%, #e6c79d 72%, #f7ecda 100%);
    color: var(--text);
    font-family: 'Montserrat', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  button { font-family: inherit; }

  .page {
    min-height: 100vh;
    background:
      radial-gradient(120% 90% at 16% 24%, rgba(31,186,198,0.08), transparent 42%),
      radial-gradient(120% 90% at 80% 60%, rgba(7,28,41,0.06), transparent 48%),
      linear-gradient(180deg, rgba(248,240,226,0.92), rgba(237,213,174,0.9), rgba(229,195,150,0.9));
  }
  .section {
    padding: 110px 28px;
    position: relative;
    scroll-margin-top: 90px;
    background: linear-gradient(180deg, rgba(248,240,226,0.88), rgba(239,218,186,0.9), rgba(246,236,220,0.94));
    overflow: hidden;
  }
  .section::before,
  .section::after {
    content: '';
    position: absolute;
    inset: auto;
    pointer-events: none;
    filter: blur(4px);
    mix-blend-mode: normal;
    opacity: 0.35;
  }
  .section::before {
    width: 420px;
    height: 420px;
    left: -140px;
    top: 40px;
    background:
      radial-gradient(90% 70% at 60% 40%, rgba(12,82,96,0.12), transparent 60%);
  }
  .section::after {
    width: 360px;
    height: 360px;
    right: -120px;
    bottom: -40px;
    background:
      radial-gradient(80% 70% at 40% 30%, rgba(217,179,106,0.16), transparent 60%);
  }
  .container { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }

  .personal-section {
    background: linear-gradient(135deg, rgba(245,232,209,0.9), rgba(241,224,193,0.94), rgba(234,209,171,0.92));
    border-top: 1px solid rgba(217,179,106,0.3);
    border-bottom: 1px solid rgba(7,28,41,0.08);
    position: relative;
    overflow: hidden;
  }

  .personal-section::before {
    content: '';
    position: absolute;
    inset: -10% -10% auto 12%;
    height: 220px;
    background:
      radial-gradient(circle at 40% 40%, rgba(217,179,106,0.2), transparent 68%),
      radial-gradient(120% 90% at 10% 40%, rgba(31,186,198,0.12), transparent 60%);
    filter: blur(12px);
  }

  .personal-grid {
    display: grid;
    grid-template-columns: 0.5fr 1.1fr;
    gap: 24px;
    align-items: center;
  }

  .personal-image-wrap {
    position: relative;
    max-width: 360px;
    margin: 0 auto;
  }

  .personal-image-bg {
    position: absolute;
    inset: 12px;
    background:
      radial-gradient(circle at 28% 28%, rgba(31,186,198,0.14), transparent 58%),
      radial-gradient(circle at 70% 70%, rgba(217,179,106,0.16), transparent 62%);
    filter: blur(12px);
    z-index: 0;
  }

  .personal-image {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(7,28,41,0.2), 0 0 0 1px rgba(217,179,106,0.18);
    background: linear-gradient(145deg, rgba(255,252,245,0.96), rgba(244,228,205,0.96));
  }

  .personal-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }

  .personal-bullets {
    display: grid;
    gap: 10px;
    margin-bottom: 18px;
  }

  .personal-bullet {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,252,245,0.94), rgba(241,224,193,0.94));
    border: 1px solid rgba(217,179,106,0.3);
    box-shadow: 0 12px 26px rgba(7,28,41,0.12);
  }

  .personal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1fbac6, #0b2338);
    flex-shrink: 0;
    box-shadow: 0 6px 12px rgba(7,28,41,0.2);
  }

  .eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .eyebrow::before {
    content: '';
    width: 22px;
    height: 2px;
    background: linear-gradient(90deg, rgba(217,179,106,0.92), rgba(31,186,198,0.7));
    opacity: 0.9;
  }

  .title {
    font-family: 'Montserrat', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 600;
    margin: 14px 0 10px;
    color: var(--navy);
    letter-spacing: 0.2px;
  }

  .subtitle {
    font-size: 17px;
    color: rgba(11,35,56,0.72);
    line-height: 1.7;
    max-width: 760px;
    margin: 0 auto;
  }

  .btn-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }

  .btn-primary, .btn-secondary {
    border: 1px solid transparent;
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: none;
    cursor: pointer;
    transition: all 0.22s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0b2338, #0f7082 42%, #1fbac6 64%, #f0c77b 100%);
    color: #fff;
    border-color: rgba(217,179,106,0.65);
    box-shadow: 0 18px 36px rgba(7, 23, 40, 0.32), inset 0 0 0 1px rgba(255,255,255,0.18);
  }

  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 22px 46px rgba(7, 23, 40, 0.4); }

  .btn-secondary {
    background: linear-gradient(135deg, rgba(255,252,245,0.94), rgba(245,231,206,0.96));
    color: var(--navy);
    border-color: rgba(217,179,106,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.72), 0 14px 30px rgba(7,28,41,0.1);
  }

  .btn-secondary:hover { border-color: rgba(217,179,106,0.75); box-shadow: 0 16px 32px rgba(7,28,41,0.14); }

  .nav-shell {
    position: fixed;
    inset: 0 0 auto 0;
    background: linear-gradient(180deg, rgba(255,252,245,0.95), rgba(245,228,204,0.9));
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 40px rgba(7, 23, 40, 0.14);
    z-index: 20;
    border-bottom: 1px solid rgba(217,179,106,0.4);
  }

  .nav {
    max-width: 1280px;
    margin: 0 auto;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .nav-left { display: flex; align-items: center; gap: 14px; }
  .brand-mark {
    width: 46px; height: 46px;
    border-radius: 12px;
    background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(255,255,255,0)), linear-gradient(135deg, #0b2338 0%, #0f7082 55%, #1fbac6 85%);
    display: grid;
    place-items: center;
    box-shadow: 0 12px 28px rgba(7,23,40,0.18);
    border: 1px solid rgba(217,179,106,0.55);
    position: relative;
    overflow: hidden;
  }

  .brand-mark::after {
    content: '';
    position: absolute;
    inset: 10px 12px;
    background: linear-gradient(180deg, rgba(217,179,106,0.95), rgba(176,140,58,0.85));
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    opacity: 0.82;
  }

  .brand-logo {
    width: 72px;
    height: 72px;
    display: grid;
    place-items: center;
  }

  .brand-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .brand-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    letter-spacing: 0.3px;
    color: var(--navy);
    font-weight: 700;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .nav-link {
    font-size: 13px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.2px;
    color: var(--navy);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    position: relative;
    transition: color 0.2s ease;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0; bottom: -6px;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, rgba(217,179,106,0.92), rgba(31,186,198,0.85));
    transition: width 0.22s ease;
  }

  .nav-link:hover { color: var(--accent); }
  .nav-link:hover::after { width: 100%; }

  .lang-switch {
    display: inline-flex;
    gap: 8px;
    padding-left: 18px;
    border-left: 1px solid rgba(11,35,56,0.12);
  }

  .lang-btn {
    border: 1px solid rgba(217,179,106,0.38);
    background: linear-gradient(135deg, rgba(255,252,245,0.9), rgba(242,224,194,0.9));
    color: var(--navy);
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.22s ease;
  }

  .lang-btn.active {
    color: #fff;
    background: linear-gradient(135deg, #0b2338, #0f7082 60%, #1fbac6);
    border-color: rgba(217,179,106,0.8);
    box-shadow: 0 12px 26px rgba(7,23,40,0.22);
  }

  .menu-toggle {
    display: none;
    background: none;
    border: 1px solid rgba(217,179,106,0.3);
    color: var(--navy);
    border-radius: 12px;
    padding: 10px 12px;
    cursor: pointer;
    background: linear-gradient(135deg, rgba(255,252,245,0.96), rgba(241,224,193,0.96));
    box-shadow: 0 10px 22px rgba(7,28,41,0.12);
  }

  .nav-mobile {
    display: none;
    flex-direction: column;
    gap: 12px;
    padding: 16px 24px 22px;
    border-top: 1px solid rgba(217,179,106,0.35);
    background: linear-gradient(180deg, rgba(255,252,245,0.95), rgba(244,228,204,0.92));
  }

  .hero {
    padding: 170px 28px 130px;
    position: relative;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(7,23,40,0.78), rgba(12,82,96,0.48)),
      url('/pozadi.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero .container { max-width: 1420px; }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(140% 90% at 50% 96%, rgba(244,223,190,0.9), rgba(244,223,190,0.08)),
      linear-gradient(120deg, rgba(7,28,41,0.65), rgba(12,82,96,0.32)),
      var(--soft-gradient);
    opacity: 0.85;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: -20% -10% auto -10%;
    width: 720px;
    height: 720px;
    background:
      radial-gradient(80% 60% at 40% 50%, rgba(31,186,198,0.18), transparent 60%),
      radial-gradient(90% 70% at 70% 60%, rgba(217,179,106,0.16), transparent 64%);
    mix-blend-mode: screen;
    opacity: 0.4;
    filter: blur(8px);
    pointer-events: none;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 60px;
    align-items: center;
  }
  .hero-grid.single {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
  }

  .hero-copy {
    width: 100%;
    max-width: 1380px;
    margin: 0 auto;
  }

  .hero-copy .display {
    font-family: 'Montserrat', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(44px, 5vw, 70px);
    margin: 16px auto;
    letter-spacing: 0.2px;
    line-height: 1.05;
    color: #fff;
    text-shadow: 0 10px 28px rgba(8, 23, 36, 0.4);
    max-width: 1320px;
    text-wrap: balance;
  }

  .hero-copy .subtitle { color: rgba(255,255,255,0.88); text-align: left; }

  .hero-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .pill {
    padding: 12px 16px;
    border-radius: 14px;
    border: 1px solid rgba(217,179,106,0.65);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(31,186,198,0.12));
    font-size: 14px;
    color: #fff;
    box-shadow: 0 12px 26px rgba(7,23,40,0.24), inset 0 0 0 1px rgba(255,255,255,0.18);
  }

  .hero-media {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 26px 50px rgba(7,23,40,0.26);
    background: linear-gradient(160deg, rgba(7,23,40,0.92), rgba(12,82,96,0.9));
    border: 1px solid rgba(217,179,106,0.45);
  }

  .hero-media img {
    width: 100%;
    height: 520px;
    object-fit: cover;
    filter: saturate(1.02) brightness(0.97);
  }

  .media-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(7, 23, 40, 0.12) 0%, rgba(7, 23, 40, 0.82) 100%), radial-gradient(circle at 20% 20%, rgba(217,179,106,0.2), transparent 40%);
  }

  .agent-card {
    position: absolute;
    bottom: 18px;
    left: 18px;
    right: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 16px;
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(255,252,245,0.94), rgba(242,224,194,0.92));
    border: 1px solid rgba(217,179,106,0.4);
    color: var(--navy);
    box-shadow: 0 16px 30px rgba(7,23,40,0.2);
  }

  .badge {
    padding: 6px 10px;
    background: rgba(217, 179, 106, 0.2);
    border: 1px solid rgba(217, 179, 106, 0.55);
    border-radius: 999px;
    font-size: 12px;
    color: var(--navy);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.4);
  }

  .stat-card {
    position: absolute;
    top: 18px;
    right: 18px;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,218,180,0.9));
    border: 1px solid rgba(217,179,106,0.45);
    text-align: right;
    color: var(--navy);
    box-shadow: 0 20px 42px rgba(7,23,40,0.26);
  }

  .hero-support {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 32px;
    color: rgba(255,255,255,0.9);
  }

  .support-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(217,179,106,0.45);
    font-weight: 600;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);
  }

  .section-header { text-align: center; margin-bottom: 64px; }

  .listing-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
    justify-content: center;
  }
  @media (max-width: 1024px) {
    .listing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .listing-grid { grid-template-columns: 1fr; }
  }

  .listing-card {
    background:
      radial-gradient(140% 120% at 10% 20%, rgba(31,186,198,0.06), transparent 52%),
      radial-gradient(120% 120% at 90% 10%, rgba(217,179,106,0.12), transparent 58%),
      linear-gradient(145deg, rgba(255,252,245,0.96), rgba(242,224,194,0.96));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(7,23,40,0.16);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .listing-card:hover { transform: translateY(-6px); box-shadow: 0 30px 68px rgba(7,23,40,0.24); border-color: rgba(217,179,106,0.55); }
  .listing-thumb { position: relative; height: 220px; overflow: hidden; }
  .listing-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; filter: saturate(1.02) brightness(0.98); }
  .listing-card:hover .listing-thumb img { transform: scale(1.05); }

  .logo-break {
    padding: 40px 24px;
    background:
      radial-gradient(80% 60% at 50% 30%, rgba(217,179,106,0.08), transparent 70%),
      linear-gradient(180deg, rgba(248,240,226,0.92), rgba(237,213,174,0.9), rgba(246,236,220,0.94));
    border-top: 1px solid rgba(217,179,106,0.3);
    border-bottom: 1px solid rgba(217,179,106,0.3);
    display: grid;
    place-items: center;
  }

  .logo-break-img {
    width: min(320px, 80%);
    max-width: 320px;
    height: auto;
    display: block;
    filter: drop-shadow(0 12px 26px rgba(7,23,40,0.18));
  }

  .logo-break .container {
    display: grid;
    place-items: center;
  }

  @media (max-width: 720px) {
    .logo-break {
      padding: 32px 20px;
    }
    .logo-break-img {
      width: min(260px, 90%);
      max-width: 260px;
      margin: 0 auto;
    }
  }

  .price-tag {
    position: absolute;
    bottom: 14px;
    left: 14px;
    padding: 10px 14px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(7,23,40,0.92), rgba(12,82,96,0.9), rgba(31,186,198,0.82));
    color: #fff;
    border: 1px solid rgba(217,179,106,0.5);
    font-weight: 700;
    box-shadow: 0 14px 24px rgba(7,23,40,0.32);
  }

  .tag-chip {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 8px 12px;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(217,179,106,0.96), rgba(217,179,106,0.72));
    color: #0b2338;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 12px 24px rgba(7,23,40,0.18);
  }

  .listing-body { padding: 20px 22px 22px; display: grid; gap: 12px; }
  .listing-title { font-size: 20px; font-family: 'Montserrat', sans-serif; margin: 0; color: var(--navy); }
  .listing-meta { display: flex; gap: 10px; flex-wrap: wrap; color: var(--muted); font-size: 14px; }
  .meta-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 12px; background: #f5e8d2; border: 1px solid rgba(217,179,106,0.28); }

  .detail-overlay {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(120% 120% at 16% 12%, rgba(31,186,198,0.14), transparent 58%),
      linear-gradient(180deg, rgba(4, 16, 33, 0.88), rgba(7, 23, 40, 0.82));
    display: grid;
    place-items: center;
    padding: 20px;
    overflow: hidden;
    z-index: 50;
  }

  .detail-modal {
    width: min(1100px, 100%);
    background:
      radial-gradient(120% 120% at 14% 12%, rgba(31,186,198,0.06), transparent 50%),
      linear-gradient(150deg, rgba(255,252,245,0.96), rgba(242,224,194,0.94));
    border-radius: 22px;
    box-shadow: 0 32px 70px rgba(7,23,40,0.26);
    padding: 22px;
    position: relative;
    border: 1px solid rgba(217,179,106,0.38);
    max-height: 92vh;
    overflow: hidden;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    border: 1px solid rgba(217,179,106,0.45);
    background: #f8f1e4;
    color: var(--navy);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.58);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
    max-height: 92vh;
    overflow: auto;
  }

  .review-modal { max-width: 980px; padding: 28px 26px; }
  @media (max-width: 640px) { .review-modal { padding: 20px 18px; } }

  .review-detail {
    background: linear-gradient(165deg, rgba(255,252,245,0.96), rgba(244,228,205,0.92));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 16px;
    padding: 18px;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45), 0 18px 32px rgba(7,23,40,0.14);
    display: grid;
    gap: 12px;
  }

  .review-detail-meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .review-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 12px;
    background: #f4e6d0;
    color: #0b2338;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.1px;
    border: 1px solid rgba(217,179,106,0.36);
  }

  .rating-chip {
    background: linear-gradient(135deg, #0b2338, #0f7082 65%, #1fbac6);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 10px 22px rgba(7,23,40,0.22);
  }

  .review-detail-header { display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; }
  .review-detail-stars { display: inline-flex; align-items: center; gap: 8px; }
  .review-detail-text { color: #1a2a38; line-height: 1.75; white-space: pre-wrap; font-size: 16px; }
  .review-name { margin: 0; font-size: 26px; color: var(--navy); }

  .detail-image {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 18px 34px rgba(7,23,40,0.18);
    position: sticky;
    top: 0;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    background: #fdf7e9;
  }

  .detail-image img {
    width: 100%;
    height: auto;
    max-height: 60vh;
    object-fit: cover;
    display: block;
  }

  .detail-video-frame {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    background: #0b2338;
  }

  .detail-video {
    width: 100%;
    height: auto;
    max-height: 60vh;
    object-fit: contain;
    display: block;
  }

  .detail-image-main {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(145deg, rgba(7,23,40,0.82), rgba(12,82,96,0.68));
  }

  .image-frame {
    border: none;
    padding: 0;
    background: transparent;
    width: 100%;
    display: block;
    cursor: zoom-in;
    position: relative;
  }

  .image-zoom-hint {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(7,23,40,0.78);
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.2px;
    border: 1px solid rgba(217,179,106,0.45);
    box-shadow: 0 10px 22px rgba(0,0,0,0.26);
  }

  .image-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(217,179,106,0.45);
    background: linear-gradient(135deg, rgba(255,252,245,0.95), rgba(244,228,205,0.92));
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: 0 12px 22px rgba(7,23,40,0.24);
    color: #0b2338;
  }

  .image-nav.left { left: 12px; }
  .image-nav.right { right: 12px; }

  .image-nav:hover { border-color: rgba(217,179,106,0.75); box-shadow: 0 16px 26px rgba(7,23,40,0.26); }

  .media-badge {
    position: absolute;
    left: 12px;
    top: 12px;
    padding: 6px 10px;
    border-radius: 10px;
    background: rgba(12, 35, 56, 0.82);
    color: #fdf7e9;
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 0.2px;
    border: 1px solid rgba(217,179,106,0.45);
    box-shadow: 0 8px 14px rgba(0,0,0,0.24);
  }

  .thumb-row {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    margin-top: 10px;
    overflow-x: auto;
    padding-bottom: 6px;
  }

  .detail-info {
    padding: 18px 22px 24px;
    align-self: start;
  }

  body.detail-open {
    overflow: hidden;
    touch-action: none;
  }

  .thumb-btn {
    width: 64px;
    height: 48px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    padding: 0;
    background: #f4e6d0;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(7,23,40,0.16);
    flex-shrink: 0;
  }

  .thumb-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb-btn.active { border-color: var(--gold); box-shadow: 0 10px 20px rgba(7,23,40,0.2); }
  .thumb-video {
    width: 100%;
    height: 100%;
    position: relative;
    background: #0b2338;
  }
  .thumb-video video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .thumb-badge {
    position: absolute;
    left: 6px;
    bottom: 6px;
    padding: 3px 6px;
    border-radius: 8px;
    background: rgba(12, 35, 56, 0.78);
    color: #fdf7e9;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.2px;
    border: 1px solid rgba(217,179,106,0.4);
  }

  .detail-contact-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: center;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(7,32,48,0.92), rgba(13,88,104,0.9));
    color: #f6efdd;
    border: 1px solid rgba(217,179,106,0.35);
    box-shadow: 0 14px 30px rgba(7,23,40,0.24), inset 0 0 0 1px rgba(255,255,255,0.06);
  }

  .detail-contact-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(31,186,198,0.12));
    color: #f6efdd;
    border: 1px solid rgba(217,179,106,0.4);
    box-shadow: 0 10px 18px rgba(0,0,0,0.24);
  }

  .detail-contact-copy { display: grid; gap: 4px; }
  .detail-contact-label {
    font-size: 11px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #d9b45a;
    font-weight: 800;
  }
  .detail-contact-title {
    font-weight: 800;
    font-size: 16px;
    color: #fdf7e9;
  }
  .detail-contact-note {
    font-size: 13px;
    color: rgba(246, 239, 221, 0.78);
  }

  @media (max-width: 720px) {
    .brand-logo {
      display: none;
    }
    .detail-overlay {
      padding: calc(24px + env(safe-area-inset-top, 0px)) 12px 16px;
      align-items: flex-start;
      justify-content: flex-start;
      overflow-y: auto;
    }
    .detail-modal {
      padding: 14px;
      max-height: 90vh;
      overflow: auto;
      margin-top: 8px;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }
    .close-btn {
      width: 42px;
      height: 42px;
      top: 6px;
      right: 6px;
      font-size: 20px;
      z-index: 2;
    }
    .detail-contact-card {
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .detail-contact-icon {
      display: none;
    }
    .detail-contact-copy { gap: 2px; }
    .detail-contact-title { font-size: 15px; }
    .detail-image {
      position: relative;
      top: auto;
      max-height: none;
    }
    .detail-image img {
      max-height: 50vh;
    }
  }

  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: radial-gradient(120% 120% at 30% 20%, rgba(31,186,198,0.18), transparent 55%), rgba(4,16,33,0.9);
    display: grid;
    place-items: center;
    padding: 18px;
    z-index: 70;
  }

  .lightbox-body {
    position: relative;
    width: min(1180px, 96vw);
    background: linear-gradient(145deg, rgba(7,23,40,0.85), rgba(7,23,40,0.92));
    border-radius: 18px;
    padding: 22px 18px;
    box-shadow: 0 24px 56px rgba(0,0,0,0.4), 0 0 0 1px rgba(217,179,106,0.32);
  }

  .lightbox-image {
    width: 100%;
    max-height: 82vh;
    object-fit: contain;
    display: block;
    border-radius: 14px;
    background: #0b2338;
    box-shadow: 0 18px 34px rgba(7,23,40,0.38);
  }

  .lightbox-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid rgba(217,179,106,0.55);
    background: linear-gradient(135deg, rgba(255,252,245,0.92), rgba(245,231,206,0.96));
    cursor: pointer;
    display: grid;
    place-items: center;
    color: #0b2338;
    box-shadow: 0 12px 24px rgba(0,0,0,0.28);
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid rgba(217,179,106,0.55);
    background: linear-gradient(135deg, rgba(255,252,245,0.92), rgba(245,231,206,0.96));
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: 0 16px 26px rgba(0,0,0,0.3);
    color: #0b2338;
  }

  .lightbox-nav.left { left: 10px; }
  .lightbox-nav.right { right: 10px; }
  .lightbox-nav:hover { border-color: rgba(217,179,106,0.8); }

  .lightbox-counter {
    position: absolute;
    right: 16px;
    bottom: 14px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(6,24,42,0.82);
    color: #fff;
    font-weight: 700;
    border: 1px solid rgba(217,179,106,0.45);
    box-shadow: 0 10px 20px rgba(0,0,0,0.28);
  }

  .cta-banner {
    margin-top: 40px;
    background: linear-gradient(135deg, #0b2338, #0f7082 55%, #1fbac6 80%);
    color: #fff;
    padding: 28px 24px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    box-shadow: 0 18px 36px rgba(7,23,40,0.22);
    border: 1px solid rgba(217,179,106,0.45);
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .step-card {
    background: linear-gradient(145deg, rgba(255,252,245,0.94), rgba(244,228,205,0.92));
    border: 1px solid rgba(217,179,106,0.3);
    border-radius: 18px;
    padding: 18px 18px;
    min-height: 170px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    box-shadow: 0 16px 32px rgba(7,23,40,0.12);
  }

  .step-number {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0b2338, #0f7082 65%, #1fbac6);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 700;
    margin-bottom: 10px;
    box-shadow: 0 10px 18px rgba(7,23,40,0.22);
    border: 1px solid rgba(217,179,106,0.4);
  }

  .step-card:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(7,23,40,0.16); }

  .about-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 42px;
    align-items: center;
    background:
      radial-gradient(140% 120% at 90% 10%, rgba(31,186,198,0.08), transparent 52%),
      linear-gradient(155deg, rgba(255,252,245,0.94), rgba(242,224,194,0.92));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 24px;
    padding: 34px;
    box-shadow: 0 22px 44px rgba(7,23,40,0.16), inset 0 0 0 1px rgba(255,255,255,0.6);
  }

  .about-image {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 38px rgba(7,23,40,0.16);
    border: 1px solid rgba(217,179,106,0.34);
  }

  .trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .trust-card {
    background: linear-gradient(145deg, rgba(255,252,245,0.96), rgba(244,228,205,0.94));
    border: 1px solid rgba(217,179,106,0.26);
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 14px 28px rgba(7,23,40,0.12);
  }

  .review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }

  .review-card {
    padding: 20px;
    border-radius: 18px;
    background:
      radial-gradient(120% 120% at 20% 16%, rgba(31,186,198,0.08), transparent 50%),
      linear-gradient(145deg, rgba(255,252,245,0.98), rgba(244,228,205,0.95));
    border: 1px solid rgba(217,179,106,0.3);
    box-shadow: 0 18px 34px rgba(7,23,40,0.14);
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    color: #111;
  }

  .review-card:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(7,23,40,0.18); border-color: rgba(217,179,106,0.45); }
  .review-meta { color: #333; font-size: 14px; }

  .reviews-layout {
    display: grid;
    grid-template-columns: minmax(320px, 0.95fr) 1.05fr;
    gap: 18px;
    align-items: start;
  }

  .review-form-card {
    background: linear-gradient(155deg, rgba(255,252,245,0.96), rgba(244,228,205,0.94));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 18px 34px rgba(7,23,40,0.16), inset 0 0 0 1px rgba(255,255,255,0.45);
  }

  .review-list { display: grid; gap: 16px; }

  .review-rating {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .star-button {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid rgba(217,179,106,0.32);
    background: #f5e8d2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
  }

  .star-button:hover { transform: translateY(-1px); border-color: rgba(217,179,106,0.9); box-shadow: 0 8px 18px rgba(217,179,106,0.2); }
  .rating-value { font-size: 13px; color: var(--muted); margin-left: 6px; }

  .review-status {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f7ebd8;
    border: 1px solid rgba(217,179,106,0.32);
    color: var(--text);
    margin: 8px 0;
  }

  .review-status.error { background: #fff4f4; color: #b42318; border-color: rgba(180,35,24,0.35); }
  .review-status.success { background: #f1f7ef; color: #2b7a0b; border-color: rgba(43,122,11,0.35); }
  .review-status.helper { background: #f2eadc; color: var(--muted); border-style: dashed; }

  .review-empty {
    padding: 18px;
    border: 1px dashed rgba(217,179,106,0.5);
    border-radius: 14px;
    color: var(--muted);
    background: #f7ecda;
  }

  .review-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(31,186,198,0.14), rgba(217,179,106,0.16));
    border: 1px solid rgba(217,179,106,0.32);
    box-shadow: 0 14px 30px rgba(7,23,40,0.14);
  }

  .avg-label { font-size: 13px; color: #a07728; text-transform: uppercase; letter-spacing: 0.3px; }
  .avg-score { font-size: 32px; font-weight: 800; color: #b68634; line-height: 1; }
  .avg-score .avg-total { font-size: 16px; font-weight: 600; color: #b68634; margin-left: 4px; }
  .avg-count { font-size: 13px; color: #7e6232; margin-top: 4px; }
  .avg-stars { display: flex; gap: 4px; }

  .review-pagination {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 4px;
  }

  .page-btn {
    width: 40px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(217,179,106,0.32);
    background: linear-gradient(145deg, #fffaf1, #f4e6d0);
    cursor: pointer;
    font-weight: 700;
    color: #0b2b3d;
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .page-btn:hover:enabled { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(7,23,40,0.18); border-color: rgba(217,179,106,0.6); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .page-info { font-size: 14px; color: var(--muted); font-weight: 700; }

  @media (max-width: 960px) {
    .reviews-layout {
      grid-template-columns: 1fr;
    }
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 960px;
    margin: 0 auto;
    gap: 14px;
    padding: 0 12px;
  }

  .contact-card {
    display: grid;
    gap: 10px;
    background: linear-gradient(150deg, rgba(255,252,245,0.94), rgba(244,228,205,0.92));
    border: 1px solid rgba(217,179,106,0.34);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 16px 32px rgba(7,23,40,0.16), inset 0 0 0 1px rgba(255,255,255,0.55);
  }

  .email-spotlight {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    min-width: 0;
    padding: 14px 16px;
    margin: 12px 0 8px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,245,225,0.12), rgba(217,179,106,0.14));
    border: 1px solid rgba(217,179,106,0.42);
    box-shadow: 0 10px 18px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1);
  }

  .email-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.06));
    color: #0b2338;
    border: 1px solid rgba(217,179,106,0.55);
    box-shadow: 0 10px 20px rgba(7,23,40,0.28);
  }

  .email-address {
    font-size: clamp(14px, 4.4vw, 18px);
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    line-height: 1.1;
    max-width: 100%;
  }

  .email-note {
    font-size: 14px;
    color: rgba(244, 238, 228, 0.86);
    margin-top: 4px;
  }

  .phone-spotlight {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    min-width: 0;
    padding: 14px 16px;
    margin: 8px 0 10px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,252,245,0.12), rgba(31,186,198,0.14));
    border: 1px solid rgba(217,179,106,0.42);
    box-shadow: 0 10px 18px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.1);
  }

  .phone-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, rgba(31,186,198,0.18), rgba(255,255,255,0.14));
    color: #0b2338;
    border: 1px solid rgba(217,179,106,0.55);
    box-shadow: 0 10px 18px rgba(7,23,40,0.22), inset 0 0 0 1px rgba(255,255,255,0.18);
  }

  .phone-number {
    font-size: clamp(17px, 3.8vw, 22px);
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.2px;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.15;
  }

  .phone-number:hover { color: var(--gold); }

  .phone-note {
    font-size: 14px;
    color: rgba(244, 238, 228, 0.86);
    margin-top: 2px;
  }

  .email-note,
  .phone-note {
    overflow-wrap: anywhere;
  }

  .contact-note {
    font-size: 13px;
    color: #dfe8f5;
    margin: 8px 0 10px;
    line-height: 1.6;
  }

  .form-field {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  input, textarea {
    width: 100%;
    background: linear-gradient(145deg, rgba(255,252,245,0.92), rgba(244,228,205,0.88));
    border: 1px solid rgba(217,179,106,0.3);
    border-radius: 14px;
    padding: 14px 16px;
    color: var(--text);
    font-size: 15px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.62);
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: rgba(31,186,198,0.7);
    box-shadow: 0 0 0 3px rgba(31, 186, 198, 0.16);
  }

  textarea { resize: vertical; min-height: 140px; }

  .contact-info {
    display: grid;
    gap: 12px;
    padding: 18px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,252,245,0.94), rgba(244,228,205,0.9));
    border: 1px solid rgba(217,179,106,0.32);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.62);
  }

  .contact-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 16px 0;
  }

  .footer {
    padding: 70px 24px 46px;
    border-top: 1px solid rgba(217,179,106,0.4);
    background:
      radial-gradient(120% 80% at 12% 10%, rgba(31,186,198,0.16), transparent 52%),
      radial-gradient(120% 90% at 88% 6%, rgba(217,179,106,0.18), transparent 56%),
      linear-gradient(180deg, #06182a, #0b2338 55%, #0f3d52);
    color: #f4efe4;
    box-shadow: 0 -20px 46px rgba(7,23,40,0.32);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 32px;
    margin-bottom: 32px;
  }

  .whatsapp {
    position: fixed;
    bottom: 26px;
    right: 26px;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: #25d366;
    display: grid;
    place-items: center;
    box-shadow: 0 16px 40px rgba(37, 211, 102, 0.4);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    z-index: 25;
  }

  .whatsapp:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 20px 46px rgba(37, 211, 102, 0.5); }

  @media (max-width: 1100px) {
    .nav-links { display: none; }
    .lang-switch { display: none; }
    .menu-toggle { display: inline-flex; }
    .nav-mobile { display: flex; }
    .hero-grid { grid-template-columns: 1fr; gap: 32px; }
    .agent-card { position: relative; inset: auto; margin-top: -80px; }
    .stat-card { top: 16px; right: 16px; }
    .about-grid { grid-template-columns: 1fr; padding: 28px; }
    .contact-grid { grid-template-columns: 1fr; }
    .personal-grid { grid-template-columns: 1fr; text-align: center; }
    .personal-image-wrap { margin-bottom: 18px; }
    .personal-bullet { justify-content: center; }
  }

  @media (max-width: 720px) {
    .section { padding: 90px 20px; }
    .hero { padding-top: 120px; }
    .nav { padding: 10px 14px; gap: 12px; }
    .brand-mark { width: 40px; height: 40px; }
    .brand-name { font-size: 18px; }
    .btn-row { width: 100%; flex-direction: column; align-items: stretch; }
    .btn-primary, .btn-secondary { flex: 1; justify-content: center; width: 100%; }
    .listing-thumb { height: 200px; }
    .hero-media img { height: 340px; }
    .personal-grid { gap: 16px; }
    .personal-image-wrap { max-width: 280px; }
    .detail-grid { grid-template-columns: 1fr; }
    .detail-modal { padding: 14px; }
    .close-btn { top: 8px; right: 8px; }

    .contact-card { padding: 16px 14px; gap: 10px; }
    .contact-actions a { width: 100%; justify-content: center; }
    .email-spotlight,
    .phone-spotlight {
      gap: 10px;
      text-align: left;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
      padding: 12px 14px;
    }
    .email-icon,
    .phone-icon {
      display: none;
    }
    .email-address { font-size: clamp(14px, 4.4vw, 17px); letter-spacing: 0.05px; max-width: 100%; line-height: 1.15; }
    .phone-number { font-size: clamp(15px, 4.8vw, 18px); }
    .email-note,
    .phone-note { font-size: 13px; }
    .contact-card .eyebrow { font-size: 11px; letter-spacing: 1px; }
  }

  @media (max-width: 540px) {
    .contact-grid { gap: 10px; padding: 0 12px; }
    .contact-card { padding: 14px 12px; gap: 8px; border-radius: 14px; }
    .contact-actions { justify-content: center; }
    .contact-actions .btn-primary { min-width: 0; width: 100%; }
    .email-spotlight,
    .phone-spotlight {
      text-align: left;
      padding: 12px;
      margin: 6px 0;
      border-radius: 12px;
      gap: 10px;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }
    .email-icon,
    .phone-icon { display: none; }
    .email-spotlight .eyebrow,
    .phone-spotlight .eyebrow { justify-content: flex-start; }
    .email-note,
    .phone-note,
    .contact-note { text-align: left; }
    .email-address { font-size: clamp(13px, 4.2vw, 16px); letter-spacing: 0.05px; max-width: 100%; line-height: 1.12; }
    .phone-number { font-size: clamp(15px, 4.8vw, 18px); letter-spacing: 0.08px; }
  }
`,F={cz:"Otevreme vas email s predvyplnenou zpravou, staci odeslat.",en:"We open your mail app with the message ready to send.",de:"Wir oeffnen Ihr Mail-Programm mit der fertigen Nachricht."},Y={cz:"Nepodarilo se otevrit e-mail klienta. Napiste prosim na Info@egyptskoceskareality.cz.",en:"Could not open the mail app. Please write to Info@egyptskoceskareality.cz.",de:"Mail-App konnte nicht geoeffnet werden. Bitte schreiben Sie an Info@egyptskoceskareality.cz."};e.s(["default",0,()=>{let[e,t]=(0,r.useState)("cz"),[i,o]=(0,r.useState)(!1),[n,s]=(0,r.useState)({name:"",email:"",phone:"",message:""}),[l,p]=(0,r.useState)({sending:!1,error:"",success:""}),g=(0,r.useMemo)(()=>R.translations[e],[e]),x=e=>{let a=document.getElementById(e);a&&((e,a=700)=>{let r=window.scrollY||window.pageYOffset,t=e-r,i=performance.now(),o=e=>{let n=Math.min((e-i)/a,1);window.scrollTo(0,r+n*(2-n)*t),n<1&&requestAnimationFrame(o)};requestAnimationFrame(o)})(a.getBoundingClientRect().top+window.scrollY-80,800),o(!1)};return(0,a.jsxs)("div",{className:"page",children:[(0,a.jsx)("style",{children:L}),(0,a.jsx)(d,{t:g,language:e,onLanguageChange:t,onNavigate:x,mobileOpen:i,onToggleMobile:()=>o(e=>!e)}),(0,a.jsxs)("main",{children:[(0,a.jsx)(c,{t:g,language:e,onPrimaryCta:()=>x("contact"),onSecondaryCta:()=>x("properties")}),(0,a.jsx)(N,{t:g,language:e}),(0,a.jsx)("section",{className:"logo-break",children:(0,a.jsx)("div",{className:"container",children:(0,a.jsx)("img",{src:"/MAINLOGO.png",alt:"Egyptsko Česká Reality",className:"logo-break-img"})})}),(0,a.jsx)(C,{t:g}),(0,a.jsx)(W,{t:g,language:e}),(0,a.jsx)($,{t:g,language:e,formData:n,onChange:e=>{s(a=>({...a,[e.target.name]:e.target.value}))},onSubmit:a=>{a.preventDefault(),p({sending:!0,error:"",success:""});try{let a=g?.contact?.info?.email||"Info@egyptskoceskareality.cz",r=[`Name: ${n.name}`,`Email: ${n.email}`,`Phone: ${n.phone}`,"",n.message].join("\n"),t=`mailto:${a}?subject=${encodeURIComponent("Web enquiry")}&body=${encodeURIComponent(r)}`;window.location.href=t,s({name:"",email:"",phone:"",message:""}),p({sending:!1,error:"",success:F[e]||F.en})}catch(a){console.error("contact submit mailto failed",a),p({sending:!1,error:Y[e]||Y.en,success:""})}},formStatus:l})]}),(0,a.jsx)(B,{t:g,onNavigate:x}),(0,a.jsx)(q,{})]})}],14633)}]);