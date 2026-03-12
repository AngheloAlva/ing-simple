"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

export function PortfolioHero() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

	useEffect(() => {
		if (!canvasRef.current) return

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
		camera.position.z = 10

		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			alpha: true,
			antialias: true,
		})
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

		const fov = camera.fov * (Math.PI / 180)
		const height = camera.position.z * Math.tan(fov / 2) * 2
		const width = height * camera.aspect

		const vertexShader = `
      varying vec2 vUv;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        vUv = uv;
      }
    `

		const fragmentShader = `
      varying vec2 vUv;
      uniform vec2 uViewportRes;
      uniform float uTime;
      uniform float uRedFactor;
      uniform float uGreenFactor;
      uniform float uBlueFactor;
      uniform vec2 uMouse;

      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){
        const vec2  C = vec2(1.0/6.0, 1.0/3.0);
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      vec2 coverUvs(vec2 imageRes, vec2 containerRes, vec2 vUv) {
        float imageAspectX = imageRes.x/imageRes.y;
        float imageAspectY = imageRes.y/imageRes.x;

        float containerAspectX = containerRes.x/containerRes.y;
        float containerAspectY = containerRes.y/containerRes.x;

        vec2 ratio = vec2(
          min(containerAspectX / imageAspectX, 1.0),
          min(containerAspectY / imageAspectY, 1.0)
        );

        vec2 newUvs = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );

        return newUvs;
      }

      void main() {
        vec2 squareUvs = coverUvs(vec2(1.0), uViewportRes, vUv);

        vec2 mouseInfluence = squareUvs - uMouse;
        float mouseDistance = length(mouseInfluence);
        float mouseEffect = smoothstep(0.8, 0.0, mouseDistance) * 0.3;

        float noise1 = snoise(vec3(squareUvs * 2.0 + mouseInfluence * 0.1, uTime * 0.1));
        float noise2 = snoise(vec3(squareUvs * 3.0 - mouseInfluence * 0.15, uTime * 0.08));
        float noise3 = snoise(vec3(squareUvs * 1.5 + mouseInfluence * 0.05, uTime * 0.12));

        float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;

        float waves = sin(combinedNoise * 8.0 + uTime * 0.5 + mouseEffect * 5.0) * 0.5 + 0.5;
        float radialGradient = length(squareUvs - 0.5) * 2.0;

        vec3 finalColor = vec3(
          0.2 + waves * uRedFactor * (1.0 - radialGradient * 0.3) + mouseEffect * 0.2,
          0.3 + waves * uGreenFactor + sin(squareUvs.x * 3.14) * 0.2 + mouseEffect * 0.3,
          0.6 + waves * uBlueFactor + cos(squareUvs.y * 3.14) * 0.3 + mouseEffect * 0.4
        );

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uViewportRes: {
					value: new THREE.Vector2(window.innerWidth, window.innerHeight),
				},
				uRedFactor: { value: 0.4 },
				uGreenFactor: { value: 0.5 },
				uBlueFactor: { value: 0.9 },
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
			},
		})

		const geometry = new THREE.PlaneGeometry(1, 1)
		const mesh = new THREE.Mesh(geometry, material)
		mesh.scale.set(width, height, 1)
		scene.add(mesh)

		const clock = new THREE.Clock()

		let animationId: number
		const animate = () => {
			const time = clock.getElapsedTime()
			material.uniforms.uTime.value = time
			material.uniforms.uMouse.value.x = mousePosition.x
			material.uniforms.uMouse.value.y = mousePosition.y
			renderer.render(scene, camera)
			animationId = requestAnimationFrame(animate)
		}
		animate()

		const handleResize = () => {
			const newWidth = window.innerWidth
			const newHeight = window.innerHeight

			camera.aspect = newWidth / newHeight
			camera.updateProjectionMatrix()

			renderer.setSize(newWidth, newHeight)
			renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

			const fov = camera.fov * (Math.PI / 180)
			const height = camera.position.z * Math.tan(fov / 2) * 2
			const width = height * camera.aspect

			mesh.scale.set(width, height, 1)
			material.uniforms.uViewportRes.value.set(newWidth, newHeight)
		}

		window.addEventListener("resize", handleResize)

		return () => {
			cancelAnimationFrame(animationId)
			window.removeEventListener("resize", handleResize)
			geometry.dispose()
			material.dispose()
			renderer.dispose()
		}
	}, [mousePosition])

	const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = (e.clientX - rect.left) / rect.width
		const y = 1.0 - (e.clientY - rect.top) / rect.height
		setMousePosition({ x, y })
	}

	return (
		<section
			className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-neutral-950"
			onMouseMove={handleMouseMove}
		>
			{/* WebGL Canvas Background - Fullscreen */}
			<canvas
				ref={canvasRef}
				className="fixed inset-0 z-0 h-full w-full"
				style={{ position: "fixed", top: 0, left: 0 }}
			/>

			{/* Content Overlay with Frame */}
			<div className="relative z-10 flex h-dvh flex-col overflow-hidden bg-[rgba(0,0,0,0.3)] p-[4vmax] dark:bg-[rgba(0,0,0,0.5)]">
				<div className="relative w-full flex-1 overflow-hidden">
					{/* Header with Label and Button */}
					<div className="flex justify-between p-[4vmax] text-[max(1.2rem,1.3vmax)] text-white">
						<div className="leading-tight">
							Neural__Lab
							<br />
							Experiments
						</div>
						<div>
							<a
								className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-[max(0.9rem,1vmax)] font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
								href="#"
								target="_blank"
								rel="noopener noreferrer"
							>
								Get Started
							</a>
						</div>
					</div>

					{/* Decorative Corners - Top */}
					<div
						className="absolute right-0 bottom-0 hidden h-12 w-12 md:block"
						style={{
							background: "radial-gradient(circle at top left, transparent 48px, white 48px)",
							transform: "translateZ(0)",
						}}
					>
						<div
							className="absolute inset-0 hidden dark:block"
							style={{
								background:
									"radial-gradient(circle at top left, transparent 48px, rgb(10, 10, 10) 48px)",
							}}
						/>
					</div>
					<div
						className="absolute top-0 left-0 h-12 w-12"
						style={{
							background: "radial-gradient(circle at bottom right, transparent 48px, white 48px)",
							transform: "translateZ(0)",
						}}
					>
						<div
							className="absolute inset-0 hidden dark:block"
							style={{
								background:
									"radial-gradient(circle at bottom right, transparent 48px, rgb(10, 10, 10) 48px)",
							}}
						/>
					</div>
					<div
						className="absolute top-0 right-0 h-12 w-12"
						style={{
							background: "radial-gradient(circle at bottom left, transparent 48px, white 48px)",
							transform: "translateZ(0)",
						}}
					>
						<div
							className="absolute inset-0 hidden dark:block"
							style={{
								background:
									"radial-gradient(circle at bottom left, transparent 48px, rgb(10, 10, 10) 48px)",
							}}
						/>
					</div>
				</div>

				{/* Decorative Corner - Mobile Only */}
				<div
					className="absolute bottom-[4vmax] left-[4vmax] block h-12 w-12 md:hidden"
					style={{
						background: "radial-gradient(circle at top right, transparent 48px, white 48px)",
						transform: "translateZ(0)",
					}}
				>
					<div
						className="absolute inset-0 hidden dark:block"
						style={{
							background:
								"radial-gradient(circle at top right, transparent 48px, rgb(10, 10, 10) 48px)",
						}}
					/>
				</div>

				{/* Bottom Section - Title and Links */}
				<div className="flex flex-col items-start md:flex-row">
					{/* Title */}
					<h1 className="relative pr-[4vmax] pb-[4vmax] pl-[4vmax] text-[5vmax] leading-tight text-white">
						Neural Network
						<br />
						Visualization Engine
						{/* Title Decorative Corners */}
						<div
							className="absolute right-0 bottom-0 hidden h-12 w-12 md:block"
							style={{
								background: "radial-gradient(circle at top left, transparent 48px, white 48px)",
								transform: "translateZ(0)",
							}}
						>
							<div
								className="absolute inset-0 hidden dark:block"
								style={{
									background:
										"radial-gradient(circle at top left, transparent 48px, rgb(10, 10, 10) 48px)",
								}}
							/>
						</div>
						<div
							className="absolute bottom-0 left-0 hidden h-12 w-12 md:block"
							style={{
								background: "radial-gradient(circle at top right, transparent 48px, white 48px)",
								transform: "translateZ(0)",
							}}
						>
							<div
								className="absolute inset-0 hidden dark:block"
								style={{
									background:
										"radial-gradient(circle at top right, transparent 48px, rgb(10, 10, 10) 48px)",
								}}
							/>
						</div>
					</h1>

					{/* Links Section */}
					<div className="relative flex h-full flex-1 items-end justify-end self-end rounded-tl-[3vmax] bg-white pt-[4vmax] pl-[4vmax] text-[max(1rem,1.4vmax)] font-light dark:bg-neutral-950">
						<ul className="flex flex-col items-end gap-[max(0.7rem,0.8vmax)] opacity-50 transition-opacity duration-300 hover:opacity-100">
							<motion.li
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 1.4 }}
							>
								<a
									href="#"
									target="_blank"
									rel="noreferrer"
									className="group relative flex items-center gap-[max(0.6rem,0.8vmax)] pb-[max(0.1rem,0.2vmax)] text-neutral-900 dark:text-white"
								>
									<span className="relative">
										Documentation
										<span className="absolute bottom-0 left-0 h-0.5 w-0 origin-left bg-neutral-900 transition-all duration-300 group-hover:w-full dark:bg-white" />
									</span>
									<ArrowUpRight className="h-[max(1rem,1.4vmax)] w-[max(1rem,1.4vmax)]" />
								</a>
							</motion.li>
							<motion.li
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 1.5 }}
							>
								<a
									href="#"
									target="_blank"
									rel="noreferrer"
									className="group relative flex items-center gap-[max(0.6rem,0.8vmax)] pb-[max(0.1rem,0.2vmax)] text-neutral-900 dark:text-white"
								>
									<span className="relative">
										API Reference
										<span className="absolute bottom-0 left-0 h-0.5 w-0 origin-left bg-neutral-900 transition-all duration-300 group-hover:w-full dark:bg-white" />
									</span>
									<ArrowUpRight className="h-[max(1rem,1.4vmax)] w-[max(1rem,1.4vmax)]" />
								</a>
							</motion.li>
							<motion.li
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 1.6 }}
							>
								<a
									href="#"
									target="_blank"
									rel="noreferrer"
									className="group relative flex items-center gap-[max(0.6rem,0.8vmax)] pb-[max(0.1rem,0.2vmax)] text-neutral-900 dark:text-white"
								>
									<span className="relative">
										Get Started
										<span className="absolute bottom-0 left-0 h-0.5 w-0 origin-left bg-neutral-900 transition-all duration-300 group-hover:w-full dark:bg-white" />
									</span>
									<ArrowUpRight className="h-[max(1rem,1.4vmax)] w-[max(1rem,1.4vmax)]" />
								</a>
							</motion.li>
						</ul>

						{/* Links Section Decorative Corners */}
						<div
							className="absolute bottom-0 left-0 block h-12 w-12 md:hidden"
							style={{
								background: "radial-gradient(circle at top left, transparent 48px, white 48px)",
								transform: "translateX(-100%) translateZ(0)",
							}}
						>
							<div
								className="absolute inset-0 hidden dark:block"
								style={{
									background:
										"radial-gradient(circle at top left, transparent 48px, rgb(10, 10, 10) 48px)",
								}}
							/>
						</div>
						<div
							className="absolute top-0 right-0 block h-12 w-12 md:hidden"
							style={{
								background: "radial-gradient(circle at top left, transparent 48px, white 48px)",
								transform: "translateY(-100%) translateZ(0)",
							}}
						>
							<div
								className="absolute inset-0 hidden dark:block"
								style={{
									background:
										"radial-gradient(circle at top left, transparent 48px, rgb(10, 10, 10) 48px)",
								}}
							/>
						</div>
					</div>
				</div>

				{/* White Border Frame */}
				<div className="pointer-events-none absolute inset-0 top-0 left-0">
					<div className="absolute bottom-0 left-0 h-[4vmax] w-full bg-white dark:bg-neutral-950" />
					<div className="absolute top-0 left-0 h-[4vmax] w-full bg-white dark:bg-neutral-950" />
					<div className="absolute bottom-0 left-0 h-full w-[4vmax] bg-white dark:bg-neutral-950" />
					<div className="absolute right-0 bottom-0 h-full w-[4vmax] bg-white dark:bg-neutral-950" />
				</div>
			</div>
		</section>
	)
}
