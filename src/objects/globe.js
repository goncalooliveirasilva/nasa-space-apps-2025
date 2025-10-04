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

  // Just to be better for the eyes
  const minimalDeviationFactor = 0.08

  jsonData.forEach((d) => {
    const pos = latLonToVector3(d.lat, d.lon, radius)
    const x = pos.x + (Math.random() - 0.5) * minimalDeviationFactor
    const y = pos.y + (Math.random() - 0.5) * minimalDeviationFactor
    const z = pos.z + (Math.random() - 0.5) * minimalDeviationFactor
    positions.push(x, y, z)

    // Map CO to color (blue -> red)
    const t = Math.min(Math.max((d.co - coMin) / (coMax - coMin), 0), 1) // normalized value
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
    opacity: 0.6,
    depthWrite: false,
  })

  return new THREE.Points(geometry, material)
}
