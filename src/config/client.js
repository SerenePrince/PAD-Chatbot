// client.js
/**
 * @module client
 * @description Manages the Azure OpenAI client instance using a singleton pattern.
 */
import { AzureOpenAI } from "openai";
import { azureOpenAIConfig } from "./config.js";

/**
 * @private
 * @type {AzureOpenAI | null}
 * @description The singleton instance of the Azure OpenAI client.
 */
let client = null;

/**
 * @function getClient
 * @description Returns the singleton instance of the Azure OpenAI client.
 * If the client does not exist, it initializes a new one.
 * @returns {AzureOpenAI} The Azure OpenAI client instance.
 */
export function getClient() {
  if (!client) {
    client = new AzureOpenAI(azureOpenAIConfig);
  }
  return client;
}
