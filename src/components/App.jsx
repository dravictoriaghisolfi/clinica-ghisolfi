'use client'
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const C = {
  wine: "#6B2D3E", wineLight: "#8B3D52", wineDark: "#4A1E2B",
  wineAlpha: "rgba(107,45,62,0.08)", gold: "#C9A84C", goldLight: "#E8C97A",
  goldAlpha: "rgba(201,168,76,0.15)", cream: "#FAF7F2", ivory: "#F5F0E8",
  sand: "#EDE7DC", sandDark: "#D4CAB8", text: "#2C1F25", textMuted: "#7A6570",
  textLight: "#B0A0A7", white: "#FFFFFF", success: "#2D6A4F",
  successBg: "#E8F5EE", danger: "#8B2D2D", dangerBg: "#F5E8E8",
};

const LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAAh8AAAErCAYAAAB+XuH3AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGBckpiciODi4uIKYmBguP/fgYGhkoGBgTGZgYGhgYGBgZWBgYGBlZGBgYGBkZ2BgYGRnYGBgYmZkYGBgZmVkYGBgYWVkYGBgYGdkYGBgZGZkYGBgYmJkYGBgZGZkYGBgYGZgYGBgZGRkYGBgYmZgYGBgYmRkYGBgYGJgYGBgYGZgYGBgYGRkYGBgYmZkYGBgYGZkYGBgYGZgYGBgZGRkYGBgYmZgYGBgYmJkYGBgYGJgYGBgYGZgYGBgYGRkYGBgYmZkYGBgYGZgYGBgYGRkYGBgYmZkYGBgYGZgYGBgZGRkYGBgYmZgYGBgYmJgYGBgYGZgYGBgYGZgYGBgYGRkYGBgYmZkYGBgYGZgYGBgYGRkYGBgYmZkYGBgYGZgYGBgZGRkYGBgYmZgYGBgYmJgYGBg";

const PROCEDIMENTOS_LIST = ["Preenchimento labial","Preenchimento mento","Preenchimento malar","Preenchimento mandíbula","Preenchimento bigode chinês","Preenchimento linha de marionete","Botox","Clareamento","Profilaxia","Raspagem","Restauração","Extração simples","Extração elemento impactado","Prótese","Placa bruxismo","Sousmile","Avaliação","Retorno"];
const MEIOS_PAGAMENTO = ["Pix","Débito","Crédito","TED","Contrato Pix (parcela)","Dinheiro"];
const MEIOS_CONTATO = ["Instagram","WhatsApp","TikTok","Indicação","Outro"];

function uid() { return Math.random().toString(36).slice(2,10); }
function fmt(n) { return (n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}); }
function fmtDate(d) { if(!d) return "—"; const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; }
function age(dob) { if(!dob) return ""; const b=new Date(dob),now=new Date(); let a=now.getFullYear()-b.getFullYear(); if(now<new Date(now.getFullYear(),b.getMonth(),b.getDate())) a--; return a+" anos"; }

const gs = {
  app: { display:"flex", height:"100vh", fontFamily:"'Cormorant Garamond', Georgia, serif", background:C.cream, color:C.text, overflow:"hidden" },
  sidebar: { width:240, background:C.wineDark, display:"flex", flexDirection:"column", padding:"0 0 24px", flexShrink:0 },
  logo: { padding:"28px 24px 20px", borderBottom:`1px solid rgba(255,255,255,0.08)` },
  logoTitle: { fontFamily:"'Cinzel', Georgia, serif", fontSize:16, color:C.white, letterSpacing:2, fontWeight:400 },
  logoSub: { fontSize:11, color:C.goldLight, letterSpacing:2, marginTop:4, fontWeight:400 },
  navItem: (active) => ({ display:"flex", alignItems:"center", gap:12, padding:"11px 24px", cursor:"pointer", color: active ? C.goldLight : "rgba(255,255,255,0.6)", background: active ? "rgba(201,168,76,0.12)" : "transparent", borderLeft: active ? `3px solid ${C.gold}` : "3px solid transparent", fontSize:14, letterSpacing:0.5, transition:"all .18s" }),
  navLabel: { fontSize:11, color:"rgba(255,255,255,0.25)", padding:"18px 24px 8px", letterSpacing:2, textTransform:"uppercase" },
  main: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
  topbar: { background:C.white, borderBottom:`1px solid ${C.sand}`, padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 },
  content: { flex:1, overflowY:"auto", padding:"32px" },
  card: { background:C.white, borderRadius:16, border:`1px solid ${C.sand}`, padding:"28px", marginBottom:20 },
  cardTitle: { fontSize:20, fontWeight:600, color:C.wine, fontFamily:"'Cinzel', Georgia, serif", letterSpacing:1, marginBottom:4 },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
  grid4: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 },
  label: { display:"block", fontSize:12, letterSpacing:0.8, color:C.textMuted, marginBottom:6, textTransform:"uppercase" },
  input: { width:"100%", padding:"12px 16px", border:`1px solid ${C.sandDark}`, borderRadius:10, fontSize:15, background:C.cream, color:C.text, fontFamily:"'Cormorant Garamond', Georgia, serif", outline:"none", boxSizing:"border-box" },
  textarea: { width:"100%", padding:"12px 16px", border:`1px solid ${C.sandDark}`, borderRadius:10, fontSize:15, background:C.cream, color:C.text, fontFamily:"'Cormorant Garamond', Georgia, serif", outline:"none", resize:"vertical", minHeight:90, boxSizing:"border-box" },
  select: { width:"100%", padding:"12px 16px", border:`1px solid ${C.sandDark}`, borderRadius:10, fontSize:15, background:C.cream, color:C.text, fontFamily:"'Cormorant Garamond', Georgia, serif", outline:"none", cursor:"pointer", boxSizing:"border-box" },
  btn: { padding:"12px 28px", background:C.wine, color:C.white, border:"none", borderRadius:10, fontSize:14, cursor:"pointer", fontFamily:"'Cormorant Garamond', Georgia, serif", letterSpacing:1, fontWeight:600 },
  btnOutline: { padding:"10px 22px", background:"transparent", color:C.wine, border:`1.5px solid ${C.wine}`, borderRadius:10, fontSize:14, cursor:"pointer", fontFamily:"'Cormorant Garamond', Georgia, serif", letterSpacing:1 },
  statCard: { background:C.white, borderRadius:14, border:`1px solid ${C.sand}`, padding:"24px", textAlign:"center" },
  statNum: { fontSize:32, fontWeight:600, color:C.wine, fontFamily:"'Cinzel', Georgia, serif" },
  statLabel: { fontSize:12, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginTop:6 },
  tag: (color) => ({ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12, background: color==="gold"?C.goldAlpha:C.wineAlpha, color: color==="gold"?C.wine:C.wineLight, border:`1px solid ${color==="gold"?C.goldLight:C.wineLight}`, marginRight:4, marginBottom:4 }),
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"12px 16px", textAlign:"left", fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", borderBottom:`1px solid ${C.sand}`, fontWeight:500 },
  td: { padding:"14px 16px", fontSize:14, borderBottom:`1px solid ${C.ivory}`, verticalAlign:"top" },
  badge: { padding:"3px 10px", borderRadius:20, fontSize:12, background:C.successBg, color:C.success, fontWeight:500 },
};

