"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef, Suspense, useEffect } from "react"
import { motion, MotionStyle } from "motion/react"
import * as THREE from "three"
import {
	Zap,
	Globe,
	Workflow,
	BarChart3,
	Smartphone,
	ChevronRight,
	CheckCircle2,
	type LucideIcon,
} from "lucide-react"

const glowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glowFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float centerDist = abs(vUv.x - 0.5) * 2.0;

    float coreGlow = exp(-centerDist * 180.0) * 2.5;
    float midGlow = exp(-centerDist * 66.0) * 1.2;
    float outerGlow = exp(-centerDist * 6.0) * 0.5;
    float glow = coreGlow + midGlow + outerGlow;

    float pulse = sin(uTime * 1.5) * 0.08 + 0.92;
    glow *= pulse;

    float scanLine = sin(vUv.y * 60.0 + uTime * 2.0) * 0.02 + 0.98;
    glow *= scanLine;

    vec3 glowColor = vec3(0.94, 0.27, 0.27);

    float edgeDist = abs(vUv.y - 0.5) * 2.0;
    float vertFade = 1.0 - smoothstep(0.2, 0.95, edgeDist);
    glow *= vertFade;

    vec3 colorOut = glowColor * glow;
    float alpha = max(max(colorOut.r, colorOut.g), colorOut.b);
    vec3 normalizedColor = colorOut / max(alpha, 0.001);
    alpha = smoothstep(0.0, 1.0, alpha);

    gl_FragColor = vec4(normalizedColor, alpha);
  }
`

const backgroundGlowFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float centerDist = abs(vUv.x - 0.5) * 2.0;

    float wideGlow = exp(-centerDist * 3.0) * 0.8;
    float softGlow = exp(-centerDist * 1.0) * 0.4;
    float glow = wideGlow + softGlow;

    float pulse = sin(uTime * 1.2) * 0.1 + 0.9;
    glow *= pulse;

    vec3 glowColor = vec3(0.94, 0.27, 0.27);

    float edgeDistY = abs(vUv.y - 0.5) * 2.0;
    float vertFade = 1.0 - smoothstep(0.0, 1.0, edgeDistY);
    glow *= vertFade;

    float edgeDistX = abs(vUv.x - 0.5) * 2.0;
    float horizFade = 1.0 - smoothstep(0.4, 0.9, edgeDistX);
    glow *= horizFade;

    vec3 colorOut = glowColor * glow;
    float alpha = max(max(colorOut.r, colorOut.g), colorOut.b);
    vec3 normalizedColor = colorOut / max(alpha, 0.001);
    alpha = smoothstep(0.0, 1.0, alpha) * 0.6;

    gl_FragColor = vec4(normalizedColor, alpha);
  }
`

function ResizeHandler(): null {
	const state = useThree()
	const glRef = useRef(state.gl)
	const cameraRef = useRef(state.camera)

	useEffect(
		function syncRefs() {
			glRef.current = state.gl
			cameraRef.current = state.camera
		},
		[state.gl, state.camera]
	)

	useEffect(
		function handleResize() {
			const canvas = state.gl.domElement
			const parent = canvas.parentElement
			if (!parent) return

			const parentEl = parent

			function updateSize() {
				const currentGl = glRef.current
				const currentCamera = cameraRef.current
				if (!currentGl || !currentCamera) return

				const width = parentEl.clientWidth
				const height = parentEl.clientHeight
				if (width > 0 && height > 0) {
					currentGl.setSize(width, height)
					if (currentCamera instanceof THREE.PerspectiveCamera) {
						currentCamera.aspect = width / height
						currentCamera.updateProjectionMatrix()
					}
				}
			}

			updateSize()

			const observer = new ResizeObserver(updateSize)
			observer.observe(parent)

			const interval = setInterval(updateSize, 500)
			setTimeout(updateSize, 100)
			setTimeout(updateSize, 300)
			setTimeout(updateSize, 1000)

			return function cleanup() {
				observer.disconnect()
				clearInterval(interval)
			}
		},
		[state.gl]
	)

	return null
}

