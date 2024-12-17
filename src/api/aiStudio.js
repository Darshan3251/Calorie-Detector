import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
console.log(process.env);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Converts a base64 image string into a format compatible with the Google Generative AI API.
 * @param {string} base64Image - The base64 encoded image string.
 * @param {string} mimeType - The MIME type of the image (e.g., "image/jpeg").
 * @returns {object} - The image data in the required format.
 */
function base64ToGenerativePart(base64Image, mimeType) {
  return {
    inlineData: {
      data: base64Image.split(",")[1], // Remove the "data:image/jpeg;base64," prefix
      mimeType,
    },
  };
}

/**
 * Analyze food image to get calorie content using Google Generative AI.
 * @param {string} base64Image - The base64 encoded image string from the webcam.
 * @returns {Promise<string>} - The AI-generated response about the food's calorie content.
 */

export const analyzeFood = async (base64Image) => {
    try {
      const mimeType = "image/jpeg";
      const imagePart = {
        inlineData: {
          data: base64Image.split(",")[1],
          mimeType,
        },
      };
  
      const prompt = "Provide the name and calorie count for the food shown in this image.";
      const result = await model.generateContent([prompt, imagePart]);
  
      // Extract AI response
      const responseText = result.response.text();
  
      // Simplify the output using regex to extract food name and calorie count
      const match = responseText.match(/(\b[A-Za-z\s]+\b).*?(\d+)\s*calories?/i);
      if (match) {
        const foodName = match[1].trim();
        const calories = match[2];
        return `${foodName}: ${calories} calories`;
      }
  
      // Fallback if the pattern is not found
      return "Unable to extract food name and calories.";
    } catch (error) {
      console.error("Error analyzing food image:", error);
      throw error;
    }
  };
  