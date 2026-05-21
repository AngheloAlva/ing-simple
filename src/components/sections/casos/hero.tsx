"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { ArrowDown } from "lucide-react"
import { motion } from "motion/react"
import { Suspense, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

const carouselVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const carouselFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uBarWidth;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float bayerDither(vec2 position) {
    int x = int(mod(position.x, 8.0));
    int y = int(mod(position.y, 8.0));

    int index = x + y * 8;
    float threshold = 0.0;

    if (index == 0) threshold = 0.0/64.0;
    else if (index == 1) threshold = 32.0/64.0;
    else if (index == 2) threshold = 8.0/64.0;
    else if (index == 3) threshold = 40.0/64.0;
    else if (index == 4) threshold = 2.0/64.0;
    else if (index == 5) threshold = 34.0/64.0;
    else if (index == 6) threshold = 10.0/64.0;
    else if (index == 7) threshold = 42.0/64.0;
    else if (index == 8) threshold = 48.0/64.0;
    else if (index == 9) threshold = 16.0/64.0;
    else if (index == 10) threshold = 56.0/64.0;
    else if (index == 11) threshold = 24.0/64.0;
    else if (index == 12) threshold = 50.0/64.0;
    else if (index == 13) threshold = 18.0/64.0;
    else if (index == 14) threshold = 58.0/64.0;
    else if (index == 15) threshold = 26.0/64.0;
    else if (index == 16) threshold = 12.0/64.0;
    else if (index == 17) threshold = 44.0/64.0;
    else if (index == 18) threshold = 4.0/64.0;
    else if (index == 19) threshold = 36.0/64.0;
    else if (index == 20) threshold = 14.0/64.0;
    else if (index == 21) threshold = 46.0/64.0;
    else if (index == 22) threshold = 6.0/64.0;
    else if (index == 23) threshold = 38.0/64.0;
    else if (index == 24) threshold = 60.0/64.0;
    else if (index == 25) threshold = 28.0/64.0;
    else if (index == 26) threshold = 52.0/64.0;
    else if (index == 27) threshold = 20.0/64.0;
    else if (index == 28) threshold = 62.0/64.0;
    else if (index == 29) threshold = 30.0/64.0;
    else if (index == 30) threshold = 54.0/64.0;
    else if (index == 31) threshold = 22.0/64.0;
    else threshold = mod(float(index) * 0.125, 1.0);

    return threshold;
  }

  float roundedRectSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);

    float barTransition = smoothstep(-uBarWidth, uBarWidth, vWorldPosition.x);

    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscaleColor = vec3(gray);

    vec2 pixelPos = vUv * uResolution;
    float ditherThreshold = bayerDither(pixelPos);

    float levels = 4.0;
    float quantized = floor(gray * levels + ditherThreshold) / levels;
    vec3 ditheredGray = vec3(quantized);

    vec3 finalColor = mix(ditheredGray, texColor.rgb, barTransition);

    vec2 centeredUv = vUv * 2.0 - 1.0;
    float cornerRadius = 0.1;
    float dist = roundedRectSDF(centeredUv, vec2(1.0, 1.0), cornerRadius);
    float alpha = 1.0 - smoothstep(-0.02, 0.02, dist);

    gl_FragColor = vec4(finalColor, alpha * texColor.a);
  }
`

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

    float coreGlow = exp(-centerDist * 60.0) * 2.5;
    float midGlow = exp(-centerDist * 12.0) * 1.2;
    float outerGlow = exp(-centerDist * 4.0) * 0.5;
    float glow = coreGlow + midGlow + outerGlow;

    float pulse = sin(uTime * 1.5) * 0.08 + 0.92;
    glow *= pulse;

    float scanLine = sin(vUv.y * 60.0 + uTime * 2.0) * 0.02 + 0.98;
    glow *= scanLine;

    vec3 glowColor = vec3(0.612, 0.749, 1.0);

    float edgeDist = abs(vUv.y - 0.5) * 2.0;
    float vertFade = 1.0 - smoothstep(0.2, 0.95, edgeDist);
    glow *= vertFade;

    gl_FragColor = vec4(glowColor * glow, glow);
  }
`

const CAROUSEL_IMAGES = [
	"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
	"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
	"https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
	"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
	"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
	"https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
	"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
	"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
]

interface CarouselItemProps {
	texture: THREE.Texture
	index: number
	totalItems: number
	rotationRef: React.RefObject<number>
	radius: number
}

