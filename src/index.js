import * as THREE from 'three'
import scene from './core/scene.js'
import camera from './core/camera.js'
import renderer from './core/renderer.js'
import sizes, { setupResize } from './core/size.js'
import { createGlobe } from './objects/globe.js'
import { animateSection } from './controls/animations.js'

let scrollY = 0
const distance = 10

const globe = createGlobe()
globe.position.y = -distance
scene.add(globe)

setupResize(camera, renderer)

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

const clock = new THREE.Clock()

export function tick() {
  const elapsed = clock.getElapsedTime()

  const sectionIndex = scrollY / sizes.height
  camera.position.y = -sectionIndex * distance

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
