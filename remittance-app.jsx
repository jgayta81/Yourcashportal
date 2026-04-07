import { useState, useEffect } from "react";

// ── TRANSLATIONS ────────────────────────────────────────────────────────────────
const T = {
  en: {
    home: "Home", send: "Send", activity: "Activity", profile: "Profile",
    goodMorning: "Good morning 👋",
    totalSent: "Total Sent (2024)",
    transfers: "Transfers", countries: "Countries", saved: "Saved",
    quickSend: "Quick Send", add: "+ Add", new: "New",
    sendMoney: "Send Money →",
    limitedOffer: "🎁 LIMITED OFFER",
    firstFree: "First transfer free",
    noFees: "No fees on your next send",
    claim: "Claim",
    recent: "Recent", seeAll: "See all",
    delivered: "✅ Delivered", pending: "⏳ Pending",
    sendMoneyTitle: "Send Money",
    chooseRecipient: "Choose Recipient",
    confirmTransfer: "Confirm Transfer",
    stepOf: (s) => `Step ${s} of 3`,
    youSend: "You Send",
    recipientGets: "Recipient Gets",
    deliverySpeed: "Delivery Speed",
    transferAmount: "Transfer amount",
    transferFee: "Transfer fee",
    free: "Free",
    total: "Total",
    continue: "Continue →",
    sendTo: "Send to",
    recentRecipients: "Recent Recipients",
    bankAccount: "Bank account",
    addNewRecipient: "+ Add new recipient",
    transferSummary: "Transfer Summary",
    sendingTo: "Sending To",
    exchangeRate: "Exchange rate",
    delivery: "Delivery",
    fee: "Fee",
    totalCharged: "Total charged",
    paymentMethod: "Payment Method",
    confirmSend: (total) => `Confirm & Send $${total} →`,
    encrypted: "🔒 256-bit encrypted · Regulated by FinCEN",
    transferSent: "Transfer Sent!",
    onItsWay: (name) => `Your money is on its way to ${name}`,
    amountSent: "Amount sent",
    recipientReceives: "Recipient receives",
    expressDelivery: "Express delivery",
    estimatedMinutes: "Estimated arrival in minutes",
    backHome: "Back to Home",
    viewActivity: "View Activity",
    activityTitle: "Activity",
    allTransfers: "All your past transfers",
    all: "All", deliveredFilter: "Delivered", pendingFilter: "Pending",
    verified: "Verified",
    personalInfo: "Personal Information",
    paymentMethods: "Payment Methods",
    notifications: "Notifications",
    security: "Security",
    preferredCountries: "Preferred Countries",
    support: "Support",
    legalPrivacy: "Legal & Privacy",
    signOut: "Sign Out",
    express: "Express", economy: "Economy", minutes: "Minutes", days: "3–5 days",
    cashPickup: "Cash Pickup", homeDelivery: "Home Delivery", bankDeposit: "Bank Deposit",
    debitCard: "Debit card", bankAcc: "Bank account",
  },
  es: {
    home: "Inicio", send: "Enviar", activity: "Actividad", profile: "Perfil",
    goodMorning: "Buenos días 👋",
    totalSent: "Total Enviado (2024)",
    transfers: "Transferencias", countries: "Países", saved: "Ahorrado",
    quickSend: "Envío Rápido", add: "+ Agregar", new: "Nuevo",
    sendMoney: "Enviar Dinero →",
    limitedOffer: "🎁 OFERTA LIMITADA",
    firstFree: "Primera transferencia gratis",
    noFees: "Sin comisiones en tu próximo envío",
    claim: "Reclamar",
    recent: "Recientes", seeAll: "Ver todo",
    delivered: "✅ Entregado", pending: "⏳ Pendiente",
    sendMoneyTitle: "Enviar Dinero",
    chooseRecipient: "Elegir Destinatario",
    confirmTransfer: "Confirmar Transferencia",
    stepOf: (s) => `Paso ${s} de 3`,
    youSend: "Tú Envías",
    recipientGets: "El Destinatario Recibe",
    deliverySpeed: "Velocidad de Entrega",
    transferAmount: "Monto de transferencia",
    transferFee: "Comisión",
    free: "Gratis",
    total: "Total",
    continue: "Continuar →",
    sendTo: "Enviar a",
    recentRecipients: "Destinatarios Recientes",
    bankAccount: "Cuenta bancaria",
    addNewRecipient: "+ Agregar nuevo destinatario",
    transferSummary: "Resumen de Transferencia",
    sendingTo: "Enviando A",
    exchangeRate: "Tipo de cambio",
    delivery: "Entrega",
    fee: "Comisión",
    totalCharged: "Total cobrado",
    paymentMethod: "Método de Pago",
    confirmSend: (total) => `Confirmar y Enviar $${total} →`,
    encrypted: "🔒 Cifrado 256 bits · Regulado por FinCEN",
    transferSent: "¡Transferencia Enviada!",
    onItsWay: (name) => `Tu dinero está en camino hacia ${name}`,
    amountSent: "Monto enviado",
    recipientReceives: "El destinatario recibe",
    expressDelivery: "Entrega Express",
    estimatedMinutes: "Llegada estimada en minutos",
    backHome: "Volver al Inicio",
    viewActivity: "Ver Actividad",
    activityTitle: "Actividad",
    allTransfers: "Todas tus transferencias pasadas",
    all: "Todas", deliveredFilter: "Entregadas", pendingFilter: "Pendientes",
    verified: "Verificado",
    personalInfo: "Información Personal",
    paymentMethods: "Métodos de Pago",
    notifications: "Notificaciones",
    security: "Seguridad",
    preferredCountries: "Países Preferidos",
    support: "Soporte",
    legalPrivacy: "Legal y Privacidad",
    signOut: "Cerrar Sesión",
    express: "Express", economy: "Económico", minutes: "Minutos", days: "3–5 días",
    cashPickup: "Retiro en Efectivo", homeDelivery: "Entrega a Domicilio", bankDeposit: "Depósito Bancario",
    debitCard: "Tarjeta de débito", bankAcc: "Cuenta bancaria",
  },
};