function ResponsiveGlowBar() {
	const { viewport } = useThree()

	const baseViewportWidth = 7.5
	const scaleX = Math.min(viewport.width / baseViewportWidth, 1)

	return (
		<group scale={[scaleX, 1, 1]}>
			<GlowBar />
		</group>
	)
}

function GlowBar() {
	const materialRef = useRef<THREE.ShaderMaterial>(null)
	const bgMaterialRef = useRef<THREE.ShaderMaterial>(null)

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
		}),
		[]
	)

	const bgUniforms = useMemo(
		() => ({
			uTime: { value: 0 },
		}),
		[]
	)

	useFrame((state) => {
		if (materialRef.current?.uniforms.uTime) {
			materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
		}
		if (bgMaterialRef.current?.uniforms.uTime) {
			bgMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime
		}
	})

	return (
		<group position={[0, 0, 2]}>
			<mesh position={[0, 0, -0.1]}>
				<planeGeometry args={[4.0, 3.0]} />
				<shaderMaterial
					ref={bgMaterialRef}
					vertexShader={glowVertexShader}
					fragmentShader={backgroundGlowFragmentShader}
					uniforms={bgUniforms}
					transparent
					depthWrite={false}
				/>
			</mesh>

			<mesh>
				<planeGeometry args={[0.7, 2.0]} />
				<shaderMaterial
					ref={materialRef}
					vertexShader={glowVertexShader}
					fragmentShader={glowFragmentShader}
					uniforms={uniforms}
					transparent
					depthWrite={false}
				/>
			</mesh>
			<GlowParticles />
		</group>
	)
}

