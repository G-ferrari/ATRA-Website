---
status: registro
atualizado_em: 2026-08-25
depende_de: [runbook-cutover.md]
---

# Ensaio parcial de cutover — 25/08/2026

O ensaio completo (MIG-132) exige `staging.atra.com.br` e a simulação de DNS,
que esperam o acesso à Cloudflare (P-23). Este registro cobre **tudo que o
runbook pede e não toca DNS**, executado contra o staging real
(`srv1927832.hstgr.cloud`) — para que, no dia do ensaio completo, só o DNS
seja novidade.

## O que foi provado, com o resultado

| Item do runbook | Evidência |
|---|---|
| Toda linha do `redirects.csv` responde no ambiente real | **261/261** pela ferramenta versionada (`infra/cutover/validar-redirects.mjs`): cadeia completa seguida, destino 200 em ≤2 saltos, 410s corretos após a normalização de barra |
| Backup restaurável, não só gravado | Dump fresco (207 posts — o retrato sem fixtures) restaurado em base limpa com contagem por tabela: 207/352/4/18/1 |
| Rollback de deploy | Exercitado **3×** por falhas reais de rede — o site nunca saiu do ar; a tag anterior voltou sozinha |
| TLS válido | Let's Encrypt no hostname da Hostinger; `staging.atra.com.br` pré-configurado no Caddy, a um registro A de distância |
| Formulário de contato grava antes de avisar | Contrato de MIG-100 no ar; sem chave do Resend, `notified: false` visível no admin |
| Newsletter com dupla confirmação | Inscrição pela caixa real da home → pendente com token de 48 hex → clique → `confirmedAt` carimbado → aterrissagem. Token inválido cai em `/newsletter/invalida` sem virar oráculo |
| Anti-spam ativo | A armadilha de tempo pegou **o robô do próprio ensaio**: submissão em <3s recebeu o sucesso falso e nada foi gravado — o teste teve que aprender a esperar como gente |
| Download gated | PDF subiu ao bucket privado → a revalidação armou o formulário na página pública → navegador real submeteu → download **200 do arquivo exato** → **403 sem assinatura** → limpeza devolveu o botão inerte sozinha |
| Candidatura invisível sem P-17 | Página de vaga responde 200 com conteúdo íntegro e **zero** traço do formulário com a flag desligada |
| Publicar no CMS atualiza o site | Provado duas vezes ao vivo: termo de glossário (criar/apagar) e o próprio gate de material (armar/desarmar) |
| `noindex` e `robots.txt` do staging | `X-Robots-Tag` presente, robots bloqueando — e é o item que o runbook manda **desligar** na virada |

## Os três defeitos que o ensaio pegou — e por que ele existe

Nenhum era visível em teste local; os três matariam fluxo de visitante real:

1. **URL assinada apontando para `minio:9000`** — o endpoint interno do compose
   na mão do visitante. Corrigido: `S3_PUBLIC_ENDPOINT` + rota `/atra-privado/*`
   no Caddy (que descarta o `Authorization`, porque o Basic do staging quebra
   assinatura AWS).
2. **Redirect da confirmação para `https://0.0.0.0:3000/`** — atrás do proxy,
   `req.nextUrl.origin` é o bind interno. O clique vem de um e-mail, o único
   contexto sem sessão para disfarçar o erro. Corrigido: base na URL canônica.
3. **`backup.sh` morrendo mudo** — variável ausente sob `pipefail` matava o
   script antes do trap; o backup "rodava" sem rodar. Corrigido e re-provado.

## O que fica para o ensaio completo (MIG-132)

- Simulação de DNS via `/etc/hosts` com `staging.atra.com.br` — espera P-23
- Amostra de 30 URLs com o domínio real
- O passo "desligar noindex" com conferência
- E-mail de verdade nos fluxos (espera a chave do Resend)
