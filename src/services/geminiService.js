import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveApiKey } from './apiKeyService';

/**
 * Generates LaTeX representation of a logical formula using the Gemini API.
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {string} formulaInput - The logical formula string.
 * @returns {Promise<string>} - A promise that resolves with the LaTeX string.
 * @throws {Error} - Throws an error if the API call fails.
 */
async function generateLatex(apiKey, formulaInput) {
  if (!apiKey) {
    throw new Error('API key is missing.');
  }
  if (!formulaInput) {
    throw new Error('Formula input is missing.');
  }

  try {
    // Save the API key to localStorage
    saveApiKey(apiKey);
    
    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstructionText =
      "You are a specialized agent designed to receive premises and a conclusion and your job is to prove it using natural deduction.\n" +
      "First, provide your thinking steps on how you will arrive at the proof.\n" +
      "After your thinking steps, output the exact separator string '---THINKING_STEPS_END---'.\n" +
      "Then, you will ONLY output the tree shaped representation of the proof written in LaTeX representation.\n" +
      "Do not include any explanatory text, greetings, context, or markdown formatting such as backticks (`) before or after the LaTeX code, except within the thinking steps block itself if necessary for clarity.\n" +
      "Start the latex directly in the \\begin{prooftree} and end it in \\end{prooftree}. Do not add anything else. Do not use \\hypo or \\infer only use things like \\Axiom";

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro-exp-03-25',
      systemInstruction: systemInstructionText
    });

    const prompt = `Formula: ${formulaInput}`;

    // Log the formula being sent
    console.log('Sending formula to Gemini:', formulaInput);
    console.log('Using system instruction:', systemInstructionText);
    console.log('Using prompt:', prompt);


    const result = await model.generateContent(
      prompt);
    const response = await result.response;
    const text = response.text();

    // Log the raw response from the API
    console.log('Raw response from Gemini:', text);

    if (!text) {
      throw new Error('Empty response received from API.');
    }

    const separator = '---THINKING_STEPS_END---';
    const parts = text.split(separator);

    let thinkingSteps = '';
    let latexOutput = '';

    if (parts.length >= 2) {
      thinkingSteps = parts[0].trim();
      latexOutput = parts[1].trim();
    } else {
      // If separator is not found, assume the whole response is LaTeX or an error.
      // For now, we'll assign the whole text to latexOutput and log a warning.
      // A more robust solution might be needed depending on observed AI behavior.
      console.warn('Separator "---THINKING_STEPS_END---" not found in API response. Assuming entire response is LaTeX.');
      latexOutput = text.trim();
    }

    // Basic check to remove potential markdown fences if the model still adds them to LaTeX output
    const cleanedLatexOutput = latexOutput.replace(/^```(?:latex)?\n?|\n?```$/g, '');

    return { thinkingSteps: thinkingSteps, latexOutput: cleanedLatexOutput };
  } catch (error) {
    console.error('Error calling Gemini API in service:', error);
    // Re-throw the error or handle it more gracefully (e.g., return a specific error object)
    throw new Error(`Failed to generate LaTeX: ${error.message || 'Unknown API error'}`);
  }
}

export { generateLatex }; 