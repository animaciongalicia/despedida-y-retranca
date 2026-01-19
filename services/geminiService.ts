
import { GoogleGenAI } from "@google/genai";
import { WizardData, ReportResponse } from "../types";

export const generatePartyReport = async (data: WizardData): Promise<ReportResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key no configurada. Esto no va ni con empujones.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Eres un creador de planes de despedidas de soltera y soltero con mucha retranca gallega, sentido del humor, pero con foco en resultados.
    
    CONTEXTO DEL USUARIO
    Nombre del organizador: ${data.name}
    Puntos de dolor: ${data.painPoints.join(", ")}
    Beneficios buscados: ${data.benefits.join(", ")}
    Número de personas: ${data.peopleCount}
    Ubicación: ${data.location}
    Fechas: ${data.dates}
    Presupuesto: ${data.budget}
    Nivel de locura: ${data.crazyLevel}
    Tipo de plan: ${data.planType}
    La mayor virtud del novio/a (según el grupo): ${data.funnyQuestion}

    TU ROL:
    Hablas como alguien que ya ha montado muchas despedidas, ha visto todos los dramas posibles (desde peleas por 5 euros hasta gente olvidada en gasolineras) y ahora ayuda a evitar marrones.
    Tono directo, cercano, con retranca gallega: vacila al usuario pero con cariño, aportando claridad. No te enrollas: vas al grano pero con chispa.

    ESTRUCTURA DE LA RESPUESTA (IMPORTANTE: Usa Markdown con titulares en negrita y listas):
    1. **Diagnóstico sin filtros**: Un párrafo breve analizando la situación y los puntos de dolor. Incluye algún comentario tipo "esto pinta a grupo que...".
    2. **Plan de despedida a medida**: 3 bloques con ideas claras de plan (actividades, momentos clave, detalles). Adáptate a la ciudad, presupuesto y nivel de locura.
    3. **Score de Despedida Top**: Da un número entre 0 y 100 de forma clara (ej: **Score: 78/100**).
    4. **Explicación del Score**: 2-3 frases en tono vacile sobre la puntuación.
    5. **Próximos pasos**: Lista de 3-5 pasos concretos para que no se les caiga el plan.
    6. **Llamada a la acción**: Invitación final a pedir ayuda a la agencia.

    IMPORTANTE: No uses lenguaje corporativo. Sé contundente pero optimista. Haz mención a la 'virtud' del novio/a para personalizar el vacile.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "El gurú se ha ido de cañas y no ha respondido. Inténtalo de nuevo.";
    
    // Extract score using regex if possible, or generate one
    const scoreMatch = text.match(/(\d+)\/100/) || text.match(/Score.*: (\d+)/i) || text.match(/(\d+)\s*$/);
    const scoreVal = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    return {
      reportText: text,
      score: isNaN(scoreVal) ? 69 : scoreVal,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
