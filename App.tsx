
import React, { useState, useEffect } from 'react';
import { WizardData, Step, ReportResponse } from './types';
import StepRenderer from './components/StepRenderer';
import ReportView from './components/ReportView';
import { WAITING_MESSAGES } from './constants';
import { generatePartyReport } from './services/geminiService';

const getInitialData = (): WizardData => ({
  painPoints: [],
  benefits: [],
  peopleCount: '',
  location: '',
  dates: '',
  budget: '',
  crazyLevel: '',
  planType: '',
  funnyQuestion: '',
  name: '',
  whatsapp: ''
});

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTRO_1);
  const [wizardData, setWizardData] = useState<WizardData>(getInitialData());

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(WAITING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentStep === Step.LOADING) {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % WAITING_MESSAGES.length;
        setLoadingMessage(WAITING_MESSAGES[index]);
      }, 3000);

      const fetchReport = async () => {
        setError(null);
        try {
          const result = await generatePartyReport(wizardData);
          setReport(result);
          setCurrentStep(Step.RESULT);
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Vaya, parece que Gemini tiene resaca o falta la API_KEY en Vercel.");
          setCurrentStep(Step.CONTACT);
        }
      };

      fetchReport();
      return () => clearInterval(interval);
    }
  }, [currentStep, wizardData]);

  const updateData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < Step.CONTACT) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(Step.LOADING);
    }
  };

  const handleBack = () => {
    if (currentStep > Step.INTRO_1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setWizardData(getInitialData());
    setReport(null);
    setError(null);
    setCurrentStep(Step.INTRO_1);
  };

  const progress = (currentStep / Step.CONTACT) * 100;

  return (
    <div className="min-h-screen bg-[#fdf2f8] flex flex-col items-center py-8 px-4">
      <header className="w-full max-w-lg mb-8 text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
          Retranca Top 🚀
        </h1>
        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">El oráculo de las despedidas gallegas</p>
      </header>

      <main className="w-full max-w-lg">
        {currentStep <= Step.CONTACT && (
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 relative overflow-hidden border-2 border-pink-50">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-50">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm flex flex-col gap-2 border border-rose-100">
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-lg"></i>
                  <span>¡Atención!</span>
                </div>
                <p className="font-normal">{error}</p>
                {error.includes("API_KEY") && (
                  <p className="text-xs bg-rose-100 p-2 rounded mt-1">
                    Tip: Ve a Vercel {"->"} Settings {"->"} Environment Variables y añade <b>API_KEY</b> con tu valor de Google AI Studio.
                  </p>
                )}
              </div>
            )}

            <StepRenderer 
              currentStep={currentStep}
              data={wizardData}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        )}

        {currentStep === Step.LOADING && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-10">
              <div className="w-32 h-32 border-[12px] border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">
                🔮
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Analizando el marrón...</h3>
            <p className="text-xl text-pink-600 font-bold h-20 px-4 transition-all duration-500">{loadingMessage}</p>
          </div>
        )}

        {currentStep === Step.RESULT && report && (
          <ReportView 
            report={report} 
            data={wizardData} 
            onReset={handleReset} 
          />
        )}
      </main>

      <footer className="mt-12 text-gray-400 text-xs font-bold uppercase tracking-[0.3em] pb-10">
        &copy; {new Date().getFullYear()} DespedidasGalicia.es &bull;
      </footer>
    </div>
  );
};

export default App;
