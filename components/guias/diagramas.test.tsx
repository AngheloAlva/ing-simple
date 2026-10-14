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

	it("renders the refresh press for the monthly-report guide with one definition and one number", () => {
		expect(DIAGRAMA_NAMES).toContain("reporte-una-definicion")
		const html = renderToStaticMarkup(<>{resolveDiagrama("reporte-una-definicion")}</>)
		expect(html.match(/data-refresh-press=""/g)).toHaveLength(1)
		expect(html.match(/data-sheet="/g)).toHaveLength(3)
		expect(html.match(/data-area-value="/g)).toHaveLength(3)
		expect(html.match(/>118</g)).toHaveLength(3)
		for (const text of [
			"Ventas netas = facturado − notas de crédito",
			"Ventas",
			"Finanzas",
			"Operaciones",
			"A las 06:00 el modelo estampa la misma cifra, desde una sola definición, en el informe de cada área.",
		])
			expect(html).toContain(text)
	})

	it("is placed after the refresh paragraph and before the checklist of the monthly-report guide", () => {
		const mdx = readFileSync("content/guias/por-que-el-informe-del-mes-se-arma-a-mano.mdx", "utf8")
		const names = [...mdx.matchAll(/nombre="([^"]+)"/g)].map((match) => match[1])
		expect(names).toEqual(["reporte-tres-capas", "reporte-una-definicion"])
		const figure = mdx.indexOf('nombre="reporte-una-definicion"')
		expect(figure).toBeGreaterThan(mdx.indexOf("El refresco se programa"))
		expect(figure).toBeLessThan(mdx.indexOf("<Checklist>"))
	})
})
