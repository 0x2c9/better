import fs from 'node:fs'
import { load } from 'cheerio'

const svgFile = './assets/sprite.svg'
const indexFile = './icons/index.ts'
const svgContent = fs.readFileSync(svgFile, 'utf8')
const $ = load(svgContent, { xmlMode: true })

const icons: Record<string, string> = {}

$('symbol').each((_, symbol) => {
	const id = $(symbol).attr('id')
	if (id) {
		console.log(id)
		// Modify this line to concatenate the correct prefix and symbol name
		icons[id] = `${id}`
	}
})

const content = `export const ICONS = ${JSON.stringify(icons, null, 2)} as const;\n`

fs.writeFileSync(indexFile, content)
