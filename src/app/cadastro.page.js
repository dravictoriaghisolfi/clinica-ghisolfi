'use client'
import { useState } from "react";
import { supabase } from "../../components/supabase";

const C = {
  wine: "#6B2D3E", wineLight: "#8B3D52", wineDark: "#4A1E2B",
  gold: "#C9A84C", goldLight: "#E8C97A", goldAlpha: "rgba(201,168,76,0.15)",
  cream: "#FAF7F2", ivory: "#F5F0E8", sand: "#EDE7DC", sandDark: "#D4CAB8",
  text: "#2C1F25", textMuted: "#7A6570", white: "#FFFFFF",
  success: "#2D6A4F", successBg: "#E8F5EE",
};

const DOENCAS = [
  "Asma/Bronquite","Urticária/Erupções cutâneas","Convulsão/Epilepsia","Diabetes",
  "Hepatite/Doença hepática","Psoríase","Patologia tireoidiana","Vitiligo",
  "Tuberculose","Câncer","HIV/AIDS","Cardiopatia","Hipertensão","Doença renal",
  "Acne","Tabagismo","Etilismo","Bruxismo","Gestante/Amamentando",
  "Problemas de coagulação","Distúrbios neurológicos","Intolerância/Alergia à lactose",
  "Uso de anticoncepcional","Queloide/Cicatrização excessiva"
];

const fontBody = "'Inter', -apple-system, sans-serif";
const fontTitle = "'Playfair Display', Georgia, serif";

