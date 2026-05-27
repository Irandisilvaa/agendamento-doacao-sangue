import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  ArrowLeft, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  Loader2,
  FileText,
  Download,
  AlertCircle,
  Phone,
  Clock4
} from "lucide-react";

// ==========================================
// URL REAL DO SEU GOOGLE APPS SCRIPT
// ==========================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykZ9i3fWicSdh8eAnC1t-9EsGl5ph5UtSVWCT_82QeZ0FfHprEVxtNYP-hbG3WaE51/exec";

export default function Agendamento() {
  const navigate = useNavigate();
  
  // Agora temos 4 passos: 1(Dados), 2(Horário), 3(Revisão), 4(Sucesso)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  
  const [planilhaData, setPlanilhaData] = useState({});
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);

  // Adicionado o campo whatsapp no estado inicial
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    vinculo: "Graduação",
    matricula: "",
    whatsapp: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isWaitlist, setIsWaitlist] = useState(false); // Controle da Lista de Espera
  const [horariosDoDia, setHorariosDoDia] = useState([]);

  useEffect(() => {
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        setPlanilhaData(data);
        const datas = Object.keys(data).map(dataString => ({
          data: dataString,
          diaSemana: obterDiaSemana(dataString)
        }));
        setDiasDisponiveis(datas);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar planilha:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setHorariosDoDia(planilhaData[selectedDate] || []);
      setSelectedTime(null);
      setIsWaitlist(false);
    }
  }, [selectedDate, planilhaData]);

  const obterDiaSemana = (dataStr) => {
    const [dia, mes, ano] = dataStr.split('/');
    if(!dia || !mes || !ano) return "Data";
    const dataObj = new Date(`${ano}-${mes}-${dia}T12:00:00`);
    return dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const avancarPasso = () => {
    if (step === 1) {
      if (!formData.nome || !formData.idade || !formData.whatsapp) {
        alert("Preencha os campos obrigatórios (Nome, Idade e WhatsApp).");
        return;
      }
      if (formData.idade < 16 || formData.idade > 69) {
        alert("A idade para doação deve ser entre 16 e 69 anos.");
        return;
      }
    }

    // Alerta de confirmação extra se for lista de espera no passo 2
    if (step === 2 && isWaitlist) {
      const confirmaEspera = window.confirm(
        "Este horário não está mais disponível.\n\nDeseja entrar na LISTA DE ESPERA? Entraremos em contato via WhatsApp caso surja uma vaga."
      );
      if (!confirmaEspera) return;
    }

    setStep(step + 1);
  };

  const finalizarAgendamento = async () => {
    setEnviando(true);
    
    // Adicionamos a flag de waitlist para o envio
    const dadosParaEnviar = {
      ...formData,
      data: selectedDate,
      hora: selectedTime,
      isWaitlist: isWaitlist
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(dadosParaEnviar),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      });
      
      setStep(4); // Vai para a tela de Sucesso
    } catch (error) {
      alert("Houve um erro ao salvar o agendamento. Tente novamente.");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12">
      <header className="bg-gradient-to-r from-red-900 to-red-800 text-white p-4 shadow-md flex items-center gap-4">
        <button 
          onClick={() => navigate("/")}
          className="p-2 hover:bg-white/20 rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide uppercase">Agendamento de Doação</h1>
      </header>

      <main className="max-w-3xl mx-auto p-6 mt-6">
        
        {/* PROGRESS BAR */}
        {step < 4 && (
          <div className="flex items-center justify-center mb-10">
            {/* Passo 1 */}
            <div className={`flex flex-col items-center gap-2 ${step >= 1 ? "text-red-700" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors ${step >= 1 ? "bg-red-700" : "bg-gray-300"}`}>1</div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden md:block">Dados</span>
            </div>
            
            <div className={`w-12 md:w-24 h-1 rounded-full mx-2 ${step >= 2 ? "bg-red-700" : "bg-gray-200"}`}></div>
            
            {/* Passo 2 */}
            <div className={`flex flex-col items-center gap-2 ${step >= 2 ? "text-red-700" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors ${step >= 2 ? "bg-red-700" : "bg-gray-300"}`}>2</div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden md:block">Horário</span>
            </div>

            <div className={`w-12 md:w-24 h-1 rounded-full mx-2 ${step >= 3 ? "bg-red-700" : "bg-gray-200"}`}></div>

            {/* Passo 3 */}
            <div className={`flex flex-col items-center gap-2 ${step >= 3 ? "text-red-700" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors ${step >= 3 ? "bg-red-700" : "bg-gray-300"}`}>3</div>
              <span className="text-xs font-semibold uppercase tracking-wider hidden md:block">Revisão</span>
            </div>
          </div>
        )}

        {/* PASSO 1: DADOS PESSOAIS */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <User className="text-red-700" size={28} />
              <h2 className="text-2xl font-black text-gray-800">Seus Dados Pessoais</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input 
                  type="text" 
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Maria da Silva"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Idade *</label>
                  <input 
                    type="number" 
                    name="idade"
                    value={formData.idade}
                    onChange={handleInputChange}
                    placeholder="Ex: 22"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp (com DDD) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="(79) 99999-9999"
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Vínculo com a UFS</label>
                  <select 
                    name="vinculo"
                    value={formData.vinculo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50 transition-all"
                  >
                    <option value="Graduação">Aluno(a) de Graduação</option>
                    <option value="Pós-graduação">Aluno(a) de Pós-graduação</option>
                    <option value="Servidor">Servidor(a) / Terceirizado</option>
                    <option value="Comunidade Externa">Comunidade Externa</option>
                  </select>
                </div>

                {formData.vinculo !== "Comunidade Externa" && (
                  <div className="animate-in fade-in">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Matrícula / SIAPE (Opcional)</label>
                    <input 
                      type="text" 
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      placeholder="Sua matrícula da UFS"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={avancarPasso}
                className="bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-800 transition-colors flex items-center gap-2"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: ESCOLHA DE DATA E HORA */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-red-700 mb-4" size={40} />
                <p className="text-gray-500 font-semibold">Carregando horários disponíveis...</p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b pb-2">
                    <CalendarIcon className="text-red-700" size={24} />
                    <h2 className="text-xl font-black text-gray-800">Escolha o Dia</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {diasDisponiveis.map((dia) => (
                      <button
                        key={dia.data}
                        onClick={() => setSelectedDate(dia.data)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          selectedDate === dia.data 
                            ? "border-red-700 bg-red-50 text-red-900 shadow-md transform scale-[1.02]" 
                            : "border-gray-200 hover:border-red-300 hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <p className="font-black text-lg">{dia.data}</p>
                        <p className="text-sm opacity-80 capitalize">{dia.diaSemana}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 mb-4 border-b pb-2">
                      <Clock className="text-red-700" size={24} />
                      <h2 className="text-xl font-black text-gray-800">Escolha o Horário</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {horariosDoDia.map((horario) => {
                        const vagasRestantes = horario.vagasTotais - horario.vagasOcupadas;
                        const lotado = vagasRestantes <= 0;
                        const isSelected = selectedTime === horario.hora;

                        return (
                          <button
                            key={horario.hora}
                            onClick={() => {
                              setSelectedTime(horario.hora);
                              setIsWaitlist(lotado);
                            }}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? (lotado ? "border-yellow-600 bg-yellow-600 text-white shadow-md transform scale-105" : "border-red-700 bg-red-700 text-white shadow-md transform scale-105")
                                : (lotado ? "border-yellow-200 bg-yellow-50 text-yellow-800 hover:border-yellow-400" : "border-gray-200 hover:border-red-400 bg-white text-gray-800")
                            }`}
                          >
                            <span className="font-black text-lg">{horario.hora}</span>
                            <span className={`text-xs mt-1 text-center leading-tight ${isSelected ? "text-white opacity-90" : lotado ? "text-yellow-700 font-bold" : "text-green-600 font-bold"}`}>
                              {lotado ? "Lotado (Espera)" : `${vagasRestantes} vaga${vagasRestantes > 1 ? 's' : ''}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Alerta de Lista de Espera caso selecione um horário lotado */}
                    {isWaitlist && (
                       <div className="mt-4 bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-lg text-sm flex items-start gap-2">
                         <AlertCircle className="shrink-0 mt-0.5 text-yellow-700" size={18} />
                         <p>
                           <strong>Atenção:</strong> Este horário já atingiu o limite de agendamentos. Ao continuar, você será adicionado(a) à <strong>Lista de Espera</strong>.
                         </p>
                       </div>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="mt-4 flex justify-between pt-6 border-t">
              <button 
                onClick={() => setStep(1)}
                className="text-gray-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Voltar
              </button>

              <button 
                disabled={!selectedDate || !selectedTime}
                onClick={avancarPasso}
                className={`font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 ${
                  !selectedDate || !selectedTime
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : isWaitlist 
                      ? "bg-yellow-600 text-white hover:bg-yellow-700 hover:scale-105"
                      : "bg-red-700 text-white hover:bg-red-800 hover:scale-105"
                }`}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: REVISÃO E CONFIRMAÇÃO */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <FileText className="text-red-700" size={28} />
              <h2 className="text-2xl font-black text-gray-800">Revise seu Agendamento</h2>
            </div>

            {!isWaitlist ? (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 mb-6 text-orange-800 text-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p>
                  Por favor, confira os dados abaixo. Se estiver tudo certo, clique em <strong>"Confirmar Agendamento"</strong> para finalizar sua reserva.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 flex items-start gap-3 mb-6 text-yellow-900 text-sm">
                <Clock4 className="shrink-0 mt-0.5 text-yellow-700" size={20} />
                <p>
                  Você está prestes a entrar na <strong>LISTA DE ESPERA</strong> para este horário. Nós entraremos em contato com você pelo WhatsApp <strong>{formData.whatsapp}</strong> caso alguém cancele.
                </p>
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border mb-8 ${isWaitlist ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Doador(a)</p>
                <p className="font-semibold text-gray-800 text-lg">{formData.nome}</p>
                <p className="text-sm text-gray-600">{formData.idade} vagas • {formData.vinculo}</p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1"><Phone size={14}/> {formData.whatsapp}</p>
                {formData.matricula && <p className="text-sm text-gray-600">Matrícula: {formData.matricula}</p>}
              </div>
              
              <div className="md:border-l md:border-gray-300 md:pl-6">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                  {isWaitlist ? "Data da Espera" : "Data e Local"}
                </p>
                <p className="font-semibold text-gray-800 text-lg">{selectedDate}</p>
                <p className={`font-black text-xl ${isWaitlist ? "text-yellow-700" : "text-red-700"}`}>{selectedTime}</p>
                <p className="text-sm text-gray-600 mt-1">Didática 6 - UFS</p>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <button 
                disabled={enviando}
                onClick={() => setStep(2)}
                className="text-gray-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Voltar e Editar
              </button>

              <button 
                disabled={enviando}
                onClick={finalizarAgendamento}
                className={`font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 ${
                  enviando
                    ? "opacity-70 cursor-not-allowed" 
                    : "hover:scale-105 active:scale-95"
                } ${isWaitlist ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-red-700 text-white hover:bg-red-800"}`}
              >
                {enviando ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processando...
                  </>
                ) : isWaitlist ? (
                  "Entrar na Lista de Espera"
                ) : (
                  "Confirmar Agendamento"
                )}
              </button>
            </div>
          </div>
        )}

        {/* PASSO 4: SUCESSO E COMPROVANTE */}
        {step === 4 && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center">
            
            {/* CABEÇALHO SUCESSO NORMAL VS ESPERA */}
            <div className="bg-white p-8 rounded-t-2xl shadow-xl border-b-2 border-dashed border-gray-200 text-center w-full max-w-lg relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 ${isWaitlist ? "bg-yellow-500" : "bg-green-500"}`}></div>
              
              {isWaitlist ? (
                <>
                  <Clock4 className="mx-auto text-yellow-500 mb-4 mt-2" size={70} />
                  <h2 className="text-3xl font-black text-gray-800 mb-2">Lista de Espera!</h2>
                  <p className="text-gray-600 mb-2">
                    Tudo certo, <strong className="text-yellow-700">{formData.nome.split(' ')[0]}</strong>. Você está na nossa lista de reserva.
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle className="mx-auto text-green-500 mb-4 mt-2" size={70} />
                  <h2 className="text-3xl font-black text-gray-800 mb-2">Confirmado!</h2>
                  <p className="text-gray-600 mb-2">
                    Obrigado por salvar vidas, <strong className="text-red-700">{formData.nome.split(' ')[0]}</strong>!
                  </p>
                </>
              )}
            </div>

            <div 
              id="comprovante-pdf" 
              className="bg-white p-8 rounded-b-2xl shadow-xl w-full max-w-lg relative"
            >
              <div className="text-center border-b pb-6 mb-6">
                <h3 className="uppercase tracking-widest text-red-800 font-black text-xl mb-1">O Amor Está na Veia</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  {isWaitlist ? "Comprovante de Espera" : "Comprovante de Agendamento"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nome do Doador</p>
                  <p className="font-bold text-gray-800 text-lg uppercase">{formData.nome}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Data</p>
                    <p className="font-bold text-gray-800">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Horário</p>
                    <p className={`font-black text-xl ${isWaitlist ? "text-yellow-600" : "text-red-700"}`}>{selectedTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Local da Campanha</p>
                  <p className="font-bold text-gray-800">Didática 6 - Universidade Federal de Sergipe (UFS)</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg mt-4">
                  {isWaitlist ? (
                    <p className="text-xs text-gray-600 leading-relaxed font-medium text-center">
                      Fique de olho no seu <strong>WhatsApp</strong>. Entraremos em contato caso surja uma vaga neste dia e horário!
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 leading-relaxed font-medium text-center">
                      Tire um print desta tela para apresentar junto com um <strong>documento oficial com foto</strong> no dia da doação.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full max-w-lg mt-8">
              <button 
                onClick={() => navigate("/")}
                className="w-full bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-red-800 transition-colors flex items-center justify-center"
              >
                Voltar ao Início
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}