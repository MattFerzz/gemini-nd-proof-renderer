# Logical Formula Proof Generator

A web application that takes logical formulas as input and uses Google's Gemini AI to generate and render proof trees in LaTeX format. The application provides a simple interface for users to input logical formulas and receive beautifully rendered proof trees using MathJax.

You can input formulas in a simple text format (like "¬p ∨ q ⊢ p → q") and receive a rendered proof tree using LaTeX and MathJax.

The application uses Google's Gemini AI to generate the proofs, which requires a Gemini API key. For security and privacy, the API key is stored exclusively in the user's browser's localStorage and is never sent to any server other than Google's Gemini API.

To get started, simply clone the repository, run `npm install` to install dependencies, and then `npm run dev` to start the development server. Open your browser to the displayed URL (typically http://localhost:5174), enter your Gemini API key (which will be saved in your browser), and you're ready to start generating proofs.

## License

MIT
