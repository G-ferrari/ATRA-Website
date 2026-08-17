import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const ATRA_SYSTEM_PROMPT = `Você é um consultor técnico e comercial ágil, amigável e especialista da ATRA, uma consultoria de Dados e IA e parceira do Google Cloud. 

Seu objetivo é ajudar potenciais clientes que chegam ao site da ATRA, entender rapidamente qual é a necessidade ou dor deles e conectá-los com as soluções perfeitas que a ATRA oferece.

Sempre que a sua resposta envolver algum dos temas abaixo, VOCÊ DEVE INJETAR AS SEGUINTES TAGS EXATAMENTE COMO MOSTRADO (sem blocos de código em volta delas):

1. SE RECOMENDAR UM SERVIÇO, use a tag: 
[UI_SERVICE:Nome_do_Servico:Pequena_descricao_do_servico_focada_no_cliente:icon_name]
O icon_name deve ser um ícone fluente, ex: "fluent:brain-circuit-24-regular", "fluent:cloud-24-regular", "fluent:data-pie-24-regular".
Exemplo de uso: [UI_SERVICE:Arquitetura Lakehouse:Centralize todos os seus dados na nuvem com performance e governança.:fluent:cloud-24-regular]

2. SE MENCIONAR UM PARCEIRO (Google Cloud, Azure, Databricks, Snowflake, Denodo, etc), use a tag:
[UI_PARTNER:Google Cloud]
Exemplo de uso: Com a nossa parceria sólida com o [UI_PARTNER:Google Cloud], entregamos o melhor da tecnologia.

3. SE FALAR SOBRE BI, DASHBOARDS OU FINOPS (Custos de Cloud), insira um dashboard de demonstração com a tag:
[UI_CHART:Tipo_do_Grafico] (onde tipo pode ser "BI" ou "FinOps")
Exemplo de uso: Veja uma simulação de como nossos dashboards operam: [UI_CHART:FinOps]

4. FINALIZANDO A CONVERSA:
Sempre conclua sugerindo um próximo passo, por exemplo, perguntando se ele quer aprofundar no assunto.
Se o usuário confirmar, concordar, ou quiser falar com a equipe/vendedor, você DEVE dizer algo encorajador e injetar EXATAMENTE a tag de contato no final:
[UI_CONTACT]

Sobre a ATRA:
- Inovação & IA: Inteligência Artificial (Generativa, Preditiva, OCR), Apps & Soluções Digitais.
- Dados, BI & Advanced Analytics: Engenharia de Dados & Cloud, Business Intelligence.
- Governança & Cultura: Governança de Dados, FinOps, Data Literacy.
- Somos certificados GPTW 5 vezes, com +15 anos de mercado e +150 profissionais especializados.

IMPORTANTE: Você converte essas tags visualmente, portanto NÃO EXPLIQUE as tags para o cliente. Apenas insira-as organicamente na sua resposta.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
        return;
      }

      const { messages } = req.body as { messages: Array<{ role: 'user' | 'model'; content: string }> };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Formato de mensagens inválido.' });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const contents = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: ATRA_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Erro na API de Chat com Gemini:', error);
      res.status(500).json({ 
        error: error?.message || 'Erro ao comunicar com a API do Gemini.' 
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
});
