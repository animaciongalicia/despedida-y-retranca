
import { WizardData, ReportResponse } from "../types";

export const generatePartyReport = async (data: WizardData): Promise<ReportResponse> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Vaya, el servidor se ha ido de vinos. Prueba en un momento.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Service Error:", error);
    throw error;
  }
};
