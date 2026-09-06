import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { JsonLd } from "@/components/json-ld"

describe("JsonLd", () => {
	it("renders a single object as one ld+json script", () => {
		const html = renderToStaticMarkup(<JsonLd data={{ "@type": "Thing", name: "A" }} />)

		expect(html).toContain('<script type="application/ld+json">')
		expect(html).toContain('"@type":"Thing"')
		expect(html).toContain('"name":"A"')
	})

	it("renders an array of objects as one script containing the array", () => {
		const html = renderToStaticMarkup(
			<JsonLd data={[{ "@type": "A" }, { "@type": "B" }]} />,
		)

		expect(html.match(/<script/g)).toHaveLength(1)
		expect(html).toContain('"@type":"A"')
		expect(html).toContain('"@type":"B"')
	})

	it("escapes '<' so a script tag can never be closed early", () => {
		const html = renderToStaticMarkup(
			<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />,
		)

		expect(html).not.toContain("</script><script>alert")
		expect(html).toContain("\\u003c/script>\\u003cscript>alert(1)\\u003c/script>")
	})
})
