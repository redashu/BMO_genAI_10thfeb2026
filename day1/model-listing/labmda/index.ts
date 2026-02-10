import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";

export const handler = async () => {
  const client = new BedrockClient({ region: process.env.AWS_REGION });

  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);

    const models = response.modelSummaries ?? [];

    // Filter only text/chat models
    const filtered = models
      .filter(m => 
        m.outputModalities?.includes("TEXT")
      )
      .slice(0, 15); // top 15 available

    console.log("Top 15 Foundation Models:");
    filtered.forEach((model, index) => {
      console.log(`${index + 1}. ${model.modelId} - ${model.providerName}`);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(filtered, null, 2),
    };

  } catch (error) {
    console.error("Error listing models:", error);
    throw error;
  }
};