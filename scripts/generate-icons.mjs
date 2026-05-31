import sharp from 'sharp'

async function svgToPng(input, output) {
  await sharp(input).png().toFile(output)
  console.log(`converted: ${output}`)
}

await svgToPng('public/pwa-192x192.svg', 'public/pwa-192x192.png')
await svgToPng('public/pwa-512x512.svg', 'public/pwa-512x512.png')
