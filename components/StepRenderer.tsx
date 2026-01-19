
import React from 'react';
import { WizardData, Step } from '../types';
import { 
  PAIN_POINTS_OPTIONS, 
  BENEFITS_OPTIONS, 
  CRAZY_LEVELS, 
  PLAN_TYPES, 
  LOCATIONS,
  FUNNY_QUESTION_OPTIONS
} from '../constants';

interface StepRendererProps {
  currentStep: Step;
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepRenderer: React.FC<StepRendererProps> = ({ currentStep, data, updateData, onNext, onBack }) => {
  const toggleArrayItem = (key: 'painPoints' | 'benefits', item: string) => {
    const currentItems = data[key];
    if (currentItems.includes(item)) {
      updateData({ [key]: currentItems.filter(i => i !== item) });
    } else {
      updateData({ [key]: [...currentItems, item] });
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case Step.INTRO_1:
      case Step.INTRO_2: return false;
      case Step.PAIN_POINTS: return data.painPoints.length === 0;
      case Step.BENEFITS: return data.benefits.length === 0;
      case Step.LOCATION: return !data.location;
      case Step.DETAILS: return !data.peopleCount || !data.dates || !data.budget;
      case Step.CRAZY_LEVEL: return !data.crazyLevel;
      case Step.PLAN_TYPE: return !data.planType;
      case Step.FUNNY_QUESTION: return !data.funnyQuestion;
      case Step.CONTACT: return !data.name || !data.whatsapp;
      default: return false;
    }
  };

  const commonClasses = "p-4 border-2 rounded-xl transition-all cursor-pointer text-left flex items-center gap-3";
  const activeClasses = "border-pink-500 bg-pink-50 shadow-md";
  const inactiveClasses = "border-gray-200 hover:border-pink-300 bg-white";

  const renderHeader = (title: string, subtitle: string) => (
    <div className="mb-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2 leading-tight">{title}</h2>
      <p className="text-gray-600 italic">{subtitle}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        {currentStep === Step.INTRO_1 && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6">🤔</div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
              ¿Cómo va a acabar vuestra despedida?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={onNext}
                className="group p-6 bg-gradient-to-br from-white to-pink-50 border-2 border-gray-100 rounded-3xl text-left hover:border-pink-500 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="text-xl font-black text-gray-800">Algo legendario</div>
                <div className="text-gray-500 text-sm">Que lo recordéis hasta cuando estéis en la residencia.</div>
              </button>
              <button 
                onClick={onNext}
                className="group p-6 bg-white border-2 border-gray-100 rounded-3xl text-left hover:border-rose-500 transition-all shadow-sm"
              >
                <div className="text-xl font-black text-gray-800">Un desastre total</div>
                <div className="text-gray-500 text-sm">Gente que no se habla, marrones infinitos y el novio/a llorando.</div>
              </button>
            </div>
            <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">Elige con sabiduría, o no.</p>
          </div>
        )}

        {currentStep === Step.INTRO_2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
              Aquí <span className="text-pink-500 ">vais a llevaros:</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: "📉", title: "Diagnóstico sin filtros", desc: "Sabreis lo mal o bien que vais como grupo." },
                { icon: "🗺️", title: "Un plan de verdad", desc: "Nada de 'lo de siempre'. Retranca y utilidad a partes iguales." },
                { icon: "🤕", title: "Un dolor de cabeza", desc: "Pero del bueno. De esos que vienen con anécdotas legendarias." },
                { icon: "💔", title: "Menos amistades", desc: "Probablemente pierdas algún amigo por el camino, pero ganarás paz mental." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-black text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.PAIN_POINTS && (
          <div>
            {renderHeader("¿Qué os quita el sueño?", "Marca los marrones que os están agobiando.")}
            <div className="space-y-3">
              {PAIN_POINTS_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleArrayItem('painPoints', option)}
                  className={`${commonClasses} ${data.painPoints.includes(option) ? activeClasses : inactiveClasses}`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${data.painPoints.includes(option) ? 'bg-pink-500 border-pink-500' : 'border-gray-300'}`}>
                    {data.painPoints.includes(option) && <i className="fas fa-check text-white text-xs"></i>}
                  </div>
                  <span className="font-medium text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.BENEFITS && (
          <div>
            {renderHeader("¿Qué quereís lograr?", "Aparte de que no os arresten, claro.")}
            <div className="space-y-3">
              {BENEFITS_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleArrayItem('benefits', option)}
                  className={`${commonClasses} ${data.benefits.includes(option) ? activeClasses : inactiveClasses}`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${data.benefits.includes(option) ? 'bg-pink-500 border-pink-500' : 'border-gray-300'}`}>
                    {data.benefits.includes(option) && <i className="fas fa-check text-white text-xs"></i>}
                  </div>
                  <span className="font-medium text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.LOCATION && (
          <div>
            {renderHeader("¿Dónde queréis liarla?", "Elegid vuestro escenario del crimen (o relax).")}
            <div className="grid grid-cols-1 gap-3">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  onClick={() => updateData({ location: loc })}
                  className={`${commonClasses} ${data.location === loc ? activeClasses : inactiveClasses}`}
                >
                  <i className="fas fa-map-marker-alt text-pink-500"></i>
                  <span className="font-medium text-gray-700">{loc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.DETAILS && (
          <div>
            {renderHeader("Los detalles del marrón", "Cuéntanos lo básico para no ir a ciegas.")}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">¿Cuántas almas en pena sois?</label>
                <input
                  type="number"
                  value={data.peopleCount}
                  onChange={(e) => updateData({ peopleCount: e.target.value })}
                  placeholder="Ej. 12"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">¿Cuándo será el desmadre?</label>
                <input
                  type="text"
                  value={data.dates}
                  onChange={(e) => updateData({ dates: e.target.value })}
                  placeholder="Ej. Junio o el finde del 12 de Julio"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hablemos de pasta (€/persona)</label>
                <input
                  type="text"
                  value={data.budget}
                  onChange={(e) => updateData({ budget: e.target.value })}
                  placeholder="Ej. 150€"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === Step.CRAZY_LEVEL && (
          <div>
            {renderHeader("Nivel de descontrol", "¿Cómo de fuerte queréis que sea el dolor de cabeza del lunes?")}
            <div className="grid grid-cols-1 gap-4">
              {CRAZY_LEVELS.map((level) => (
                <div
                  key={level.value}
                  onClick={() => updateData({ crazyLevel: level.label })}
                  className={`${commonClasses} ${data.crazyLevel === level.label ? activeClasses : inactiveClasses}`}
                >
                  <span className="text-3xl">{level.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800">{level.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.PLAN_TYPE && (
          <div>
            {renderHeader("¿Qué tipo de lio buscáis?", "Elegid vuestro veneno.")}
            <div className="space-y-3">
              {PLAN_TYPES.map((plan) => (
                <div
                  key={plan}
                  onClick={() => updateData({ planType: plan })}
                  className={`${commonClasses} ${data.planType === plan ? activeClasses : inactiveClasses}`}
                >
                  <i className="fas fa-glass-cheers text-pink-400"></i>
                  <span className="font-medium text-gray-700">{plan}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.FUNNY_QUESTION && (
          <div>
            {renderHeader("Pregunta obligatoria", "¿Cuál es la mayor virtud del novio/a?")}
            <div className="space-y-3">
              {FUNNY_QUESTION_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={() => updateData({ funnyQuestion: option })}
                  className={`${commonClasses} ${data.funnyQuestion === option ? activeClasses : inactiveClasses}`}
                >
                  <i className="fas fa-star text-yellow-400"></i>
                  <span className="font-medium text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.CONTACT && (
          <div>
            {renderHeader("Datos del responsable", "Para mandarte el plan y por si hay que pagar fianza.")}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tu nombre</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                  placeholder="Tu nombre (o el de tu enemigo)"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={data.whatsapp}
                  onChange={(e) => updateData({ whatsapp: e.target.value })}
                  placeholder="600 000 000"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between gap-4 sticky bottom-0 bg-white/80 py-4 backdrop-blur-sm">
        {currentStep > Step.INTRO_1 && (
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Atrás
          </button>
        )}
        <button
          onClick={onNext}
          disabled={isNextDisabled()}
          className={`flex-grow px-6 py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            isNextDisabled() ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105'
          }`}
        >
          {currentStep === Step.INTRO_1 || currentStep === Step.INTRO_2 ? "¡Vale, venga!" : 
           currentStep === Step.CONTACT ? "¡Generar Plan con Retranca!" : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default StepRenderer;
