# Context — Task 005: motor de pontuação do diagnóstico RC18

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/7
**Branch:** feature/rc18 · **Depende de:** —

## Entregue
- `web/src/lib/diagnostico-rc18.ts` — puro e determinístico:
  - `DIMENSOES` — as 12 oficiais do Art. 2º da RC 18/2025 (id, nome, pergunta de autoavaliação).
  - `NIVEIS` — escala de maturidade 0–3 (Inexistente → Em produção), alinhada ao DAMA
    nível 1→3 do material da ATRA; `PISO_DA_NORMA = 3`.
  - `calcularIndice(respostas) → { ipRc18 (0–100), faixa, porDimensao, lacunas, respondidas }`.
    Índice = soma dos níveis / (12×3). Não respondida conta como 0.
  - `validarRespostas` — fonte única de validação (descarta chave desconhecida e nível fora
    de 0–3); usada pelo cliente e pelo servidor (task 007 recalcula, não confia no cliente).
  - `faixaDe` — limites indicativos (<45 inicial, 45–74 intermediário, ≥75 avançado).
- `web/src/lib/diagnostico-rc18.test.ts` — 10 testes (0%, 100%, 67%, parcial, vazio,
  validação, não-objeto, faixas, determinismo).

## Verificação
- `pnpm test diagnostico-rc18`: 10/10 verdes. `typecheck` + `lint` verdes.

## Notas
- Índice é **indicativo** (autoavaliação por percepção), não veredito de conformidade — a
  ilha (006) deixa isso explícito.
- A lib fica em `lib/` puro para o componente cliente importar sem arrastar servidor.
