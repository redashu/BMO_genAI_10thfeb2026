import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const handler = async (event: any) => {
  const region = process.env.AWS_REGION;
  const kbId = process.env.KNOWLEDGE_BASE_ID!;
  const modelArn = process.env.MODEL_ARN!;

  const ragClient = new BedrockAgentRuntimeClient({ region });
  const llmClient = new BedrockRuntimeClient({ region });

  try {
    const body = JSON.parse(event.body || "{}");
    const question = body.question || "What is AWS Lambda?";

    // 🔹 1️⃣ Try RAG first
    const ragCommand = new RetrieveAndGenerateCommand({
      input: { text: question },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: kbId,
          modelArn: modelArn,
        },
      },
    });

    const ragResponse = await ragClient.send(ragCommand);

    // If citations exist → return grounded answer
    if (ragResponse.citations && ragResponse.citations.length > 0) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "RAG",
          answer: ragResponse.output,
        }),
      };
    }

    // 🔹 2️⃣ Fallback to General LLM Invoke
    const invokeCommand = new InvokeModelCommand({
      modelId: modelArn.split("foundation-model/")[1], // extract modelId
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: question }
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    const llmResponse = await llmClient.send(invokeCommand);

    const parsed = JSON.parse(
      new TextDecoder().decode(llmResponse.body)
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "LLM",
        answer: parsed.content[0].text,
      }),
    };

  } catch (error: any) {
    console.error("Hybrid RAG Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Hybrid RAG failed",
        error: error?.message,
      }),
    };
  }
};