// ── LOGO ────────────────────────────────────────────────────────────────────────
function YourCashPortalLogo({ size = 48, showText = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: showText ? 6 : 0 }}>
      <svg width={size * 2.4} height={size} viewBox="0 0 110 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sM" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff"/><stop offset="20%" stopColor="#e2e8f0"/>
            <stop offset="45%" stopColor="#94a3b8"/><stop offset="70%" stopColor="#cbd5e1"/>
            <stop offset="100%" stopColor="#f8fafc"/>
          </linearGradient>
          <linearGradient id="sS" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0"/>
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="cF" cx="42%" cy="36%" r="58%">
            <stop offset="0%" stopColor="#fff7c0"/><stop offset="25%" stopColor="#fde047"/>
            <stop offset="55%" stopColor="#eab308"/><stop offset="80%" stopColor="#ca8a04"/>
            <stop offset="100%" stopColor="#92400e"/>
          </radialGradient>
          <linearGradient id="cR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a"/><stop offset="40%" stopColor="#d97706"/>
            <stop offset="100%" stopColor="#78350f"/>
          </linearGradient>
          <radialGradient id="cSh" cx="60%" cy="65%" r="55%">
            <stop offset="0%" stopColor="#92400e" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#92400e" stopOpacity="0"/>
          </radialGradient>
          <filter id="cD" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#92400e" floodOpacity="0.5"/>
          </filter>
          <filter id="sG" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M18,25 C18,13 29,6 39,6 C49,6 53,16 55,25 C57,34 61,44 71,44 C81,44 92,37 92,25 C92,13 81,6 71,6 C61,6 57,16 55,25 C53,34 49,44 39,44 C29,44 18,37 18,25 Z" stroke="#64748b" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18,25 C18,13 29,6 39,6 C49,6 53,16 55,25 C57,34 61,44 71,44 C81,44 92,37 92,25 C92,13 81,6 71,6 C61,6 57,16 55,25 C53,34 49,44 39,44 C29,44 18,37 18,25 Z" stroke="url(#sM)" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#sG)"/>
        <path d="M18,25 C18,13 29,6 39,6 C49,6 53,16 55,25 C57,34 61,44 71,44 C81,44 92,37 92,25 C92,13 81,6 71,6 C61,6 57,16 55,25 C53,34 49,44 39,44 C29,44 18,37 18,25 Z" stroke="url(#sS)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        <circle cx="71" cy="25" r="11" fill="url(#cR)" filter="url(#cD)"/>
        <circle cx="71" cy="25" r="9.2" fill="url(#cF)"/>
        <circle cx="71" cy="25" r="9.2" fill="url(#cSh)"/>
        <circle cx="71" cy="25" r="8" stroke="#ca8a04" strokeWidth="0.6" fill="none" opacity="0.6"/>
        <text x="71" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="'DM Serif Display',Georgia,serif" fill="#78350f" opacity="0.85">$</text>
        <ellipse cx="67.5" cy="19.5" rx="3" ry="1.6" fill="white" opacity="0.28" transform="rotate(-30 67.5 19.5)"/>
      </svg>
      {showText && (
        <span style={{ fontFamily:"'DM Serif Display',serif", fontSize: size*0.42, letterSpacing:1, fontWeight:400, display:"inline-flex", alignItems:"baseline" }}>
          <span style={{ background:"linear-gradient(135deg,#94a3b8 0%,#e2e8f0 50%,#cbd5e1 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>YourCa</span>
          <span style={{ background:"linear-gradient(135deg,#fde68a 0%,#f59e0b 45%,#d97706 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", filter:"drop-shadow(0 0 4px #f59e0b88)" }}>$</span>
          <span style={{ background:"linear-gradient(135deg,#94a3b8 0%,#e2e8f0 50%,#cbd5e1 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>hPortal</span>
        </span>
      )}
    </div>
  );
}

// ── LANGUAGE TOGGLE ─────────────────────────────────────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
    <button onClick={() => setLang(l => l === "en" ? "es" : "en")}
      title={lang === "en" ? "Cambiar a Español" : "Switch to English"}
      style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"4px 10px", cursor:"pointer", color:"white", fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
      <span style={{ fontSize:14 }}>{lang === "en" ? "🇺🇸" : "🇲🇽"}</span>
      {lang === "en" ? "EN" : "ES"}
    </button>
  );
}

// ── DATA ────────────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code:"MX", name:"Mexico",           flag:"🇲🇽", currency:"MXN", rate:17.15 },
  { code:"PH", name:"Philippines",      flag:"🇵🇭", currency:"PHP", rate:56.82 },
  { code:"IN", name:"India",            flag:"🇮🇳", currency:"INR", rate:83.42 },
  { code:"GT", name:"Guatemala",        flag:"🇬🇹", currency:"GTQ", rate:7.76  },
  { code:"HN", name:"Honduras",         flag:"🇭🇳", currency:"HNL", rate:24.80 },
  { code:"DO", name:"Dominican Rep.",   flag:"🇩🇴", currency:"DOP", rate:58.50 },
  { code:"SV", name:"El Salvador",      flag:"🇸🇻", currency:"USD", rate:1.00  },
  { code:"CO", name:"Colombia",         flag:"🇨🇴", currency:"COP", rate:3940.0},
  { code:"NG", name:"Nigeria",          flag:"🇳🇬", currency:"NGN", rate:1580.5},
  { code:"VN", name:"Vietnam",          flag:"🇻🇳", currency:"VND", rate:24800 },
];
const RECIPIENTS = [
  { id:1, name:"Maria Santos",   country:"PH", initials:"MS", color:"#e8563a" },
  { id:2, name:"Carlos Rivera",  country:"MX", initials:"CR", color:"#059669" },
  { id:3, name:"Ana Gutierrez",  country:"GT", initials:"AG", color:"#7c3aed" },
];
const HISTORY = [
  { id:1, name:"Carlos Rivera",  amount:300, currency:"MXN", received:5145,  date:"24 Mar", status:"delivered" },
  { id:2, name:"Maria Santos",   amount:200, currency:"PHP", received:11364, date:"18 Mar", status:"delivered" },
  { id:3, name:"Ana Gutierrez",  amount:150, currency:"GTQ", received:1164,  date:"10 Mar", status:"delivered" },
];
const fmt = (n, dec=2) => n.toLocaleString("en-US", { minimumFractionDigits:dec, maximumFractionDigits:dec });

