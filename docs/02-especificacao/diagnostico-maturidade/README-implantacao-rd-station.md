# Diagnóstico de Maturidade de Dados · ATRA — guia de implantação

Arquivo: `atra-diagnostico-maturidade-dados.html` (HTML + CSS + JS num único bloco, sem dependências além da fonte Inter).

## 1. Publicar no WordPress

**Elementor:** arraste o widget **HTML** para a seção desejada e cole o arquivo inteiro. Use uma seção de largura "Boxed" (o quiz já se limita a 760 px e centraliza).
**Gutenberg:** bloco **HTML personalizado**, cole o arquivo inteiro.

Antes de colar, edite a seção `CONFIG` no topo do `<script>`:

| Chave | O que colocar |
|---|---|
| `webhookUrl` | URL do seu proxy (opção A, recomendada). Deixe vazio para usar a opção B. |
| `rdApiKey` | API Key pública do RD (Configurações › Integrações › API Key). Só use se **não** houver proxy. |
| `rdConversionIdentifier` | Nome do evento de conversão no RD. Padrão `quiz-maturidade-dados`. |
| `whatsapp` | Número com DDI+DDD, só dígitos (ex.: `5511999999999`). |
| `agendaUrl` | Link do Calendly/HubSpot Meetings/Google Agenda do especialista. |
| `blockedEmailDomains` | Domínios de e-mail pessoal recusados (filtro B2B). |

Sem `webhookUrl` nem `rdApiKey`, o quiz roda em modo simulação e imprime o payload no console do navegador. Bom para homologar.

Para a Política de Privacidade, ajuste o link no `<label class="aq-consent">` se a URL do site for outra.

## 2. Como o envio chega ao RD Station

O quiz monta um único JSON (função `buildPayload`) e o envia de uma das duas formas:

**Opção A — proxy no servidor (recomendada).** O navegador chama `webhookUrl`; o servidor adiciona a credencial e repassa à API de Conversões do RD. A chave nunca fica exposta no site. Pode ser um endpoint do próprio WordPress (snippet abaixo), n8n, Make ou Zapier.

**Opção B — direto do navegador.** `POST https://api.rd.services/platform/conversions?api_key=SUA_KEY` com o corpo:

```json
{ "event_type": "CONVERSION", "event_family": "CDP", "payload": { ...campos abaixo... } }
```

### Proxy mínimo no WordPress (functions.php do tema filho ou plugin Code Snippets)

```php
add_action('rest_api_init', function () {
  register_rest_route('atra/v1', '/quiz', [
    'methods'  => 'POST',
    'permission_callback' => '__return_true',
    'callback' => function (WP_REST_Request $req) {
      $payload = $req->get_json_params();
      if (empty($payload['email']) || !is_email($payload['email'])) {
        return new WP_REST_Response(['ok' => false], 422);
      }
      $payload['conversion_identifier'] = sanitize_key($payload['conversion_identifier'] ?? 'quiz-maturidade-dados');
      $res = wp_remote_post(
        'https://api.rd.services/platform/conversions?api_key=' . rawurlencode(RD_STATION_API_KEY),
        ['headers' => ['Content-Type' => 'application/json'],
         'body' => wp_json_encode(['event_type' => 'CONVERSION', 'event_family' => 'CDP', 'payload' => $payload]),
         'timeout' => 15]
      );
      $code = is_wp_error($res) ? 500 : wp_remote_retrieve_response_code($res);
      return new WP_REST_Response(['ok' => $code < 300], $code < 300 ? 200 : 502);
    },
  ]);
});
```

Defina `RD_STATION_API_KEY` no `wp-config.php` (`define('RD_STATION_API_KEY', '...');`) e use `webhookUrl: 'https://www.atra.com.br/wp-json/atra/v1/quiz'`.

## 3. Mapeamento de campos no RD Station

### Campos padrão (já existem no RD)

| Campo enviado | Campo no RD |
|---|---|
| `name` | Nome |
| `email` | E-mail (identificador do lead) |
| `personal_phone` / `mobile_phone` | Telefone / Celular |
| `company_name` | Empresa |
| `job_title` | Cargo |
| `conversion_identifier` | Nome da conversão (aparece na linha do tempo e serve de gatilho de automação) |
| `traffic_source` / `traffic_medium` / `traffic_campaign` | Origem (lidos das UTMs da URL) |
| `legal_bases` | Base legal LGPD (consentimento para comunicação) |

