import { useNavigate } from "react-router-dom";
import {
  Droplet,
  Calendar,
  MapPin,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  AtSign,
  IdCard, // <-- Ícone novo
  Download
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import imagemCelulas from "../assets/fundo-depoimento.svg";
import logoCampanha from "../assets/logo-campanha.png";
import logoHemose from "../assets/logo-hemose.svg";
import fotoIrandi from "../assets/irandi.png";
import fotoCamillaDev from "../assets/camilla-dev.png";
import fotoMatheusImg from "../assets/matheus.png"
import bolsaImg from "../assets/bolsa.svg";
import bracoImg from "../assets/braco.svg";
import foto1Img from "../assets/foto1.svg";
import foto2Img from "../assets/foto2.svg";
import foto3Img from "../assets/foto3.svg";
import foto4Img from "../assets/foto4.svg";
import foto5Img from "../assets/foto5.png";
import foto6Img from "../assets/foto6.png";
import foto7Img from "../assets/foto7.png";
import foto8Img from "../assets/foto8.png";
import foto9Img from "../assets/foto9.png";
import foto10Img from "../assets/foto10.png";
import foto11Img from "../assets/foto11.png";

import fotoJoseImg from "../assets/jose-lucas.svg";
import fotoCamillaImg from "../assets/camilla.svg";

const fotoMatheus = fotoMatheusImg;
const bannersData = [
  {
    text: "Agora você pode",
    mainText: "AGENDAR ON-LINE",
    subText: "a sua doação de sangue",
    bgImage: foto2Img, // <--- Foto no fundo
  },
  {
    text: "Você pode ser",
    mainText: "O TIPO CERTO DE ALGUÉM",
    subText: "Doe sangue, salve vidas!",
    bgImage: fotoJoseImg, // <--- Foto no fundo
  },
  {
    text: "10 Anos de Campanha",
    mainText: "O AMOR ESTÁ NA VEIA",
    subText: "Venha celebrar doando vida",
    bgImage: bolsaImg, // <--- Foto no fundo
  },
  {
    text: "Seja a esperança",
    mainText: "CADASTRE SUA MEDULA",
    subText: "Um ato rápido que salva vidas",
    bgImage: fotoCamillaImg, // <--- Foto no fundo
  },
];

const galeriaCampanha = {
  foto2: foto2Img,
  foto3: foto3Img,
  foto4: foto4Img,
  foto5: foto5Img,
  foto6: foto6Img,
  foto7: foto7Img,
  foto8: foto8Img,
  foto9: foto9Img,
  foto10: foto10Img,
  foto11: foto11Img,
};

const fotoJose = fotoJoseImg;
const fotoCamilla = fotoCamillaImg;

// LOOP DOS BANNERS
const extendedBanners = [
  ...bannersData,
  ...bannersData,
  ...bannersData,
];

export default function Home() {
  const navigate = useNavigate();
  const loopRef = useRef(null);
  const animationRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [hideHeaderLogos, setHideHeaderLogos] = useState(false);

  // LOOP DOS BANNERS
  useEffect(() => {
    const loopContainer = loopRef.current;
    let position = 0;
    const scroll = () => {
      position += 1.8;
      const maxScroll = window.innerWidth * bannersData.length;
      if (position >= maxScroll) {
        position = 0;
      }
      if (loopContainer) {
        loopContainer.style.transform = `translateX(-${position}px)`;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };
    animationRef.current = requestAnimationFrame(scroll);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // LÓGICA DO CARROSSEL DA SEÇÃO SOBRE
  const fotosSobre = Object.values(galeriaCampanha).filter(Boolean);
  const [fotoSobreAtiva, setFotoSobreAtiva] = useState(0);

  useEffect(() => {
    if (fotosSobre.length <= 1) return;
    
    // Altere 3500 para mudar a velocidade de transição (3500 = 3.5 segundos)
    const timerSobre = setInterval(() => {
      setFotoSobreAtiva((prev) => (prev + 1) % fotosSobre.length);
    }, 3500);

    return () => clearInterval(timerSobre);
  }, [fotosSobre.length]);

  // HEADER SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setHideHeaderLogos(true);
      } else {
        setHideHeaderLogos(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden scroll-smooth">
      {/* HEADER*/}
      <header
        className={`
          fixed top-0 left-0 w-full py-1
          flex justify-between items-center
          z-50 px-6 md:px-12
          transition-all duration-500
          ${
            hideHeaderLogos
              ? "-translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100 bg-gradient-to-b from-black/70 to-transparent"
          }
        `}
      >
        <div className="flex items-center gap-4">
          <div
            className={`
              flex items-center gap-3
              transition-all duration-500
              ${
                hideHeaderLogos
                  ? "opacity-0 -translate-y-10 scale-75"
                  : "opacity-100 translate-y-0 scale-100"
              }
            `}
          >
            <img
              src={logoCampanha}
              alt="Logo Campanha"
              className="w-20 h-20 object-contain"
            />
            <img
              src={logoHemose}
              alt="Logo Hemose"
              className="w-40 h-16 object-contain"
            />
          </div>
        </div>
        <nav className="hidden md:flex gap-6 font-semibold text-white text-sm">
          <a href="#" className="hover:text-red-200 transition">
            Início
          </a>
          <a href="#perguntas" className="hover:text-red-200 transition">
            Quem pode doar
          </a>
          <a href="#sobre" className="hover:text-red-200 transition">
            O Evento
          </a>
          <a href="#contato" className="hover:text-red-200 transition">
            Contato
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative h-[550px] md:h-[650px] bg-red-900 overflow-hidden w-full">
        <div
          ref={loopRef}
          className="absolute inset-y-0 left-0 flex h-full"
          style={{ width: `${extendedBanners.length * 100}vw` }}
        >
          {extendedBanners.map((banner, index) => (
            <div
              key={index}
              className="w-screen h-full flex items-center justify-center p-6 md:p-24 flex-shrink-0 relative overflow-hidden"
            >
              {/* IMAGEM DE FUNDO */}
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-top z-0"
                style={{ backgroundImage: `url(${banner.bgImage})` }}
              />
              
              {/* CAMADA ESCURA (OVERLAY) PARA AS LETRAS FICAREM VISÍVEIS */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 to-red-900/80 z-0" />
              
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-0" />

              {/* CONTEÚDO (Centralizado, sem a imagem lateral) */}
              <div className="max-w-6xl w-full flex flex-col items-center justify-center gap-6 z-10 relative">
                <div className="w-full text-center text-white flex flex-col items-center justify-center">
                  <h2 className="text-2xl md:text-4xl font-semibold mb-2 drop-shadow-md">
                    {banner.text}
                  </h2>
                  <div className="bg-white text-red-800 py-2 px-5 inline-block rounded shadow-2xl transform -skew-x-6 mb-3">
                    <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter skew-x-6">
                      {banner.mainText}
                    </h2>
                  </div>
                  <h3 className="text-xl md:text-3xl font-medium opacity-95 drop-shadow-md">
                    {banner.subText}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTÃO */}
        <div className="absolute bottom-10 left-0 w-full z-30 flex justify-center items-center">
          <button
            onClick={() => navigate("/agendamento")}
            className="bg-white text-red-700 font-black text-lg md:text-2xl py-4 md:py-5 px-10 md:px-14 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border-4 border-white/50 bg-clip-padding"
          >
            REALIZAR AGENDAMENTO
            <span className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center">
              ➔
            </span>
          </button>
        </div>

      </section>
          {/* =========================================
          BANNER CHAMATIVO DA CARTEIRINHA
          ========================================= */}
      <section className="bg-gradient-to-r from-red-50 to-white border-y border-red-100 py-12 px-6 md:px-12 relative overflow-hidden">
        {/* Ícone gigante de fundo para dar charme */}
        <Droplet className="absolute -right-16 -top-10 text-red-100 w-80 h-80 opacity-40 rotate-12 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Ícone com animação de pulso */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-red-800/30 animate-[bounce_3s_infinite]">
              <IdCard className="text-white w-10 h-10" />
            </div>
            
            <div className="mt-2 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-black text-red-800 uppercase tracking-tight mb-2">
                Já fez a sua Tipagem Sanguínea?
              </h2>
              <p className="text-gray-600 md:text-lg max-w-xl">
                Se você já participou da coleta, a sua <b>Carteirinha</b> já está pronta! Baixe agora mesmo em formato PDF.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/carteirinha")}
            className="group bg-red-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-xl hover:bg-red-800 hover:shadow-red-800/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 shrink-0"
          >
            <Download size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
            BAIXAR CARTEIRINHA
          </button>

        </div>
      </section>
      {/* ========================================= */}
      {/* FAQ*/}
      <section
        id="perguntas"
        className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative"
      >
        <div className="md:col-span-7 space-y-4 z-10">
          <h2 className="text-3xl font-black text-red-700 uppercase tracking-tight mb-6">
            Perguntas Frequentes
          </h2>
          {[
            {
              pergunta: "Quem pode doar?",
              resposta: (
                <>
                  <p>• Pessoas entre 16 a 69 anos (menores de 18 apenas com autorização);</p>
                  <p>• Peso mínimo de 50 kg e boa saúde;</p>
                  <p>• Apresentar documento oficial com foto.</p>
                </>
              ),
            },
            {
              pergunta: "Precisa estar em jejum?",
              resposta: (
                <p>
                  Não. É importante estar alimentado e hidratado, evitando comidas gordurosas
                  nas 4 horas antes e álcool nas últimas 12 horas.
                </p>
              ),
            },
            {
              pergunta: "Quantas vidas uma doação pode salvar?",
              resposta: (
                <p>
                  Até quatro pessoas, pois o sangue é separado em diferentes componentes.
                </p>
              ),
            },
            {
              pergunta: "Como funciona o cadastro de medula óssea?",
              resposta: (
                <p>
                  São retirados apenas 4 mL de sangue. A amostra é processada e 
                  incluída no banco de dados nacional (REDOME). Se houver compatibilidade, 
                  o doador será contatado para confirmar o interesse.
                </p>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white"
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full p-4 text-left font-bold text-white flex justify-between items-center transition-colors ${
                  openFaq === index ? "bg-red-800" : "bg-red-700"
                }`}
              >
                <span>{item.pergunta}</span>
                {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openFaq === index && (
                <div className="p-5 bg-red-50 text-gray-800 border-t border-red-200 text-sm md:text-base">
                  {item.resposta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* INFO */}
        <div className="md:col-span-5 bg-red-700 text-white p-6 md:p-8 rounded-2xl shadow-xl space-y-6 z-10">
          <h2 className="text-3xl font-black uppercase tracking-tight border-b border-white/20 pb-2">
            Informações Rápidas
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Calendar size={24} />
              <div>
                <p className="font-bold text-lg">18 e 19 de Junho de 2026</p>
                <p className="text-sm opacity-85">Quinta e Sexta-feira</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin size={24} />
              <div>
                <p className="font-bold text-lg">Didática 6, UFS</p>
                <p className="text-sm opacity-85">Universidade Federal de Sergipe</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={24} />
              <div>
                <p className="font-bold text-lg">Horários:</p>
                <p className="text-sm">18/06: 09h às 17h</p>
                <p className="text-sm">19/06: 08h às 16h</p>
              </div>
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center">
            <Heart className="mx-auto fill-white animate-bounce" size={24} />
            <p className="text-xs md:text-sm opacity-90 mt-2">
              Em comemoração aos 10 anos da campanha “O Amor Está na Veia”.
            </p>
          </div>
        </div>
      </section>

{/* SOBRE */}
      <section id="sobre" className="bg-[#5c0606] text-white py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* LADO ESQUERDO: CARROSSEL DE FOTOS COM EFEITO DE FOCO PROFISSONAL */}
          <div className="md:col-span-6 w-full">
            <div className="relative h-96 md:h-[450px] w-full bg-red-950/60 rounded-3xl border border-white/10 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] flex items-center justify-center group">
              
              {/* Camada de Gradiente Sutil para dar Profundidade à Imagem */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#5c0606]/60 via-transparent to-black/20 z-20 pointer-events-none" />
              
              {fotosSobre.length > 0 ? (
                fotosSobre.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`Foto da campanha ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ease-in-out ${
                      index === fotoSobreAtiva 
                        ? 'opacity-100 z-10 scale-100 blur-0 rotate-0' 
                        : 'opacity-0 z-0 scale-105 blur-sm pointer-events-none'
                    }`}
                  />
                ))
              ) : (
                <span className="text-xs text-white/30 text-center">[ NENHUMA FOTO DISPONÍVEL ]</span>
              )}

              {/* Indicadores de navegação (Bolinhas modernas com brilho temático) */}
              {fotosSobre.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-30 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                  {fotosSobre.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setFotoSobreAtiva(index)}
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        index === fotoSobreAtiva 
                          ? 'bg-red-500 w-6 shadow-[0_0_12px_rgba(239,68,68,0.9)] border border-white/20' 
                          : 'bg-white/40 w-2 hover:bg-white/80'
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LADO DIREITO: TEXTO SOBRE A CAMPANHA */}
          <div className="md:col-span-6 space-y-6 text-center md:text-right">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">Sobre a Campanha</h2>
              <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded inline-block mt-2">
                O Amor Está na Veia
              </div>
            </div>
            <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-200">
              <p>
                A campanha “O Amor Está na Veia” nasceu no Grupo de Pesquisa em Hematologia da Universidade Federal de Sergipe com o objetivo de incentivar a doação de sangue e o cadastro de doadores 
                de medula óssea, aproximando a universidade da sociedade por meio da solidariedade.
              </p>
              <p>
                Ao longo dos anos, a campanha se consolidou como uma importante ação extensionista, 
                levando o Hemose até a UFS e mobilizando estudantes, servidores e a população do entorno em favor da vida.
              </p>
              <p className="border-t border-white/10 pt-4 text-white font-medium">
                Em 2026, a campanha celebra sua 10ª edição, reafirmando seu compromisso com a 
                promção da doação voluntária, em alusão ao Dia Mundial do Doador de Sangue (14/06).
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* DEPOIMENTOS*/}
      <section className="relative bg-gradient-to-b from-gray-50 to-red-50/30 py-16 px-6 md:px-12 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
            <img
              src={imagemCelulas}
              alt="Fundo decorativo"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="bg-[#4c0505] text-white font-black text-xl md:text-2xl px-12 py-3 rounded-full shadow-md tracking-wider uppercase mb-12 text-center">
            Depoimentos
          </div>
          
          {/* Grid alterado para 3 colunas no desktop (md:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* DEPOIMENTO 1 - JOSÉ LUCAS */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full">
              <div className="h-80 md:h-[420px] bg-gray-200 flex items-center justify-center">
                {fotoJose ? (
                  <img
                    src={fotoJose}
                    alt="José Lucas"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-xs text-gray-400">[ FOTO JOSÉ LUCAS ]</span>
                )}
              </div>
              <div className="bg-[#8a0f0f] text-white p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold opacity-85 mb-3">
                    José Lucas
                  </p>
                  <p className="text-xs opacity-75 mb-4 leading-tight">
                    Doutorando do Grupo de Pesquisa em Hematologia (UFS)
                  </p>
                  <p className="italic text-sm leading-relaxed">
                    “Eu vejo a doação de sangue como um gesto de solidariedade e cidadania. Cada vez que doo, sinto que 
                    ofereço esperança e contribuo para salvar vidas. É rápido, seguro e muito significativo."
                  </p>
                </div>
              </div>
            </div>

            {/* DEPOIMENTO 2 - CAMILLA */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full">
              <div className="h-80 md:h-[420px] bg-gray-200 flex items-center justify-center">
                {fotoCamilla ? (
                  <img
                    src={fotoCamilla}
                    alt="Camilla"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-xs text-gray-400">[ FOTO CAMILLA ]</span>
                )}
              </div>
              <div className="bg-[#8a0f0f] text-white p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold opacity-85 mb-3">
                    Camilla
                  </p>
                  <p className="text-xs opacity-75 mb-4 leading-tight">
                    Estudante de graduação
                  </p>
                  <p className="italic text-sm leading-relaxed">
                    “Para mim, doar sangue é um ato de coragem e empatia.
                    Cada doação representa a chance de transformar vidas de forma simples e concreta.”
                  </p>
                </div>
              </div>
            </div>

            {/* DEPOIMENTO 3 - MATHEUS (NOVO) */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full">
              <div className="h-80 md:h-[420px] bg-gray-200 flex items-center justify-center">
                {typeof fotoMatheus !== 'undefined' && fotoMatheus ? (
                  <img
                    src={fotoMatheus}
                    alt="Matheus Silva Assis"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-xs text-gray-400">[ FOTO MATHEUS SILVA ]</span>
                )}
              </div>
              <div className="bg-[#8a0f0f] text-white p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold opacity-85 mb-3">
                    Matheus Silva Assis
                  </p>
                  <p className="text-xs opacity-75 mb-4 leading-tight">
                    Residente HU-UFS
                  </p>
                  <p className="italic text-sm leading-relaxed">
                    “Ter a experiência de participar da campanha e convidar aos alunos para serem doadores mostra o lado humanizado da saúde, o cuidado e a sensibilidade ao outro. Porque doar sangue vai além de um simples ato de doação de sangue, é um ato de amor, ser um herói na vida do outro para quem necessita.”
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* BOTÃO AGENDAMENTO FINAL */}
      <section className="bg-gradient-to-r from-red-700 via-red-800 to-red-950 py-14 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex justify-center">
          <button
            onClick={() => navigate("/agendamento")}
            className="
              bg-gradient-to-r from-red-600 to-red-900 border-2 border-white/20 text-white font-black text-3xl md:text-5xl px-10 md:px-16 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 tracking-tight
            "
          >
            Agende sua doação!
          </button>
        </div>
      </section>

      {/* RODAPÉ */}
      <section id="contato" className="bg-[#4c0505] text-white pt-12 pb-8 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-xs md:text-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-40 h-16 flex items-center justify-center">
                <img src={logoCampanha} alt="Logo Campanha" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-black tracking-tight text-lg uppercase">
                  Campanha “O Amor Está na Veia”
                </span>
                <span className="text-[11px] text-white/60 tracking-wide">
                  Há 10 anos captando doadores de sangue e de medula óssea na Universidade Federal de Sergipe
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span>hematox2017@hotmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <AtSign size={16} />
                <span>@hematologia.ufs</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="shrink-0 mt-1" />
                <span>
                  Grupo de Pesquisa em Hematologia – Departamento de Farmácia (DFA-UFS), Av. Marechal Rondon, s/n, Jardim Rosa Elze, São Cristóvão/SE.
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-54 h-20 flex items-center justify-center">
                {logoHemose ? (
                  <img src={logoHemose} alt="Logo Hemose" className="w-full h-full object-contain" />
                ) : (
                  <Droplet size={40} className="fill-white" />
                )}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-black tracking-tight text-lg uppercase">
                  Fundação de Saúde Parreiras Horta
                </span>
                <span className="text-[11px] text-white/60 tracking-wide">
                  Cuidando da saúde em cada detalhe
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span>ouvidoria.fsph@fsph.se.gov.br</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>+55 79 3234-6010</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} />
                <span>Av. Prof. José Bonifácio Fortes Neto, 400, Aracaju/SE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full">
            <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10 w-full max-w-[340px] shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <img src={fotoIrandi} alt="Irandi Silva" className="w-full h-full object-cover" />
              </div>
              <div className="leading-tight text-left">
                <p className="text-xs text-white/50 uppercase tracking-wider">
                  Engenharia de Computação
                </p>
                <h3 className="font-black text-lg text-white">Irandi Silva</h3>
                <p className="text-sm text-white/70">Desenvolvimento da página</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10 w-full max-w-[340px] shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <img src={fotoCamillaDev} alt="Camilla Menezes" className="w-full h-full object-cover" />
              </div>
              <div className="leading-tight text-left">
                <p className="text-xs text-white/50 uppercase tracking-wider">Farmácia</p>
                <h3 className="font-black text-lg text-white">Camilla Menezes</h3>
                <p className="text-sm text-white/70">Design UX e UI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-red-950 text-white/50 text-xs text-center py-6 border-t border-red-900/40">
        © 2026 Campanha O Amor Está na Veia - UFS & HEMOSE. Todos os direitos reservados.
      </footer>
    </div>
  );
}