import * as THREE from 'three'

export const createBackgroundParticles = () => {
  const n = 1000
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const j = i * 3
    positions[j] = (Math.random() - 0.5) * 20
    positions[j + 1] = (Math.random() - 0.5) * 100
    positions[j + 2] = (Math.random() - 0.5) * 20
    colors[j] = 1
    colors[j + 1] = 1
    colors[j + 2] = 1
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  return new THREE.Points(geometry, material)
}
