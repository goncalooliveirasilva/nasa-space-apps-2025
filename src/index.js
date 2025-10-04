import * as THREE from 'three'
import scene from './core/scene.js'
import camera from './core/camera.js'
import renderer from './core/renderer.js'
import sizes, { setupResize } from './core/size.js'
import { createGlobe } from './objects/globe.js'
import { animateSatellites } from './controls/animations.js'

let scrollY = 0
const distance = 10

const globe = createGlobe()
globe.position.y = -distance * 2
scene.add(globe)

setupResize(camera, renderer)

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

document.addEventListener('DOMContentLoaded', () => {
  animateSatellites()
})

// Initial button control
document.querySelector('.scroll-btn').addEventListener('click', () => {
  document.querySelector('.intro-container').scrollIntoView({
    behavior: 'smooth',
  })
})

const clock = new THREE.Clock()

export function tick() {
  const elapsed = clock.getElapsedTime()

  const sectionIndex = scrollY / sizes.height
  camera.position.y = sectionIndex * -distance

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
