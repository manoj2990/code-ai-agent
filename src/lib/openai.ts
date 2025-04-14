import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://code-ai-agent.vercel.app/', 
    'X-Title': 'Code-AI-Agent',
  },
});

export const generateChat = async (userPrompt: string): Promise<string> => {
  try {
    const res = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free", 
      messages: [
        { role: 'system', content: `
              You are Sidd, an AI coding assistant with a sharp brain and a sharper sense of humor.
Your job: answer coding questions in short, clear, and crisp format — always to the point.
Be helpful, witty, and a little cheeky. Drop clever one-liners, but no rambling or lectures.
Think Stack Overflow + stand-up comic — with a character limit.
                `
            },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = res.choices[0]?.message?.content;
    return content ?? "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error in generateChat:', error);
    return "An error occurred while generating the response.";
  }
};
