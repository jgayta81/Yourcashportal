import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

// ── CORRIDOR DATA ──────────────────────────────────────────────────────────────
const CORRIDORS = [
  { id: "PHP", name: "Philippines", flag: "🇵🇭", wiseFixed: 1.00, wiseVar: 0.006, popular: true },
  { id: "MXN", name: "Mexico",      flag: "🇲🇽", wiseFixed: 0.80, wiseVar: 0.005, popular: true },
  { id: "INR", name: "India",       flag: "🇮🇳", wiseFixed: 0.80, wiseVar: 0.0045, popular: true },
  { id: "NGN", name: "Nigeria",     flag: "🇳🇬", wiseFixed: 1.50, wiseVar: 0.012, popular: false },
  { id: "GHS", name: "Ghana",       flag: "🇬🇭", wiseFixed: 1.50, wiseVar: 0.011, popular: false },
  { id: "KES", name: "Kenya",       flag: "🇰🇪", wiseFixed: 1.20, wiseVar: 0.009, popular: false },
  { id: "BDT", name: "Bangladesh",  flag: "🇧🇩", wiseFixed: 0.90, wiseVar: 0.007, popular: false },
  { id: "COP", name: "Colombia",    flag: "🇨🇴", wiseFixed: 0.80, wiseVar: 0.005, popular: false },
];

const OVERHEAD = {
  server:     200,
  compliance: 500,
  support:    1000,
  misc:       300,
};
const TOTAL_OVERHEAD = Object.values(OVERHEAD).reduce((a, b) => a + b, 0);

function fmt$(n, dec = 2) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtK(n) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)     return "$" + (n / 1_000).toFixed(1) + "K";
  return fmt$(n, 0);
}

// ── CALCULATION ENGINE ─────────────────────────────────────────────────────────
function calcUnit({ transferAmount, yourFee, fxSpread, achPct, corridor }) {
  const cor = CORRIDORS.find(c => c.id === corridor) || CORRIDORS[0];

  // Wise cost
  const wiseCost = cor.wiseFixed + cor.wiseVar * transferAmount;

  // Stripe cost (blended: ACH vs card)
  const cardFee  = transferAmount * 0.029 + 0.30;
  const achFee   = Math.min(transferAmount * 0.008, 5.00);
  const stripeCost = (achPct / 100) * achFee + ((100 - achPct) / 100) * cardFee;

  // FX spread income
  const fxIncome = (fxSpread / 100) * transferAmount;

  const totalCost   = wiseCost + stripeCost;
  const totalRevenue = yourFee + fxIncome;
  const profit      = totalRevenue - totalCost;
  const margin      = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return { wiseCost, stripeCost, totalCost, fxIncome, totalRevenue, profit, margin };
}

// ── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #334155",
      borderRadius: 10, padding: "10px 14px", fontSize: 13,
    }}>
      <p style={{ color: "#94a3b8", marginBottom: 6 }}>{label} transfers/mo</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmtK(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── SLIDER ─────────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, format, color = "#f59e0b", hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>
          {format ? format(value) : value}
        </span>
      </div>
      <div style={{ position: "relative", height: 6, background: "#1e293b", borderRadius: 3 }}>
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.1s" }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, width: "100%", opacity: 0,
            cursor: "pointer", height: "100%", margin: 0,
          }}
        />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 16, height: 16, borderRadius: "50%",
          background: color, border: "2px solid #0f172a",
          boxShadow: `0 0 8px ${color}88`, pointerEvents: "none",
          transition: "left 0.1s",
        }} />
      </div>
      {hint && <p style={{ fontSize: 11, color: "#475569", marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

// ── STAT CARD ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "#f59e0b", glow = false }) {
  return (
    <div style={{
      background: "#0f172a", border: `1px solid ${glow ? color + "55" : "#1e293b"}`,
      borderRadius: 16, padding: "18px 20px", flex: 1,
      boxShadow: glow ? `0 0 24px ${color}22` : "none",
    }}>
      <p style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

// ── SECTION HEADER ─────────────────────────────────────────────────────────────
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'DM Serif Display'" }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: "#475569", marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function ProfitCalculator() {
  const [transferAmount, setTransferAmount] = useState(200);
  const [yourFee, setYourFee]               = useState(9.99);
  const [fxSpread, setFxSpread]             = useState(0.1);
  const [achPct, setAchPct]                 = useState(30);
  const [monthlyVol, setMonthlyVol]         = useState(2000);
  const [corridor, setCorridor]             = useState("PHP");
  const [activeTab, setActiveTab]           = useState("unit"); // unit | scale | breakdown

  // Unit economics
  const unit = useMemo(() =>
    calcUnit({ transferAmount, yourFee, fxSpread, achPct, corridor }),
    [transferAmount, yourFee, fxSpread, achPct, corridor]
  );

  // Monthly P&L
  const monthly = useMemo(() => {
    const grossProfit = unit.profit * monthlyVol;
    const netProfit   = grossProfit - TOTAL_OVERHEAD;
    const revenue     = unit.totalRevenue * monthlyVol;
    return { grossProfit, netProfit, revenue };
  }, [unit, monthlyVol]);

  // Break-even
  const breakEven = useMemo(() => {
    if (unit.profit <= 0) return Infinity;
    return Math.ceil(TOTAL_OVERHEAD / unit.profit);
  }, [unit]);

  // Scale chart data
  const scaleData = useMemo(() => {
    return [100, 250, 500, 1000, 2000, 5000, 10000, 25000, 50000].map(vol => ({
      vol,
      revenue: unit.totalRevenue * vol,
      profit:  Math.max(0, unit.profit * vol - TOTAL_OVERHEAD),
      costs:   unit.totalCost * vol + TOTAL_OVERHEAD,
    }));
  }, [unit]);

  // Corridor comparison data
  const corridorData = useMemo(() =>
    CORRIDORS.map(c => {
      const u = calcUnit({ transferAmount, yourFee, fxSpread, achPct, corridor: c.id });
      return { name: c.flag + " " + c.id, profit: parseFloat(u.profit.toFixed(2)), margin: parseFloat(u.margin.toFixed(1)) };
    }),
    [transferAmount, yourFee, fxSpread, achPct]
  );

  const tabs = ["unit", "scale", "breakdown"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }

        .tab-btn {
          padding: 8px 18px; border-radius: 20px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
        }
        .tab-active { background: #f59e0b; color: #0f172a; }
        .tab-inactive { background: transparent; color: #475569; }
        .tab-inactive:hover { color: #94a3b8; }

        .corridor-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 20px; border: 1.5px solid transparent;
          cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
        }
        .corridor-pill:hover { border-color: #334155; }

        .cost-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #1e293b;
        }
        .cost-row:last-child { border-bottom: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        .count-up { animation: countUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
      `}</style>

      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#020617",
        minHeight: "100vh",
        color: "#f1f5f9",
        padding: "0 0 60px",
      }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1030 50%, #0f172a 100%)",
          borderBottom: "1px solid #1e293b",
          padding: "40px 24px 32px",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Logo row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <svg width="52" height="24" viewBox="0 0 110 50" fill="none">
                <defs>
                  <linearGradient id="sm" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff"/>
                    <stop offset="45%" stopColor="#94a3b8"/>
                    <stop offset="100%" stopColor="#f8fafc"/>
                  </linearGradient>
                  <radialGradient id="cf" cx="42%" cy="36%" r="58%">
                    <stop offset="0%" stopColor="#fff7c0"/>
                    <stop offset="55%" stopColor="#eab308"/>
                    <stop offset="100%" stopColor="#92400e"/>
                  </radialGradient>
                  <linearGradient id="cr" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a"/>
                    <stop offset="100%" stopColor="#78350f"/>
                  </linearGradient>
                </defs>
                <path d="M18,25 C18,13 29,6 39,6 C49,6 53,16 55,25 C57,34 61,44 71,44 C81,44 92,37 92,25 C92,13 81,6 71,6 C61,6 57,16 55,25 C53,34 49,44 39,44 C29,44 18,37 18,25 Z" stroke="#64748b" strokeWidth="7" fill="none" strokeLinecap="round"/>
                <path d="M18,25 C18,13 29,6 39,6 C49,6 53,16 55,25 C57,34 61,44 71,44 C81,44 92,37 92,25 C92,13 81,6 71,6 C61,6 57,16 55,25 C53,34 49,44 39,44 C29,44 18,37 18,25 Z" stroke="url(#sm)" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
                <circle cx="71" cy="25" r="11" fill="url(#cr)"/>
                <circle cx="71" cy="25" r="9.2" fill="url(#cf)"/>
                <text x="71" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="Georgia,serif" fill="#78350f" opacity="0.85">$</text>
              </svg>
              <div>
                <p style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", display: "flex", alignItems: "baseline", gap: 0 }}>
                  <span style={{ color: "#64748b" }}>YourCa</span>
                  <span style={{ color: "#f59e0b", filter: "drop-shadow(0 0 3px #f59e0b88)" }}>$</span>
                  <span style={{ color: "#64748b" }}>hPortal</span>
                </p>
                <p style={{ fontSize: 20, fontFamily: "'DM Serif Display'", color: "#f1f5f9", lineHeight: 1.2 }}>Profit Calculator</p>
              </div>
            </div>

            {/* Key stats hero row */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <StatCard
                label="Profit / Transfer"
                value={fmt$(unit.profit)}
                sub={`${unit.margin.toFixed(1)}% margin`}
                color={unit.profit > 0 ? "#4ade80" : "#f87171"}
                glow={unit.profit > 2}
              />
              <StatCard
                label="Monthly Profit"
                value={fmtK(monthly.netProfit)}
                sub={`at ${monthlyVol.toLocaleString()} transfers`}
                color={monthly.netProfit > 0 ? "#f59e0b" : "#f87171"}
                glow={monthly.netProfit > 0}
              />
              <StatCard
                label="Break-Even"
                value={breakEven === Infinity ? "∞" : breakEven.toLocaleString()}
                sub="transfers/month needed"
                color="#a78bfa"
              />
              <StatCard
                label="Annual Revenue"
                value={fmtK(monthly.revenue * 12)}
                sub="at current volume"
                color="#38bdf8"
              />
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>

            {/* ── LEFT PANEL: CONTROLS ── */}
            <div style={{ flex: "0 0 300px", minWidth: 260 }}>
              <div style={{
                background: "#0f172a", border: "1px solid #1e293b",
                borderRadius: 20, padding: "24px",
              }}>
                <p style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>Model Inputs</p>

                {/* Corridor selector */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginBottom: 10 }}>Destination Corridor</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {CORRIDORS.map(c => (
                      <button
                        key={c.id}
                        className="corridor-pill"
                        onClick={() => setCorridor(c.id)}
                        style={{
                          background: corridor === c.id ? "#1e293b" : "transparent",
                          borderColor: corridor === c.id ? "#f59e0b" : "#1e293b",
                          color: corridor === c.id ? "#f59e0b" : "#64748b",
                        }}
                      >
                        {c.flag} {c.id}
                      </button>
                    ))}
                  </div>
                </div>

                <Slider
                  label="Transfer Amount"
                  value={transferAmount}
                  min={50} max={2000} step={50}
                  onChange={setTransferAmount}
                  format={v => fmt$(v, 0)}
                  color="#38bdf8"
                  hint="Avg remittance is $200–$300"
                />
                <Slider
                  label="Your Flat Fee"
                  value={yourFee}
                  min={1.99} max={24.99} step={0.50}
                  onChange={setYourFee}
                  format={v => fmt$(v)}
                  color="#f59e0b"
                  hint="Remitly charges $3.99–$14.99 typically"
                />
                <Slider
                  label="FX Spread (extra markup)"
                  value={fxSpread}
                  min={0} max={1.5} step={0.05}
                  onChange={setFxSpread}
                  format={v => v.toFixed(2) + "%"}
                  color="#a78bfa"
                  hint="0% = pure mid-market. Invisible to users."
                />
                <Slider
                  label="ACH Funding Mix"
                  value={achPct}
                  min={0} max={100} step={5}
                  onChange={setAchPct}
                  format={v => v + "%"}
                  color="#4ade80"
                  hint="Higher ACH = lower Stripe fees for you"
                />
                <Slider
                  label="Monthly Transfers"
                  value={monthlyVol}
                  min={100} max={50000} step={100}
                  onChange={setMonthlyVol}
                  format={v => v.toLocaleString()}
                  color="#fb7185"
                  hint="Break-even shown in stats above"
                />

                {/* Overhead breakdown */}
                <div style={{ marginTop: 8, background: "#020617", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Monthly Overhead</p>
                  {Object.entries(OVERHEAD).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#475569", textTransform: "capitalize" }}>{k}</span>
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{fmt$(v, 0)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #1e293b", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>{fmt$(TOTAL_OVERHEAD, 0)}/mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL: OUTPUT ── */}
            <div style={{ flex: 1, minWidth: 280 }}>

              {/* Tab switcher */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0f172a", borderRadius: 24, padding: 4, width: "fit-content" }}>
                {[
                  { id: "unit",      label: "Per Transfer" },
                  { id: "scale",     label: "At Scale" },
                  { id: "breakdown", label: "By Corridor" },
                ].map(t => (
                  <button key={t.id} className={`tab-btn ${activeTab === t.id ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── TAB: PER TRANSFER ── */}
              {activeTab === "unit" && (
                <div className="fade-up">
                  {/* Revenue waterfall */}
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
                    <SectionHeader title="Revenue Waterfall" sub="How one transfer breaks down" />

                    {/* Visual bar */}
                    {(() => {
                      const total = unit.totalRevenue;
                      const wisePct   = total > 0 ? (unit.wiseCost / total) * 100 : 0;
                      const stripePct = total > 0 ? (unit.stripeCost / total) * 100 : 0;
                      const profitPct = total > 0 ? Math.max(0, (unit.profit / total) * 100) : 0;
                      return (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", gap: 2 }}>
                            <div style={{ width: `${wisePct}%`, background: "#f87171", transition: "width 0.3s" }} title="Wise fee" />
                            <div style={{ width: `${stripePct}%`, background: "#fb923c", transition: "width 0.3s" }} title="Stripe fee" />
                            <div style={{ width: `${profitPct}%`, background: "#4ade80", transition: "width 0.3s" }} title="Your profit" />
                          </div>
                          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                            {[
                              { color: "#f87171", label: "Wise" },
                              { color: "#fb923c", label: "Stripe" },
                              { color: "#4ade80", label: "Profit" },
                            ].map(l => (
                              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                                <span style={{ fontSize: 11, color: "#64748b" }}>{l.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Line items */}
                    <div className="cost-row">
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>Your flat fee</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>+{fmt$(yourFee)}</span>
                    </div>
                    <div className="cost-row">
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>FX spread income</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b" }}>+{fmt$(unit.fxIncome)}</span>
                    </div>
                    <div className="cost-row" style={{ background: "#0a0f1a", margin: "0 -4px", padding: "12px 4px", borderRadius: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Total Revenue</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{fmt$(unit.totalRevenue)}</span>
                    </div>
                    <div style={{ height: 1, background: "#1e293b", margin: "12px 0" }} />
                    <div className="cost-row">
                      <div>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>Wise cost</span>
                        <p style={{ fontSize: 11, color: "#334155" }}>Fixed {fmt$(CORRIDORS.find(c=>c.id===corridor)?.wiseFixed||0)} + {((CORRIDORS.find(c=>c.id===corridor)?.wiseVar||0)*100).toFixed(2)}% var</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f87171" }}>−{fmt$(unit.wiseCost)}</span>
                    </div>
                    <div className="cost-row">
                      <div>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>Stripe cost (blended)</span>
                        <p style={{ fontSize: 11, color: "#334155" }}>{achPct}% ACH · {100-achPct}% card</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fb923c" }}>−{fmt$(unit.stripeCost)}</span>
                    </div>
                    <div style={{ background: "#0a0f1a", margin: "8px -4px 0", padding: "14px 4px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>Net Profit / Transfer</span>
                      <span style={{ fontSize: 22, fontWeight: 700, color: unit.profit > 0 ? "#4ade80" : "#f87171", fontFamily: "'DM Serif Display'" }}>
                        {fmt$(unit.profit)}
                      </span>
                    </div>
                  </div>

                  {/* Card vs ACH comparison */}
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: "24px" }}>
                    <SectionHeader title="Card vs ACH Impact" sub="Same transfer, different funding method" />
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "100% Card", achPctSim: 0,   color: "#fb923c" },
                        { label: "50/50 Mix", achPctSim: 50,  color: "#f59e0b" },
                        { label: "100% ACH",  achPctSim: 100, color: "#4ade80" },
                      ].map(s => {
                        const u = calcUnit({ transferAmount, yourFee, fxSpread, achPct: s.achPctSim, corridor });
                        return (
                          <div key={s.label} style={{
                            flex: 1, background: "#020617", borderRadius: 12, padding: "14px 12px", textAlign: "center",
                            border: `1px solid ${s.color}33`,
                          }}>
                            <p style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>{s.label}</p>
                            <p style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Serif Display'" }}>{fmt$(u.profit)}</p>
                            <p style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>Stripe: {fmt$(u.stripeCost)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: AT SCALE ── */}
              {activeTab === "scale" && (
                <div className="fade-up">
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
                    <SectionHeader title="Revenue vs Profit at Scale" sub="How your business grows with volume" />
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={scaleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                          dataKey="vol"
                          tickFormatter={v => v >= 1000 ? v/1000+"K" : v}
                          tick={{ fill: "#475569", fontSize: 11 }}
                          axisLine={{ stroke: "#1e293b" }}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={v => fmtK(v)}
                          tick={{ fill: "#475569", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          width={54}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={0} stroke="#334155" strokeDasharray="4 4" />
                        <Line dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                        <Line dataKey="profit"  name="Net Profit" stroke="#4ade80" strokeWidth={2.5} dot={false} />
                        <Line dataKey="costs"   name="Total Costs" stroke="#f87171" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Scale milestones */}
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: "24px" }}>
                    <SectionHeader title="Milestone Projections" sub="Monthly net profit after overhead" />
                    {[500, 1000, 2500, 5000, 10000, 25000].map(vol => {
                      const gross = unit.profit * vol;
                      const net   = gross - TOTAL_OVERHEAD;
                      const isPast = vol <= monthlyVol;
                      return (
                        <div key={vol} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "12px 14px", borderRadius: 12, marginBottom: 6,
                          background: isPast ? "#0a0f1a" : "transparent",
                          border: isPast ? "1px solid #1e293b" : "1px solid transparent",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: net > 0 ? "#4ade80" : "#f87171" }} />
                            <span style={{ fontSize: 14, color: isPast ? "#f1f5f9" : "#475569", fontWeight: 600 }}>
                              {vol.toLocaleString()} transfers/mo
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 15, fontWeight: 700, color: net > 0 ? "#4ade80" : "#f87171" }}>{fmtK(net)}/mo</p>
                            <p style={{ fontSize: 10, color: "#334155" }}>{fmtK(net * 12)}/yr</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TAB: BY CORRIDOR ── */}
              {activeTab === "breakdown" && (
                <div className="fade-up">
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
                    <SectionHeader title="Profit by Corridor" sub={`On a ${fmt$(transferAmount, 0)} transfer with your current fee settings`} />
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={corridorData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={v => "$"+v} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                        <Tooltip content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px" }}>
                              <p style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</p>
                              <p style={{ color: "#4ade80", fontWeight: 700 }}>Profit: {fmt$(payload[0]?.value)}</p>
                            </div>
                          );
                        }} />
                        <ReferenceLine y={0} stroke="#334155" />
                        <Bar dataKey="profit" name="Profit" radius={[6, 6, 0, 0]}
                          fill="#f59e0b"
                          label={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Corridor detail table */}
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, padding: "24px" }}>
                    <SectionHeader title="Corridor Detail" sub="Wise fees vary significantly by route" />
                    {CORRIDORS.map(c => {
                      const u = calcUnit({ transferAmount, yourFee, fxSpread, achPct, corridor: c.id });
                      const isSelected = c.id === corridor;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setCorridor(c.id)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 14px", borderRadius: 12, marginBottom: 6,
                            cursor: "pointer", transition: "all 0.15s",
                            background: isSelected ? "#1e293b" : "transparent",
                            border: `1px solid ${isSelected ? "#f59e0b33" : "transparent"}`,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 22 }}>{c.flag}</span>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{c.name}</p>
                              <p style={{ fontSize: 11, color: "#334155" }}>
                                Wise: {fmt$(c.wiseFixed)} + {(c.wiseVar * 100).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 15, fontWeight: 700, color: u.profit > 0 ? "#4ade80" : "#f87171" }}>{fmt$(u.profit)}</p>
                            <p style={{ fontSize: 11, color: "#475569" }}>{u.margin.toFixed(1)}% margin</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
