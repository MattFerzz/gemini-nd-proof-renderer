import { useState, useEffect } from 'react'
import { MathJaxContext, MathJax } from 'better-react-mathjax'
import { generateLatex } from './services/geminiService'
import { saveApiKey, getApiKey } from './services/apiKeyService'

// MathJax configuration
const config = {
  loader: { load: ['[tex]/bussproofs'] },
  tex: {
    packages: { '[+]?': ['bussproofs'] }
  }
}

function App() {
  const [apiKey, setApiKey] = useState('')
  const [formulaInput, setFormulaInput] = useState('')
  const [latexOutput, setLatexOutput] = useState('')
  const [thinkingStepsOutput, setThinkingStepsOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = getApiKey()
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  function handleApiKeyChange(event) {
    const newApiKey = event.target.value
    setApiKey(newApiKey)
    saveApiKey(newApiKey)
  }

  function handleFormulaChange(event) {
    setFormulaInput(event.target.value)
  }

  async function handleSubmit() {
    if (!apiKey) {
      setError('Please enter your Gemini API key.')
      return
    }
    if (!formulaInput) {
      setError('Please enter premises and conclusion.')
      return
    }

    setIsLoading(true)
    setError(null)
    setLatexOutput('')
    setThinkingStepsOutput('')

    try {
      const generatedOutput = await generateLatex(apiKey, formulaInput)
      setLatexOutput(`$$${generatedOutput.latexOutput}$$`)
      setThinkingStepsOutput(generatedOutput.thinkingSteps)

    } catch (err) {
      console.error('Error in handleSubmit:', err)
      setError(err.message || 'Failed to generate LaTeX proof.')
      setLatexOutput('')
      setThinkingStepsOutput('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MathJaxContext config={config}>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="bg-gray-800 text-white p-3 flex items-center gap-3 shadow-md">
          <label htmlFor="apiKeyInput" className="font-semibold whitespace-nowrap">Gemini API Key:</label>
          <input
            id="apiKeyInput"
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your Gemini API Key"
            className="flex-grow p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-row flex-grow overflow-hidden">
          <div className="w-1/2 p-4 flex flex-col border-r border-gray-300 bg-white">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Enter Premises & Conclusion</h2>
            <textarea
              value={formulaInput}
              onChange={handleFormulaChange}
              placeholder="¬p ∨ q ⊢ p → q"
              className="flex-grow w-full p-3 border border-gray-300 rounded-md resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded font-semibold text-white transition-colors duration-200 ease-in-out 
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
            >
              {isLoading ? 'Generating Proof...' : 'Generate Proof'}
            </button>
          </div>

          <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Rendered Proof (LaTeX via MathJax)</h2>
            <div className="latex-display p-4 bg-white border border-gray-200 rounded-md min-h-[100px]">
              {latexOutput ? (
                <MathJax dynamic>{latexOutput}</MathJax>
              ) : (
                <p className="text-gray-500 italic">LaTeX proof output will appear here...</p>
              )}
            </div>
            {thinkingStepsOutput && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <details>
                  <summary className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-blue-600">
                    Show Thinking Steps
                  </summary>
                  <div className="mt-2 p-3 bg-white border border-gray-200 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-gray-600 font-mono">
                      {thinkingStepsOutput}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </MathJaxContext>
  )
}

export default App
