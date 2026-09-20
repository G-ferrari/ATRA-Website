import { describe, expect, it } from 'vitest'

import { paraEmbed } from './video'

describe('paraEmbed', () => {
  it('aceita as formas de YouTube que se cola no admin', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=abc123',
      'https://youtu.be/abc123',
      'https://www.youtube.com/embed/abc123',
      'https://www.youtube.com/watch?v=abc123&t=42s',
    ]) {
      expect(paraEmbed(url), url).toEqual({
        src: 'https://www.youtube-nocookie.com/embed/abc123',
        titulo: 'YouTube',
      })
    }
  })

  it('aceita Vimeo', () => {
    expect(paraEmbed('https://vimeo.com/76979871')).toEqual({
      src: 'https://player.vimeo.com/video/76979871',
      titulo: 'Vimeo',
    })
  })

  it('devolve null em vez de montar um iframe quebrado', () => {
    for (const url of [null, undefined, '', 'não é url', 'https://exemplo.com/video.mp4']) {
      expect(paraEmbed(url as string | null)).toBeNull()
    }
  })
})
