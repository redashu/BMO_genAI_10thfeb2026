import { Bedrock } from "langchain/llms/bedrock";


export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const question = body.question || "Explain AWS Lambda simply.";

    const formattedPrompt = `<|begin_of_text|>
<|start_header_id|>system<|end_header_id|>
You are a helpful AI assistant.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
${question}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>`;

    const model = new Bedrock({
      region: process.env.AWS_REGION!,
      model: process.env.MODEL_ID!,
      modelKwargs: {
        max_gen_len: 300,
        temperature: 0.5,
      },
    });

    const response = await model.call(formattedPrompt);

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: response,
      }),
    };

  } catch (error: any) {
    console.error("LangChain Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};