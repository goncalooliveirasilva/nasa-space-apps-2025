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

export const CO_GLOBAL_MIN = 1e17
export const CO_GLOBAL_MAX = 1e19

export const createParticlesFromJSON = (jsonData, radius, size) => {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  jsonData.forEach((d) => {
    const pos = latLonToVector3(d.lat, d.lon, radius)
    positions.push(pos.x, pos.y, pos.z)

    // Map CO to color using global min/max
    const t = Math.min(
      Math.max((d.co - CO_GLOBAL_MIN) / (CO_GLOBAL_MAX - CO_GLOBAL_MIN), 0),
      1,
    )
    const color = new THREE.Color()
    color.setHSL((1 - t) * 0.7, 1, 0.5) // blue -> green -> red
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
  })

  return new THREE.Points(geometry, material)
}
