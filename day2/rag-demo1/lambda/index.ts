import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

export const handler = async (event: any) => {
  const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION,
  });

  try {
    const body = JSON.parse(event.body || "{}");
    const question = body.question || "What is our leave policy?";

    const command = new RetrieveAndGenerateCommand({
      input: {
        text: question,
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID!,
          modelArn: process.env.MODEL_ARN!,
        },
      },
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.output, null, 2),
    };

  } catch (error: any) {
    console.error("RAG Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "RAG failed",
        error: error?.message,
      }),
    };
  }
};