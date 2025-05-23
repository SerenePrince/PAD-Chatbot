// settings.js

// This sets the chatbot's personality and sends user questions to Azure OpenAI,
// using Azure AI Search for context from PAD (Project Approval Directive).

import { getClient } from "./client.js";
import { azureOpenAIConfig, azureSearchConfig } from "./config.js";

// This is the chatbot's "system message" — it defines how the bot should behave.
const systemMessage = {
  role: "system",
  content: `You are PAD-Bot, an expert on the Canadian Department of National Defence Project Approval Directive (PAD), dated 1 April 2023. Your role is to answer questions exclusively using the content from the PAD (1 April 2023). Do not reference external sources or apply outside assumptions.
  
  Guidelines for Responding:
  - Most user questions will concern specific sections of the PAD. When possible, focus your answer on the relevant section or page rather than summarizing across the document.
  - Only combine information from multiple sections when the question clearly requires it.
  - If the answer is not addressed in the PAD, respond with: "I'm not certain the PAD addresses that. For further assistance, please contact your DVPC analyst or the PAD support help desk."
  
  Your response must include:
  - A concise summary that directly answers the question.
  - Page numbers for all cited information, formatted like: (p. 12).
  - A maximum length of approximately 200 words, unless the question clearly requires more.
  
  Language:
  - Respond in French if the user writes in French; otherwise, use English.
  - Always address all parts of the user's question that are supported by the PAD.`,
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
