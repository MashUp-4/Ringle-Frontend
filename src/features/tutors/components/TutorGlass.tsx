import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

// Figma: I260:4037;219:4230 (Profile-overlay), and the supplied Glass panel.
const tutorGlassSettings = {
  lightAngle: -45,
  lightIntensity: 0.8,
  refraction: 0.8,
  depth: 20,
  dispersion: 0.5,
  frostRadius: 4,
  splay: 0,
} as const

interface GlassSize {
  width: number
  height: number
  cornerRadius: number
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function createGlassMaps({ width, height, cornerRadius }: GlassSize) {
  const displacement = document.createElement('canvas')
  const lighting = document.createElement('canvas')
  displacement.width = lighting.width = width
  displacement.height = lighting.height = height
  const displacementContext = displacement.getContext('2d')!
  const lightingContext = lighting.getContext('2d')!
  const displacementPixels = displacementContext.createImageData(width, height)
  const lightingPixels = lightingContext.createImageData(width, height)
  const radius = Math.min(cornerRadius, width / 2, height / 2)
  const angle = (tutorGlassSettings.lightAngle * Math.PI) / 180

  // Rounded-rectangle surface model. This is a web approximation, not Figma's
  // private Glass renderer. The maps describe optics, not tutor image content.
  const distance = (x: number, y: number) => {
    const dx = Math.abs(x - width / 2) - (width / 2 - radius)
    const dy = Math.abs(y - height / 2) - (height / 2 - radius)
    return (
      Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) +
      Math.min(Math.max(dx, dy), 0) -
      radius
    )
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const edgeDistance = -distance(px, py)
      const edgeProgress = clamp(edgeDistance / tutorGlassSettings.depth)
      // Zero displacement at both ends of the bevel. On a flat edge, the
      // sampling derivative is 1 + refraction * cos(2 * PI * edgeProgress),
      // which stays positive for refraction .8. The old quadratic profile
      // folded the sampling coordinates and repeated edge pixels.
      const refractionSlope =
        Math.sin(2 * Math.PI * edgeProgress) / (2 * Math.PI)
      const lightSlope = (1 - edgeProgress) ** 2
      const nx = distance(px + 0.5, py) - distance(px - 0.5, py)
      const ny = distance(px, py + 0.5) - distance(px, py - 0.5)
      const length = Math.hypot(nx, ny) || 1
      const normalX = nx / length
      const normalY = ny / length
      const offset = (y * width + x) * 4
      const spreadX = tutorGlassSettings.splay * (px / width - 0.5)
      const spreadY = tutorGlassSettings.splay * (py / height - 0.5)

      displacementPixels.data[offset] = Math.round(
        255 * clamp(0.5 - (normalX * refractionSlope + spreadX) / 2),
      )
      displacementPixels.data[offset + 1] = Math.round(
        255 * clamp(0.5 - (normalY * refractionSlope + spreadY) / 2),
      )
      displacementPixels.data[offset + 2] = 128
      displacementPixels.data[offset + 3] = 255

      const facingLight = Math.max(
        0,
        normalX * Math.cos(angle) + normalY * Math.sin(angle),
      )
      // Schlick-style edge falloff keeps the flat glass surface unlit.
      const highlight =
        Math.pow(lightSlope, 5) *
        facingLight *
        tutorGlassSettings.lightIntensity
      lightingPixels.data[offset] = 255
      lightingPixels.data[offset + 1] = 255
      lightingPixels.data[offset + 2] = 255
      lightingPixels.data[offset + 3] = Math.round(255 * highlight)
    }
  }

  displacementContext.putImageData(displacementPixels, 0, 0)
  lightingContext.putImageData(lightingPixels, 0, 0)
  return {
    displacement: displacement.toDataURL(),
    lighting: lighting.toDataURL(),
  }
}

export function TutorGlass({ children }: { children: ReactNode }) {
  const filterId = `tutor-glass-${useId().replaceAll(':', '')}`
  const source = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<GlassSize>({
    width: 252,
    height: 252,
    cornerRadius: 16,
  })
  const maps = useMemo(() => createGlassMaps(size), [size])

  useEffect(() => {
    const element = source.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(1, Math.round(entry.contentRect.width))
      const height = Math.max(1, Math.round(entry.contentRect.height))
      const cornerRadius = parseFloat(
        getComputedStyle(element).borderTopLeftRadius,
      )
      setSize((previous) =>
        previous.width === width &&
        previous.height === height &&
        previous.cornerRadius === cornerRadius
          ? previous
          : { width, height, cornerRadius },
      )
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // The web surface model uses depth relative to the pane width. Ray travel
  // and surface slope both depend on this ratio; depth 20 is not a direct
  // 20px image displacement. This remains an approximation of Figma Glass.
  // SVG displacement uses scale * (channel - .5), hence the factor of two.
  const relativeDepth = tutorGlassSettings.depth / size.width
  const refractionScale =
    2 * relativeDepth * relativeDepth * tutorGlassSettings.refraction
  // Model dispersion as a subpixel sampling difference, independently of the
  // lens depth. Multiplying refraction by +/-50% created broad RGB fringes.
  // This sampling model is an approximation, not Figma's conversion formula.
  const chromaticScale = tutorGlassSettings.dispersion / size.width
  const style = {
    '--tutor-glass-filter': `url("#${filterId}")`,
  } as CSSProperties

  return (
    <>
      <svg
        className="tutor-glass-definitions"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            filterUnits="objectBoundingBox"
            primitiveUnits="objectBoundingBox"
            x="0"
            y="0"
            width="1"
            height="1"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={maps.displacement}
              x="0"
              y="0"
              width="1"
              height="1"
              preserveAspectRatio="none"
              result="surface"
            />
            {/* Frost radius is modeled as a two-sigma Gaussian radius.
                This conversion is part of the approximation, not a CSS value from Figma. */}
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={`${tutorGlassSettings.frostRadius / (2 * size.width)} ${tutorGlassSettings.frostRadius / (2 * size.height)}`}
              edgeMode="duplicate"
              result="frost"
            />
            <feDisplacementMap
              in="frost"
              in2="surface"
              scale={refractionScale + chromaticScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="red-displaced"
            />
            <feColorMatrix
              in="red-displaced"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              in="frost"
              in2="surface"
              scale={refractionScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="green-displaced"
            />
            <feColorMatrix
              in="green-displaced"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              in="frost"
              in2="surface"
              scale={refractionScale - chromaticScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="blue-displaced"
            />
            <feColorMatrix
              in="blue-displaced"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feComposite
              in="red"
              in2="green"
              operator="arithmetic"
              k2="1"
              k3="1"
              result="red-green"
            />
            <feComposite
              in="red-green"
              in2="blue"
              operator="arithmetic"
              k2="1"
              k3="1"
              result="refracted"
            />
            <feComposite in="refracted" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
      </svg>
      <div className="tutor-glass-source" ref={source} style={style}>
        {children}
      </div>
      <div className="tutor-glass-surface" aria-hidden="true">
        <img src={maps.lighting} alt="" />
      </div>
    </>
  )
}