function GlowParticles() {
	const particlesRef = useRef<THREE.Points>(null)
	const particleCount = 40
	const fadeDistance = 1.0

	const velocitiesRef = useRef<Float32Array>(new Float32Array(particleCount * 3))
	const lifetimesRef = useRef<Float32Array>(new Float32Array(particleCount))

	const positions = useMemo(() => {
		const positions = new Float32Array(particleCount * 3)

		for (let i = 0; i < particleCount; i++) {
			const y = (i / particleCount - 0.5) * 1.2
			positions[i * 3] = 0
			positions[i * 3 + 1] = y
			positions[i * 3 + 2] = (((i * 0.618) % 1.0) - 0.5) * 0.1
		}

		return positions
	}, [particleCount])

	useEffect(() => {
		const velocities = velocitiesRef.current
		const lifetimes = lifetimesRef.current

		for (let i = 0; i < particleCount; i++) {
			const direction = i % 2 === 0 ? 1 : -1
			velocities[i * 3] = direction * (((i * 0.382) % 1.0) * 0.012 + 0.004)
			velocities[i * 3 + 1] = (((i * 0.786) % 1.0) - 0.4) * 0.006
			velocities[i * 3 + 2] = (((i * 0.214) % 1.0) - 0.5) * 0.003

			lifetimes[i] = (i * 0.123) % 1.0
		}
	}, [particleCount])

	const geometry = useMemo(() => {
		const geo = new THREE.BufferGeometry()
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
		const opacities = new Float32Array(particleCount)
		for (let i = 0; i < particleCount; i++) {
			opacities[i] = 1.0
		}
		geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1))
		return geo
	}, [positions, particleCount])

	const shaderMaterial = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				uColor: { value: new THREE.Color("#EF4444") },
				uFadeDistance: { value: fadeDistance },
			},
			vertexShader: `
        attribute float aOpacity;
        varying float vOpacity;
        varying float vDistance;

        void main() {
          vOpacity = aOpacity;
          vDistance = abs(position.x);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 7.0 * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
			fragmentShader: `
        uniform vec3 uColor;
        uniform float uFadeDistance;
        varying float vOpacity;
        varying float vDistance;

        void main() {
          float fade = 1.0 - smoothstep(0.0, uFadeDistance, vDistance);

          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

          float finalAlpha = alpha * fade * vOpacity * 1.5;
          gl_FragColor = vec4(uColor * 1.3, finalAlpha);
        }
      `,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		})
	}, [fadeDistance])

	useFrame((state) => {
		if (!particlesRef.current) return

		const positionAttr = particlesRef.current.geometry.attributes.position
		const opacityAttr = particlesRef.current.geometry.attributes.aOpacity
		if (!positionAttr || !opacityAttr) return

		const posArray = positionAttr.array as Float32Array
		const opacityArray = opacityAttr.array as Float32Array
		const velocities = velocitiesRef.current
		const lifetimes = lifetimesRef.current

		for (let i = 0; i < particleCount; i++) {
			const currentLifetime = (lifetimes[i] ?? 0) + 0.012
			const newLifetime = currentLifetime > 1 ? 0 : currentLifetime
			lifetimes[i] = newLifetime

			if (currentLifetime > 1) {
				posArray[i * 3] = 0
				posArray[i * 3 + 1] =
					(((i + state.clock.elapsedTime * 10) % particleCount) / particleCount - 0.5) * 1.2
				posArray[i * 3 + 2] = (((i * 0.618 + state.clock.elapsedTime) % 1.0) - 0.5) * 0.1

				const direction = i % 2 === 0 ? 1 : -1
				velocities[i * 3] =
					direction * ((((i + state.clock.elapsedTime) * 0.382) % 1.0) * 0.012 + 0.004)
				velocities[i * 3 + 1] = ((((i + state.clock.elapsedTime) * 0.786) % 1.0) - 0.4) * 0.006
			}

			posArray[i * 3] = (posArray[i * 3] ?? 0) + velocities[i * 3]!
			posArray[i * 3 + 1] =
				(posArray[i * 3 + 1] ?? 0) +
				velocities[i * 3 + 1]! +
				Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.0008
			posArray[i * 3 + 2] = (posArray[i * 3 + 2] ?? 0) + velocities[i * 3 + 2]!

			const dist = Math.abs(posArray[i * 3]!)
			opacityArray[i] = Math.max(0, 1.0 - dist / fadeDistance)
		}

		positionAttr.needsUpdate = true
		opacityAttr.needsUpdate = true
	})

	return <points ref={particlesRef} geometry={geometry} material={shaderMaterial} />
}

function FloatingIcons() {
	const icons: Array<{
		Icon: LucideIcon
		color: string
		bg: string
		x: string
		xMob: string
		y: string
		delay: number
	}> = [
		{
			Icon: BarChart3,
			color: "text-background",
			bg: "bg-foreground",
			x: "65%",
			xMob: "20%",
			y: "25%",
			delay: 0,
		},
		{
			Icon: Smartphone,
			color: "text-background",
			bg: "bg-foreground",
			x: "80%",
			xMob: "25%",
			y: "45%",
			delay: 0.2,
		},
		{
			Icon: Workflow,
			color: "text-background",
			bg: "bg-foreground",
			x: "60%",
			xMob: "15%",
			y: "60%",
			delay: 0.4,
		},
		{
			Icon: Globe,
			color: "text-background",
			bg: "bg-foreground",
			x: "45%",
			xMob: "10%",
			y: "40%",
			delay: 0.3,
		},
	]

	return (
		<div className="pointer-events-none absolute inset-y-0 left-0 w-full overflow-hidden sm:w-1/2">
			{icons.map((item, i) => (
				<motion.div
					key={i}
					className={`border-foreground/40 absolute rounded-2xl border p-4 shadow-lg ${item.bg} left-(--x-mob) sm:left-(--x-desk)`}
					style={
						{
							"top": item.y,
							"--x-mob": item.xMob,
							"--x-desk": item.x,
						} as MotionStyle
					}
					animate={{
						y: [0, -8, 0],
						rotate: [0, 5, -5, 0],
					}}
					transition={{
						duration: 4 + i * 0.5,
						repeat: Infinity,
						ease: "easeInOut",
						delay: item.delay,
					}}
				>
					<item.Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color}`} />
				</motion.div>
			))}
		</div>
	)
}

