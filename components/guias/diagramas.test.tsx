import { readFileSync } from "node:fs"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { DIAGRAMA_NAMES, resolveDiagrama } from "./diagramas"

describe("guide diagram registry", () => {
	it("renders the card index for the Ley 21.719 guide with every activity and its basis", () => {
		expect(DIAGRAMA_NAMES).toContain("ley-fichero-de-licitud")
		const html = renderToStaticMarkup(<>{resolveDiagrama("ley-fichero-de-licitud")}</>)
		expect(html.match(/data-card-index=""/g)).toHaveLength(1)
		expect(html.match(/data-card-status="/g)).toHaveLength(5)
		for (const text of [
			"Responder cotizaciones",
			"Facturar y despachar",
			"Contactos en el WhatsApp",
			"Pagar sueldos",
			"Enviar el newsletter",
			"Interés legítimo",
			"Contrato",
			"Obligación legal",
			"Consentimiento",
			"JUSTIFICAR O ELIMINAR",
			"Cada tratamiento de datos necesita una base de licitud; el que no la tiene sale del fichero.",
		])
			expect(html).toContain(text)
	})

	it("is placed in the guide and keeps the two existing Ley diagrams", () => {
		const mdx = readFileSync("content/guias/ley-21719-que-hacer-antes-del-1-de-diciembre.mdx", "utf8")
		const names = [...mdx.matchAll(/nombre="([^"]+)"/g)].map((match) => match[1])
		expect(names).toEqual(["ley-linea-de-tiempo", "ley-fichero-de-licitud", "ley-inventario"])
		for (const name of names) expect(DIAGRAMA_NAMES).toContain(name)
	})

	it("renders the invoice gate for the IA guide with the threshold and both trays", () => {
		expect(DIAGRAMA_NAMES).toContain("ia-umbral-de-confianza")
		const html = renderToStaticMarkup(<>{resolveDiagrama("ia-umbral-de-confianza")}</>)
		expect(html.match(/data-invoice-gate=""/g)).toHaveLength(1)
		expect(html.match(/data-hopper="/g)).toHaveLength(6)
		expect(html.match(/data-stack="system"/g)).toHaveLength(5)
		expect(html.match(/data-stack="review"/g)).toHaveLength(1)
		for (const text of [
			"0,85",
			"SISTEMA",
			"REVISIÓN",
			"Al sistema",
			"A revisión",
			"Las facturas leídas con confianza sobre el umbral siguen solas al sistema; las demás las revisa una persona.",
		])
			expect(html).toContain(text)
	})

	it("is placed after the confidence paragraph of the IA guide and keeps its two diagrams", () => {
		const mdx = readFileSync("content/guias/ia-en-procesos-por-donde-empezar.mdx", "utf8")
		const names = [...mdx.matchAll(/nombre="([^"]+)"/g)].map((match) => match[1])
		expect(names).toEqual(["ia-que-proceso", "ia-umbral-de-confianza", "ia-paso-que-cambia"])
		const confidence = mdx.indexOf("caso se enruta a una persona")
		expect(confidence).toBeGreaterThan(0)
		expect(mdx.indexOf('nombre="ia-umbral-de-confianza"')).toBeGreaterThan(confidence)
	})
})
