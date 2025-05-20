// config.js
/**
 * @module config
 * @description Configuration settings for Azure OpenAI and Azure AI Search.
 */

/**
 * @function getEnv
 * @description Retrieves an environment variable by name.
 * @param {string} name The name of the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws {Error} If the environment variable is not found.
 */
function getEnv(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * @typedef {object} AzureOpenAIConfig
 * @property {string} endpoint The endpoint URL for Azure OpenAI.
 * @property {string} apiKey The API key for Azure OpenAI.
 * @property {string} apiVersion The API version to use.
 * @property {string} deployment The name of the deployed model.
 * @property {boolean} dangerouslyAllowBrowser Whether to allow browser usage (use with caution).
 */

/** @type {AzureOpenAIConfig} */
export const azureOpenAIConfig = {
  endpoint: getEnv("VITE_OPENAI_ENDPOINT"),
  apiKey: getEnv("VITE_OPENAI_API_KEY"),
  apiVersion: getEnv("VITE_OPENAI_API_VERSION"),
  deployment: getEnv("VITE_OPENAI_DEPLOYMENT"),
  dangerouslyAllowBrowser: true,
};

/**
 * @typedef {object} AzureSearchConfig
 * @property {string} endpoint The endpoint URL for Azure AI Search.
 * @property {string} key The API key for Azure AI Search.
 * @property {string} index The name of the search index.
 */

/** @type {AzureSearchConfig} */
export const azureSearchConfig = {
  endpoint: getEnv("VITE_AI_SEARCH_ENDPOINT"),
  key: getEnv("VITE_AI_SEARCH_API_KEY"),
  index: getEnv("VITE_AI_SEARCH_INDEX"),
};
