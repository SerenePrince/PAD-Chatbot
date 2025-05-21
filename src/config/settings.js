// settings.js

// This sets the chatbot's personality and sends user questions to Azure OpenAI,
// using Azure AI Search for context from PAD (Project Approval Directive).

import { getClient } from "./client.js";
import { azureOpenAIConfig, azureSearchConfig } from "./config.js";

// This is the chatbot's "system message" — it defines how the bot should behave.
const systemMessage = {
  role: "system",
  content:
    "You are PAD-Bot, an expert on the Canadian Department of National Defence Project Approval Directive (PAD, 1 April 2023). ONLY answer questions using PAD content. Do NOT bring in outside knowledge or information not explicitly stated in the PAD (1 April 2023). Always cite the specific page number(s) where the information can be found in parentheses at the end of the sentence or clause it refers to. For example: 'The project requires a preliminary assessment (p. 5).' If uncertain, respond: \"I'm not certain the PAD addresses that.\" Provide direct and concise answers based on the PAD content (~200 words max unless asked). Default language is English; reply in French if the user writes in French. Always cite page numbers and where to find them. Address all parts of the user's question that are covered within the PAD.",
};

/**
 * Sends a question to the chatbot and returns the response.
 * This also includes content from PAD using Azure AI Search.
 */
export async function askChatbot(question) {
  const client = getClient();

  const messages = [systemMessage, { role: "user", content: question }];

  try {
    const response = await client.chat.completions.create({
      messages,
      model: azureOpenAIConfig.deployment,
      max_tokens: 500,
      temperature: 0,
      top_p: 0.5,
      frequency_penalty: 0,
      presence_penalty: 0,
      data_sources: [
        {
          type: "azure_search",
          parameters: {
            endpoint: azureSearchConfig.endpoint,
            index_name: azureSearchConfig.index,
            authentication: {
              type: "api_key",
              key: azureSearchConfig.key,
            },
          },
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    return "An error occurred while processing the answer.";
  }
}
