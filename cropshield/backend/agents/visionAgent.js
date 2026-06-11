import axios from 'axios';

const DEFAULT_RESULT = {
  pest: 'Unknown',
  diseaseName: 'Could not identify',
  scientificName: 'Unknown',
  infectionStage: 'Early',
  affectedPercent: 5,
  affectedPlants: 10,
  totalPlants: 200,
  spreadable: false,
  spreadMechanism: 'wind',
  spreadSpeedKmPerHour: 0,
  confidence: 0,
  treatment: 'Please upload a clearer photo',
  severity: 'LOW'
};

export async function analyzeImage(imageBase64, cropType) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are an expert agricultural scientist. Analyze this crop image and return ONLY a valid JSON object with zero markdown and zero backticks. Return exactly this: { "pest": string, "diseaseName": string, "scientificName": string, "infectionStage": string must be Early or Mid or Late, "affectedPercent": number between 0 and 100, "affectedPlants": number, "totalPlants": number, "spreadable": boolean, "spreadMechanism": string must be wind or water or insects or soil, "spreadSpeedKmPerHour": number, "confidence": number between 0 and 100, "treatment": string one sentence only, "severity": string must be LOW or MEDIUM or HIGH }`;

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, body);
    const rawText = response.data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return DEFAULT_RESULT;
  }
}
