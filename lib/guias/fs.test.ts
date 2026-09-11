import { describe, expect, it, vi } from "vitest"

const mockReaddir = vi.fn()
const mockReadFile = vi.fn()
const mockAccess = vi.fn()

vi.mock("node:fs/promises", () => ({
	readdir: (...args: unknown[]) => mockReaddir(...args),
	readFile: (...args: unknown[]) => mockReadFile(...args),
	access: (...args: unknown[]) => mockAccess(...args),
}))

const { getAllGuias, getGuiaBySlug } = await import("@/lib/guias/fs")

const VALID_RAW = `---
title: Guía de prueba
description: Descripción de prueba para la guía.
publishedAt: "2026-09-06"
tema: ia
portada: /img/guias/prueba.png
portadaAlt: Descripción de la portada de prueba
---

Cuerpo de la guía de prueba.
`

const VALID_RAW_WITH_RELIEVE = `---
title: Guía de prueba
description: Descripción de prueba para la guía.
publishedAt: "2026-09-06"
tema: ia
portada: /img/guias/prueba.png
portadaAlt: Descripción de la portada de prueba
portadaRelieve: /img/guias/prueba-relieve.png
---

Cuerpo de la guía de prueba.
`

function enoent(): NodeJS.ErrnoException {
	const error = new Error("ENOENT") as NodeJS.ErrnoException
	error.code = "ENOENT"
	return error
}

describe("getAllGuias", () => {
	it("returns guides whose cover file exists under public", async () => {
		mockReaddir.mockResolvedValue(["prueba.mdx"])
		mockReadFile.mockResolvedValue(VALID_RAW)
		mockAccess.mockResolvedValue(undefined)

		const guias = await getAllGuias()

		expect(guias).toHaveLength(1)
		expect(guias[0]?.slug).toBe("prueba")
		expect(mockAccess).toHaveBeenCalledWith(expect.stringContaining("public/img/guias/prueba.png"))
	})

	it("throws an error naming the slug and the missing path when the cover file is absent", async () => {
		mockReaddir.mockResolvedValue(["prueba.mdx"])
		mockReadFile.mockResolvedValue(VALID_RAW)
		mockAccess.mockRejectedValue(enoent())

		await expect(getAllGuias()).rejects.toThrow(/prueba/)
		await expect(getAllGuias()).rejects.toThrow(/img\/guias\/prueba\.png/)
	})

	it("also checks portadaRelieve exists when present", async () => {
		mockReaddir.mockResolvedValue(["prueba.mdx"])
		mockReadFile.mockResolvedValue(VALID_RAW_WITH_RELIEVE)
		mockAccess.mockResolvedValue(undefined)

		await getAllGuias()

		expect(mockAccess).toHaveBeenCalledWith(
			expect.stringContaining("public/img/guias/prueba-relieve.png")
		)
	})

	it("throws when portadaRelieve is present but its file is missing", async () => {
		mockReaddir.mockResolvedValue(["prueba.mdx"])
		mockReadFile.mockResolvedValue(VALID_RAW_WITH_RELIEVE)
		mockAccess.mockImplementation((filePath: string) =>
			filePath.includes("prueba-relieve.png")
				? Promise.reject(enoent())
				: Promise.resolve(undefined)
		)

		await expect(getAllGuias()).rejects.toThrow(/prueba/)
		await expect(getAllGuias()).rejects.toThrow(/img\/guias\/prueba-relieve\.png/)
	})
})

describe("getGuiaBySlug", () => {
	it("returns the guide when its cover file exists", async () => {
		mockReadFile.mockResolvedValue(VALID_RAW)
		mockAccess.mockResolvedValue(undefined)

		const guia = await getGuiaBySlug("prueba")

		expect(guia?.meta.slug).toBe("prueba")
	})

	it("returns undefined when the .mdx file itself does not exist", async () => {
		mockReadFile.mockRejectedValue(enoent())

		const guia = await getGuiaBySlug("no-existe")

		expect(guia).toBeUndefined()
	})

	it("throws (does not silently return undefined) when the cover file is missing", async () => {
		mockReadFile.mockResolvedValue(VALID_RAW)
		mockAccess.mockRejectedValue(enoent())

		await expect(getGuiaBySlug("prueba")).rejects.toThrow(/prueba/)
	})

	it("throws when portadaRelieve is present but its file is missing", async () => {
		mockReadFile.mockResolvedValue(VALID_RAW_WITH_RELIEVE)
		mockAccess.mockImplementation((filePath: string) =>
			filePath.includes("prueba-relieve.png")
				? Promise.reject(enoent())
				: Promise.resolve(undefined)
		)

		await expect(getGuiaBySlug("prueba")).rejects.toThrow(/img\/guias\/prueba-relieve\.png/)
	})
})
