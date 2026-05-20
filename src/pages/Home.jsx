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
  } from "lucide-react";

  import { useEffect, useRef, useState } from "react";
 

import imagemCelulas from "../assets/fundo-depoimento.svg";
import logoCampanha from "../assets/logo-campanha.svg";
import logoHemose from "../assets/logo-hemose.svg";

import bolsaImg from "../assets/bolsa.svg";
import bracoImg from "../assets/braco.svg";

import foto1Img from "../assets/foto1.svg";
import foto2Img from "../assets/foto2.svg";
import foto3Img from "../assets/foto3.svg";
import foto4Img from "../assets/foto4.svg";

import fotoJoseImg from "../assets/jose-lucas.svg";
import fotoCamillaImg from "../assets/camilla.svg";

  // ==========================================
  // BANNERS DO TOPO
  // ==========================================
  const bannersData = [
    {
      text: "Agora você pode",
      mainText: "AGENDAR ON-LINE",
      subText: "a sua doação de sangue",
      image: bolsaImg,
    },
    {
      text: "Você pode ser",
      mainText: "O TIPO CERTO DE ALGUÉM",
      subText: "Doe sangue, salve vidas!",
      image: bracoImg,
    },
  ];

  const galeriaCampanha = {
  foto1: foto1Img,
  foto2: foto2Img,
  foto3: foto3Img,
  foto4: foto4Img,
};

