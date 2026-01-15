const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI('AIzaSyC5n3CzLMl8RHJPdV5_ZDcDSyfiX6FbsMU'); // Replace with your Gemini API key

const generateRecipe = async (ingredients, dietaryPreferences) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
  const prompt = `
You are a recipe generator.

Return ONLY valid JSON in the following exact format.
Do NOT add explanations, markdown, or extra text.

{
  "title": "string",
  "ingredients": ["string"],
  "instructions": ["string"],
  "cookingTime": "string",
  "difficulty": "string",
  "nutritionalInfo": "string"
}

Ingredients available: ${ingredients.join(", ")}
Dietary preferences: ${dietaryPreferences.join(", ")}
`;

  try {
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    console.log('Received response from Gemini API:', generatedText);
    return generatedText;
  } catch (error) {
    console.error('Error generating recipe with Gemini:', error);
    return null;
  }
};

module.exports = { generateRecipe };