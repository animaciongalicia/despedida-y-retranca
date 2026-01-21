
import React from 'react';
import { WizardData, ReportResponse } from '../types';

interface ReportViewProps {
  report: ReportResponse;
  data: WizardData;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, data, onReset }) => {
  const copyToClipboard = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      alert("¡Resumen copiado! Pégalo donde quieras.");
    } catch (err) {
      console.error("Clipboard failed:", err);
    }
  };

  const handleShare = () => {
    const text = `¡Mirad el plan de despedida que nos han montado para ${data.location}! 🚀 Score: ${report.score}/100.`;
    const url = window.location.origin;
    const fullMessage = `${text} \n\nPlanea la tuya aquí: ${url}`;
    
    // URL universal para compartir en WhatsApp (abre selector de chat)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppAgencia = () => {
    const message = encodeURIComponent(
      `¡Socorro! Soy ${data.name} y necesito ayuda para organizar una despedida en ${data.location} para ${data.peopleCount} personas. Mi nivel de locura deseado es ${data.crazyLevel}. ¡Ayudadme antes de que sea tarde!`
    );
    // WhatsApp de la agencia
    window.open(`https://wa.me/34678288284?text=${message}`, '_blank');
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-600';
    if (score > 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const formattedReport = report.reportText
    .split('\n')
    .map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-3" />;

      // Match markdown-style bold headers: **Header** or 1. **Header**
      if (trimmedLine.match(/^(\d+\.\s+)?\*\*(.*)\*\*/)) {
        return (
          <h3 key={i} className="text-2xl font-black text-pink-600 mt-8 mb-3 border-l-4 border-pink-500 pl-3 leading-tight uppercase tracking-tight">
            {trimmedLine.replace(/\*\*/g, '').replace(/^\d+\.\s+/, '')}
          </h3>
        );
      }

      // Match list items
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return (
          <li key={i} className="ml-5 list-none relative mb-2 pl-2">
            <span className="absolute -left-5 text-pink-500 font-bold">•</span>
            <span className="font-medium text-gray-700">{trimmedLine.substring(1).trim()}</span>
          </li>
        );
      }

      // Regular text
      return (
        <p key={i} className="mb-3 text-gray-700 leading-relaxed font-normal">
          {trimmedLine.replace(/\*\*/g, '')}
        </p>
      );
    });

  return (
    <div className="animate-fade-in pb-16">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 overflow-hidden relative border-t-[12px] border-pink-500">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fas fa-certificate text-[12rem] text-pink-500 rotate-12"></i>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center p-8 rounded-full bg-gradient-to-br from-pink-50 to-white border-4 border-pink-100 mb-6 shadow-xl relative z-10">
            <span className={`text-7xl font-black ${getScoreColor(report.score)} tracking-tighter`}>
              {report.score}<span className="text-3xl">/100</span>
            </span>
            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Nivel de Despedida</div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 leading-tight">Vuestro Diagnóstico Final</h2>
          <p className="text-pink-500 font-bold italic mt-2 text-lg">"Porque un marrón compartido es menos marrón"</p>
        </div>

        <div className="text-gray-800 text-lg md:text-xl">
           {formattedReport}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4">
          <button
            onClick={handleShare}
            className="group flex items-center justify-center gap-4 bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95"
          >
            <i className="fab fa-whatsapp text-xl group-hover:rotate-12 transition-transform"></i>
            PASAR AL GRUPO
          </button>

          <button
            onClick={() => window.open('https://drive.google.com/file/d/1mdN1yLzH2vitNZtNMX18YCoCfPN4phCa/view?usp=sharing', '_blank')}
            className="flex items-center justify-center gap-4 bg-gray-50 text-gray-600 py-5 rounded-3xl font-bold text-lg hover:bg-gray-100 transition-all border-2 border-gray-100 active:scale-95"
          >
            <i className="fas fa-lightbulb text-pink-400"></i>
            GUÍA DE SUPERVIVENCIA
          </button>

          <button
            onClick={handleWhatsAppAgencia}
            className="group flex items-center justify-center gap-4 bg-emerald-500 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl hover:shadow-emerald-200 active:scale-105 border-b-4 border-emerald-700"
          >
            <i className="fab fa-whatsapp text-3xl group-hover:scale-110 transition-transform"></i>
            PEDIR SOCORRO AGENCIA
          </button>

          <button
            onClick={onReset}
            className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm py-4 font-black hover:text-pink-500 transition-colors uppercase tracking-[0.2em]"
          >
            <i className="fas fa-trash-alt"></i>
            BORRAR TODO Y HUIR
          </button>
        </div>
      </div>
      
      <div className="mt-10 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
        <p>Retranca Gallega &bull; Certificada &bull; Cero Filtros</p>
      </div>
    </div>
  );
};

export default ReportView;
