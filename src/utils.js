import * as THREE from 'three'

export function latLonToVector3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon)

  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return new THREE.Vector3(x, y, z)
}

export function drawColorBar(coMin, coMax) {
  const canvas = document.getElementById('colorBar')
  const ctx = canvas.getContext('2d')
  const steps = 200

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const hue = (1 - t) * 0.7 * 360
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
    const y = (1 - t) * canvas.height
    ctx.fillRect(0, y, canvas.width, canvas.height / steps)
  }

  // Convert to molecules/cm² (assuming original CO is in mol/m²)
  const convertToMoleculesPerCm2 = (v) => (v * 6.022e23) / 1e4

  const labelsDiv = document.getElementById('labels')
  labelsDiv.innerHTML = `
    <div>${convertToMoleculesPerCm2(coMax).toExponential(2)}</div>
    <div>${convertToMoleculesPerCm2((coMin + coMax) / 2).toExponential(2)}</div>
    <div>${convertToMoleculesPerCm2(coMin).toExponential(2)}</div>
  `
}
