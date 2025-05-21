// client.js

// This sets up a single, shared connection to Azure OpenAI.
// We only create the client once and reuse it across the app.

import { AzureOpenAI } from "openai";
import { azureOpenAIConfig } from "./config.js";

let client = null;

/**
 * Returns the shared Azure OpenAI client.
 * If it hasn't been created yet, this will create it first.
 */
export function getClient() {
  if (!client) {
    client = new AzureOpenAI(azureOpenAIConfig);
  }
  return client;
}
