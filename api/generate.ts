
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Manejo de CORS básico para Vercel
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
  
  // IMPORTANTE: Debes configurar la variable API_KEY en el panel de Vercel
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY no encontrada en process.env");
    return res.status(500).json({ 
      error: 'Configuración incompleta: Falta la API_KEY en las variables de entorno de Vercel (Settings > Environment Variables).' 
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Eres un consultor experto en organización de despedidas de soltero/a, con muchísima RETRANCA GALLEGA. 
      Tu misión es analizar los datos de un grupo y generar un plan que sea útil pero también muy gracioso y directo.

      DATOS DEL GRUPO:
      - Organizador: ${data.name}
      - Problemas actuales: ${data.painPoints?.join(", ") || "Ninguno"}
      - Objetivos: ${data.benefits?.join(", ") || "Ninguno"}
      - Grupo: ${data.peopleCount} personas en ${data.location}
      - Fechas: ${data.dates}
      - Presupuesto: ${data.budget}
      - Nivel de locura: ${data.crazyLevel}
      - Estilo: ${data.planType}
      - Sobre el novio/a: ${data.funnyQuestion}

      INSTRUCCIONES DE RESPUESTA:
      1. Usa un tono sarcástico, honesto y muy gallego (retranca).
      2. Genera un "Diagnóstico del Marrón" inicial.
      3. Propón un plan detallado con 3 fases: "El Calentamiento", "El Momento Crítico" y "La Supervivencia".
      4. Calcula un "Score de Éxito" (0-100) y ponlo claramente como: **Score: XX/100**.
      5. Añade una lista de "Próximos Pasos" obligatorios para no acabar en el calabozo o sin amigos.
      6. Formatea todo con Markdown (negritas, listas, etc.).

      REGLA DE ORO: No seas aburrido. Vacila al organizador por el marrón en el que se ha metido.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error("La IA no devolvió texto.");
    }

    // Extracción de la puntuación para el gráfico
    const scoreMatch = text.match(/(\d+)\/100/) || text.match(/Score.*: (\d+)/i);
    const scoreVal = scoreMatch ? parseInt(scoreMatch[1]) : 77;

    return res.status(200).json({
      reportText: text,
      score: isNaN(scoreVal) ? 69 : scoreVal,
    });
  } catch (error: any) {
    console.error("Error detallado en la API de Gemini:", error);
    return res.status(500).json({ 
      error: 'Error al conectar con el oráculo de las despedidas.',
      details: error.message 
    });
  }
}
