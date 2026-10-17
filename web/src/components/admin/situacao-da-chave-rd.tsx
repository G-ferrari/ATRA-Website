import type { UIFieldServerComponent } from 'payload'

import { chaveDoRdConfigurada } from '@/lib/rd-marketing'

import estilos from './situacao-da-chave-rd.module.css'

/* "Chave do RD: configurada / ausente", em Sistema → Integrações (15/10).
 *
 * ⚠️ Componente de **servidor**, sem `'use client'`, e é isso que o torna
 * seguro: ele lê o ambiente na renderização e manda ao navegador só o texto
 * pronto. Virar componente de cliente obrigaria a passar algo do servidor
 * como prop — e o próximo a mexer poderia passar a chave. O valor nunca sai
 * de `chaveDoRdConfigurada`. */

const TEXTOS = {
  pt: {
    rotulo: 'Chave do RD',
    configurada: 'Configurada',
    ausente: 'Ausente',
    explicacaoOk: 'O site consegue mandar os leads ao RD. A chave fica no servidor e não aparece aqui.',
    explicacaoAusente:
      'Sem a chave, nada vai ao RD, mesmo com a integração ligada. Quem cuida do servidor põe a variável RDSTATION_MARKETING_API_KEY (a Chave de API da App Store do RD).',
  },
  en: {
    rotulo: 'RD key',
    configurada: 'Configured',
    ausente: 'Missing',
    explicacaoOk: 'The site can send leads to RD. The key lives on the server and is not shown here.',
    explicacaoAusente:
      'Without the key nothing goes to RD, even when enabled. Whoever runs the server sets RDSTATION_MARKETING_API_KEY (the API key from the RD App Store).',
  },
}

export const SituacaoDaChaveRd: UIFieldServerComponent = ({ i18n }) => {
  const t = i18n?.language === 'en' ? TEXTOS.en : TEXTOS.pt
  const configurada = chaveDoRdConfigurada()
  return (
    <div className={estilos.quadro} data-testid="situacao-da-chave-rd">
      <div className={estilos.linha}>
        <span>{t.rotulo}</span>
        <span className={`${estilos.selo} ${configurada ? estilos.configurada : estilos.ausente}`}>
          {configurada ? t.configurada : t.ausente}
        </span>
      </div>
      <p className={estilos.explicacao}>{configurada ? t.explicacaoOk : t.explicacaoAusente}</p>
    </div>
  )
}
