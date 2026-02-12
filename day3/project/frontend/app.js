const API_URL = "https://bde91x1djd.execute-api.us-east-1.amazonaws.com/sit2/rag";

const chat = document.getElementById("chat");
const input = document.getElementById("input");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerText = "Bot is typing...";
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const raw = await response.json();
    const data = raw.body ? JSON.parse(raw.body) : raw;

    chat.removeChild(typing);
    addMessage(data.answer || "No response received", "bot");

  } catch (error) {
    chat.removeChild(typing);
    addMessage("Error contacting backend", "bot");
    console.error(error);
  }
}