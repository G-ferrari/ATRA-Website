---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [estrategia-de-testes.md, ../02-especificacao/contratos-de-dados.md]
---

# Definição de pronto

Checklist que **toda PR de rota** precisa passar. Copiar para a descrição da PR e
marcar item a item — o que não for verdade fica desmarcado, com uma linha
explicando.

## Funcionamento

- [ ] A rota responde **200 em PT e em EN**
- [ ] `generateStaticParams` cobre os dois locales (rotas dinâmicas)
- [ ] Rota inválida na mesma família cai em **404**, não em página vazia
- [ ] Nenhum erro ou warning novo no console do browser
- [ ] Funciona com JavaScript lento: sem salto de layout depois da hidratação

## Paridade visual

- [ ] Regressão visual passa nos 3 viewports (375, 768, 1280) e nos 2 temas
- [ ] Se algum snapshot foi atualizado, **a PR explica por quê** — atualização sem
      justificativa não passa na revisão
- [ ] Rota **nova** (sem baseline legado): screenshots anexados na PR, claro e
      escuro, e o critério passa a ser funcional

## Conteúdo

- [ ] **Nenhum texto de conteúdo hardcoded** — todo texto editável vem do Payload
- [ ] Microcopy de interface fica no código ou no arquivo de tradução, nunca no CMS
- [ ] Se faltou campo no modelo, a PR **volta ao spec e adiciona o campo**; não
      contorna no componente
- [ ] Nenhuma URL de imagem externa (`unsplash`, `picsum`, `wp-content`) —
      no `src`. O campo `credit` da mídia **guarda** a URL de origem de
      propósito: é proveniência, não requisição (D-27)
- [ ] Toda imagem tem `alt` vindo do Media

## Código

- [ ] Componente de apresentação **não busca dado** — nada de `payload.*` ou
      `fetch` fora de `page.tsx`
- [ ] `components/ui/*` não importa `@/payload-types`
- [ ] Dado passa por **mapper**; o documento cru não chega ao componente
- [ ] Componentes do design system reaproveitados; **bloco ou componente novo tem
      justificativa na PR** do porquê nenhum existente serve
- [ ] `pnpm lint` e `pnpm typecheck` limpos
- [ ] Diff **abaixo de ~400 linhas**. Acima disso, presume-se refactor misturado ao
      porte: reverter a melhoria e registrar em `debito-tecnico.md`

## Testes

- [ ] Smoke test cobre a rota nova
- [ ] Teste de regressão visual adicionado
- [ ] Se a PR tem lógica (mapper, conversor, parser), tem teste unitário
- [ ] CI verde

## SEO

- [ ] `generateMetadata` com title e description próprios, nos dois locales
- [ ] `canonical` e `hreflang` recíproco
- [ ] JSON-LD quando o tipo se aplica
- [ ] Rota entra no `sitemap.ts` — ou é explicitamente excluída, com motivo
- [ ] URL legada correspondente mapeada no `redirects.csv`

## Acessibilidade

- [ ] Relatório do axe anexado (não reprova — D-13)
- [ ] Navegação por teclado funciona nos elementos interativos da rota
- [ ] Hierarquia de headings sem salto (um `h1` por página)

## Documentação

- [ ] `CLAUDE.md` atualizado **se** a PR estabeleceu um padrão novo
- [ ] Task marcada `done` em `tasks.md`
- [ ] Achado fora do escopo registrado em `debito-tecnico.md`, não corrigido de
      passagem

---

## Definição de pronto — fases sem rota

### Migração de conteúdo (4a, 4b, 4c)

- [ ] Script **idempotente**: roda 2× sem duplicar registro
- [ ] Amostra manual de 20 itens conferida: formatação, imagens, links internos
- [ ] Nenhum item com corpo vazio publicado
- [ ] Toda imagem baixada, com `alt`; nenhuma referência a `wp-content` no banco
- [ ] Redirects gerados e validados contra staging

### Infraestrutura (1, 6)

- [ ] Documentado em `docs/04-infra/`
- [ ] Reproduzível do zero por outra pessoa, seguindo só a documentação
- [ ] Segredo em variável de ambiente — **nunca no repositório**
- [ ] Se a task cria backup: **restore testado**, não só o dump rodando

---

## Regras invioláveis

Valem para toda PR do projeto. Quebrar qualquer uma é motivo de reprovação, não de
discussão.

1. **Porte fiel antes de refatorar.** Melhoria identificada durante o porte vai
   para `debito-tecnico.md`, não para o diff.
2. **Uma PR por rota.** Diff pequeno é a única forma de revisão real de código
   gerado por IA.
3. **Nunca hardcodar conteúdo editável.** Se o modelo não cobre, o modelo muda.
4. **Componente de apresentação não busca dado.**
5. **Nada vai ao ar sem corpo.** Página de detalhe sem conteúdo fica rascunho —
   *thin content* prejudica o domínio inteiro (D-08).
6. **Segredo não entra no repositório.** E o `define` do `vite.config.ts:12` não é
   portado, em hipótese alguma.