function CarouselItem({ texture, index, totalItems, rotationRef, radius }: CarouselItemProps) {
	const meshRef = useRef<THREE.Mesh>(null)

	const uniforms = useMemo(
		() => ({
			uTexture: { value: texture },
			uResolution: { value: new THREE.Vector2(400, 300) },
			uBarWidth: { value: 0.1 },
		}),
		[texture]
	)

	useFrame(() => {
		if (!meshRef.current) return

		const anglePerItem = (Math.PI * 2) / totalItems
		const baseAngle = index * anglePerItem
		const currentAngle = baseAngle + rotationRef.current

		const normalizedAngle =
			(((currentAngle % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI

		const x = Math.sin(normalizedAngle) * radius
		const z = -Math.cos(normalizedAngle) * radius + radius * 0.1

		meshRef.current.position.set(x, 0, z)
		meshRef.current.rotation.y = -normalizedAngle

		const isBehind = Math.abs(normalizedAngle) > Math.PI * 0.7
		meshRef.current.visible = !isBehind
	})

	return (
		<mesh ref={meshRef}>
			<planeGeometry args={[3.0, 2.0]} />
			<shaderMaterial
				vertexShader={carouselVertexShader}
				fragmentShader={carouselFragmentShader}
				uniforms={uniforms}
				transparent
				side={THREE.DoubleSide}
			/>
		</mesh>
	)
}

function GlowBar() {
	const materialRef = useRef<THREE.ShaderMaterial>(null)

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
		}),
		[]
	)

	useFrame((state) => {
		if (materialRef.current) {
			;(materialRef.current.uniforms.uTime as THREE.IUniform<number>).value =
				state.clock.elapsedTime
		}
	})

	return (
		<group position={[0, 0, 2]}>
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
		</group>
	)
}

function ResizeHandler() {
	const { gl, camera } = useThree()
	const glRef = useRef(gl)
	const cameraRef = useRef(camera)

	useEffect(() => {
		glRef.current = gl
		cameraRef.current = camera
	}, [gl, camera])

	useEffect(() => {
		const canvas = gl.domElement
		const parent = canvas.parentElement
		if (!parent) return

		const updateSize = () => {
			const currentGl = glRef.current
			const currentCamera = cameraRef.current
			const width = parent.clientWidth
			const height = parent.clientHeight
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

		return () => {
			observer.disconnect()
		}
	}, [gl])

	return null
}

function CarouselScene() {
	const textures = useTexture(CAROUSEL_IMAGES)
	const rotationRef = useRef(0)
	const radius = 4.5

	useFrame((state) => {
		rotationRef.current = state.clock.elapsedTime * 0.15
	})

	return (
		<group>
			{textures.map((texture, index) => (
				<CarouselItem
					key={index}
					texture={texture}
					index={index}
					totalItems={textures.length}
					rotationRef={rotationRef}
					radius={radius}
				/>
			))}
			<GlowBar />
		</group>
	)
}

function LoadingFallback() {
	return (
		<mesh>
			<planeGeometry args={[2, 2]} />
			<meshBasicMaterial color="#1a1a1a" transparent opacity={0} />
		</mesh>
	)
}

export function CasosHero() {
	return (
		<section className="bg-background relative min-h-screen w-full overflow-hidden">
			<div className="relative z-20 flex flex-col items-center px-4 pt-32 text-center sm:px-6 sm:pt-40 md:pt-44">
				<motion.span
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-muted-foreground mb-4 text-xs font-medium tracking-[0.2em] uppercase"
				>
					Casos reales en producción
				</motion.span>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-foreground max-w-4xl text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-6xl"
				>
					Proyectos que ya están corriendo
					<br className="hidden sm:block" /> en empresas reales
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="text-muted-foreground mt-6 max-w-2xl text-base sm:text-lg md:text-xl"
				>
					No son maquetas ni conceptos. Son productos en producción que sostienen operaciones,
					ventas y equipos de clientes que confiaron en nosotros.
				</motion.p>
			</div>

			<div className="absolute inset-0 z-10 translate-y-16 sm:translate-y-32 xl:translate-y-24">
				<Canvas
					camera={{ position: [0, 0, 8], fov: 45 }}
					dpr={[1, 2]}
					frameloop="always"
					gl={{
						alpha: true,
						antialias: true,
						powerPreference: "high-performance",
					}}
					style={{ background: "transparent" }}
				>
					<ResizeHandler />
					<Suspense fallback={<LoadingFallback />}>
						<CarouselScene />
					</Suspense>
				</Canvas>
			</div>

			<div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 sm:bottom-14">
				<motion.a
					href="#casos-grid"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="group border-border bg-background/80 text-foreground hover:bg-foreground hover:text-background inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-colors sm:text-base"
				>
					Ver casos
					<ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
				</motion.a>
			</div>
		</section>
	)
}