### Campos personalizados (criar em Configurações › Campos personalizados)

Crie cada um com o **nome de API** exatamente igual ao da primeira coluna. O prefixo `cf_` é obrigatório na API de Conversões.

| Nome de API | Tipo | Conteúdo |
|---|---|---|
| `cf_quiz_setor` | Texto | Setor em texto (ex.: "Mercado Financeiro · Bancos…") |
| `cf_quiz_setor_codigo` | Texto | `financeiro`, `capitais`, `seguros`, `saude`, `telecom`, `varejo`, `outros` — use nas segmentações |
| `cf_quiz_porte` | Texto | Faixa de faturamento |
| `cf_quiz_cargo_codigo` | Texto | `ceo_presidente`, `cfo_cro`, `cio_cto_cdo`, `diretor_gerente`, `coordenador_analista`, `outro` |
| `cf_quiz_maturidade_geral` | Número | Média geral 1,00–5,00 |
| `cf_quiz_nivel_dmbok` | Texto | `1 · Inicial` … `5 · Otimizado` (escala DAMA-DMBOK/CMMI) |
| `cf_quiz_governanca` | Número | Média do pilar Governança |
| `cf_quiz_qualidade` | Número | Média do pilar Qualidade |
| `cf_quiz_seguranca` | Número | Média do pilar Segurança |
| `cf_quiz_conformidade` | Número | Média do pilar Conformidade |
| `cf_quiz_gaps_top3` | Texto | Três maiores gaps regulatórios, ex.: `LGPD (28) \| IFRS 9 / CMN 4.966 (8) \| CVM (6)` |
| `cf_quiz_gaps_json` | Texto | Todos os gaps por tag (`{"lgpd":28,"rc18":4,...}`) |
| `cf_quiz_dama_json` | Texto | Média por área de conhecimento DAMA |
| `cf_quiz_respostas_json` | Texto | Todas as respostas com pilar, área DAMA, score e tags |
| `cf_quiz_duracao_seg` | Número | Tempo de resposta em segundos |
| `cf_quiz_versao` | Texto | Versão do quiz (`data-version`) |
| `cf_quiz_url` | Texto | Página onde foi respondido |

O gap de cada tag é a soma de (5 − score) das respostas que carregam a tag; quanto maior, mais distante do nível Otimizado naquele tema. Os JSONs cabem no campo Texto do RD (limite de 255 caracteres em alguns planos: se o `cf_quiz_respostas_json` for cortado, mantenha-o só no proxy ou grave em planilha/CRM).

### Automações sugeridas no RD

1. **Gatilho:** conversão `quiz-maturidade-dados` → e-mail automático com o diagnóstico, usando as variáveis `cf_quiz_nivel_dmbok`, `cf_quiz_governanca`… e `cf_quiz_gaps_top3`. Um e-mail por setor (`cf_quiz_setor_codigo`) permite citar o regulador certo.
2. **Lead scoring:** somar pontos quando `cf_quiz_cargo_codigo` for `ceo_presidente`/`cfo_cro`/`cio_cto_cdo` e `cf_quiz_porte` for `1_5bi`/`acima_5bi`; subtrair quando `cf_quiz_maturidade_geral` ≥ 4,3.
3. **Distribuição:** nível ≤ 2,6 e porte alto → oportunidade no CRM para o time comercial.

## 4. Estrutura das perguntas e roteamento

- Base de 19 perguntas em `QUESTIONS`; cada uma tem `sectors` (`['all']` = transversal) e cada opção tem `s` (score 1–5) e `tags`.
- O JS filtra por setor ao sair da tela de perfil: 11 transversais + 1 a 2 específicas. Mudar de setor recomeça as respostas.
- Cada tela gerada carrega `data-pilar`, `data-dama` e `data-tags`; cada opção carrega `data-score` e `data-tags`.
- Para acrescentar um setor: adicione a `<option>` no `#aq-setor`, crie perguntas com `sectors:['novo']` e rótulos em `TAG_LABELS`.

