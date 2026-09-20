---
status: revisado
atualizado_em: 2026-08-18
depende_de: [roadmap.md, tasks.md]
---

# Piloto de conversão HTML → Lexical (MIG-012)

Diagnóstico do maior risco imprevisto do projeto: os **207 posts** do WordPress
dependem deste conversor. O [roadmap](roadmap.md#fase-4b--migração-do-wordpress-d-17)
classificava a probabilidade de estouro de prazo como **alta**, com a hipótese de
que blocos do Gutenberg (galerias, embeds, colunas) não teriam equivalente.

**A hipótese estava errada, e o risco é menor do que o previsto.**

## Varredura do corpus inteiro

Não da amostra — dos 207 posts, 2.498.783 caracteres de HTML, 287 imagens.

| Estrutura | Posts | % |
|---|---|---|
| Bloco Gutenberg (`<!-- wp: -->`) | **0** | 0% |
| iframe / embed | **0** | 0% |
| script embutido | **0** | 0% |
| galeria | **0** | 0% |
| colunas | **0** | 0% |
| shortcode não processado | **0** | 0% |
| formulário | **0** | 0% |
| SVG inline | **0** | 0% |
| **tabela** | **2** | 1,0% |
| **referência a vídeo** | **2** | 1,0% |
| posts com corpo < 200 caracteres | **0** | 0% |

O conteúdo não é Gutenberg: é **Elementor / editor clássico**. O HTML traz muito
invólucro de page-builder (211 `div` e 39 `section` na amostra de 12 posts), que o
conversor descarta sozinho.

**Nenhum post está vazio** — os 207 têm corpo real. Isso confirma D-17: são 6 anos
de conteúdo aproveitável, não uma casca.

## Conversão: 12 posts, dois por ano de 2021 a 2026

| Ano | Retenção de texto |
|---|---|
| 2021 | 100% · 99,9% |
| 2022 | 100% · 99,9% |
| 2023 | 99,9% · 100% |
| 2024 | 100% · 100% |
| 2025 | 100% · 100% |
| 2026 | 100% · 100% |

As perdas de 0,1% são normalização de espaço em branco no fim do texto.

**Imagens: 14 de 14 convertidas. Links: 10 de 10.**

Nós gerados: `paragraph` 233 · `heading` 86 · `listitem` 59 · `list` 16 ·
`upload` 14 · `link` 10 · `linebreak` 4.

Verificado item a item, não só por contagem:

- **Níveis de título preservados** — `h1 h3 h3 h3` na origem, idêntico no destino
- **Formatação inline preservada** — `<strong>` vira `format: 1`
- **Links preservados com destino e `newTab`**

### Imagens saem como `pending`, com a URL de origem

```json
{ "type": "upload",
  "pending": { "src": "https://www.atra.com.br/wp-content/uploads/2021/10/4.png" } }
```

O conversor **não baixa** a imagem: marca o nó como pendente carregando a URL
original. É a entrega ideal para **MIG-082** — percorrer os nós pendentes, baixar,
criar o documento em `media` e trocar pela relação real.

## ⚠️ A falha que a métrica principal não pega

Os 2 posts com tabela converteram com **100% de retenção de texto** e
**zero nós de tabela**: as 5 linhas viraram parágrafos soltos. O conteúdo textual
está todo lá; a relação tabular, não.

É o tipo de defeito que passa batido — a métrica diz 100% enquanto o significado
se perde.

**Causa:** a tabela não faz parte do conjunto padrão de features do Lexical.

**Correção verificada:** habilitando `EXPERIMENTAL_TableFeature()` no editor,
os dois posts convertem íntegros:

```
agentes-de-ia-a-revolucao...  →  table:1  tablerow:5  tablecell:15
ia-machine-learning-deep...   →  table:1  tablerow:5  tablecell:20
```

**Encaminhamento:** habilitar a feature na config do Payload antes de MIG-081.
O prefixo `EXPERIMENTAL_` é do próprio Payload — vale registrar como dívida a
revisitar quando estabilizar.

## Outros achados operacionais

| Achado | Consequência |
|---|---|
| A API REST **responde 302 sem user-agent de browser** | MIG-080 precisa mandar UA. Sem isso o importador falha sem explicar por quê |
| `buildConfig` já devolve config sanitizado | Sanitizar de novo lança `DuplicateCollection: payload-kv` |
| As features de Lexical (link, upload) exigem config real | Stub não serve — elas leem `collections` e os defaults de link |
| Scripts precisam rodar com `tsx` | O strip de tipos do Node não resolve import de TS sem extensão |

## Efeito no plano

| | Antes | Depois do piloto |
|---|---|---|
| Risco de estouro em 4b | **alto** | **baixo** |
| MIG-081 (conversor) | 6h | ~3h — o conversor do Payload já resolve; o trabalho é habilitar tabela, tratar os 4 outliers e testar com fixtures |
| Bloqueio para começar 4b | piloto | nenhum |

**Recomendação: começar a Fase 4b assim que a Fase 1 fechar.** Ela não depende de
nenhuma tela, e é a maior alavanca de prazo do projeto — 207 posts de conteúdo
real entrando enquanto a fábrica de rotas roda em paralelo.

## Limites deste piloto

- Converteu **12 posts de 207** (5,8%); a varredura de estruturas, essa sim, cobriu
  os 207.
- A amostra pegou os **dois primeiros de cada ano** — escolha por diversidade
  temporal, não aleatória.
- Mede **retenção de texto e tipo de nó**, não fidelidade visual do resultado
  renderizado. A conferência visual dos 20 posts amostrados continua sendo critério
  de aceite de MIG-083.
