import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export const handler = async (event: any) => {
  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
  });

  try {
    const body = JSON.parse(event.body || "{}");
    const userPrompt = body.prompt || "Explain AWS Lambda in simple terms.";

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.5
      }),
    });

    const response = await client.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseBody, null, 2),
    };

  } catch (error: any) {
    console.error("Full error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Model invocation failed",
        error: error?.message
      }),
    };
  }
};