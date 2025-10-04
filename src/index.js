import * as THREE from 'three'
import scene from './core/scene.js'
import camera from './core/camera.js'
import renderer from './core/renderer.js'
import sizes, { setupResize } from './core/size.js'
import { createGlobe, createParticlesFromJSON } from './objects/globe.js'
import {
  animateSatellites,
  animateTitle,
  animateText,
} from './controls/animations.js'
import { createBackgroundParticles } from './objects/particles.js'
import data from '../data/json_files/MOP03JM-202104-L3V95.9.3.beta.json'

// Background particles
scene.add(createBackgroundParticles())

let scrollY = 0
const distance = 10

const globeGroup = new THREE.Group()
scene.add(globeGroup)

const globe = createGlobe(3)
globe.position.y = -distance * 3.5
const globeParticles = createParticlesFromJSON(data, 3.01, 0.1)
globeParticles.position.y = -distance * 3.5
globeGroup.add(globe, globeParticles)

setupResize(camera, renderer)

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

document.addEventListener('DOMContentLoaded', () => {
  animateSatellites()
  animateTitle()
  animateText()
})

// Initial button control
document.querySelector('.scroll-btn').addEventListener('click', () => {
  document.querySelector('.intro-container').scrollIntoView({
    behavior: 'smooth',
  })
})

const clock = new THREE.Clock()

// Earth rotation
const rotationPeriod = 60 // uma rotacao a cada x segundos
const earthRotationSpeed = (2 * Math.PI) / rotationPeriod

// Globe tilt
globe.rotation.z = THREE.MathUtils.degToRad(-23.5)
globeParticles.rotation.z = THREE.MathUtils.degToRad(-23.5)

export function tick() {
  const elapsedTime = clock.getElapsedTime()

  const sectionIndex = scrollY / sizes.height
  camera.position.y = sectionIndex * -distance

  globe.rotation.y = elapsedTime * earthRotationSpeed
  globeParticles.rotation.y = elapsedTime * earthRotationSpeed

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
