// Converte os renders de _ref/ em AVIF + WebP responsivos dentro de public/img/
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const sources = {
  'danilas-fachada': 'Enscape_2025-11-27-19-41-37.png',
  'danilas-vitrine': 'Enscape_2025-11-26-22-54-13.png',
  fitness: 'Enscape_2025-03-01-14-57-03.png',
  acai: 'Enscape_2025-04-08-02-55-11.png',
  escritorio: 'Enscape_2025-01-29-23-43-45.png',
}
const widths = [640, 1280, 1920]
await mkdir('public/img', { recursive: true })

let webpTotal = 0
let avifTotal = 0
for (const [name, file] of Object.entries(sources)) {
  const meta = await sharp(`_ref/${file}`).metadata()
  for (const w of widths) {
    if (w > meta.width) continue
    const base = sharp(`_ref/${file}`).resize({ width: w })
    const webp = await base.clone().webp({ quality: 76, effort: 6 }).toFile(`public/img/${name}-${w}.webp`)
    const avif = await base.clone().avif({ quality: 52, effort: 6 }).toFile(`public/img/${name}-${w}.avif`)
    webpTotal += webp.size
    avifTotal += avif.size
    console.log(`${name}-${w}`, `webp ${Math.round(webp.size / 1024)}kB`, `avif ${Math.round(avif.size / 1024)}kB`)
  }
}
console.log(`total webp ${Math.round(webpTotal / 1024)}kB · avif ${Math.round(avifTotal / 1024)}kB`)