const s = {
  page: { minHeight:"100vh", background:C.cream, fontFamily:fontBody, color:C.text, padding:"24px 16px 60px" },
  container: { maxWidth:680, margin:"0 auto" },
  header: { textAlign:"center", marginBottom:28 },
  title: { fontFamily:fontTitle, fontSize:24, color:C.wine, fontWeight:700, letterSpacing:2, textTransform:"uppercase", margin:0 },
  subtitle: { fontSize:12, color:C.gold, letterSpacing:3, textTransform:"uppercase", marginTop:6 },
  intro: { fontSize:14, color:C.textMuted, marginTop:14, lineHeight:1.6 },
  card: { background:C.white, borderRadius:16, border:`1px solid ${C.sand}`, padding:"24px 20px", marginBottom:18 },
  sectionTitle: { fontFamily:fontTitle, fontSize:16, color:C.wine, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:16, paddingBottom:10, borderBottom:`1px solid ${C.sand}` },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  field: { marginBottom:16 },
  label: { display:"block", fontFamily:fontTitle, fontSize:12, letterSpacing:1.5, color:C.textMuted, marginBottom:6, textTransform:"uppercase", fontWeight:600 },
  input: { width:"100%", padding:"13px 14px", border:`1px solid ${C.sandDark}`, borderRadius:10, fontSize:15, background:C.cream, color:C.text, fontFamily:fontBody, outline:"none", boxSizing:"border-box" },
  textarea: { width:"100%", padding:"13px 14px", border:`1px solid ${C.sandDark}`, borderRadius:10, fontSize:15, background:C.cream, color:C.text, fontFamily:fontBody, outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box" },
  select: { width:"100%", padding:"13px 14px", border:`1px solid ${C.sandDark}`, borderRadius:10, fontSize:15, background:C.cream, color:C.text, fontFamily:fontBody, outline:"none", cursor:"pointer", boxSizing:"border-box" },
  checklistGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px" },
  checkLabel: (checked) => ({ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, color: checked?C.wine:C.textMuted, userSelect:"none" }),
  btn: { width:"100%", padding:"16px", background:C.wine, color:C.white, border:"none", borderRadius:12, fontSize:15, fontWeight:700, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", fontFamily:fontBody, marginTop:8 },
  successBox: { textAlign:"center", padding:"60px 24px" },
};

const initialState = {
  nome:"", nascimento:"", sexo:"Feminino", estado_civil:"Solteiro(a)",
  endereco:"", celular:"", instagram:"", rg:"", cpf:"", profissao:"",
  altura:"", peso:"", contato_emergencia:"",
  ultima_consulta_medica:"", ultima_consulta_odonto:"",
  tratamento_medico:"", anestesia_historico:"", medicamentos:"", alergias:"",
  cremes_locoes:"", problemas_pele:"", procedimento_anterior:"",
  queixa_principal:"", historico_medico:"", observacoes:"", doencas:[],
};

export default function Cadastro() {
  const [f, setF] = useState(initialState);
  const [doencas, setDoencas] = useState([]);
  const [status, setStatus] = useState("form"); // form | saving | done | error
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const toggleDoenca = (d) => {
    setDoencas(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);
  };

  const submit = async () => {
    if (!f.nome.trim()) { alert("Por favor, preencha seu nome completo."); return; }
    setStatus("saving");
    const payload = {
      ...f,
      doencas,
      primeira_consulta: new Date().toISOString().slice(0,10),
      status: "novo",
      observacoes: (f.observacoes ? f.observacoes + "\n\n" : "") + "📱 Ficha preenchida pelo paciente via formulário online.",
    };
    const { error } = await supabase.from("pacientes").insert([payload]);
    if (error) { console.error(error); setStatus("error"); }
    else setStatus("done");
  };

  if (status === "done") {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.successBox}>
            <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
            <h1 style={s.title}>Ficha enviada com sucesso!</h1>
            <p style={s.intro}>Obrigado por preencher seus dados. Nossa equipe já tem acesso às suas informações e entrará em contato em breve.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Clínica Ghisolfi</h1>
          <div style={s.subtitle}>Ficha Cadastral · Estética & Odontologia</div>
          <p style={s.intro}>
            Preencha o formulário abaixo com atenção. Essas informações são essenciais para a sua segurança
            e para um atendimento personalizado. Todos os dados são confidenciais.
          </p>
        </div>

        {/* DADOS PESSOAIS */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Dados Pessoais</div>
          <div style={s.field}><label style={s.label}>Nome completo</label><input style={s.input} value={f.nome} onChange={set("nome")} /></div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Data de nascimento</label><input type="date" style={s.input} value={f.nascimento} onChange={set("nascimento")} /></div>
            <div style={s.field}><label style={s.label}>Sexo</label>
              <select style={s.select} value={f.sexo} onChange={set("sexo")}>
                <option>Feminino</option><option>Masculino</option><option>Outro</option>
              </select>
            </div>
          </div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Estado civil</label>
              <select style={s.select} value={f.estado_civil} onChange={set("estado_civil")}>
                <option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option>
              </select>
            </div>
            <div style={s.field}><label style={s.label}>Profissão</label><input style={s.input} value={f.profissao} onChange={set("profissao")} /></div>
          </div>
          <div style={s.field}><label style={s.label}>Endereço completo</label><input style={s.input} value={f.endereco} onChange={set("endereco")} /></div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>RG</label><input style={s.input} value={f.rg} onChange={set("rg")} /></div>
            <div style={s.field}><label style={s.label}>CPF</label><input style={s.input} value={f.cpf} onChange={set("cpf")} /></div>
          </div>
        </div>

        {/* CONTATO */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Contato</div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Celular / WhatsApp</label><input style={s.input} value={f.celular} onChange={set("celular")} placeholder="(11) 99999-9999" /></div>
            <div style={s.field}><label style={s.label}>Instagram</label><input style={s.input} value={f.instagram} onChange={set("instagram")} placeholder="@seuperfil" /></div>
          </div>
          <div style={s.field}><label style={s.label}>Contato de emergência (nome e telefone)</label><input style={s.input} value={f.contato_emergencia} onChange={set("contato_emergencia")} /></div>
        </div>

        {/* SAUDE GERAL */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Histórico de Saúde</div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Altura</label><input style={s.input} value={f.altura} onChange={set("altura")} placeholder="1,65m" /></div>
            <div style={s.field}><label style={s.label}>Peso</label><input style={s.input} value={f.peso} onChange={set("peso")} placeholder="60kg" /></div>
          </div>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Última consulta médica (aproximadamente)</label><input style={s.input} value={f.ultima_consulta_medica} onChange={set("ultima_consulta_medica")} placeholder="Ex: Janeiro/2025" /></div>
            <div style={s.field}><label style={s.label}>Última consulta odontológica (aproximadamente)</label><input style={s.input} value={f.ultima_consulta_odonto} onChange={set("ultima_consulta_odonto")} placeholder="Ex: Março/2024" /></div>
          </div>
          <div style={s.field}><label style={s.label}>Está sob tratamento médico no momento? Se sim, qual?</label><textarea style={s.textarea} value={f.tratamento_medico} onChange={set("tratamento_medico")} /></div>
          <div style={s.field}><label style={s.label}>Já passou por cirurgia ou aplicação de anestesia (geral ou local)? Quando e qual?</label><textarea style={s.textarea} value={f.anestesia_historico} onChange={set("anestesia_historico")} /></div>
          <div style={s.field}><label style={s.label}>Está tomando algum medicamento atualmente? Quais?</label><textarea style={s.textarea} value={f.medicamentos} onChange={set("medicamentos")} /></div>
          <div style={s.field}><label style={s.label}>Possui alguma alergia (medicamentos, alimentos, materiais)?</label><textarea style={s.textarea} value={f.alergias} onChange={set("alergias")} /></div>
          <div style={s.field}><label style={s.label}>Histórico médico geral (doenças ou tratamentos relevantes)</label><textarea style={s.textarea} value={f.historico_medico} onChange={set("historico_medico")} /></div>
        </div>

        {/* CONDIÇÕES DE SAÚDE - CHECKLIST */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Condições de Saúde</div>
          <p style={{ fontSize:13, color:C.textMuted, marginTop:-8, marginBottom:14 }}>Selecione todas as opções que se aplicam a você:</p>
          <div style={s.checklistGrid}>
            {DOENCAS.map(d => {
              const checked = doencas.includes(d);
              return (
                <label key={d} style={s.checkLabel(checked)}>
                  <input type="checkbox" checked={checked} onChange={()=>toggleDoenca(d)} style={{ accentColor:C.wine, width:17, height:17, cursor:"pointer", flexShrink:0 }} />
                  <span>{d}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ESTETICA */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Sobre o Tratamento</div>
          <div style={s.field}><label style={s.label}>Utiliza cremes, ácidos ou loções faciais atualmente? Quais?</label><textarea style={s.textarea} value={f.cremes_locoes} onChange={set("cremes_locoes")} /></div>
          <div style={s.field}><label style={s.label}>Possui problemas de pele (acne, dermatite, sensibilidade, etc.)?</label><textarea style={s.textarea} value={f.problemas_pele} onChange={set("problemas_pele")} /></div>
          <div style={s.field}><label style={s.label}>Já realizou algum procedimento estético anteriormente? Qual e quando?</label><textarea style={s.textarea} value={f.procedimento_anterior} onChange={set("procedimento_anterior")} /></div>
          <div style={s.field}><label style={s.label}>Qual a sua principal queixa ou objetivo com o tratamento?</label><textarea style={s.textarea} value={f.queixa_principal} onChange={set("queixa_principal")} /></div>
          <div style={s.field}><label style={s.label}>Observações adicionais</label><textarea style={s.textarea} value={f.observacoes} onChange={set("observacoes")} /></div>
        </div>

        {status === "error" && <p style={{ color:"#8B2D2D", textAlign:"center", marginBottom:12 }}>Ocorreu um erro ao enviar. Por favor, tente novamente.</p>}
        <button style={s.btn} onClick={submit} disabled={status==="saving"}>
          {status==="saving" ? "Enviando..." : "Enviar Ficha Cadastral"}
        </button>
      </div>
    </div>
  );
}