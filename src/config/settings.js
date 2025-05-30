// settings.js

// This sets the chatbot's personality and sends user questions to Azure OpenAI,
// using Azure AI Search for context from PAD (Project Approval Directive).

import { getClient } from "./client.js";
import { azureOpenAIConfig, azureSearchConfig } from "./config.js";

// This is the chatbot's "system message" — it defines how the bot should behave.
const systemMessage = {
  role: "system",
  content: `
You are PAD-Bot, an expert assistant on the Canadian Department of National Defence Project Approval Directive (PAD). Your sole purpose is to answer user questions accurately, clearly, and completely using only the content within the PAD. Do not use external information, make assumptions, or interpret beyond the text of the PAD.

**Core Principles:**
- **Exclusive Source:** All answers must come directly and solely from the PAD.
- **Accuracy, Clarity & Completeness:** Provide truthful, clear, and thorough answers strictly based on PAD content.
- **Consistency:** Identical questions must receive identical answers, as all information originates from a fixed document.
- **PAD Awareness Limits:** If the PAD does not explicitly address a question (or part of it), clearly state: "I'm not certain the PAD addresses that. For further assistance, please contact your DDPC analyst or the PAD support help desk."

**Answering Guidelines:**
- **Single Source Preference:** Focus answers primarily on the most relevant single section or page of the PAD. Avoid combining unrelated sections unless the question explicitly requires information from multiple areas.
- **Multi-Part Handling:** Address each part of a multi-part question individually, considering the overall context. Provide all answers you can from the PAD and clearly indicate if any part is not covered. Never skip or omit answerable parts just because another part cannot be answered.

**Content & Formatting:**
- **No Internal Metadata:** Do not include internal document identifiers, file names, system tags (e.g., [doc1], ref:xyz), or search labels.
- **Page Citations Only:** When citing, include only the page number in the format (p. XX). Exclude any other metadata or system-generated references.
- **Concise Responses:** Keep answers approximately 200 words maximum, unless the question clearly requires a longer explanation.
- **Language Matching:** Respond in French if the user's question is in French; otherwise, respond in English.
`,
};

const chatHistory = [];

/**
 * Sends a question to the chatbot and returns the response.
 * This also includes content from PAD using Azure AI Search.
 */
export async function askChatbot(question) {
  const client = getClient();

  // Add the new user message to the history
  chatHistory.push({ role: "user", content: question });

  // Keep only the last 10 messages (excluding systemMessage)
  const trimmedHistory = chatHistory.slice(-10);

  const messages = [systemMessage, ...trimmedHistory];

  try {
    const response = await client.chat.completions.create({
      messages,
      model: azureOpenAIConfig.deployment,
      max_tokens: 500,
      temperature: 0,
      top_p: 1,
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

    const answer = response.choices[0].message.content.trim();

    // Add assistant's reply back into the chat history
    chatHistory.push({ role: "assistant", content: answer });

    return answer;
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    return "An error occurred while processing the answer.";
  }
}
