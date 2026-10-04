/* Último passo do seed: as migrações de **dados** que dependem de conteúdo.
 *
 * ⚠️ Em banco novo o `migrate` roda antes do seed, as travas dessas migrações
 * não acham as páginas e elas ficam marcadas como feitas sem ter feito nada (a
 * armadilha do CLAUDE.md). Rodá-las aqui de novo deixa o banco do CI no mesmo
 * formato da homologação — e o e2e testa o site que vai ao ar, não o de antes.
 * São idempotentes: onde já agiram, a trava pula.
 *
 * Os importadores do WordPress fazem o mesmo no fim deles, pelo mesmo motivo. */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

import { up as semEnderecoFixo } from '../../src/migrations/20260929_223000_sem_endereco_fixo'
import { up as selosNaPaginaDoGoogleCloud } from '../../src/migrations/20260929_223100_selos_na_pagina_do_google_cloud'
import { up as fimDasPaginasInternas } from '../../src/migrations/20260929_223200_fim_das_paginas_internas'
import { criarMateriasDaImprensa } from '../../src/migrations/20261002_170000_materias_da_imprensa'
import { preencherPainelDeConversao } from '../../src/migrations/20261002_203000_painel_de_conversao'

const payload = await getPayload({ config })

await semEnderecoFixo({ payload } as never)
await selosNaPaginaDoGoogleCloud({ payload } as never)
await fimDasPaginasInternas({ payload } as never)

/* As matérias de "ATRA na mídia" (D-49) são conteúdo real, não fixture: entram
 * em todo banco, e aqui sem a trava da carga — é este o banco que não a tem. A
 * migração pula no `migrate` também porque o job `verify` do CI não tem storage
 * para as capas; este passo roda onde o MinIO existe. */
await criarMateriasDaImprensa({ payload } as never, { exigirCarga: false })

/* O painel de conversão do menu de Soluções (D-51): os textos já entraram no
 * `migrate`; aqui, com os cases criados, a migração liga os de cada aba. */
await preencherPainelDeConversao({ payload } as never)

process.exit(0)
