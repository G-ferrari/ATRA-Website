export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<{ text: string }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}`);
  }

  return response.json();
}

