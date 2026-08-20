'use client'

import { useEffect, useRef, useState } from 'react'

import { aleatorio, congelado } from '@/lib/e2e'

/* Campo de partículas do herói da home — porte de
 * `legacy/src/components/aether-flow-hero.tsx:23` (a classe) e `:165` (o laço).
 *
 * Desenha pontos azuis e laranjas ligados por linhas quando estão a menos de
 * 110px, e os afasta do ponteiro num raio de 160px.
 *
 * ⚠️ Sob `?e2e=1` a velocidade é zero e as posições vêm do gerador
 * determinístico, então todo quadro é idêntico — mas o laço **continua
 * rodando**, porque ele é quem repinta depois de um `resize`. Parar o
 * `requestAnimationFrame` deixaria o canvas em branco quando a captura
 * redimensiona a janela. */

class Particula {
  x: number
  y: number
  vx: number
  vy: number
  raio: number
  laranja: boolean

  constructor(largura: number, altura: number) {
    this.x = aleatorio() * largura
    this.y = aleatorio() * altura
    this.vx = congelado() ? 0 : (aleatorio() - 0.5) * 0.7
    this.vy = congelado() ? 0 : (aleatorio() - 0.5) * 0.7
    this.raio = aleatorio() * 2 + 1.5
    // ~1 em cada 6 é laranja.
    this.laranja = aleatorio() < 1 / 6
  }

  mover(largura: number, altura: number, mouse: { x: number | null; y: number | null; raio: number }) {
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x
      const dy = this.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < mouse.raio && dist > 0) {
        const forca = (mouse.raio - dist) / mouse.raio
        const angulo = Math.atan2(dy, dx)
        this.x += Math.cos(angulo) * forca * 3.5
        this.y += Math.sin(angulo) * forca * 3.5
      }
    }

    this.x += this.vx
    this.y += this.vy

    if (this.x < 0) this.x = largura
    else if (this.x > largura) this.x = 0
    if (this.y < 0) this.y = altura
    else if (this.y > altura) this.y = 0
  }
}

const DISTANCIA_MAXIMA = 110