function ContentCards() {
	return (
		<div className="pointer-events-none absolute inset-y-0 right-0 flex w-1/2 items-center pl-8 sm:pl-12">
			<div className="relative w-full max-w-sm space-y-3">
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.5, duration: 0.6 }}
					className="bg-foreground border-foreground/40 pointer-events-auto origin-left scale-90 rounded-xl border p-4 shadow-lg backdrop-blur-md sm:scale-100"
				>
					<div className="mb-2 flex items-center gap-2">
						<div className="bg-background min-w-6 rounded-md p-1">
							<Zap className="text-foreground h-4 w-4" />
						</div>
						<span className="text-background truncate text-xs font-semibold">
							Automatización de Procesos
						</span>
					</div>
					<p className="text-muted-foreground mb-2 line-clamp-2 text-[10px] leading-relaxed">
						Reducción del 60% en tareas manuales con flujos inteligentes.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.7, duration: 0.6 }}
					className="bg-foreground border-foreground/40 pointer-events-auto ml-4 origin-left scale-90 rounded-xl border p-4 shadow-lg backdrop-blur-md sm:ml-6 sm:scale-100"
				>
					<div className="mb-2 flex items-center gap-2">
						<div className="bg-background min-w-6 rounded-md p-1">
							<CheckCircle2 className="text-foreground h-4 w-4" />
						</div>
						<span className="text-background truncate text-xs font-semibold">Estado de Apps</span>
					</div>
					<ul className="mb-2 space-y-1">
						<li className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
							<span className="h-1 w-1 rounded-full bg-neutral-300" /> Todas las apps operativas
						</li>
						<li className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
							<span className="h-1 w-1 rounded-full bg-neutral-300" /> 99.9% de disponibilidad
						</li>
					</ul>
				</motion.div>
			</div>
		</div>
	)
}

export function PowerPlatformHero() {
	return (
		<section className="bg-background flex min-h-screen w-full items-center justify-center">
			<div className="mx-auto w-full max-w-6xl py-12 sm:py-40">
				<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
					<div className="pointer-events-auto relative z-20 mb-12 max-w-3xl px-4 text-left sm:text-center">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-foreground mb-4 text-4xl tracking-tight text-pretty sm:text-6xl md:text-6xl"
						>
							Soluciones empresariales sin código
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-muted-foreground mx-0 mb-8 max-w-lg text-base tracking-tight text-pretty sm:mx-auto sm:text-lg"
						>
							Creamos apps, automatizaciones y dashboards con Power Platform para que tu empresa
							opere más rápido, sin depender de código.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="flex w-full flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-center"
						>
							<a
								href="/contacto"
								className="group inline-flex w-fit items-center justify-center gap-3 rounded-md bg-red-600 py-3 pr-3 pl-5 text-sm font-medium text-white transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:text-base"
							>
								<span>Empezar Proyecto</span>
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 transition-all duration-300 group-hover:scale-110">
									<ChevronRight className="relative left-px h-4 w-4" />
								</span>
							</a>
						</motion.div>
					</div>

					<div className="relative mx-auto -mt-10 h-100 w-full max-w-6xl sm:-mt-15 sm:h-125">
						<div className="pointer-events-none absolute inset-0 z-20">
							<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
								<ResizeHandler />
								<Suspense fallback={null}>
									<ResponsiveGlowBar />
								</Suspense>
							</Canvas>
						</div>

						<div className="pointer-events-none absolute inset-0 z-10">
							<FloatingIcons />
							<ContentCards />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
