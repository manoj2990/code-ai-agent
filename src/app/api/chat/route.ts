// src/app/api/chat/route.ts

import { generateChat } from '@/lib/openai';
import { textToSpeech } from '@/lib/elevenlabs';

export async function POST(req: Request) {
  try {
    //get messg/question from user
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Invalid message' }, { status: 400 });
    }

    //use generateChat from openAI to generate answer of question
    const textResponse = await generateChat(message);

    if (!textResponse) {
      return Response.json({ error: 'No response from AI' }, { status: 500 });
    }

    //genrate audio from response text using elevenlabs
    const audioUrl = await textToSpeech(textResponse);

    if (!audioUrl) {
        return Response.json({ error: 'No audioUrl from AI' }, { status: 500 });
      }

    return Response.json({ text: textResponse, audio: audioUrl });
  } catch (error) {
    console.error('POST /api/chat error:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