// ── ROOT ─────────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]   = useState("en");
  const [screen, setScreen] = useState("home");
  const [sendAmount, setSendAmount] = useState("200");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [delivery, setDelivery] = useState("express");
  const [payMethod, setPayMethod] = useState("debit");
  const [selectedRecipient, setSelectedRecipient] = useState(RECIPIENTS[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [animIn, setAnimIn] = useState(true);

  const t = T[lang];
  const numAmount = parseFloat(sendAmount) || 0;
  const fee = delivery === "express" ? 3.99 : delivery === "cashPickup" ? 3.99 : delivery === "homeDelivery" ? 5.99 : 0;
  const total     = numAmount + fee;
  const received  = numAmount * selectedCountry.rate;

  const DELIVERY_OPTIONS = [
    { id:"express",      label:t.bankDeposit,   time:t.minutes, fee:3.99, icon:"🏦" },
    { id:"cashPickup",   label:t.cashPickup,    time:t.minutes, fee:3.99, icon:"💵" },
    { id:"homeDelivery", label:t.homeDelivery,  time:"24–48 hrs", fee:5.99, icon:"🏠" },
    { id:"economy",      label:t.economy,       time:t.days,    fee:0,    icon:"⚡" },
  ];
  const PAYMENT_METHODS = [
    { id:"debit", label:t.debitCard, icon:"💳", last4:"4521" },
    { id:"bank",  label:t.bankAcc,  icon:"🏛️", last4:"7890" },
  ];

  useEffect(() => {
    setAnimIn(false);
    const timer = setTimeout(() => setAnimIn(true), 50);
    return () => clearTimeout(timer);
  }, [screen]);

  const goTo = (s) => setScreen(s);
  const p = { t, lang, setLang, goTo, sendAmount, setSendAmount, selectedCountry, setSelectedCountry, delivery, setDelivery, payMethod, setPayMethod, selectedRecipient, setSelectedRecipient, showCountryPicker, setShowCountryPicker, step, setStep, fee, total, received, numAmount, sent, setSent, DELIVERY_OPTIONS, PAYMENT_METHODS };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}input:focus{outline:none;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
        .pb{display:inline-flex;align-items:center;justify-content:center;border-radius:100px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;border:none;transition:all 0.18s;}
        .pb:active{transform:scale(0.97);}
        .pp{background:#e8563a;color:white;padding:16px 32px;font-size:16px;width:100%;}.pp:hover{background:#d4472c;}
        .pg{background:transparent;color:#e8563a;padding:10px 20px;font-size:14px;border:1.5px solid #e8563a;}
        .ti{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 0;cursor:pointer;transition:color 0.15s;}
        .ch:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1);}.ch{transition:all 0.2s;}
        .ia{border:none;background:transparent;font-family:'DM Serif Display',serif;font-size:48px;color:#1a1a1a;width:100%;text-align:center;}
        .ia::placeholder{color:#ccc;}
        .su{animation:slideUp 0.3s ease forwards;}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
        .pu{animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
        .cc{animation:pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;}
        @keyframes pop{from{transform:scale(0);}to{transform:scale(1);}}
        .nd{width:6px;height:6px;border-radius:50%;background:#e8563a;margin:0 auto;}
      `}</style>

      <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#f5f4f0", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:420, minHeight:"100vh", background:"#fff", position:"relative", overflow:"hidden", boxShadow:"0 0 60px rgba(0,0,0,0.12)" }}>
          <div style={{ opacity:animIn?1:0, transform:animIn?"translateY(0)":"translateY(12px)", transition:"opacity 0.28s ease,transform 0.28s ease" }}>
            {screen==="home"     && <HomeScreen     {...p} />}
            {screen==="send"     && <SendScreen     {...p} />}
            {screen==="activity" && <ActivityScreen {...p} />}
            {screen==="profile"  && <ProfileScreen  {...p} />}
          </div>
          {!sent && (
            <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:"white", borderTop:"1px solid #f0eeea", display:"flex", paddingBottom:20, zIndex:100 }}>
              {[{id:"home",icon:"🏠",label:t.home},{id:"send",icon:"💸",label:t.send},{id:"activity",icon:"📋",label:t.activity},{id:"profile",icon:"👤",label:t.profile}].map(tab => (
                <div key={tab.id} className="ti" style={{ color:screen===tab.id?"#e8563a":"#999" }} onClick={() => { goTo(tab.id); setStep(1); setSent(false); }}>
                  <span style={{ fontSize:20 }}>{tab.icon}</span>
                  <span style={{ fontSize:11, fontWeight:600 }}>{tab.label}</span>
                  {screen===tab.id && <div className="nd"/>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────────
function HomeScreen({ t, lang, setLang, goTo }) {
  return (
    <div style={{ paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#0f0720 0%,#1a0a3c 50%,#16213e 100%)", padding:"52px 24px 32px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <YourCashPortalLogo size={28} showText={true}/>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <LangToggle lang={lang} setLang={setLang}/>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#d97706,#fbbf24)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:16, boxShadow:"0 0 12px rgba(251,191,36,0.4)" }}>AJ</div>
          </div>
        </div>
        <div style={{ marginBottom:24 }}>
          <p style={{ color:"#a78bfa", fontSize:13, fontWeight:500, marginBottom:4 }}>{t.goodMorning}</p>
          <h1 style={{ color:"white", fontFamily:"'DM Serif Display'", fontSize:26 }}>Alex Johnson</h1>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:20, padding:"20px 24px", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color:"#8899bb", fontSize:12, fontWeight:600, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>{t.totalSent}</p>
          <p style={{ color:"white", fontFamily:"'DM Serif Display'", fontSize:38 }}>$2,340.00</p>
          <div style={{ display:"flex", gap:16, marginTop:16 }}>
            {[[t.transfers,"14","white"],[t.countries,"3","white"],[t.saved,"$18","#4ade80"]].map(([label,val,color]) => (
              <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"10px 14px" }}>
                <p style={{ color:"#8899bb", fontSize:11 }}>{label}</p>
                <p style={{ color, fontWeight:700, fontSize:18 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:"28px 24px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:17, fontWeight:700, color:"#1a1a1a" }}>{t.quickSend}</h2>
          <span style={{ fontSize:13, color:"#e8563a", fontWeight:600, cursor:"pointer" }}>{t.add}</span>
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:32, overflowX:"auto", paddingBottom:4 }}>
          {RECIPIENTS.map(r => (
            <div key={r.id} className="ch" onClick={() => goTo("send")} style={{ flexShrink:0, background:"#faf9f6", borderRadius:16, padding:"14px 18px", cursor:"pointer", border:"1px solid #f0eeea", textAlign:"center", minWidth:80 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:r.color, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:15, margin:"0 auto 8px" }}>{r.initials}</div>
              <p style={{ fontSize:11, fontWeight:600, color:"#555", whiteSpace:"nowrap" }}>{r.name.split(" ")[0]}</p>
              <p style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{COUNTRIES.find(c=>c.code===r.country)?.flag}</p>
            </div>
          ))}
          <div className="ch" onClick={() => goTo("send")} style={{ flexShrink:0, background:"#faf9f6", borderRadius:16, padding:"14px 18px", cursor:"pointer", border:"1.5px dashed #e0ddd8", textAlign:"center", minWidth:80, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"#f5f4f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:8 }}>＋</div>
            <p style={{ fontSize:11, fontWeight:600, color:"#aaa" }}>{t.new}</p>
          </div>
        </div>

        <button className="pb pp" style={{ marginBottom:32 }} onClick={() => goTo("send")}>{t.sendMoney}</button>

        <div style={{ background:"linear-gradient(135deg,#fff5f3 0%,#fff9f8 100%)", borderRadius:16, padding:"18px 20px", marginBottom:28, border:"1px solid #fce4df", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:12, color:"#e8563a", fontWeight:700, marginBottom:4 }}>{t.limitedOffer}</p>
            <p style={{ fontSize:15, fontWeight:700, color:"#1a1a1a" }}>{t.firstFree}</p>
            <p style={{ fontSize:12, color:"#888", marginTop:2 }}>{t.noFees}</p>
          </div>
          <button className="pb pg" style={{ fontSize:12, padding:"8px 16px" }} onClick={() => goTo("send")}>{t.claim}</button>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:17, fontWeight:700, color:"#1a1a1a" }}>{t.recent}</h2>
          <span style={{ fontSize:13, color:"#e8563a", fontWeight:600, cursor:"pointer" }} onClick={() => goTo("activity")}>{t.seeAll}</span>
        </div>
        {HISTORY.slice(0,2).map(tx => <TxRow key={tx.id} tx={tx} t={t}/>)}
      </div>
    </div>
  );
}

function TxRow({ tx, t }) {
  const country = COUNTRIES.find(c => c.currency === tx.currency);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:"1px solid #f5f4f0" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:"50%", background:"#f5f4f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{country?.flag}</div>
        <div>
          <p style={{ fontWeight:600, fontSize:15, color:"#1a1a1a" }}>{tx.name}</p>
          <p style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{tx.date} · {tx.status==="delivered" ? t.delivered : t.pending}</p>
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <p style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>−${tx.amount}</p>
        <p style={{ fontSize:12, color:"#888", marginTop:2 }}>{fmt(tx.received,0)} {tx.currency}</p>
      </div>
    </div>
  );
}

// ── SEND ─────────────────────────────────────────────────────────────────────────
function SendScreen(props) {
  const { t, lang, setLang, sent, step, setStep, numAmount } = props;
  if (sent) return <SuccessScreen {...props}/>;
  const titles = [t.sendMoneyTitle, t.chooseRecipient, t.confirmTransfer];
  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:"52px 24px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {step>1 && <button onClick={() => setStep(s=>s-1)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#555", padding:"4px 8px 4px 0" }}>←</button>}
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:"#1a1a1a", fontFamily:"'DM Serif Display'" }}>{titles[step-1]}</h1>
              <p style={{ fontSize:13, color:"#999", marginTop:2 }}>{t.stepOf(step)}</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <LangToggle lang={lang} setLang={setLang}/>
            <YourCashPortalLogo size={20} showText={false}/>
          </div>
        </div>
      </div>
      <div style={{ padding:"0 24px 24px" }}>
        <div style={{ height:4, background:"#f0eeea", borderRadius:2 }}>
          <div style={{ height:"100%", width:`${(step/3)*100}%`, background:"#e8563a", borderRadius:2, transition:"width 0.3s" }}/>
        </div>
      </div>
      {step===1 && <Step1 {...props} onNext={() => setStep(2)}/>}
      {step===2 && <Step2 {...props} onNext={() => setStep(3)}/>}
      {step===3 && <Step3 {...props} onSend={() => props.setSent(true)}/>}
    </div>
  );
}

function Step1({ t, sendAmount, setSendAmount, selectedCountry, setSelectedCountry, delivery, setDelivery, showCountryPicker, setShowCountryPicker, received, fee, total, numAmount, onNext, DELIVERY_OPTIONS }) {
  return (
    <div style={{ padding:"0 24px" }}>
      <div style={{ background:"#faf9f6", borderRadius:20, padding:"28px 20px", border:"1px solid #f0eeea", marginBottom:16, textAlign:"center" }}>
        <p style={{ fontSize:12, color:"#aaa", fontWeight:600, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>{t.youSend}</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span style={{ fontFamily:"'DM Serif Display'", fontSize:42, color:"#ccc" }}>$</span>
          <input className="ia" style={{ width:"auto", maxWidth:200 }} value={sendAmount} onChange={e => setSendAmount(e.target.value.replace(/[^0-9.]/g,""))} placeholder="0"/>
          <span style={{ fontSize:16, color:"#999", fontWeight:600 }}>USD</span>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:16 }}>
          {[100,200,500,1000].map(amt => (
            <button key={amt} onClick={() => setSendAmount(String(amt))} style={{ background:sendAmount===String(amt)?"#e8563a":"#f0eeea", color:sendAmount===String(amt)?"white":"#666", border:"none", borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>${amt}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"center", margin:"-4px 0", position:"relative", zIndex:1 }}>
        <div style={{ width:38, height:38, background:"#e8563a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:18, border:"3px solid white" }}>⇅</div>
      </div>

      <div style={{ background:"#faf9f6", borderRadius:20, padding:"20px", border:"1px solid #f0eeea", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:12, color:"#aaa", fontWeight:600, letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{t.recipientGets}</p>
            <p style={{ fontFamily:"'DM Serif Display'", fontSize:32, color:"#1a1a1a" }}>{fmt(received,0)} <span style={{ fontSize:18 }}>{selectedCountry.currency}</span></p>
            <p style={{ fontSize:12, color:"#888", marginTop:4 }}>1 USD = {selectedCountry.rate} {selectedCountry.currency}</p>
          </div>
          <button onClick={() => setShowCountryPicker(true)} style={{ background:"white", border:"1px solid #e8e6e0", borderRadius:14, padding:"10px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:22 }}>{selectedCountry.flag}</span>
            <div style={{ textAlign:"left" }}><p style={{ fontSize:13, fontWeight:700 }}>{selectedCountry.currency}</p><p style={{ fontSize:11, color:"#aaa" }}>{selectedCountry.name}</p></div>
            <span style={{ color:"#aaa", fontSize:12 }}>▼</span>
          </button>
        </div>
      </div>

      <p style={{ fontSize:13, fontWeight:700, color:"#555", marginBottom:10, textTransform:"uppercase", letterSpacing:0.8 }}>{t.deliverySpeed}</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {DELIVERY_OPTIONS.map(opt => (
          <div key={opt.id} onClick={() => setDelivery(opt.id)} style={{ background:delivery===opt.id?"#fff5f3":"#faf9f6", border:`2px solid ${delivery===opt.id?"#e8563a":"#f0eeea"}`, borderRadius:16, padding:"14px", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{opt.icon}</div>
            <p style={{ fontWeight:700, fontSize:13, color:"#1a1a1a" }}>{opt.label}</p>
            <p style={{ fontSize:11, color:"#888", marginTop:2 }}>{opt.time}</p>
            <p style={{ fontSize:13, fontWeight:700, color:opt.fee===0?"#059669":"#e8563a", marginTop:6 }}>{opt.fee===0?t.free:`$${opt.fee}`}</p>
          </div>
        ))}
      </div>

      <div style={{ background:"#faf9f6", borderRadius:16, padding:"16px 20px", marginBottom:24 }}>
        {[[t.transferAmount,`$${fmt(numAmount)}`],[t.transferFee,fee===0?t.free:`$${fmt(fee)}`],[t.total,`$${fmt(total)}`]].map(([label,val],i) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:i===2?"10px 0 0":"0 0 8px", borderTop:i===2?"1px solid #e8e6e0":"none" }}>
            <span style={{ fontSize:14, color:"#888" }}>{label}</span>
            <span style={{ fontSize:14, fontWeight:i===2?700:500, color:i===2?"#1a1a1a":"#444" }}>{val}</span>
          </div>
        ))}
      </div>

      <button className="pb pp" onClick={onNext} disabled={numAmount<=0} style={{ opacity:numAmount>0?1:0.5 }}>{t.continue}</button>

      {showCountryPicker && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setShowCountryPicker(false)}>
          <div className="su" style={{ width:"100%", maxWidth:420, background:"white", borderRadius:"24px 24px 0 0", padding:"24px", maxHeight:"70vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ width:40, height:4, background:"#e0ddd8", borderRadius:2, margin:"0 auto 20px" }}/>
            <h3 style={{ fontSize:18, fontWeight:700, marginBottom:16 }}>{t.sendTo}</h3>
            {COUNTRIES.map(c => (
              <div key={c.code} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); }} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 12px", borderRadius:12, cursor:"pointer", background:selectedCountry.code===c.code?"#fff5f3":"transparent", marginBottom:4 }}>
                <span style={{ fontSize:28 }}>{c.flag}</span>
                <div style={{ flex:1 }}><p style={{ fontWeight:600, fontSize:15 }}>{c.name}</p><p style={{ fontSize:12, color:"#aaa" }}>{c.currency}</p></div>
                <p style={{ fontSize:13, color:"#888" }}>1 USD = {c.rate}</p>
                {selectedCountry.code===c.code && <span style={{ color:"#e8563a" }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step2({ t, selectedRecipient, setSelectedRecipient, onNext }) {
  return (
    <div style={{ padding:"0 24px" }}>
      <p style={{ fontSize:13, fontWeight:700, color:"#555", marginBottom:16, textTransform:"uppercase", letterSpacing:0.8 }}>{t.recentRecipients}</p>
      {RECIPIENTS.map(r => {
        const country = COUNTRIES.find(c => c.code===r.country);
        return (
          <div key={r.id} onClick={() => { setSelectedRecipient(r); onNext(); }} className="ch"
            style={{ display:"flex", alignItems:"center", gap:14, padding:"16px", borderRadius:16, marginBottom:10, cursor:"pointer", background:selectedRecipient?.id===r.id?"#fff5f3":"#faf9f6", border:`1.5px solid ${selectedRecipient?.id===r.id?"#e8563a":"#f0eeea"}` }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:r.color, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:17 }}>{r.initials}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{r.name}</p>
              <p style={{ fontSize:13, color:"#888", marginTop:2 }}>{country?.flag} {country?.name} · {t.bankAccount}</p>
            </div>
            <span style={{ color:"#ccc", fontSize:18 }}>›</span>
          </div>
        );
      })}
      <div style={{ marginTop:16 }}>
        <button className="pb" style={{ width:"100%", background:"transparent", border:"1.5px dashed #e0ddd8", color:"#888", padding:"16px", borderRadius:100, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans'" }}>{t.addNewRecipient}</button>
      </div>
    </div>
  );
}

function Step3({ t, numAmount, received, selectedCountry, selectedRecipient, delivery, fee, total, payMethod, setPayMethod, onSend, DELIVERY_OPTIONS, PAYMENT_METHODS }) {
  const sel = DELIVERY_OPTIONS.find(d => d.id===delivery);
  return (
    <div style={{ padding:"0 24px" }}>
      <div style={{ background:"#faf9f6", borderRadius:20, padding:"20px", marginBottom:16, border:"1px solid #f0eeea" }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>{t.transferSummary}</p>
        {[[t.youSend,`$${numAmount.toFixed(2)} USD`],[t.recipientGets,`${received.toLocaleString("en-US",{maximumFractionDigits:0})} ${selectedCountry.currency}`],[t.exchangeRate,`1 USD = ${selectedCountry.rate} ${selectedCountry.currency}`],[t.delivery,`${sel?.icon} ${sel?.label} (${sel?.time})`],[t.fee,fee===0?`🎉 ${t.free}`:`$${fee.toFixed(2)}`],[t.totalCharged,`$${total.toFixed(2)} USD`]].map(([label,val],i) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<5?"1px solid #f0eeea":"none" }}>
            <span style={{ fontSize:14, color:"#777" }}>{label}</span>
            <span style={{ fontSize:14, fontWeight:600, color:i===5?"#e8563a":"#1a1a1a" }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ background:"#faf9f6", borderRadius:20, padding:"20px", marginBottom:16, border:"1px solid #f0eeea" }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>{t.sendingTo}</p>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:selectedRecipient?.color, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:16 }}>{selectedRecipient?.initials}</div>
          <div><p style={{ fontWeight:700, fontSize:15 }}>{selectedRecipient?.name}</p><p style={{ fontSize:12, color:"#aaa" }}>{selectedCountry.flag} {selectedCountry.name} · ****4521</p></div>
        </div>
      </div>
      <p style={{ fontSize:13, fontWeight:700, color:"#555", marginBottom:12, textTransform:"uppercase", letterSpacing:0.8 }}>{t.paymentMethod}</p>
      {PAYMENT_METHODS.map(pm => (
        <div key={pm.id} onClick={() => setPayMethod(pm.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:payMethod===pm.id?"#fff5f3":"#faf9f6", border:`1.5px solid ${payMethod===pm.id?"#e8563a":"#f0eeea"}`, borderRadius:14, marginBottom:8, cursor:"pointer" }}>
          <span style={{ fontSize:22 }}>{pm.icon}</span>
          <p style={{ flex:1, fontWeight:600, fontSize:14 }}>{pm.label} ···{pm.last4}</p>
          {payMethod===pm.id && <span style={{ color:"#e8563a", fontWeight:700 }}>✓</span>}
        </div>
      ))}
      <div style={{ marginTop:24 }}>
        <button className="pb pp" onClick={onSend}>{t.confirmSend(total.toFixed(2))}</button>
        <p style={{ fontSize:12, color:"#aaa", textAlign:"center", marginTop:12 }}>{t.encrypted}</p>
      </div>
    </div>
  );
}

function SuccessScreen({ t, goTo, numAmount, received, selectedCountry, selectedRecipient, setSent }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => { const timer = setInterval(() => setProgress(p => Math.min(p+2,100)),30); return () => clearInterval(timer); }, []);
  return (
    <div style={{ padding:"60px 24px 40px", display:"flex", flexDirection:"column", alignItems:"center", minHeight:"100vh" }}>
      <div className="cc" style={{ marginBottom:20 }}><YourCashPortalLogo size={52} showText={false}/></div>
      <div style={{ fontSize:32, marginBottom:12 }}>✅</div>
      <h1 style={{ fontFamily:"'DM Serif Display'", fontSize:30, color:"#1a1a1a", textAlign:"center", marginBottom:8 }}>{t.transferSent}</h1>
      <p style={{ color:"#888", fontSize:15, textAlign:"center", marginBottom:32 }}>{t.onItsWay(selectedRecipient?.name)}</p>
      <div style={{ background:"#faf9f6", borderRadius:20, padding:"24px", width:"100%", marginBottom:32, border:"1px solid #f0eeea" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <p style={{ fontSize:13, color:"#aaa", marginBottom:6 }}>{t.amountSent}</p>
          <p style={{ fontFamily:"'DM Serif Display'", fontSize:40, color:"#1a1a1a" }}>${numAmount.toFixed(2)}</p>
        </div>
        <div style={{ display:"flex", alignItems:"center" }}>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#e8563a", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:16, margin:"0 auto 8px" }}>$</div>
            <p style={{ fontSize:12, color:"#aaa" }}>USD</p>
          </div>
          <div style={{ flex:2, position:"relative", height:6, background:"#f0eeea", borderRadius:3 }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"#e8563a", borderRadius:3, transition:"width 0.1s" }}/>
            {progress<100 && <span className="pu" style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", fontSize:10 }}>✈️</span>}
          </div>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#f0eeea", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 8px" }}>{selectedCountry.flag}</div>
            <p style={{ fontSize:12, color:"#aaa" }}>{selectedCountry.currency}</p>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:20 }}>
          <p style={{ fontSize:13, color:"#aaa", marginBottom:6 }}>{t.recipientReceives}</p>
          <p style={{ fontFamily:"'DM Serif Display'", fontSize:30, color:"#059669" }}>{received.toLocaleString("en-US",{maximumFractionDigits:0})} {selectedCountry.currency}</p>
        </div>
      </div>
      <div style={{ background:"#fff5f3", borderRadius:14, padding:"14px 18px", width:"100%", marginBottom:24, display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:22 }}>{delivery==="cashPickup"?"💵":delivery==="homeDelivery"?"🏠":"🏦"}</span>
        <div>
          <p style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{delivery==="cashPickup"?t.cashPickup:delivery==="homeDelivery"?t.homeDelivery:t.expressDelivery}</p>
          <p style={{ fontSize:12, color:"#888" }}>{t.estimatedMinutes}</p>
        </div>
      </div>
      <button className="pb pp" style={{ marginBottom:12, width:"100%" }} onClick={() => { setSent(false); goTo("home"); }}>{t.backHome}</button>
      <button className="pb pg" style={{ width:"100%" }} onClick={() => { setSent(false); goTo("activity"); }}>{t.viewActivity}</button>
    </div>
  );
}

function ActivityScreen({ t, lang, setLang, goTo }) {
  const [active, setActive] = useState(0);
  const filters = [t.all, t.deliveredFilter, t.pendingFilter];
  return (
    <div style={{ padding:"52px 24px 90px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <h1 style={{ fontFamily:"'DM Serif Display'", fontSize:26, color:"#1a1a1a" }}>{t.activityTitle}</h1>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <LangToggle lang={lang} setLang={setLang}/>
          <YourCashPortalLogo size={20} showText={false}/>
        </div>
      </div>
      <p style={{ color:"#aaa", fontSize:14, marginBottom:24 }}>{t.allTransfers}</p>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {filters.map((f,i) => (
          <button key={f} onClick={() => setActive(i)} style={{ background:active===i?"#e8563a":"#f5f4f0", color:active===i?"white":"#666", border:"none", borderRadius:20, padding:"8px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>{f}</button>
        ))}
      </div>
      {[...HISTORY,...HISTORY].map((tx,i) => <TxRow key={i} tx={tx} t={t}/>)}
    </div>
  );
}

function ProfileScreen({ t, lang, setLang }) {
  const items = [
    { icon:"👤", label:t.personalInfo },{ icon:"🏦", label:t.paymentMethods },
    { icon:"🔔", label:t.notifications },{ icon:"🔒", label:t.security },
    { icon:"🌍", label:t.preferredCountries },{ icon:"💬", label:t.support },
    { icon:"📄", label:t.legalPrivacy },
  ];
  return (
    <div style={{ paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#0f0720 0%,#1a0a3c 50%,#16213e 100%)", padding:"52px 24px 36px", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ flex:1 }}/>
          <YourCashPortalLogo size={22} showText={true}/>
          <div style={{ flex:1, display:"flex", justifyContent:"flex-end" }}><LangToggle lang={lang} setLang={setLang}/></div>
        </div>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"#e8563a", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:26, margin:"0 auto 16px" }}>AJ</div>
        <h2 style={{ color:"white", fontFamily:"'DM Serif Display'", fontSize:22 }}>Alex Johnson</h2>
        <p style={{ color:"#8899bb", fontSize:14, marginTop:4 }}>alex.johnson@email.com</p>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(74,222,128,0.15)", borderRadius:20, padding:"6px 14px", marginTop:12 }}>
          <span style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", display:"inline-block" }}/>
          <span style={{ color:"#4ade80", fontSize:12, fontWeight:600 }}>{t.verified}</span>
        </div>
      </div>
      <div style={{ padding:"24px" }}>
        {items.map(item => (
          <div key={item.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0", borderBottom:"1px solid #f5f4f0", cursor:"pointer" }}>
            <div style={{ width:40, height:40, background:"#faf9f6", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{item.icon}</div>
            <p style={{ flex:1, fontSize:15, fontWeight:500, color:"#1a1a1a" }}>{item.label}</p>
            <span style={{ color:"#ccc" }}>›</span>
          </div>
        ))}
        <div style={{ marginTop:24, textAlign:"center" }}>
          <p style={{ fontSize:13, color:"#aaa" }}>YourCa$hPortal v1.0.0</p>
          <button style={{ background:"none", border:"none", color:"#e8563a", fontSize:14, fontWeight:600, marginTop:8, cursor:"pointer" }}>{t.signOut}</button>
        </div>
      </div>
    </div>
  );
}
