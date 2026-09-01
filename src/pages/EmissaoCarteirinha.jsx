import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { User } from 'lucide-react';
import './EmissaoCarteirinha.css'; 

export default function EmissaoCarteirinha() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnHnVhUX33mmsnUIqdFBBfAjBxGHRjn9qt5OIQPES9iYv8aWPTlxh2tTcDZJt9RFU7/exec';

  // Máscara de Telefone: (XX) 9XXXX-XXXX
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (value.length > 7) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    setTelefone(value);
  };

  const buscarEGerarPDF = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    // === TRAVAS DE SEGURANÇA ===
    const nomeTratado = nome
      .toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
      .trim();

    let telTratado = telefone.replace(/\D/g, '');
    
    if (telTratado.length === 10) {
      telTratado = telTratado.substring(0, 2) + '9' + telTratado.substring(2);
    }

    if (telTratado.length !== 11) {
      setErro('O telefone deve conter o DDD e 9 dígitos válidos.');
      setLoading(false);
      return;
    }

    try {
      const urlComParametros = `${SCRIPT_URL}?action=buscar_carteirinha&nome=${encodeURIComponent(nomeTratado)}&telefone=${encodeURIComponent(telTratado)}`;
      
      const response = await fetch(urlComParametros);
      const resultado = await response.json();

      if (resultado.status === 'sucesso') {
        await preencherBaixarPDF(resultado.dados);
      } else {
        setErro('Doador não encontrado. Verifique se os dados conferem com seu agendamento.');
      }
    } catch (error) {
      console.error(error);
      setErro('Erro de conexão com a base de dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const preencherBaixarPDF = async (dadosUsuario) => {
    const urlModelo = '/modelo-carteirinha.pdf'; 
    const existingPdfBytes = await fetch(urlModelo).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // ==========================================
    // FUNÇÃO ATUALIZADA: ALINHA O TEXTO À ESQUERDA
    // ==========================================
    const escreverTexto = (texto, centroX, yInicial, tamanho, cor = rgb(0, 0, 0), larguraMaxima = null, limiteX = null) => {
      if (!texto) return;

      const palavras = texto.split(' ');
      let linhas = [];
      let linhaAtual = '';

      // 1. Quebra o texto em linhas baseado na largura máxima permitida
      for (let i = 0; i < palavras.length; i++) {
        const testeLinha = linhaAtual === '' ? palavras[i] : linhaAtual + ' ' + palavras[i];
        const larguraTeste = helveticaBold.widthOfTextAtSize(testeLinha, tamanho);

        if (larguraMaxima && larguraTeste > larguraMaxima && linhaAtual !== '') {
          linhas.push(linhaAtual);
          linhaAtual = palavras[i];
        } else {
          linhaAtual = testeLinha;
        }
      }
      if (linhaAtual !== '') {
        linhas.push(linhaAtual);
      }

      const alturaLinha = tamanho * 1.2;
      let yAtual = yInicial;

      // Ajusta o Y inicial para cima se houver mais de uma linha, para não descer demais
      if (linhas.length > 1) {
        yAtual += (alturaLinha * (linhas.length - 1)) / 2;
      }

      // 2. Encontra a maior largura entre as linhas para definir o alinhamento à esquerda
      let maxLarguraLinha = 0;
      linhas.forEach((linha) => {
        const largura = helveticaBold.widthOfTextAtSize(linha, tamanho);
        if (largura > maxLarguraLinha) {
          maxLarguraLinha = largura;
        }
      });

      // 3. Define a posição X inicial em que TODAS as linhas vão começar (Justificado à esquerda do bloco)
      let posXInicial = centroX - (maxLarguraLinha / 2);

      // Trava de segurança: impede que a linha passe do limite máximo no eixo X do PDF
      if (limiteX && (posXInicial + maxLarguraLinha) > limiteX) {
        posXInicial = limiteX - maxLarguraLinha;
      }

      // 4. Desenha as linhas no PDF (repare que todas usam o mesmo posXInicial)
      linhas.forEach((linha) => {
        firstPage.drawText(linha, {
          x: posXInicial, 
          y: yAtual,
          size: tamanho,
          font: helveticaBold,
          color: cor,
        });
        yAtual -= alturaLinha; // Desce para a próxima linha
      });
    };

    // ==========================================
    // COORDENADAS 
    // ==========================================
    
    // Nome: Quebra a linha e alinha todas as quebras à esquerda
    escreverTexto(dadosUsuario.nome, 620, 390, 15, rgb(0, 0, 0), 280, 700); 

    // Código
    escreverTexto(dadosUsuario.codigo, 493, 340, 16); 

    // Data
    escreverTexto(dadosUsuario.data_coleta, 660, 340, 16); 

    // Tipo Sanguíneo DENTRO da gota
    if(dadosUsuario.tipo_sanguineo) {
       escreverTexto(dadosUsuario.tipo_sanguineo, 295, 330, 45, rgb(1, 1, 1)); 
    }

    // Salva e faz o Download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Carteirinha_${dadosUsuario.nome.split(' ')[0]}.pdf`;
    link.click();
  };

  return (
    <div className="carteirinha-wrapper">
      <div className="carteirinha-card">
        
        <div className="icon-header">
          <User size={36} color="#8b0000" strokeWidth={2.5} />
        </div>

        <h2>Emitir Carteirinha</h2>
        <p className="subtitle">Informe seus dados para buscar sua carteirinha.</p>
        
        <form onSubmit={buscarEGerarPDF} className="carteirinha-form">
          <div className="input-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              placeholder="Ex: João da Silva"
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Telefone (WhatsApp)</label>
            <input 
              type="tel" 
              placeholder="(XX) 9XXXX-XXXX"
              value={telefone} 
              onChange={handleTelefoneChange} 
              required 
            />
          </div>

          {erro && (
            <div className="erro-mensagem anime-shake">
              {erro}
            </div>
          )}

          <button type="submit" disabled={loading} className={`btn-submit ${loading ? 'loading' : ''}`}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Baixar Minha Carteirinha'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
