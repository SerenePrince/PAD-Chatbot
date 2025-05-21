// config.js

// This file sets up connection details for Azure OpenAI and Azure AI Search.
// These values come from environment variables, which are set securely outside the code.

/**
 * Gets a value from the environment settings.
 * If the value doesn't exist, it throws an error to help catch misconfigurations early.
 */
function getEnv(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Settings for connecting to Azure OpenAI
export const azureOpenAIConfig = {
  endpoint: getEnv("VITE_OPENAI_ENDPOINT"), // The API endpoint
  apiKey: getEnv("VITE_OPENAI_API_KEY"), // The secret key for access
  apiVersion: getEnv("VITE_OPENAI_API_VERSION"), // The version of the API to use
  deployment: getEnv("VITE_OPENAI_DEPLOYMENT"), // The model we've deployed
  dangerouslyAllowBrowser: true, // Allows use in the browser (only enabled intentionally)
};

// Settings for connecting to Azure AI Search
export const azureSearchConfig = {
  endpoint: getEnv("VITE_AI_SEARCH_ENDPOINT"), // The search service endpoint
  key: getEnv("VITE_AI_SEARCH_API_KEY"), // The secret key for search access
  index: getEnv("VITE_AI_SEARCH_INDEX"), // The name of the index we're querying
};
