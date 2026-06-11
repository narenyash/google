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

export async function analyzeImage(imageBase64, cropType, mimeType = 'image/jpeg') {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are an expert agricultural scientist analyzing a ${cropType} crop image.
Return ONLY a raw JSON object. No markdown. No backticks. No explanation. No code blocks.
Just the JSON object starting with { and ending with }.

Required format:
{"pest":"string","diseaseName":"string","scientificName":"string","infectionStage":"Early","affectedPercent":25,"affectedPlants":50,"totalPlants":200,"spreadable":true,"spreadMechanism":"wind","spreadSpeedKmPerHour":2,"confidence":85,"treatment":"one sentence treatment","severity":"HIGH"}

infectionStage must be: Early or Mid or Late
spreadMechanism must be: wind or water or insects or soil
severity must be: LOW or MEDIUM or HIGH
affectedPercent must be a number 0-100
confidence must be a number 0-100`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: imageBase64 } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 512
    }
  };

  try {
    const response = await axios.post(url, body, { timeout: 30000 });
    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log('Gemini raw response:', rawText.substring(0, 200));

    // Extract JSON from response — handle all markdown variations
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Gemini response:', rawText);
      return DEFAULT_RESULT;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields exist
    if (!parsed.diseaseName || !parsed.pest) {
      console.error('Missing required fields in parsed result');
      return DEFAULT_RESULT;
    }

    return parsed;
  } catch (err) {
    console.error('visionAgent error:', err.response?.data || err.message);
    return DEFAULT_RESULT;
  }
}