const fotoJose = fotoJoseImg;
const fotoCamilla = fotoCamillaImg;


  // ==========================================
  // LOOP DOS BANNERS
  // ==========================================
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

  // NOVO STATE
  const [hideHeaderLogos, setHideHeaderLogos] =
    useState(false);

  // ==========================================
  // LOOP DOS BANNERS
  // ==========================================
  useEffect(() => {
    const loopContainer = loopRef.current;

    let position = 0;

    const scroll = () => {
      position += 1.2;

      const maxScroll =
        window.innerWidth *
        bannersData.length;

      if (position >= maxScroll) {
        position = 0;
      }

      if (loopContainer) {
        loopContainer.style.transform = `translateX(-${position}px)`;
      }

      animationRef.current =
        requestAnimationFrame(scroll);
    };

    animationRef.current =
      requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, []);

  // NOVO USEEFFECT
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setHideHeaderLogos(true);
      } else {
        setHideHeaderLogos(false);
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(
      openFaq === index ? null : index
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden scroll-smooth">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header
        className={`
          fixed top-0 left-0 w-full p-4
          flex justify-between items-center
          z-50 px-6 md:px-12
          transition-all duration-500
          ${
            hideHeaderLogos
              ? "bg-red-900/95 shadow-xl backdrop-blur-md"
              : "bg-gradient-to-b from-black/50 to-transparent"
          }
        `}
      >
        <div className="flex items-center gap-4">

          {/* LOGOS */}
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
              className="w-14 h-14 object-contain"
            />

            <img
              src={logoHemose}
              alt="Logo Hemose"
              className="w-40 h-16 object-contain"
            />
          </div>
        </div>

        <nav className="hidden md:flex gap-6 font-semibold text-white text-sm">
          <a
            href="#"
            className="hover:text-red-200 transition"
          >
            Início
          </a>

          <a
            href="#perguntas"
            className="hover:text-red-200 transition"
          >
            Quem pode doar
          </a>

          <a
            href="#sobre"
            className="hover:text-red-200 transition"
          >
            O Evento
          </a>

          <a
            href="#contato"
            className="hover:text-red-200 transition"
          >
            Contato
          </a>
        </nav>
      </header>

        {/* ==========================================
            HERO
        ========================================== */}
        <section className="relative h-[550px] md:h-[650px] bg-red-900 overflow-hidden w-full">
          <div
            ref={loopRef}
            className="absolute inset-y-0 left-0 flex h-full"
            style={{
              width: `${extendedBanners.length * 100}vw`,
            }}
          >
            {extendedBanners.map(
              (banner, index) => (
                <div
                  key={index}
                  className="w-screen h-full flex items-center justify-center p-6 md:p-24 bg-gradient-to-r from-red-700 to-red-950 flex-shrink-0 relative"
                >
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-6 z-10">
                    <div className="flex-1 text-center md:text-left text-white mt-12 md:mt-0">
                      <h2 className="text-2xl md:text-4xl font-semibold mb-2">
                        {banner.text}
                      </h2>

                      <div className="bg-white text-red-700 py-2 px-5 inline-block rounded shadow-2xl transform -skew-x-6 mb-3">
                        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter skew-x-6">
                          {banner.mainText}
                        </h2>
                      </div>

                      <h3 className="text-xl md:text-3xl font-medium opacity-95">
                        {banner.subText}
                      </h3>
                    </div>

                    <div className="flex-1 flex justify-center items-center h-[250px] md:h-[400px]">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="max-h-full object-contain animate-pulse"
                        />
                      ) : (
                        <div className="w-48 h-48 md:w-72 md:h-72 bg-red-500/20 rounded-full border-4 border-white/10 flex items-center justify-center text-white/40 text-xs text-center p-4">
                          [ Espaço para imagem ]
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* BOTÃO */}
          <div className="absolute bottom-10 left-0 w-full z-30 flex justify-center items-center">
            <button
              onClick={() =>
                navigate("/agendamento")
              }
              className="bg-white text-red-700 font-black text-lg md:text-2xl py-4 md:py-5 px-10 md:px-14 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
            >
              REALIZAR AGENDAMENTO

              <span className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center">
                ➔
              </span>
            </button>
          </div>
        </section>

        {/* ==========================================
            FAQ
        ========================================== */}
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
                    <p>
                      • Pessoas entre 16 a 69 anos (menores de 18 apenas com autorização);
                    </p>

                    <p>
                      • Peso mínimo de 50 kg e boa saúde;
                    </p>

                    <p>
                      • Apresentar documento oficial com foto.
                    </p>
                  </>
                ),
              },
              {
                pergunta:
                  "Precisa estar em jejum?",
                resposta: (
                  <p>
                    Não. É importante estar
                    alimentado e hidratado,
                    evitando comidas gordurosas
                    nas 4 horas antes e álcool
                    nas últimas 12 horas.
                  </p>
                ),
              },
              {
                pergunta:
                  "Quantas vidas uma doação pode salvar?",
                resposta: (
                  <p>
                    Até quatro pessoas, pois o
                    sangue é separado em
                    diferentes componentes.
                  </p>
                ),
              },
              {
                pergunta:
                  "Como funciona o cadastro de medula óssea?",
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
                  onClick={() =>
                    toggleFaq(index)
                  }
                  className={`w-full p-4 text-left font-bold text-white flex justify-between items-center transition-colors ${
                    openFaq === index
                      ? "bg-red-800"
                      : "bg-red-700"
                  }`}
                >
                  <span>
                    {item.pergunta}
                  </span>

                  {openFaq === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
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
                  <p className="font-bold text-lg">
                    18 e 19 de Junho de 2026
                  </p>

                  <p className="text-sm opacity-85">
                    Quinta e Sexta-feira
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={24} />

                <div>
                  <p className="font-bold text-lg">
                    Didática 6, UFS
                  </p>

                  <p className="text-sm opacity-85">
                    Universidade Federal de
                    Sergipe
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={24} />

                <div>
                  <p className="font-bold text-lg">
                    Horários:
                  </p>

                  <p className="text-sm">
                    18/06: 09h às 17h
                  </p>

                  <p className="text-sm">
                    19/06: 08h às 16h
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center">
              <Heart
                className="mx-auto fill-white animate-bounce"
                size={24}
              />

              <p className="text-xs md:text-sm opacity-90 mt-2">
                Em comemoração aos 10 anos da
                campanha “O Amor Está na
                Veia”.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            SOBRE
        ========================================== */}
        <section
          id="sobre"
          className="bg-[#5c0606] text-white py-16 px-6 md:px-12"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <div className="grid grid-cols-2 gap-3">
                {Object.values(
                  galeriaCampanha
                ).map((foto, index) => (
                  <div
                    key={index}
                    className="h-52 bg-red-950/40 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center p-2"
                  >
                    {foto ? (
                      <img
                        src={foto}
                        alt={`Foto ${
                          index + 1
                        }`}
                       className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-xs text-white/30 text-center">
                        [ FOTO {index + 1} ]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6 space-y-6 text-center md:text-right">
              <div>
                <h2 className="text-4xl font-black uppercase">
                  Sobre a Campanha
                </h2>

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
                  Em 2026, a campanha celebra sua sua 10ª edição, reafirmando seu compromisso com a 
                  promoção da doação voluntária, em alusão ao Dia Mundial do Doador de Sangue (14/06).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            DEPOIMENTOS
        ========================================== */}
        <section className="relative bg-gradient-to-b from-gray-50 to-red-50/30 py-16 px-6 md:px-12 overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10">
            {/* FUNDO DECORATIVO */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* JOSÉ */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full">
                <div className="h-80 md:h-[420px] bg-gray-200 flex items-center justify-center">
                  {fotoJose ? (
                    <img
                      src={fotoJose}
                      alt="José Lucas"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      [ FOTO JOSÉ LUCAS ]
                    </span>
                  )}
                </div>

                <div className="bg-[#8a0f0f] text-white p-6 flex-1">
                  <p className="text-sm opacity-75 mb-3">
                    José Lucas,
                    doutorando do Grupo de
                    Pesquisa em Hematologia
                    (UFS)
                  </p>

                  <p className="italic text-sm md:text-base">
                    “Eu vejo a doação de sangue como um gesto de solidariedade e cidadania. Cada vez que doo, sinto que 
                    ofereço esperança e contribuo para salvar vidas. É rápido, seguro e muito significativo.
                  </p>
                </div>
              </div>

              {/* CAMILLA */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full">
                <div className="h-80 md:h-[420px] bg-gray-200 flex items-center justify-center">
                  {fotoCamilla ? (
                    <img
                      src={fotoCamilla}
                      alt="Camilla"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      [ FOTO CAMILLA ]
                    </span>
                  )}
                </div>

                <div className="bg-[#8a0f0f] text-white p-6 flex-1 flex flex-col justify-center">
                  <p className="text-sm opacity-75 mb-3">
                    Camilla, estudante de
                    graduação
                  </p>

                  <p className="italic text-sm md:text-base">
                    “Para mim, doar sangue é um ato de coragem e empatia.
                    Cada doação representa a chance de transformar vidas de forma simples e concreta.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

  {/* ==========================================
      BOTÃO AGENDAMENTO FINAL
  ========================================== */}
  <section className="bg-gradient-to-r from-red-700 via-red-800 to-red-950 py-14 px-6 md:px-12">
    <div className="max-w-5xl mx-auto flex justify-center">
      <button
        onClick={() => navigate("/agendamento")}
        className="
          bg-gradient-to-r
          from-red-600
          to-red-900
          border-2
          border-white/20
          text-white
          font-black
          text-3xl
          md:text-5xl
          px-10
          md:px-16
          py-5
          rounded-full
          shadow-2xl
          hover:scale-105
          active:scale-95
          transition-all
          duration-300
          tracking-tight
        "
      >
        Agende sua doação!
      </button>
    </div>
  </section>

        {/* ==========================================
            RODAPÉ
        ========================================== */}
        <section
          id="contato"
          className="bg-[#4c0505] text-white pt-12 pb-8 px-6 md:px-12"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-xs md:text-sm">
            {/* COLUNA 1 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* LOGO CAMPANHA */}
                <div className="w-36 h-16 flex items-center justify-center">
                    <img
                      src={logoCampanha}
                      alt="Logo Campanha"
                      className="w-full h-full object-contain"
                    />
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="font-black tracking-tight text-lg uppercase">
                    Campanha “O Amor Está na
                    Veia”
                  </span>

                  <span className="text-[11px] text-white/60 tracking-wide">
                    Há 10 anos captando
                    doadores de sangue e de
                    medula óssea na
                    Universidade Federal de
                    Sergipe
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Mail size={16} />

                  <span>
                    hematoufs2017@hotmail.com
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <AtSign size={16} />

                  <span>
                    @hematologia.ufs
                  </span>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin size={16} className="shrink-0 mt-1" />

                  <span>
                    Grupo de Pesquisa em Hematologia – Departamento de Farmácia (DFA-UFS), Av. Marechal Rondon, s/n, Jardim Rosa Elze, São Cristóvão/SE.
                  </span>
                </div>
              </div>
            </div>

            {/* COLUNA 2 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* LOGO HEMOSE */}
                <div className="w-54 h-20 flex items-center justify-center">
                  {logoHemose ? (
                    <img
                      src={logoHemose}
                      alt="Logo Hemose"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Droplet
                      size={40}
                      className="fill-white"
                    />
                  )}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="font-black tracking-tight text-lg uppercase">
                    Fundação de Saúde
                    Parreiras Horta
                  </span>

                  <span className="text-[11px] text-white/60 tracking-wide">
                    Cuidando da saúde em cada
                    detalhe
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Mail size={16} />

                  <span>
                    ouvidoria.fsph@fsph.se.gov.br
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} />

                  <span>
                    +55 79 3234-6010
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} />

                  <span>
                    Av. Prof. José Bonifácio
                    Fortes Neto, 400,
                    Aracaju/SE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-red-950 text-white/50 text-xs text-center py-6 border-t border-red-900/40">
          © 2026 Campanha O Amor Está na
          Veia - UFS & HEMOSE. Todos os
          direitos reservados.
        </footer>
      </div>
    );
  }