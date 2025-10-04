import * as THREE from 'three'
import { latLonToVector3 } from '../utils'

export const createGlobe = (radius) => {
  const geometry = new THREE.SphereGeometry(radius, 64, 64)

  const textureLoader = new THREE.TextureLoader()
  const earthTexture = textureLoader.load('../world.200407.3x5400x2700.jpg')
  earthTexture.colorSpace = THREE.SRGBColorSpace

  const material = new THREE.MeshBasicMaterial({
    map: earthTexture,
  })
  const globe = new THREE.Mesh(geometry, material)
  return globe
}

export const createParticlesFromJSON = (jsonData, radius, size) => {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  // Determine min/max for CO color mapping
  const coValues = jsonData.map((d) => d.co)
  const coMin = Math.min(...coValues)
  const coMax = Math.max(...coValues)

  jsonData.forEach((d) => {
    const pos = latLonToVector3(d.lat, d.lon, radius)
    positions.push(pos.x, pos.y, pos.z)

    // Map CO to color (blue -> red)
    const t = Math.min(Math.max((d.co - coMin) / (coMax - coMin), 0), 1)
    const color = new THREE.Color()
    color.setHSL((1 - t) * 0.7, 1, 0.5) // 0.7=blue, 0=red
    colors.push(color.r, color.g, color.b)
  })

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  return new THREE.Points(geometry, material)
}