### Cobertura regulatória atual (v1.2 · foco 2026-2027)

| Setor | Perguntas específicas | Tags |
|---|---|---|
| Todos | LGPD com RIPD e DPO; direitos do titular e comunicação de incidentes (Res. CD/ANPD 15/2024; prioridades ANPD 2026-27); governança de dados para IA (PL 2338/2023) | `lgpd`, `anpd`, `ia` |
| Financeiro | RC CMN/BCB 18/2025: política, diretor, dicionário, relatório semestral (prazo 31/12/2026); as 12 dimensões (rastreabilidade, acurácia, tempestividade…); CMN 5.274/2025 cibersegurança e terceiros (prazo 1º/3/2026); Open Finance (manuais de monitoramento 3.0 e segurança 5.0); IFRS 9 / CMN 4.966 | `rc18`, `bcb`, `cmn5274`, `openfinance`, `ifrs9` |
| Capitais | CVM 175 + ANBIMA; suitability / KYC / PLD; CVM 244/2026 (IFRS S1/S2 voluntário com "pratique ou explique" a partir de 2027) | `cvm`, `anbima`, `pld`, `cvm244`, `esg` |
| Seguros | IFRS 17 + SUSEP; SRO e Open Insurance; Circular SUSEP 638/2021 e atualizações 2026 (nuvem, incidentes) | `ifrs17`, `susep`, `sro`, `openinsurance` |
| Saúde | Anvisa, CFM e dados sensíveis (foco ANPD); RN ANS 639/2025 (fim do SIP, Monitoramento TISS desde mar/2026) e RNDS em HL7 FHIR (Decreto 12.560/2025); Reforma Tributária | `anvisa`, `lgpd_saude`, `ans`, `tiss`, `rnds`, `reforma_tributaria` |
| Telecom | Anatel + RGC (set/2025); segurança cibernética, incidentes, spoofing e ECA Digital; Reforma Tributária | `anatel`, `rgc`, `eca`, `reforma_tributaria` |
| Educação | MEC/INEP (Censo, e-MEC, Enade, FIES/ProUni); dados de menores e ECA Digital, IA educacional; qualidade dos dados de evasão e inadimplência; Reforma Tributária | `mec`, `inep`, `fies`, `eca`, `reforma_tributaria` |
| Varejo/Outros | ESG e CVM 244/2026; Reforma Tributária CBS/IBS (teste em 2026, CBS integral em 2027) | `esg`, `cvm244`, `fiscal`, `reforma_tributaria` |

Total: 32 perguntas na base; cada respondente vê de 14 a 17.

**Validar com o jurídico/compliance antes de publicar** o texto das normas citadas. Fontes consultadas em 16/09/2026:

