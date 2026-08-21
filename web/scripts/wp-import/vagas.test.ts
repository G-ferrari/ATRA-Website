import { describe, expect, it } from 'vitest'

import { corpoDaVaga, modeloDeTrabalho } from './vagas'

/* Reproduz a página do WP: cabeçalho do template, banner, a vaga e o
   formulário de candidatura no fim. */
const PAGINA = `
<div class="elementor">
  <div class="e-con-inner">
    <h2 class="elementor-heading-title">Explore nossas vagas e venha fazer parte do nosso time de ATRAentes!

#vemserATRA</h2>
    <img src="https://www.atra.com.br/wp-content/uploads/2024/04/Site-diversas-1.jpg" alt="" />
  </div>
  <div class="e-con-inner">
    <h2 class="elementor-heading-title">Engenheiro(a) de Dados SR &#8211; Azure/Databricks</h2>
    <p>A ATRA está em busca de um(a) Engenheiro(a) de Dados Sênior.</p>
    <h3>Responsabilidades:</h3>
    <ul><li><p>Construir pipelines.</p></li><li>Otimizar custos.</li></ul>
    <h3>Nós somos a ATRA</h3>
    <p>Somos apaixonados por dados!</p>
    <h3>Envie seu Currículo e faça parte do nosso time de profissionais!</h3>
    <form><select><option>Governança de Dados</option><option>Marketing</option></select>
    <input type="file" /><button>Anexar Currículo</button></form>
  </div>
</div>`

describe('corpoDaVaga', () => {
  const html = corpoDaVaga(PAGINA, 'Engenheiro(a) de Dados SR – Azure/Databricks')

  it('começa depois do título e não repete o cabeçalho do template', () => {
    expect(html).not.toMatch(/vemserATRA/)
    expect(html).not.toMatch(/Engenheiro\(a\) de Dados SR/)
    expect(html.startsWith('<p>A ATRA está em busca')).toBe(true)
  })

  it('mantém as seções da vaga', () => {
    expect(html).toMatch(/<h3>Responsabilidades:<\/h3>/)
    expect(html).toMatch(/<h3>Nós somos a ATRA<\/h3>/)
    expect(html).toMatch(/Somos apaixonados por dados/)
  })

  /* O `<p>` dentro do `<li>` entraria duas vezes sem a guarda de aninhamento. */
  it('não duplica bloco aninhado', () => {
    expect(html.match(/Construir pipelines/g)).toHaveLength(1)
  })

  it('corta o formulário de candidatura e o que vem depois', () => {
    expect(html).not.toMatch(/Envie seu Currículo/)
    expect(html).not.toMatch(/Governança de Dados|Anexar Currículo/)
  })

  it('casa o título mesmo com entidade HTML no meio', () => {
    // `&#8211;` no HTML contra `–` no título vindo de `title.rendered` decodificado
    expect(corpoDaVaga(PAGINA, 'Engenheiro(a) de Dados SR - Azure/Databricks')).toBe(html)
  })
})

describe('modeloDeTrabalho', () => {
  it('lê o remoto escrito em texto corrido', () => {
    expect(modeloDeTrabalho('Contratação PJ com salário fixo. Atuação remota, com visitas a clientes.')).toBe('remote')
  })

  /* A frase do híbrido cita "presenciais" e "remotos" na mesma linha: procurar
     "remoto" primeiro classificaria as vagas híbridas como remotas. */
  it('reconhece híbrido mesmo quando a frase cita presencial e remoto', () => {
    expect(modeloDeTrabalho('Contrato PJ. Híbrido – São Paulo/SP (3 dias presenciais e 2 dias remotos)')).toBe('hybrid')
  })

  it('reconhece presencial', () => {
    expect(modeloDeTrabalho('Atuação 100% presencial em São Paulo.')).toBe('onsite')
  })

  it('cai no default do campo quando a página não diz', () => {
    expect(modeloDeTrabalho('Contrato PJ, necessário CNPJ.')).toBe('remote')
  })
})
