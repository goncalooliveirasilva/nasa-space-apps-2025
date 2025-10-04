import * as THREE from 'three'

export function createGlobe() {
  const geometry = new THREE.SphereGeometry(2, 64, 64)
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff' })
  const globe = new THREE.Mesh(geometry, material)

  return globe
}
