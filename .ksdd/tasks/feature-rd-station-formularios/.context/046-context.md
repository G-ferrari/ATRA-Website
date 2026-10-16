# Contexto de implementação — 046

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/139
**Branch:** `feature/rd-station-formularios/046-ebook-identificador-e-formulario`, empilhada sobre a 045 (#137)
**Task:** `.ksdd/tasks/feature-rd-station-formularios/046-ebook-identificador-e-formulario.md`

## Task em uma página

- **Objetivo:** cada e-book chega ao RD com o próprio identificador de conversão, e o formulário de download sai do herói para depois do texto, antes de "Entre em contato". Pedido da Taci (14/10).
- **Decisão do G-ferrari (15/10):** "Um identificador por e-book". Vazio, vale `ebook-<slug>` (FEATURE 2.1).
- **Fora:** mandar o e-book por e-mail, os PDFs reais (P-07), a ordem e o texto dos blocos.

## Estado atual (lido em 16/10)

- `resources` não tem campo de RD. O download (`actions/materiais.ts`) grava `form-submissions` com `kind: 'material-download'` e `resource: <id>`, e devolve a URL assinada de 15 min. Não avisa o time (fica assim, ver a 045).
- O gancho do RD usa o identificador global do formulário "Download de material" (`integrations.rdStationMarketing.conversions.materialDownload`, padrão `site-download-material`) para todo download.
- Na página do e-book (`components/content/pagina-de-material.tsx`), o `DownloadGate` fica no herói azul quando o material tem PDF; sem PDF, um botão inativo.
- Nenhuma migração de dados lê `resources` pela Local API: não precisa de migração antecipada.
- O e2e não tem e-book com PDF: o seed dos materiais não sobe arquivo.

## Plano

1. **`resources`**: campo `rdConversionIdentifier` (texto, lateral, sem `localized`), com a normalização e a validação dos identificadores da 043 (`normalizarNome`, `ehIdentificadorDeConversao`). Migração de schema.
2. **RD**: `LeadParaRd.material` (slug e identificador do e-book, lidos pelo gancho a partir de `resource`, com `select` e locale `pt`). `identificadorDe` passa a receber o lead: no download, o do e-book; vazio, `ebook-<slug>`; o identificador global continua sendo o liga/desliga (vazio, nada vai) e só vale como nome se o e-book não for achado. Descrição do campo global dizendo isso.
3. **Página**: herói com PDF mostra um link-botão para `#baixar`; o `DownloadGate` vai para uma seção própria depois do corpo e antes de `ChamadaFinal`, num painel legível nos dois temas. Sem PDF, nada muda.
4. **Seed (só `SEED_FIXTURES=1`)**: um PDF mínimo válido no e-book "Governança de Dados na Era da IA Generativa", para o e2e.
5. **Testes**: unitários do identificador (com, sem, slug ausente, global vazio) e do gancho lendo o material; e2e da ordem e da rolagem nos três tamanhos; a rota entra no contraste e no axe.
6. **Guia do editor**: o campo novo.

## Quality gates

- [ ] typecheck · lint · test
- [ ] `migrate:create` sem diferença; `migrate` em banco zerado
- [ ] e2e da página do e-book (host, Playwright) e contraste nos dois temas
- [ ] revisão de código (agente)
- [ ] Impeccable detect nos arquivos de UI, se disponível
