
import React from 'react';
import { WizardData, ReportResponse } from '../types';

interface ReportViewProps {
  report: ReportResponse;
  data: WizardData;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, data, onReset }) => {
  const handleShare = () => {
    const text = `¡Mirad el plan de despedida para ${data.location}! 🚀 Score: ${report.score}/100.`;
    const fullMessage = `${text} \n\nPlanea la tuya aquí: ${window.location.origin}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppAgencia = () => {
    const message = encodeURIComponent(
      `¡Socorro! Soy ${data.name} y necesito ayuda para organizar una despedida en ${data.location} para ${data.peopleCount} personas. ¡Ayudadme!`
    );
    window.open(`https://wa.me/34678288284?text=${message}`, '_blank');
  };

  const handleHerramientas = () => {
    // Aquí puedes cambiar la URL por tu enlace real de Google Drive
    window.open('https://drive.google.com/drive/folders/TU_ID_DE_DRIVE_AQUI', '_blank');
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-600';
    if (score > 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  // Función sencilla para procesar negritas dentro de una línea
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const formattedReport = report.reportText
    .split('\n')
    .map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-4" />;

      // Cabeceras (Secciones principales)
      if (trimmedLine.match(/^(\d+\.\s+)?\*\*(.*)\*\*/) || trimmedLine.startsWith('###')) {
        return (
          <h3 key={i} className="text-lg font-black text-pink-700 mt-6 mb-2 border-l-4 border-pink-500 pl-3 uppercase tracking-wide">
            {trimmedLine.replace(/\*\*/g, '').replace(/^#+\s*/, '').replace(/^\d+\.\s+/, '')}
          </h3>
        );
      }

      // Elementos de lista
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return (
          <li key={i} className="ml-5 list-none relative mb-1.5 pl-2 text-base md:text-lg">
            <span className="absolute -left-5 text-pink-500 font-bold">•</span>
            <span className="text-gray-800">{formatText(trimmedLine.substring(1).trim())}</span>
          </li>
        );
      }

      // Párrafos normales
      return (
        <p key={i} className="mb-3 text-gray-800 leading-relaxed text-base md:text-lg">
          {formatText(trimmedLine)}
        </p>
      );
    });

  return (
    <div className="animate-fade-in pb-16">
      <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 overflow-hidden relative border-t-8 border-pink-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center p-6 rounded-full bg-pink-50 border-2 border-pink-100 mb-4 shadow-sm">
            <span className={`text-5xl font-black ${getScoreColor(report.score)}`}>
              {report.score}<span className="text-xl">/100</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Vuestro Diagnóstico Final</h2>
        </div>

        <div className="report-content">
           {formattedReport}
        </div>

        <div className="mt-12 space-y-3">
          <button onClick={handleShare} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
            <i className="fab fa-whatsapp"></i> PASAR AL GRUPO
          </button>

          <button onClick={handleHerramientas} className="w-full flex items-center justify-center gap-3 bg-slate-700 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <i className="fas fa-toolbox"></i> HERRAMIENTAS ORGANIZADOR
          </button>

          <button onClick={handleWhatsAppAgencia} className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl active:scale-105 border-b-4 border-emerald-700">
            <i className="fab fa-whatsapp text-2xl"></i> PEDIR SOCORRO AGENCIA
          </button>

          <button onClick={onReset} className="w-full text-gray-400 text-xs py-4 font-bold hover:text-pink-500 transition-colors uppercase tracking-widest">
            <i className="fas fa-trash-alt mr-2"></i> BORRAR Y HUIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