export function CampoDeParticulas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ⚠️ O tema é **estado**, com o laço redesenhado a cada troca, e não uma
   * leitura por quadro — que seria mais simples e daria o mesmo desenho.
   *
   * O motivo é o gerador determinístico: no gabarito
   * (`aether-flow-hero.tsx:145`) a troca de tema faz o efeito rodar de novo, o
   * que recria a nuvem e **consome mais números da sequência**. Ler a classe por
   * quadro pularia esse consumo, e o campo de partículas do app novo sairia
   * deslocado do gabarito sem nenhuma diferença de layout para explicar. */
  const [noite, setNoite] = useState(true)

  useEffect(() => {
    const conferir = () =>
      setNoite(
        document.documentElement.classList.contains('dark') ||
          !document.documentElement.classList.contains('light'),
      )
    conferir()
    const observador = new MutationObserver(conferir)
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let quadro: number
    let particulas: Particula[] = []
    let visivel = true
    let ultimoQuadro = 0
    const intervaloAlvo = 1000 / 60
    const mouse = { x: null as number | null, y: null as number | null, raio: 160 }

    const aoRedimensionar = () => {
      const largura = container.clientWidth
      const altura = container.clientHeight
      canvas.width = largura
      canvas.height = altura

      const densidade = Math.floor((largura * altura) / 22000)
      const quantas = Math.max(35, Math.min(densidade, 60))
      particulas = []
      for (let i = 0; i < quantas; i++) particulas.push(new Particula(largura, altura))
    }

    const desenhar = (agora: number = performance.now()) => {
      if (!visivel) return
      quadro = requestAnimationFrame(desenhar)

      const decorrido = agora - ultimoQuadro
      if (decorrido < intervaloAlvo - 1) return
      ultimoQuadro = agora - (decorrido % intervaloAlvo)

      const { width: largura, height: altura } = canvas
      ctx.fillStyle = noite ? '#0F1117' : '#F7F8FA'
      ctx.fillRect(0, 0, largura, altura)

      /* Desenho em lote: os pontos de cada cor entram num `Path2D` só, e as
         linhas em mais dois. São 4 chamadas de pintura por quadro em vez de
         300 — é assim no gabarito, e é o que segura os 60fps. */
      const azuis: Particula[] = []
      const laranjas: Particula[] = []
      for (const p of particulas) {
        p.mover(largura, altura, mouse)
        ;(p.laranja ? laranjas : azuis).push(p)
      }

      for (const [grupo, cor] of [
        [azuis, noite ? 'rgba(60, 152, 250, 0.85)' : 'rgba(60, 152, 250, 0.95)'],
        [laranjas, noite ? 'rgba(255, 139, 8, 0.9)' : 'rgba(255, 139, 8, 1)'],
      ] as const) {
        if (grupo.length === 0) continue
        ctx.beginPath()
        for (const p of grupo) {
          ctx.moveTo(p.x + p.raio, p.y)
          ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2)
        }
        ctx.fillStyle = cor
        ctx.fill()
      }

      const normais: number[][] = []
      const realcadas: number[][] = []
      for (let i = 0; i < particulas.length; i++) {
        const a = particulas[i]
        for (let j = i + 1; j < particulas.length; j++) {
          const b = particulas[j]
          const dx = a.x - b.x
          if (Math.abs(dx) > DISTANCIA_MAXIMA) continue
          const dy = a.y - b.y
          if (Math.abs(dy) > DISTANCIA_MAXIMA) continue
          if (dx * dx + dy * dy >= DISTANCIA_MAXIMA * DISTANCIA_MAXIMA) continue

          let pertoDoMouse = false
          if (mouse.x !== null && mouse.y !== null) {
            const mx = (a.x + b.x) * 0.5 - mouse.x
            const my = (a.y + b.y) * 0.5 - mouse.y
            pertoDoMouse = mx * mx + my * my < 20000
          }
          ;(pertoDoMouse ? realcadas : normais).push([a.x, a.y, b.x, b.y])
        }
      }

      for (const [linhas, cor, espessura] of [
        [normais, noite ? 'rgba(60, 152, 250, 0.18)' : 'rgba(40, 130, 230, 0.28)', 0.8],
        [realcadas, noite ? 'rgba(255, 139, 8, 0.65)' : 'rgba(255, 139, 8, 0.75)', 1.2],
      ] as const) {
        if (linhas.length === 0) continue
        ctx.beginPath()
        for (const [x1, y1, x2, y2] of linhas) {
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
        }
        ctx.strokeStyle = cor
        ctx.lineWidth = espessura
        ctx.stroke()
      }
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting && !document.hidden
        cancelAnimationFrame(quadro)
        if (visivel) {
          ultimoQuadro = performance.now()
          quadro = requestAnimationFrame(desenhar)
        }
      },
      { threshold: 0.01 },
    )
    observador.observe(container)

    const aoMover = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const aoSair = () => {
      mouse.x = null
      mouse.y = null
    }
    const aoTocar = (e: TouchEvent) => {
      if (e.touches.length === 0) return
      const r = canvas.getBoundingClientRect()
      mouse.x = e.touches[0].clientX - r.left
      mouse.y = e.touches[0].clientY - r.top
    }

    aoRedimensionar()
    window.addEventListener('resize', aoRedimensionar, { passive: true })
    container.addEventListener('mousemove', aoMover, { passive: true })
    container.addEventListener('mouseleave', aoSair, { passive: true })
    container.addEventListener('touchmove', aoTocar, { passive: true })
    container.addEventListener('touchend', aoSair, { passive: true })

    ultimoQuadro = performance.now()
    quadro = requestAnimationFrame(desenhar)

    return () => {
      observador.disconnect()
      window.removeEventListener('resize', aoRedimensionar)
      container.removeEventListener('mousemove', aoMover)
      container.removeEventListener('mouseleave', aoSair)
      container.removeEventListener('touchmove', aoTocar)
      container.removeEventListener('touchend', aoSair)
      cancelAnimationFrame(quadro)
    }
  }, [noite])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0" />
}
