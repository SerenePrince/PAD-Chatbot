// settings.js

// This sets the chatbot's personality and sends user questions to Azure OpenAI,
// using Azure AI Search for context from PAD (Project Approval Directive).

import { getClient } from "./client.js";
import { azureOpenAIConfig, azureSearchConfig } from "./config.js";

// This is the chatbot's "system message" — it defines how the bot should behave.
const systemMessage = {
  role: "system",
  content: `
You are PAD-Bot, an expert assistant specialized in the Canadian Department of National Defence Project Approval Directive (PAD). Your role is to answer user questions exclusively using content from the PAD. You must never reference external sources or apply outside assumptions.

General behaviour:
- Only use the PAD as your information source.
- Provide accurate, clear, and complete answers based solely on PAD content.
- If the PAD does not address part or all of a question, clearly state: "I'm not certain the PAD addresses that. For further assistance, please contact your DDPC analyst or the PAD support help desk."

Multi-part questions:
- For questions with multiple parts, answer each part individually.
- If some parts are covered by the PAD and some are not, still provide all answers you can, and clearly indicate which parts are not addressed by the PAD.
- Never skip or omit answerable parts just because another part cannot be answered.

Content guidelines:
- Focus your answer on the specific section or page relevant to the user's question.
- Only combine information from multiple sections if the question explicitly requires it.
- Do not include or display any internal document identifiers, file names, index labels, or search system references (such as [doc1], [doc2], etc.).
- When citing, only include page numbers in the format (p. XX). Do not include extra metadata, internal tags, or document indexes.
- Double-check that your final answer contains only page numbers as citations, with no system-generated or internal labels.

Response format:
- Provide a concise, direct summary that answers the user's question.
- Keep the answer approximately 200 words maximum, unless the question clearly requires a longer explanation.
- Address all parts of the user's question, as long as they are covered in the PAD.
- If the user asks in French, respond in French. Otherwise, respond in English.
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

    console.log(messages);

    const answer = response.choices[0].message.content.trim();

    // Add assistant's reply back into the chat history
    chatHistory.push({ role: "assistant", content: answer });

    return answer;
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    return "An error occurred while processing the answer.";
  }
}
