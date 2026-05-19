import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  Loader2
} from "lucide-react";

// ==========================================
// URL REAL DO SEU GOOGLE APPS SCRIPT
// ==========================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzi6Du1nekaCpAsD_2kDO8sZmDGKWsfB6GTWAd3JwVwqUtfsdBNeaPe1w_aYfILUBNQyw/exec";

export default function Agendamento() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  
  const [planilhaData, setPlanilhaData] = useState({});
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    vinculo: "Graduação",
    matricula: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [horariosDoDia, setHorariosDoDia] = useState([]);

  // Busca os dados reais da planilha ao carregar a página
  useEffect(() => {
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        setPlanilhaData(data);
        // Extrai as datas diretamente do objeto recebido
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
    }
  }, [selectedDate, planilhaData]);

  // Função auxiliar para tentar descobrir o dia da semana
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
      if (!formData.nome || !formData.idade) {
        alert("Preencha os campos obrigatórios (Nome e Idade).");
        return;
      }
      // Aqui ainda estamos usando fixo, mas podemos puxar da sua tabela de configurações depois!
      if (formData.idade < 16 || formData.idade > 69) {
        alert("A idade para doação deve ser entre 16 e 69 anos.");
        return;
      }
    }
    setStep(step + 1);
  };

  const finalizarAgendamento = async () => {
    setEnviando(true);
    
    const dadosParaEnviar = {
      ...formData,
      data: selectedDate,
      hora: selectedTime
    };

    try {
      // Enviamos como text/plain para evitar bloqueio de CORS do Google Apps Script
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(dadosParaEnviar),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      });
      
      setStep(3);
    } catch (error) {
      alert("Houve um erro ao salvar o agendamento. Tente novamente.");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-red-900 text-white p-4 shadow-md flex items-center gap-4">
        <button 
          onClick={() => navigate("/")}
          className="p-2 hover:bg-red-800 rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide uppercase">Agendamento de Doação</h1>
      </header>

      <main className="max-w-3xl mx-auto p-6 mt-6">
        
        {step < 3 && (
          <div className="flex items-center justify-center mb-10">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-red-700" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= 1 ? "bg-red-700" : "bg-gray-300"}`}>1</div>
              <span className="font-semibold hidden md:inline">Dados Pessoais</span>
            </div>
            <div className={`w-16 h-1 mx-4 ${step >= 2 ? "bg-red-700" : "bg-gray-300"}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-red-700" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= 2 ? "bg-red-700" : "bg-gray-300"}`}>2</div>
              <span className="font-semibold hidden md:inline">Data e Hora</span>
            </div>
          </div>
        )}

        {/* PASSO 1: DADOS PESSOAIS */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <User className="text-red-700" size={28} />
              <h2 className="text-2xl font-black text-gray-800">Seus Dados</h2>
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Vínculo com a UFS</label>
                  <select 
                    name="vinculo"
                    value={formData.vinculo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50"
                  >
                    <option value="Graduação">Aluno(a) de Graduação</option>
                    <option value="Pós-graduação">Aluno(a) de Pós-graduação</option>
                    <option value="Servidor">Servidor(a) / Terceirizado</option>
                    <option value="Comunidade Externa">Comunidade Externa</option>
                  </select>
                </div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 bg-gray-50"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={avancarPasso}
                className="bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-800 transition-colors flex items-center gap-2"
              >
                Próximo Passo
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: ESCOLHA DE DATA E HORA */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-red-700 mb-4" size={40} />
                <p className="text-gray-500 font-semibold">Carregando horários da planilha...</p>
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
                            ? "border-red-700 bg-red-50 text-red-900" 
                            : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
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
                            disabled={lotado}
                            onClick={() => setSelectedTime(horario.hora)}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                              lotado 
                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60" 
                                : isSelected
                                  ? "border-red-700 bg-red-700 text-white shadow-md transform scale-105"
                                  : "border-gray-200 hover:border-red-400 bg-white text-gray-800"
                            }`}
                          >
                            <span className="font-black text-lg">{horario.hora}</span>
                            <span className={`text-xs mt-1 ${isSelected ? "text-red-100" : lotado ? "text-gray-400" : "text-green-600 font-semibold"}`}>
                              {lotado ? "Lotado" : `${vagasRestantes} vaga${vagasRestantes > 1 ? 's' : ''}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-4 flex justify-between pt-6 border-t">
              <button 
                disabled={enviando}
                onClick={() => setStep(1)}
                className="text-gray-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Voltar
              </button>

              <button 
                disabled={!selectedDate || !selectedTime || enviando}
                onClick={finalizarAgendamento}
                className={`font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 ${
                  !selectedDate || !selectedTime || enviando
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-red-700 text-white hover:bg-red-800 hover:scale-105 active:scale-95"
                }`}
              >
                {enviando ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </button>
            </div>
          </div>
        )}

        {/* PASSO 3: SUCESSO */}
        {step === 3 && (
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center animate-in zoom-in-95 duration-500 border border-green-100">
            <CheckCircle className="mx-auto text-green-500 mb-6" size={80} />
            <h2 className="text-3xl font-black text-gray-800 mb-2">Agendamento Confirmado!</h2>
            <p className="text-gray-600 mb-8">
              Obrigado por se voluntariar, <strong className="text-red-700">{formData.nome.split(' ')[0]}</strong>! Seu horário foi reservado com sucesso.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 inline-block text-left mb-8 w-full max-w-sm mx-auto shadow-inner">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-4 border-b pb-2">Detalhes da Doação</p>
              <div className="space-y-3 font-medium text-gray-800">
                <p className="flex justify-between">
                  <span className="text-gray-500">Data:</span> 
                  <span>{selectedDate}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Horário:</span> 
                  <span className="font-bold text-red-700">{selectedTime}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Local:</span> 
                  <span className="text-right">Didática 6 - UFS</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/")}
                className="bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-800 transition-colors"
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