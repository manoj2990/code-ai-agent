

export async function textToSpeech(text: string): Promise<string> {

  
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID!}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY! || "my-elevenlabs-api-key",
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS Error:', errorText);
      throw new Error(`TTS API error: ${response.statusText}`);
    }
  
  
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:audio/mpeg;base64,${base64}`;
  }
  