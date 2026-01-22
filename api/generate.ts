
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const data = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Falta la API_KEY en las variables de entorno de Vercel.' 
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Eres un consultor experto en organización de despedidas, con mucha RETRANCA GALLEGA. 
      Analiza los datos y genera un informe útil, sarcástico y directo.

      DATOS:
      - Organizador: ${data.name}
      - Problemas: ${data.painPoints?.join(", ")}
      - Objetivos: ${data.benefits?.join(", ")}
      - Grupo: ${data.peopleCount} personas en ${data.location}
      - Presupuesto: ${data.budget}
      - Nivel de locura: ${data.crazyLevel}
      - Sobre el novio/a: ${data.funnyQuestion}

      INSTRUCCIONES DE FORMATO:
      1. Genera un "Diagnóstico del Marrón".
      2. Crea un plan en 3 fases: "El Calentamiento", "El Momento Crítico" y "La Supervivencia".
      3. IMPORTANTE: Usa párrafos CORTOS (máximo 3 líneas).
      4. El tono debe ser de vacile pero profesional.
      5. Calcula un Score: **Score: XX/100**.
      6. Lista de "Próximos Pasos" numerada.
      7. Usa negritas (**) para enfatizar conceptos clave pero no abuses.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";
    const scoreMatch = text.match(/(\d+)\/100/) || text.match(/Score.*: (\d+)/i);
    const scoreVal = scoreMatch ? parseInt(scoreMatch[1]) : 77;

    return res.status(200).json({
      reportText: text,
      score: isNaN(scoreVal) ? 69 : scoreVal,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al generar el plan', details: error.message });
  }
}
