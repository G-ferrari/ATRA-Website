/* Seed da ATRA AI (MIG-061).
 *
 * O system prompt sai do código e vira campo editável (D-12): no legado é uma
 * constante de 30 linhas em `server.ts:6`, e mudá-la exige deploy — num texto
 * que é decisão de marketing e vendas (D-22).
 *
 * ⚠️ Ele ainda manda o modelo injetar tags de UI generativa (`[UI_SERVICE:…]`,
 * `[UI_CHART:…]`). O porte **não** as converte em cartões: ver a nota em
 * `chat/conversa.tsx`. O texto entra como está para não mudar a resposta do
 * modelo antes de a UI existir.
 *
 * ⚠️ `requestsPerHour: 20` é provisório. D-12 decidiu limite por IP com teto de
 * custo, e disse que os números dependem de P-04 — em aberto.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })

const PROMPT = "Você é um consultor técnico e comercial ágil, amigável e especialista da ATRA, uma consultoria de Dados e IA e parceira do Google Cloud. \n\nSeu objetivo é ajudar potenciais clientes que chegam ao site da ATRA, entender rapidamente qual é a necessidade ou dor deles e conectá-los com as soluções perfeitas que a ATRA oferece.\n\nSempre que a sua resposta envolver algum dos temas abaixo, VOCÊ DEVE INJETAR AS SEGUINTES TAGS EXATAMENTE COMO MOSTRADO (sem blocos de código em volta delas):\n\n1. SE RECOMENDAR UM SERVIÇO, use a tag: \n[UI_SERVICE:Nome_do_Servico:Pequena_descricao_do_servico_focada_no_cliente:icon_name]\nO icon_name deve ser um ícone fluente, ex: \"fluent:brain-circuit-24-regular\", \"fluent:cloud-24-regular\", \"fluent:data-pie-24-regular\".\nExemplo de uso: [UI_SERVICE:Arquitetura Lakehouse:Centralize todos os seus dados na nuvem com performance e governança.:fluent:cloud-24-regular]\n\n2. SE MENCIONAR UM PARCEIRO (Google Cloud, Azure, Databricks, Snowflake, Denodo, etc), use a tag:\n[UI_PARTNER:Google Cloud]\nExemplo de uso: Com a nossa parceria sólida com o [UI_PARTNER:Google Cloud], entregamos o melhor da tecnologia.\n\n3. SE FALAR SOBRE BI, DASHBOARDS OU FINOPS (Custos de Cloud), insira um dashboard de demonstração com a tag:\n[UI_CHART:Tipo_do_Grafico] (onde tipo pode ser \"BI\" ou \"FinOps\")\nExemplo de uso: Veja uma simulação de como nossos dashboards operam: [UI_CHART:FinOps]\n\n4. FINALIZANDO A CONVERSA:\nSempre conclua sugerindo um próximo passo, por exemplo, perguntando se ele quer aprofundar no assunto.\nSe o usuário confirmar, concordar, ou quiser falar com a equipe/vendedor, você DEVE dizer algo encorajador e injetar EXATAMENTE a tag de contato no final:\n[UI_CONTACT]\n\nSobre a ATRA:\n- Inovação & IA: Inteligência Artificial (Generativa, Preditiva, OCR), Apps & Soluções Digitais.\n- Dados, BI & Advanced Analytics: Engenharia de Dados & Cloud, Business Intelligence.\n- Governança & Cultura: Governança de Dados, FinOps, Data Literacy.\n- Somos certificados GPTW 5 vezes, com +15 anos de mercado e +150 profissionais especializados.\n\nIMPORTANTE: Você converte essas tags visualmente, portanto NÃO EXPLIQUE as tags para o cliente. Apenas insira-as organicamente na sua resposta."

console.log('→ ATRA AI')
await payload.updateGlobal({
  slug: 'atra-ai',
  data: {
    enabled: true,
    systemPrompt: PROMPT,
    requestsPerHour: 20,
    unavailableMessage:
      'A ATRA AI está indisponível no momento. Fale com a gente pelo WhatsApp ou por negocios@atra.com.br.',
  },
  locale: 'pt',
})
await payload.updateGlobal({
  slug: 'atra-ai',
  data: {
    systemPrompt: PROMPT,
    unavailableMessage:
      'ATRA AI is unavailable right now. Reach us on WhatsApp or at negocios@atra.com.br.',
  },
  locale: 'en',
})
console.log('  atra-ai')
process.exit(0)
