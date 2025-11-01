
import React, { useState } from 'react';
import { suggestBugs } from '../services/geminiService';
import { SuggestedBug, Severity } from '../types';
import { WandIcon, PlusIcon } from './Icons';

interface AIAssistantProps {
  projectUrl: string;
  onAddBug: (bug: { title: string; description: string; severity: Severity }) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ projectUrl, onAddBug }) => {
  const [componentName, setComponentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedBug[]>([]);

  const handleGetSuggestions = async () => {
    if (!componentName.trim()) {
      setError('Please enter a component name to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await suggestBugs(projectUrl, componentName);
      setSuggestions(result);
    } catch (err) {
      setError('Failed to fetch suggestions. Please check the console for details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestionAsBug = (suggestion: SuggestedBug) => {
    onAddBug({
      ...suggestion,
      severity: Severity.Medium, // Default severity for AI suggestions
    });
    // Remove the suggestion from the list once added
    setSuggestions(suggestions.filter(s => s.title !== suggestion.title));
  };

  return (
    <div className="bg-base-200/50 border border-dashed border-base-300 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-bold mb-4 text-content-100 flex items-center">
        <WandIcon /> AI Bug Assistant
      </h3>
      <p className="mb-4 text-sm text-content-200">
        Describe a component on the page (e.g., "header navigation", "stock chart", "news feed") and let Gemini suggest potential bugs.
      </p>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-4">
        <input
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="Enter component name..."
          className="flex-grow bg-base-300 border border-base-300 text-content-100 rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition"
          disabled={isLoading}
        />
        <button
          onClick={handleGetSuggestions}
          disabled={isLoading}
          className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-md hover:bg-brand-primary transition disabled:bg-base-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Get Suggestions'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-semibold text-content-100">Suggestions:</h4>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-base-300 p-3 rounded-md flex justify-between items-center">
              <div>
                <p className="font-bold text-content-100">{suggestion.title}</p>
                <p className="text-sm text-content-200">{suggestion.description}</p>
              </div>
              <button
                onClick={() => handleAddSuggestionAsBug(suggestion)}
                className="p-2 text-content-200 hover:text-white hover:bg-brand-secondary rounded-full transition"
                title="Add as bug"
              >
                <PlusIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