- RC 18/2025: [texto na LegisWeb](https://www.legisweb.com.br/legislacao/?id=487039) (art. 2º §2º lista as 12 dimensões; art. 12 prazo 31/12/2026), [Deloitte](https://www.deloitte.com/br/pt/Industries/financial-services/perspectives/resolucao-conjunta-numero-dezoito.html), [Finsiders](https://finsidersbrasil.com.br/regulamentacao/resolucao-conjunta-no-18-prazo-vira-o-maior-risco-da-qualidade-de-dados/)
- CMN 5.274/2025: [NDM Advogados](https://ndmadvogados.com.br/artigo/seguranca-cibernetica-bcb-538-cmn-5274/), [Grant Thornton](https://www.grantthornton.com.br/insights/artigos-e-publicacoes/seguranca-cibernetica-o-que-muda-com-a-cmn-5.2742025/)
- Open Finance 2026 (IN BCB 706, 720, 740, 760): [Open Finance Brasil · atos normativos](https://openfinancebrasil.org.br/atos-normativos/)
- CVM 244/2026: [EY FAQ](https://www.ey.com/pt_br/services/assurance/faq-resolucao-cvm-244), [Mayer Brown](https://www.mayerbrown.com/pt/insights/publications/2026/06/copy-of-cvm-torna-facultativa-a-divulgacao-de-reportes-financeiros-relacionados-a-sustentabilidade-ifrs-s1-e-s2-para-as-companhias-abertas)
- ANPD 2026-27: [Mapa de Temas Prioritários](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-mapa-de-temas-prioritarios-para-o-bienio-2026-2027-e-atualiza-agenda-regulatoria-2025-2026), [Daniel Law](https://www.daniel.com.br/pt/client-alert/anpd-em-2026-fiscalizacao-em-escala-e-uma-agenda-mais-ampla-para-o-ambiente-digital/)
- Marco Legal da IA: [PL 2338/2023 no Senado](https://www25.senado.leg.br/web/atividade/materias/-/materia/157233)
- ANS RN 639/2025: [Legismap](https://legismap.com.br/conteudos/artigos-e-noticias/ans-comunica-fim-da-obrigatoriedade-de-envio-de-dados-ao-sip-a-partir-de-2026); RNDS: [Ministério da Saúde](https://www.gov.br/saude/pt-br/composicao/seidigi/rnds)
- SUSEP: [Circular 638/2021](https://www2.susep.gov.br/safe/scripts/bnweb/bnmapi.exe?router=upload/25121), [manual de segurança cibernética](https://legismap.com.br/conteudos/artigos-e-noticias/susep-divulga-manual-de-orientacoes-sobre-seguranca-ciberneticapara-supervisionadas), [SRO](https://www.gov.br/susep/pt-br/assuntos/sistema-de-registro-de-operacoes/regulamentacao)
- Anatel: [RGC](https://www.sydle.com/br/blog/rgc-691b989f241da9297ada360b), [regulamento de segurança cibernética](https://teletime.com.br/04/07/2024/novo-regulamento-de-seguranca-cibernetica-da-anatel-e-aprovado/)

Não conferido em fonte primária: numeração exata das normas SUSEP de 2026 (Resolução CNSP 491/492 e a alteração da Circular 638), a base legal do ECA Digital e o cronograma do MEC/INEP. As perguntas foram escritas sem citar esses números.

## 5. Eventos de analytics

Ao concluir, o quiz faz `dataLayer.push({event:'quiz_maturidade_lead', quiz_setor, quiz_nivel})`. Crie um gatilho no GTM para o evento e envie a conversão ao GA4/Meta/LinkedIn.

## 6. Checklist de homologação

1. Colar com `webhookUrl`/`rdApiKey` vazios; responder; conferir o payload no console.
2. Criar os campos `cf_*` no RD; configurar a chave; responder com um e-mail corporativo de teste; ver o lead e a conversão no RD.
3. Testar os oito setores (a quantidade de perguntas varia de 14 a 17).
4. Testar em celular (o rodapé empilha os botões) e teclado (A–D ou 1–4 escolhem; Enter avança).

## 7. Versão 1.1 · o que mudou

- **Checkbox de consentimento** agora exibe o estado marcado (a regra genérica dos inputs aplicava `appearance:none` a ele).
- **Etiquetas "Impacta:"** em cada pergunta, geradas pela união das `data-tags` das opções (rótulos em `TAG_LABELS`; as tags internas `governanca`, `qualidade` e `seguranca` não viram etiqueta).
- **Mindmap** `atra-mindmap-diagnostico.html`: mapa interativo em HTML/CSS/JS puro, sem nenhuma dependência externa (abre offline, direto do arquivo), gerado da base `QUESTIONS`, agrupado em Perfil → Escala → Governança / Qualidade / Segurança → Conformidade por setor, com cada pergunta, os reguladores impactados e a **resposta ideal (nível 5)** destacada, seguida das demais opções com o nível. O `mindmap.md` é a fonte em Markdown, útil para importar em outras ferramentas. Se a base de perguntas mudar, regenere o mapa.

## 8. Versão 1.2 · agenda regulatória 2026-2027 e setor Educação

- Bloco de Conformidade reescrito com foco no que vence neste e no próximo ano: RC 18/2025 (duas perguntas: programa e dimensões), CMN 5.274/2025, Open Finance 2026, CVM 244/2026, ANS RN 639/2025 e RNDS, SRO/Open Insurance, Anatel RGC e ECA Digital, Reforma Tributária, Marco Legal da IA e prioridades da ANPD.
- Novo setor **Educação** (código `educacao`) com três perguntas: MEC/INEP, dados de menores e ECA Digital, qualidade dos dados de evasão e inadimplência. Também recebe a pergunta da Reforma Tributária.
- Novas tags para criar no RD se quiser segmentar por regulador (já vão em `cf_quiz_gaps_json`): `anpd`, `ia`, `cmn5274`, `cvm244`, `sro`, `openinsurance`, `tiss`, `rnds`, `rgc`, `eca`, `mec`, `inep`, `fies`, `reforma_tributaria`.
- Regenerar o mindmap após mudar perguntas: `python3 build_mindmap.py` na pasta dos arquivos (lê o HTML do quiz e reescreve `mindmap.md` e `atra-mindmap-diagnostico.html`).

## 9. Matriz de cobertura

`atra-matriz-cobertura.html` (gerado por `build_matriz.py`, sem dependências): perguntas por setor × pilar, por setor × regulação impactada (mapa de calor em um só tom de azul, com as perguntas no hover), resumo por setor e lista de perguntas por regulação. Regenerar junto com o mindmap após alterar a base.

## 10. Versão 1.3 · tela de resultado (temporária)

- Botão **"Ver meu resultado agora"** na tela final (tracejado, `#aq-cta-resultado`) abre a tela `data-screen="result"` com: nível DMBOK e média geral com leitura por porte, barras por pilar (vermelho < 2,6, laranja < 3,5), maiores gaps regulatórios, roadmap em três fases (0-3, 3-6, 6-12 meses) com as ofertas ATRA por pilar e faixa de maturidade, e ações por regulação (`REG_ACTIONS`).
- **Para remover quando a automação de e-mail estiver no ar:** apague o botão `#aq-cta-resultado` e o `<section data-screen="result">`; o JS ignora a ausência. As tabelas `LEVELS`, `OFFERS` e `REG_ACTIONS` podem servir de base para o template do e-mail no RD.
- O payload ganhou `cf_quiz_roadmap` (texto com as três fases e seus itens), útil como variável no e-mail automático. Crie o campo no RD como Texto.

## 11. Versão 1.4 · etiquetas limpas e entrega em arquivos únicos

- Etiquetas de regulação só com o nome da norma ou do órgão (sem prazos, prioridades ou valor do gap) em todas as telas, no mapa mental, na matriz e na tela de resultado. Os números continuam no payload (`cf_quiz_gaps_json`, `cf_quiz_gaps_top3`).
- **Arquivos para compartilhar** (cada um abre sozinho, sem internet, exceto o quiz que carrega a fonte Inter do Google e a logo do site):
  - `atra-diagnostico-maturidade-dados.html` — o questionário, para colar no Elementor.
  - `atra-deck-comercial-diagnostico.html` — apresentação comercial no formato do deck institucional (carrossel, visão geral, teclado, impressão), com o mapa mental e a matriz de cobertura embutidos no botão "Mapa mental e matriz" (tecla M).
  - `atra-mindmap-diagnostico.html` — mapa mental + matriz, avulso.
  - `atra-matriz-cobertura.html` — matriz avulsa.
- Geradores: `build_mindmap.py`, `build_matriz.py`, `build_deck_comercial.py` (este lê `~/Downloads/deck_institucional.html` como casca).

## 12. Versão 1.5 · revisão de conteúdo e consolidação dos arquivos

**Arquivos finais (compartilháveis, cada um abre sozinho):**
- `atra-diagnostico-maturidade-dados.html` — o questionário (v1.5).
- `atra-deck-comercial-diagnostico.html` — apresentação comercial no formato do deck institucional, com o mapa mental e a matriz de cobertura embutidos (botão "Mapa mental e matriz" ou tecla M). O mapa e a matriz avulsos foram retirados por serem repetitivos.
- `README-implantacao-rd-station.md` — este guia.
- Pasta `atra-quiz-fontes/` — geradores (`build_mindmap.py`, `build_matriz.py`, `build_deck_comercial.py`) e `mindmap.md`. Para regenerar o deck depois de editar perguntas, copie o quiz para a pasta e rode os três scripts na ordem acima; o último lê `~/Downloads/deck_institucional.html` como casca.

**Correções da revisão:**
- Perguntas transversais mostravam reguladores de outro setor (um hospital via "Banco Central" na pergunta de incidentes). Agora cada setor tem a lista de reguladores relevantes (`SECTOR_TAGS`); a etiqueta e o gap só consideram os do setor escolhido. A matriz de cobertura segue a mesma regra.
- Enunciados das perguntas transversais de LGPD, titulares e IA reescritos em linguagem executiva; siglas e números de norma ficaram nas alternativas e nas ações do resultado.
- Marco Legal da IA: a votação na Câmara ficou para o fim de 2026, após as eleições ([Mobile Time, 24/8/2026](https://www.mobiletime.com.br/noticias/24/08/2026/marco-ia-voto-fim-do-ano/)). Textos que diziam "votação final" foram ajustados.
- ECA Digital = Lei 15.211/2025, em vigor desde 17/3/2026, com cronograma da ANPD em duas fases ([Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/estatuto-digital-da-crianca-e-do-adolescente-lei-n-15-211-2025-entra-em-vigor-em-17-de-marco-de-2026)).
- IFRS 17: a SUSEP ainda não referendou o CPC 50; seguradoras reguladas seguem o CPC 11 prudencial e só as companhias abertas publicam IFRS 17 para a CVM. A pergunta de seguros passou a falar em "IFRS 17 / CPC 50 (companhias abertas) e reportes prudenciais à SUSEP".
- RC 18/2025: mantida como "Resolução Conjunta CMN/BCB nº 18/2025" (a LegisWeb a cataloga como MF/CMN; as demais fontes, CMN/BCB). Conferir a ementa antes de citar em proposta.

**Acréscimos:**
- Pergunta `gov_decisao` (Governança · Data Warehousing & BI): tempo até uma resposta nova a partir dos dados. É a pergunta de valor de negócio que abre a conversa com o C-Level. Base: 33 perguntas; 15 a 18 por setor.
- Tags novas: `bcbs239` (princípios de agregação de dados de risco que a RC 18 traz ao Brasil), `cfm` (prontuário eletrônico, Lei 13.787/2018), `marco_civil` (guarda de registros). Rótulos e ações por regulação atualizados.
- Tela de resultado: bloco "O que está em jogo" com a consequência prática de cada pilar abaixo de 3,5 (reporte devolvido pelo regulador, decisão adiada, sanção LGPD de até 2% do faturamento limitada a R$ 50 mi por infração, evidências que não escalam).
- Deck: slide "Por que o diagnóstico importa" com seis aplicações práticas da governança; números de perguntas, setores e regulações e a tabela de setores agora são calculados a partir do quiz, sem risco de divergir.

**Sugestões de regulação não incluídas (avaliar):** Resolução Conjunta 6/2023 (compartilhamento de dados de fraude entre instituições), LC 105/2001 (sigilo bancário), GDPR para grupos com operação na Europa, Lei 14.478/2022 (ativos virtuais). Ficaram de fora para não alongar o quiz.

## 13. Versão 1.6 · impactos na tela de perfil

Ao escolher o setor, aparece abaixo do campo a linha "Impactos avaliados:" com LGPD, ANPD, Marco Legal da IA, os reguladores do setor (`SECTOR_TAGS`), a Reforma Tributária quando o setor a recebe, e a etiqueta "entre outros" ao final. Some quando nenhum setor está selecionado.

## 14. Versão 1.7 · arquivos finais

- Tela de resultado ganhou o bloco "Impactos avaliados para o seu setor", com a mesma lista da tela inicial e "entre outros" ao final.
- **Prontos para compartilhar** em `~/Downloads`: `atra-diagnostico-maturidade-dados.html` (questionário), `atra-deck-comercial-diagnostico.html` (apresentação comercial com mapa mental e matriz embutidos) e este guia.
- `~/Downloads/atra-quiz-fontes/`: só os três geradores, para regenerar o deck após editar o quiz (copie o quiz para a pasta e rode `build_matriz.py`, `build_mindmap.py`, `build_deck_comercial.py`; o último usa `~/Downloads/deck_institucional.html` como casca). Os intermediários (mapa e matriz avulsos, `mindmap.md`) foram apagados.