function Checklist({ options, value=[], onChange, columns=2 }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${columns},1fr)`, gap:"8px 16px" }}>
      {options.map(opt => {
        const checked = value.includes(opt);
        return (
          <label key={opt} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, color: checked?C.wine:C.textMuted, userSelect:"none" }}>
            <input type="checkbox" checked={checked} onChange={() => { if(checked) onChange(value.filter(x=>x!==opt)); else onChange([...value, opt]); }} style={{ accentColor:C.wine, width:16, height:16, cursor:"pointer", flexShrink:0 }} />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function Field({ label, children, span=1 }) {
  return (
    <div style={{ gridColumn:`span ${span}` }}>
      <label style={gs.label}>{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children, wide=false }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(44,31,37,0.55)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 20px", overflowY:"auto" }}>
      <div style={{ background:C.white, borderRadius:20, width:"100%", maxWidth: wide?900:680, boxShadow:"0 24px 80px rgba(107,45,62,0.25)" }}>
        <div style={{ padding:"24px 32px", borderBottom:`1px solid ${C.sand}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 style={{ margin:0, fontSize:22, fontFamily:"'Cinzel', Georgia, serif", color:C.wine, fontWeight:500 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.textMuted }}>✕</button>
        </div>
        <div style={{ padding:"32px" }}>{children}</div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position:"relative", maxWidth:340 }}>
      <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.textMuted }}>🔍</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Buscar..."} style={{ ...gs.input, paddingLeft:42 }} />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.cream, flexDirection:"column", gap:16 }}>
      <div style={{ width:48, height:48, border:`3px solid ${C.sand}`, borderTop:`3px solid ${C.wine}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <p style={{ color:C.textMuted, fontFamily:"'Cinzel',serif", letterSpacing:2, fontSize:14 }}>CARREGANDO</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ patients, consultas, pagamentos, leads, onNav }) {
  const totalReceita = pagamentos.reduce((s,p)=>s+(p.valor_pago||0),0);
  const totalLucro = pagamentos.reduce((s,p)=>s+((p.valor_pago||0)-(p.insumos||0)-(p.aluguel||0)),0);
  const procedCount = {};
  consultas.forEach(c=>(c.procedimentos||[]).forEach(p=>{ procedCount[p]=(procedCount[p]||0)+1; }));
  const topProcs = Object.entries(procedCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const recentConsultas = [...consultas].sort((a,b)=>(b.data||"").localeCompare(a.data||"")).slice(0,5);

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28, fontFamily:"'Cinzel',serif", color:C.wine, fontWeight:400, marginBottom:6 }}>Visão Geral</h1>
        <p style={{ color:C.textMuted, fontSize:15 }}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
      </div>
      <div style={gs.grid4}>
        {[{n:patients.length,l:"Pacientes"},{n:consultas.length,l:"Consultas"},{n:leads.length,l:"Leads"},{n:fmt(totalReceita),l:"Receita Total"}].map(s=>(
          <div key={s.l} style={gs.statCard}>
            <div style={gs.statNum}>{s.n}</div>
            <div style={gs.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ ...gs.grid2, marginTop:20 }}>
        <div style={gs.card}>
          <div style={gs.cardTitle}>Financeiro</div>
          <div style={{ display:"flex", gap:24, marginTop:12 }}>
            <div><div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase" }}>Receita</div><div style={{ fontSize:24, color:C.wine, fontFamily:"'Cinzel',serif", fontWeight:600 }}>{fmt(totalReceita)}</div></div>
            <div><div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase" }}>Lucro</div><div style={{ fontSize:24, color:C.success, fontFamily:"'Cinzel',serif", fontWeight:600 }}>{fmt(totalLucro)}</div></div>
          </div>
        </div>
        <div style={gs.card}>
          <div style={gs.cardTitle}>Procedimentos em Alta</div>
          <div style={{ marginTop:12 }}>
            {topProcs.map(([proc,count],i)=>(
              <div key={proc} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:24, height:24, borderRadius:6, background:C.wineAlpha, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:C.wine, fontWeight:600, flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1, fontSize:14 }}>{proc}</div>
                <div style={{ fontSize:13, color:C.textMuted }}>{count}x</div>
              </div>
            ))}
            {topProcs.length===0 && <p style={{ color:C.textMuted, fontSize:14 }}>Nenhum procedimento ainda.</p>}
          </div>
        </div>
      </div>
      <div style={gs.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={gs.cardTitle}>Consultas Recentes</div>
          <button onClick={()=>onNav("consultas")} style={gs.btnOutline}>Ver todas</button>
        </div>
        <table style={gs.table}>
          <thead><tr>{["Registro","Paciente","Data","Procedimentos"].map(h=><th key={h} style={gs.th}>{h}</th>)}</tr></thead>
          <tbody>
            {recentConsultas.map(c=>{
              const pac = patients.find(p=>p.id===c.paciente_id);
              return (
                <tr key={c.id}>
                  <td style={gs.td}><span style={gs.badge}>{c.registro}</span></td>
                  <td style={{ ...gs.td, fontWeight:500 }}>{pac?.nome||"—"}</td>
                  <td style={{ ...gs.td, color:C.textMuted }}>{fmtDate(c.data)}</td>
                  <td style={gs.td}>{(c.procedimentos||[]).slice(0,2).map(p=><span key={p} style={gs.tag()}>{p}</span>)}</td>
                </tr>
              );
            })}
            {recentConsultas.length===0 && <tr><td colSpan={4} style={{ padding:"24px", textAlign:"center", color:C.textMuted }}>Nenhuma consulta ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── PATIENT FORM ───────────────────────────────────────────────────────────────
function PatientForm({ initial={}, onSave, onClose }) {
  const [f,setF] = useState({ nome:"",nascimento:"",primeira_consulta:"",sexo:"Feminino",estado_civil:"Solteiro(a)",endereco:"",celular:"",rg:"",cpf:"",profissao:"",altura:"",peso:"",contato_emergencia:"",ultima_consulta_medica:"",ultima_consulta_odonto:"",historico_medico:"",alergias:"",medicamentos:"",queixa_principal:"",observacoes:"", ...initial });
  const set = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Field label="Nome Completo" span={2}><input style={gs.input} value={f.nome} onChange={set("nome")} /></Field>
        <Field label="Data de Nascimento"><input type="date" style={gs.input} value={f.nascimento} onChange={set("nascimento")} /></Field>
        <Field label="Primeira Consulta"><input type="date" style={gs.input} value={f.primeira_consulta} onChange={set("primeira_consulta")} /></Field>
        <Field label="Sexo"><select style={gs.select} value={f.sexo} onChange={set("sexo")}><option>Feminino</option><option>Masculino</option><option>Outro</option></select></Field>
        <Field label="Estado Civil"><select style={gs.select} value={f.estado_civil} onChange={set("estado_civil")}><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option></select></Field>
        <Field label="Endereço" span={2}><input style={gs.input} value={f.endereco} onChange={set("endereco")} /></Field>
        <Field label="Celular"><input style={gs.input} value={f.celular} onChange={set("celular")} /></Field>
        <Field label="Profissão"><input style={gs.input} value={f.profissao} onChange={set("profissao")} /></Field>
        <Field label="RG"><input style={gs.input} value={f.rg} onChange={set("rg")} /></Field>
        <Field label="CPF"><input style={gs.input} value={f.cpf} onChange={set("cpf")} /></Field>
        <Field label="Altura"><input style={gs.input} value={f.altura} onChange={set("altura")} /></Field>
        <Field label="Peso"><input style={gs.input} value={f.peso} onChange={set("peso")} /></Field>
        <Field label="Contato de Emergência" span={2}><input style={gs.input} value={f.contato_emergencia} onChange={set("contato_emergencia")} /></Field>
        <Field label="Última Consulta Médica"><input style={gs.input} value={f.ultima_consulta_medica} onChange={set("ultima_consulta_medica")} /></Field>
        <Field label="Última Consulta Odontológica"><input style={gs.input} value={f.ultima_consulta_odonto} onChange={set("ultima_consulta_odonto")} /></Field>
        <Field label="Histórico Médico" span={2}><textarea style={gs.textarea} value={f.historico_medico} onChange={set("historico_medico")} /></Field>
        <Field label="Alergias" span={2}><textarea style={gs.textarea} value={f.alergias} onChange={set("alergias")} /></Field>
        <Field label="Medicamentos em Uso" span={2}><textarea style={gs.textarea} value={f.medicamentos} onChange={set("medicamentos")} /></Field>
        <Field label="Queixa Principal" span={2}><textarea style={gs.textarea} value={f.queixa_principal} onChange={set("queixa_principal")} /></Field>
        <Field label="Observações" span={2}><textarea style={gs.textarea} value={f.observacoes} onChange={set("observacoes")} /></Field>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:28, borderTop:`1px solid ${C.sand}`, paddingTop:24 }}>
        <button style={gs.btnOutline} onClick={onClose}>Cancelar</button>
        <button style={gs.btn} onClick={()=>onSave(f)}>Salvar Paciente</button>
      </div>
    </div>
  );
}

function PatientsPage({ patients, consultas, pagamentos, setPatients }) {
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [view,setView]=useState(null);
  const [saving,setSaving]=useState(false);

  const filtered = patients.filter(p=>
    p.nome?.toLowerCase().includes(search.toLowerCase())||
    p.celular?.includes(search)||p.cpf?.includes(search)
  );

  const save = async (data) => {
    setSaving(true);
    try {
      if(modal==="new") {
        const { data: row, error } = await supabase.from("pacientes").insert([data]).select().single();
        if(!error) setPatients(p=>[...p, row]);
      } else {
        const { error } = await supabase.from("pacientes").update(data).eq("id", modal.id);
        if(!error) setPatients(p=>p.map(x=>x.id===modal.id?{...x,...data}:x));
      }
    } finally { setSaving(false); setModal(null); }
  };

  if(view) return <PatientDetail patient={view} consultas={consultas} pagamentos={pagamentos} onBack={()=>setView(null)} onEdit={p=>{setModal(p);setView(null);}} />;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:26, fontFamily:"'Cinzel',serif", color:C.wine, fontWeight:400, marginBottom:4 }}>Pacientes</h1>
          <p style={{ color:C.textMuted, fontSize:14 }}>{patients.length} pacientes cadastrados</p>
        </div>
        <button style={gs.btn} onClick={()=>setModal("new")}>+ Novo Paciente</button>
      </div>
      <div style={{ ...gs.card, marginBottom:20 }}><SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, celular ou CPF..." /></div>
      <div style={gs.card}>
        <table style={gs.table}>
          <thead><tr>{["Paciente","Celular","Nascimento","Primeira Consulta",""].map(h=><th key={h} style={gs.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} style={{ cursor:"pointer" }} onClick={()=>setView(p)}>
                <td style={gs.td}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:C.wineAlpha, display:"flex", alignItems:"center", justifyContent:"center", color:C.wine, fontSize:14, fontWeight:600, flexShrink:0 }}>{p.nome?.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                    <div><div style={{ fontWeight:600, fontSize:15 }}>{p.nome}</div><div style={{ fontSize:12, color:C.textMuted }}>{p.profissao}</div></div>
                  </div>
                </td>
                <td style={{ ...gs.td, color:C.textMuted }}>{p.celular}</td>
                <td style={{ ...gs.td, color:C.textMuted }}>{fmtDate(p.nascimento)}</td>
                <td style={{ ...gs.td, color:C.textMuted }}>{fmtDate(p.primeira_consulta)}</td>
                <td style={gs.td}><button onClick={e=>{e.stopPropagation();setModal(p);}} style={{ ...gs.btnOutline, padding:"6px 14px", fontSize:13 }}>Editar</button></td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan={5} style={{ padding:"32px", textAlign:"center", color:C.textMuted }}>Nenhum paciente encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <Modal title={modal==="new"?"Novo Paciente":"Editar Paciente"} onClose={()=>setModal(null)} wide><PatientForm initial={modal==="new"?{}:modal} onSave={save} onClose={()=>setModal(null)} /></Modal>}
    </div>
  );
}

function PatientDetail({ patient, consultas, pagamentos, onBack, onEdit }) {
  const pConsultas = consultas.filter(c=>c.paciente_id===patient.id).sort((a,b)=>(b.data||"").localeCompare(a.data||""));
  const pPagamentos = pagamentos.filter(p=>p.paciente_id===patient.id);
  const totalPago = pPagamentos.reduce((s,p)=>s+(p.valor_pago||0),0);
  return (
    <div>
      <button style={{ ...gs.btnOutline, marginBottom:24, fontSize:13 }} onClick={onBack}>← Voltar</button>
      <div style={{ ...gs.card, background:`linear-gradient(135deg, ${C.wineDark} 0%, ${C.wine} 100%)`, color:C.white }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:600 }}>{patient.nome?.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
            <div>
              <h2 style={{ margin:0, fontSize:24, fontFamily:"'Cinzel',serif", fontWeight:400 }}>{patient.nome}</h2>
              <div style={{ marginTop:6, fontSize:14, opacity:0.8 }}>{patient.profissao} · {patient.celular}</div>
              <div style={{ marginTop:4, fontSize:13, opacity:0.65 }}>1ª consulta: {fmtDate(patient.primeira_consulta)} · {age(patient.nascimento)}</div>
            </div>
          </div>
          <button onClick={()=>onEdit(patient)} style={{ padding:"11px 24px", background:"rgba(255,255,255,0.2)", color:C.white, border:"1px solid rgba(255,255,255,0.3)", borderRadius:10, fontSize:13, cursor:"pointer" }}>Editar</button>
        </div>
      </div>
      <div style={gs.grid2}>
        <div style={gs.card}>
          <div style={gs.cardTitle}>Dados Pessoais</div>
          {[["Nascimento",`${fmtDate(patient.nascimento)} (${age(patient.nascimento)})`],["Estado Civil",patient.estado_civil],["Endereço",patient.endereco],["CPF",patient.cpf],["RG",patient.rg],["Contato Emergência",patient.contato_emergencia]].map(([k,v])=>v&&(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.ivory}`, fontSize:14 }}>
              <span style={{ color:C.textMuted }}>{k}</span><span style={{ textAlign:"right", maxWidth:"60%" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={gs.card}>
          <div style={gs.cardTitle}>Saúde</div>
          {[["Histórico",patient.historico_medico],["Alergias",patient.alergias],["Medicamentos",patient.medicamentos],["Queixa Principal",patient.queixa_principal]].map(([k,v])=>v&&(
            <div key={k} style={{ padding:"8px 0", borderBottom:`1px solid ${C.ivory}`, fontSize:14 }}>
              <div style={{ color:C.textMuted, fontSize:12, marginBottom:2 }}>{k}</div><div>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={gs.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={gs.cardTitle}>Timeline de Consultas</div>
          <div style={{ fontSize:14, color:C.wine, fontWeight:600 }}>Total pago: {fmt(totalPago)}</div>
        </div>
        {pConsultas.length===0 && <p style={{ color:C.textMuted }}>Nenhuma consulta registrada.</p>}
        {pConsultas.map((c,i)=>(
          <div key={c.id} style={{ display:"flex", gap:20, marginBottom:20 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
              <div style={{ width:12, height:12, borderRadius:"50%", background:C.gold, marginTop:4 }} />
              {i<pConsultas.length-1 && <div style={{ width:2, flex:1, background:C.sandDark, marginTop:4 }} />}
            </div>
            <div style={{ flex:1, background:C.ivory, borderRadius:12, padding:"16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontWeight:600, fontSize:15, color:C.wine }}>{c.registro}</span>
                <span style={{ color:C.textMuted, fontSize:13 }}>{fmtDate(c.data)}</span>
              </div>
              <div style={{ marginBottom:8 }}>{(c.procedimentos||[]).map(p=><span key={p} style={gs.tag()}>{p}</span>)}</div>
              {c.descricao && <p style={{ fontSize:14, color:C.textMuted, margin:0 }}>{c.descricao}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsultaForm({ initial={}, patients, onSave, onClose }) {
  const [f,setF] = useState({ registro:"",paciente_id:"",data:"",procedimentos:[],descricao:"",materiais:"",procedimentos_interesse:[],observacoes:"", ...initial });
  const set = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Field label="Nº do Registro"><input style={gs.input} value={f.registro} onChange={set("registro")} placeholder="C-001/2024" /></Field>
        <Field label="Data da Consulta"><input type="date" style={gs.input} value={f.data} onChange={set("data")} /></Field>
        <Field label="Paciente" span={2}><select style={gs.select} value={f.paciente_id} onChange={set("paciente_id")}><option value="">Selecionar paciente...</option>{patients.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></Field>
        <Field label="Procedimentos Realizados" span={2}><div style={{ background:C.cream, border:`1px solid ${C.sandDark}`, borderRadius:10, padding:16 }}><Checklist options={PROCEDIMENTOS_LIST} value={f.procedimentos||[]} onChange={v=>setF(p=>({...p,procedimentos:v}))} /></div></Field>
        <Field label="Descrição" span={2}><textarea style={gs.textarea} value={f.descricao} onChange={set("descricao")} /></Field>
        <Field label="Materiais" span={2}><textarea style={gs.textarea} value={f.materiais} onChange={set("materiais")} /></Field>
        <Field label="Procedimentos de Interesse (Lead)" span={2}><div style={{ background:C.goldAlpha, border:`1px solid ${C.goldLight}`, borderRadius:10, padding:16 }}><Checklist options={PROCEDIMENTOS_LIST} value={f.procedimentos_interesse||[]} onChange={v=>setF(p=>({...p,procedimentos_interesse:v}))} /></div></Field>
        <Field label="Observações" span={2}><textarea style={gs.textarea} value={f.observacoes} onChange={set("observacoes")} /></Field>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:28, borderTop:`1px solid ${C.sand}`, paddingTop:24 }}>
        <button style={gs.btnOutline} onClick={onClose}>Cancelar</button>
        <button style={gs.btn} onClick={()=>onSave(f)}>Salvar Consulta</button>
      </div>
    </div>
  );
}

function ConsultasPage({ consultas, patients, setConsultas }) {
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);

  const filtered = consultas.filter(c=>{
    const pac = patients.find(p=>p.id===c.paciente_id);
    return (pac?.nome||"").toLowerCase().includes(search.toLowerCase())||
      (c.registro||"").toLowerCase().includes(search.toLowerCase())||
      (c.procedimentos||[]).some(p=>p.toLowerCase().includes(search.toLowerCase()));
  }).sort((a,b)=>(b.data||"").localeCompare(a.data||""));

  const save = async (data) => {
    if(modal==="new") {
      const { data: row, error } = await supabase.from("consultas").insert([data]).select().single();
      if(!error) setConsultas(p=>[...p, row]);
    } else {
      const { error } = await supabase.from("consultas").update(data).eq("id", modal.id);
      if(!error) setConsultas(p=>p.map(x=>x.id===modal.id?{...x,...data}:x));
    }
    setModal(null);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:26, fontFamily:"'Cinzel',serif", color:C.wine, fontWeight:400, marginBottom:4 }}>Consultas</h1>
          <p style={{ color:C.textMuted, fontSize:14 }}>{consultas.length} consultas registradas</p>
        </div>
        <button style={gs.btn} onClick={()=>setModal("new")}>+ Nova Consulta</button>
      </div>
      <div style={{ ...gs.card, marginBottom:20 }}><SearchBar value={search} onChange={setSearch} placeholder="Buscar por paciente, registro ou procedimento..." /></div>
      <div style={gs.card}>
        <table style={gs.table}>
          <thead><tr>{["Registro","Paciente","Data","Procedimentos",""].map(h=><th key={h} style={gs.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(c=>{
              const pac = patients.find(p=>p.id===c.paciente_id);
              return (
                <tr key={c.id}>
                  <td style={gs.td}><span style={gs.badge}>{c.registro}</span></td>
                  <td style={{ ...gs.td, fontWeight:500 }}>{pac?.nome||"—"}</td>
                  <td style={{ ...gs.td, color:C.textMuted }}>{fmtDate(c.data)}</td>
                  <td style={gs.td}>{(c.procedimentos||[]).slice(0,3).map(p=><span key={p} style={gs.tag()}>{p}</span>)}</td>
                  <td style={gs.td}><button onClick={()=>setModal(c)} style={{ ...gs.btnOutline, padding:"6px 14px", fontSize:13 }}>Editar</button></td>
                </tr>
              );
            })}
            {filtered.length===0 && <tr><td colSpan={5} style={{ padding:"32px", textAlign:"center", color:C.textMuted }}>Nenhuma consulta encontrada.</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <Modal title={modal==="new"?"Nova Consulta":"Editar Consulta"} onClose={()=>setModal(null)} wide><ConsultaForm initial={modal==="new"?{}:modal} patients={patients} onSave={save} onClose={()=>setModal(null)} /></Modal>}
    </div>
  );
}

function PagamentoForm({ initial={}, patients, consultas, onSave, onClose }) {
  const [f,setF] = useState({ paciente_id:"",consulta_id:"",valor_pago:0,insumos:0,aluguel:0,meios:[],observacoes:"", ...initial });
  const set = k => e => setF(p=>({...p,[k]:e.target.value}));
  const lucro = (parseFloat(f.valor_pago)||0)-(parseFloat(f.insumos)||0)-(parseFloat(f.aluguel)||0);
  const pacConsultas = consultas.filter(c=>c.paciente_id===f.paciente_id);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Field label="Paciente" span={2}><select style={gs.select} value={f.paciente_id} onChange={e=>setF(p=>({...p,paciente_id:e.target.value,consulta_id:""}))}><option value="">Selecionar paciente...</option>{patients.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></Field>
        <Field label="Consulta" span={2}><select style={gs.select} value={f.consulta_id} onChange={set("consulta_id")}><option value="">Selecionar consulta...</option>{pacConsultas.map(c=><option key={c.id} value={c.id}>{c.registro} — {fmtDate(c.data)}</option>)}</select></Field>
        <Field label="Valor Pago (R$)"><input type="number" style={gs.input} value={f.valor_pago} onChange={set("valor_pago")} min={0} step={0.01} /></Field>
        <Field label="Insumos (R$)"><input type="number" style={gs.input} value={f.insumos} onChange={set("insumos")} min={0} step={0.01} /></Field>
        <Field label="Aluguel da Sala (R$)"><input type="number" style={gs.input} value={f.aluguel} onChange={set("aluguel")} min={0} step={0.01} /></Field>
        <Field label="Lucro (Calculado)"><div style={{ ...gs.input, background: lucro>=0?C.successBg:C.dangerBg, color: lucro>=0?C.success:C.danger, fontWeight:600 }}>{fmt(lucro)}</div></Field>
        <Field label="Meio de Pagamento" span={2}><div style={{ background:C.cream, border:`1px solid ${C.sandDark}`, borderRadius:10, padding:16 }}><Checklist options={MEIOS_PAGAMENTO} value={f.meios||[]} onChange={v=>setF(p=>({...p,meios:v}))} columns={3} /></div></Field>
        <Field label="Observações" span={2}><textarea style={gs.textarea} value={f.observacoes} onChange={set("observacoes")} /></Field>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:28, borderTop:`1px solid ${C.sand}`, paddingTop:24 }}>
        <button style={gs.btnOutline} onClick={onClose}>Cancelar</button>
        <button style={gs.btn} onClick={()=>onSave({...f,valor_pago:parseFloat(f.valor_pago)||0,insumos:parseFloat(f.insumos)||0,aluguel:parseFloat(f.aluguel)||0})}>Salvar Pagamento</button>
      </div>
    </div>
  );
}

function PagamentosPage({ pagamentos, patients, consultas, setPagamentos }) {
  const [modal,setModal]=useState(null);
  const totalReceita = pagamentos.reduce((s,p)=>s+(p.valor_pago||0),0);
  const totalInsumos = pagamentos.reduce((s,p)=>s+(p.insumos||0),0);
  const totalAluguel = pagamentos.reduce((s,p)=>s+(p.aluguel||0),0);
  const totalLucro = totalReceita-totalInsumos-totalAluguel;

  const save = async (data) => {
    if(modal==="new") {
      const { data: row, error } = await supabase.from("pagamentos").insert([data]).select().single();
      if(!error) setPagamentos(p=>[...p, row]);
    } else {
      const { error } = await supabase.from("pagamentos").update(data).eq("id", modal.id);
      if(!error) setPagamentos(p=>p.map(x=>x.id===modal.id?{...x,...data}:x));
    }
    setModal(null);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div><h1 style={{ fontSize:26, fontFamily:"'Cinzel',serif", color:C.wine, fontWeight:400, marginBottom:4 }}>Pagamentos</h1><p style={{ color:C.textMuted, fontSize:14 }}>{pagamentos.length} registros</p></div>
        <button style={gs.btn} onClick={()=>setModal("new")}>+ Novo Pagamento</button>
      </div>
      <div style={gs.grid4}>
        {[{l:"Receita",v:totalReceita,c:C.wine},{l:"Insumos",v:totalInsumos,c:C.textMuted},{l:"Aluguel",v:totalAluguel,c:C.textMuted},{l:"Lucro",v:totalLucro,c:C.success}].map(s=>(
          <div key={s.l} style={gs.statCard}><div style={{ ...gs.statNum, color:s.c, fontSize:20 }}>{fmt(s.v)}</div><div style={gs.statLabel}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ ...gs.card, marginTop:20 }}>
        <table style={gs.table}>
          <thead><tr>{["Paciente","Consulta","Valor","Insumos","Aluguel","Lucro","Meio",""].map(h=><th key={h} style={gs.th}>{h}</th>)}</tr></thead>
          <tbody>
            {[...pagamentos].reverse().map(pg=>{
              const pac = patients.find(p=>p.id===pg.paciente_id);
              const con = consultas.find(c=>c.id===pg.consulta_id);
              const lucro = (pg.valor_pago||0)-(pg.insumos||0)-(pg.aluguel||0);
              return (
                <tr key={pg.id}>
                  <td style={{ ...gs.td, fontWeight:500 }}>{pac?.nome||"—"}</td>
                  <td style={{ ...gs.td, color:C.textMuted }}>{con?.registro||"—"}</td>
                  <td style={gs.td}><strong style={{ color:C.wine }}>{fmt(pg.valor_pago)}</strong></td>
                  <td style={{ ...gs.td, color:C.textMuted }}>{fmt(pg.insumos)}</td>
                  <td style={{ ...gs.td, color:C.textMuted }}>{fmt(pg.aluguel)}</td>
                  <td style={gs.td}><strong style={{ color: lucro>=0?C.success:C.danger }}>{fmt(lucro)}</strong></td>
                  <td style={gs.td}>{(pg.meios||[]).map(m=><span key={m} style={gs.tag("gold")}>{m}</span>)}</td>
                  <td style={gs.td}><button onClick={()=>setModal(pg)} style={{ ...gs.btnOutline, padding:"6px 14px", fontSize:13 }}>Editar</button></td>
                </tr>
              );
            })}
            {pagamentos.length===0 && <tr><td colSpan={8} style={{ padding:"32px", textAlign:"center", color:C.textMuted }}>Nenhum pagamento ainda.</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && <Modal title={modal==="new"?"Novo Pagamento":"Editar Pagamento"} onClose={()=>setModal(null)} wide><PagamentoForm initial={modal==="new"?{}:modal} patients={patients} consultas={consultas} onSave={save} onClose={()=>setModal(null)} /></Modal>}
    </div>
  );
}

function LeadForm({ initial={}, onSave, onClose }) {
  const [f,setF] = useState({ nome:"",data_contato:"",meio_contato:"Instagram",sexo:"Feminino",celular:"",profissao:"",procedimentos_interesse:[],motivo_nao_fechar:"",nivel_interesse:"",queixa_principal:"",proximo_contato:"",observacoes:"", ...initial });
  const set = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Field label="Nome Completo" span={2}><input style={gs.input} value={f.nome} onChange={set("nome")} /></Field>
        <Field label="Data do Contato"><input type="date" style={gs.input} value={f.data_contato} onChange={set("data_contato")} /></Field>
        <Field label="Próximo Contato"><input type="date" style={gs.input} value={f.proximo_contato} onChange={set("proximo_contato")} /></Field>
        <Field label="Meio de Contato"><select style={gs.select} value={f.meio_contato} onChange={set("meio_contato")}>{MEIOS_CONTATO.map(m=><option key={m}>{m}</option>)}</select></Field>
        <Field label="Sexo"><select style={gs.select} value={f.sexo} onChange={set("sexo")}><option>Feminino</option><option>Masculino</option><option>Outro</option></select></Field>
        <Field label="Celular"><input style={gs.input} value={f.celular} onChange={set("celular")} /></Field>
        <Field label="Profissão"><input style={gs.input} value={f.profissao} onChange={set("profissao")} /></Field>
        <Field label="Nível de Interesse" span={2}><input style={gs.input} value={f.nivel_interesse} onChange={set("nivel_interesse")} placeholder="Alto / Médio / Baixo" /></Field>
        <Field label="Procedimentos de Interesse" span={2}><div style={{ background:C.cream, border:`1px solid ${C.sandDark}`, borderRadius:10, padding:16 }}><Checklist options={PROCEDIMENTOS_LIST} value={f.procedimentos_interesse||[]} onChange={v=>setF(p=>({...p,procedimentos_interesse:v}))} /></div></Field>
        <Field label="Queixa Principal" span={2}><textarea style={gs.textarea} value={f.queixa_principal} onChange={set("queixa_principal")} /></Field>
        <Field label="Motivo de não fechar agora" span={2}><textarea style={gs.textarea} value={f.motivo_nao_fechar} onChange={set("motivo_nao_fechar")} /></Field>
        <Field label="Observações" span={2}><textarea style={gs.textarea} value={f.observacoes} onChange={set("observacoes")} /></Field>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:28, borderTop:`1px solid ${C.sand}`, paddingTop:24 }}>
        <button style={gs.btnOutline} onClick={onClose}>Cancelar</button>
        <button style={gs.btn} onClick={()=>onSave(f)}>Salvar Lead</button>
      </div>
    </div>
  );
}

function LeadsPage({ leads, setLeads }) {
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const filtered = leads.filter(l=>l.nome?.toLowerCase().includes(search.toLowerCase())||l.celular?.includes(search));

  const save = async (data) => {
    if(modal==="new") {
      const { data: row, error } = await supabase.from("leads").insert([data]).select().single();
      if(!error) setLeads(p=>[...p, row]);
    } else {
      const { error } = await supabase.from("leads").update(data).eq("id", modal.id);
      if(!error) setLeads(p=>p.map(x=>x.id===modal.id?{...x,...data}:x));
    }
    setModal(null);
  };

  const nivelColor = (n) => {
    if(!n) return {};
    if(n.toLowerCase().includes("alt")) return { background:C.successBg, color:C.success };
    if(n.toLowerCase().includes("méd")||n.toLowerCase().includes("med")) return { background:C.goldAlpha, color:C.wine };
    return { background:C.dangerBg, color:C.danger };
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div><h1 style={{ fontSize:26, fontFamily:"'Cinzel',serif", color:C.wine, fontWeight:400, marginBottom:4 }}>Leads</h1><p style={{ color:C.textMuted, fontSize:14 }}>{leads.length} leads</p></div>
        <button style={gs.btn} onClick={()=>setModal("new")}>+ Novo Lead</button>
      </div>
      <div style={{ ...gs.card, marginBottom:20 }}><SearchBar value={search} onChange={setSearch} placeholder="Buscar leads..." /></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
        {filtered.map(l=>(
          <div key={l.id} style={{ ...gs.card, margin:0, cursor:"pointer" }} onClick={()=>setModal(l)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div><div style={{ fontWeight:600, fontSize:16 }}>{l.nome}</div><div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{l.meio_contato} · {fmtDate(l.data_contato)}</div></div>
              {l.nivel_interesse && <span style={{ ...nivelColor(l.nivel_interesse), padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:500 }}>{l.nivel_interesse}</span>}
            </div>
            <div>{(l.procedimentos_interesse||[]).slice(0,3).map(p=><span key={p} style={gs.tag("gold")}>{p}</span>)}</div>
            {l.proximo_contato && <div style={{ fontSize:12, color:C.textMuted, marginTop:8, borderTop:`1px solid ${C.sand}`, paddingTop:8 }}>📅 Próximo contato: <strong>{fmtDate(l.proximo_contato)}</strong></div>}
          </div>
        ))}
        {filtered.length===0 && <div style={{ gridColumn:"1/-1", padding:"32px", textAlign:"center", color:C.textMuted }}>Nenhum lead encontrado.</div>}
      </div>
      {modal && <Modal title={modal==="new"?"Novo Lead":"Editar Lead"} onClose={()=>setModal(null)} wide><LeadForm initial={modal==="new"?{}:modal} onSave={save} onClose={()=>setModal(null)} /></Modal>}
    </div>
  );
}

function Login({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState(false);
  const USERS = [
    { user: "dra.victoriaghisolfi", password: "Hannah1998." },
    { user: "gabrielandradedearaujo", password: "trophyhusband123" },
    { user: "auxiliar", password: "clinicaghisolfi26" },
  ];
  const submit = () => {
    if(USERS.some(x=>x.user===u && x.password===p)) onLogin();
    else setErr(true);
  };
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, ${C.wineDark} 0%, ${C.wine} 50%, ${C.wineLight} 100%)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.white, borderRadius:24, padding:"48px 56px", width:420, boxShadow:"0 40px 100px rgba(44,31,37,0.35)" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <img src={`data:image/png;base64,${LOGO_B64}`} alt="Logo VG" style={{ width:220, display:"block", margin:"0 auto 4px" }} />
          <h1 style={{ fontFamily:"'Cinzel',Georgia,serif", fontSize:20, color:C.wine, fontWeight:400, letterSpacing:3, margin:0 }}>CLÍNICA GHISOLFI</h1>
          <div style={{ fontSize:11, color:C.gold, letterSpacing:4, marginTop:6, textTransform:"uppercase" }}>Estética & Odontologia</div>
        </div>
        <Field label="Usuário"><input style={gs.input} value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} /></Field>
        <div style={{ marginTop:16 }}><Field label="Senha"><input type="password" style={gs.input} value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} /></Field></div>
        {err && <p style={{ color:C.danger, fontSize:13, marginTop:8, textAlign:"center" }}>Credenciais inválidas.</p>}
        <button style={{ ...gs.btn, width:"100%", marginTop:24, padding:"14px" }} onClick={submit}>Entrar</button>
      </div>
    </div>
  );
}

export default function App() {
  const [logged,setLogged]=useState(false);
  const [nav,setNav]=useState("dashboard");
  const [patients,setPatients]=useState([]);
  const [consultas,setConsultas]=useState([]);
  const [pagamentos,setPagamentos]=useState([]);
  const [leads,setLeads]=useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if(!logged) return;
    setLoading(true);
    Promise.all([
      supabase.from("pacientes").select("*").order("created_at", { ascending: false }),
      supabase.from("consultas").select("*").order("created_at", { ascending: false }),
      supabase.from("pagamentos").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
    ]).then(([p,c,pg,l]) => {
      setPatients(p.data||[]);
      setConsultas(c.data||[]);
      setPagamentos(pg.data||[]);
      setLeads(l.data||[]);
      setLoading(false);
    });
  }, [logged]);

  if(!logged) return <Login onLogin={()=>setLogged(true)} />;
  if(loading) return <LoadingScreen />;

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:"🏠" },
    { id:"pacientes", label:"Pacientes", icon:"👤" },
    { id:"consultas", label:"Consultas", icon:"📋" },
    { id:"pagamentos", label:"Pagamentos", icon:"💰" },
    { id:"leads", label:"Leads", icon:"✨" },
  ];

  const pageTitle = { dashboard:"Dashboard", pacientes:"Pacientes", consultas:"Consultas", pagamentos:"Financeiro", leads:"Leads" };

  return (
    <div style={gs.app}>
      <div style={gs.sidebar}>
        <div style={gs.logo}>
          <img src={`data:image/png;base64,${LOGO_B64}`} alt="Logo VG" style={{ width:180, display:"block", marginBottom:2 }} />
          <div style={gs.logoTitle}>CLÍNICA GHISOLFI</div>
          <div style={gs.logoSub}>ESTÉTICA & ODONTO</div>
        </div>
        <div style={{ marginTop:16 }}>
          <div style={gs.navLabel}>Menu</div>
          {navItems.map(item=>(
            <div key={item.id} style={gs.navItem(nav===item.id)} onClick={()=>setNav(item.id)}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id==="leads" && leads.length>0 && <span style={{ marginLeft:"auto", background:C.gold, color:C.white, borderRadius:20, padding:"2px 7px", fontSize:11, fontWeight:600 }}>{leads.length}</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop:"auto", padding:"0 24px" }}>
          <button onClick={()=>setLogged(false)} style={{ width:"100%", padding:"10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:13 }}>Sair</button>
        </div>
      </div>
      <div style={gs.main}>
        <div style={gs.topbar}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:18, color:C.wine, fontWeight:400 }}>{pageTitle[nav]}</div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:14, color:C.textMuted }}>{patients.length} pacientes · {consultas.length} consultas</span>
            <div style={{ width:36, height:36, borderRadius:"50%", background:C.wineAlpha, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.wine, fontWeight:600 }}>VG</div>
          </div>
        </div>
        <div style={gs.content}>
          {nav==="dashboard" && <Dashboard patients={patients} consultas={consultas} pagamentos={pagamentos} leads={leads} onNav={setNav} />}
          {nav==="pacientes" && <PatientsPage patients={patients} consultas={consultas} pagamentos={pagamentos} setPatients={setPatients} />}
          {nav==="consultas" && <ConsultasPage consultas={consultas} patients={patients} setConsultas={setConsultas} />}
          {nav==="pagamentos" && <PagamentosPage pagamentos={pagamentos} patients={patients} consultas={consultas} setPagamentos={setPagamentos} />}
          {nav==="leads" && <LeadsPage leads={leads} setLeads={setLeads} />}
        </div>
      </div>
    </div>
  );
}
