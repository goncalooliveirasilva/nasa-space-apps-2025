import * as THREE from 'three'
import scene from './core/scene.js'
import camera from './core/camera.js'
import renderer from './core/renderer.js'
import sizes, { setupResize } from './core/size.js'
import {
  createGlobe,
  createParticlesFromJSON,
  CO_GLOBAL_MAX,
  CO_GLOBAL_MIN,
} from './objects/globe.js'
import {
  animateSatellites,
  animateTitle,
  animateText,
} from './controls/animations.js'
import { createBackgroundParticles } from './objects/particles.js'
import { drawColorBar } from './utils.js'
import { latLonToVector3 } from './utils.js'

const DISTANCE = 10
const globeGroup = new THREE.Group()
scene.add(globeGroup)

// Loading screen
document.body.classList.add('loading')
const loadingScreen = document.getElementById('loadingScreen')
const loadingPercentEl = document.getElementById('loadingPercent')

// Load datasets
async function loadDatasets() {
  const fileNames = await fetch('./data/fileList.json').then((res) =>
    res.json(),
  )
  const datasets = []

  for (let i = 0; i < fileNames.length; i++) {
    const f = fileNames[i]
    const data = await fetch(`/data/json_files/${f}`).then((res) => res.json())
    datasets.push(data)

    const percent = Math.round(((i + 1) / fileNames.length) * 100)
    loadingPercentEl.innerText = `${percent}%`
  }

  return { datasets, fileNames }
}

const { datasets, fileNames } = await loadDatasets()

// Hide loading screen
loadingScreen.style.opacity = 0
setTimeout(() => {
  loadingScreen.style.display = 'none'
  document.body.classList.remove('loading')
}, 500)

// Parse labels for slider
const labels = fileNames.map((f) => {
  const match = f.match(/MOP03JM-(\d{6})/)
  if (!match) return f
  const y = match[1].slice(0, 4)
  const m = match[1].slice(4, 6)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${monthNames[parseInt(m) - 1]} ${y}`
})

// Setup slider
const monthSlider = document.getElementById('monthSlider')
const sliderLabel = document.getElementById('sliderLabel')
monthSlider.max = datasets.length - 1
sliderLabel.innerText = labels[0]

// Background particles
scene.add(createBackgroundParticles())

// Create globe
const globe = createGlobe(3)
globe.position.y = -DISTANCE * 3.5
globeGroup.add(globe)

// Create initial particles
let currentMonthIndex = 0
const globeParticles = createParticlesFromJSON(
  datasets[currentMonthIndex],
  3.02,
  0.1,
)
globeParticles.position.y = -DISTANCE * 3.5
globeGroup.add(globeParticles)

// Update particles for a new month
function updateParticles(newData, index) {
  const posAttr = globeParticles.geometry.attributes.position
  const colorAttr = globeParticles.geometry.attributes.color
  const coMin = CO_GLOBAL_MIN
  const coMax = CO_GLOBAL_MAX

  newData.forEach((d, i) => {
    const pos = latLonToVector3(d.lat, d.lon, 3.02)
    posAttr.setXYZ(i, pos.x, pos.y, pos.z)

    const t = Math.min(Math.max((d.co - coMin) / (coMax - coMin), 0), 1)
    const color = new THREE.Color()
    color.setHSL((1 - t) * 0.7, 1, 0.5)
    colorAttr.setXYZ(i, color.r, color.g, color.b)
  })

  posAttr.needsUpdate = true
  colorAttr.needsUpdate = true

  sliderLabel.innerText = labels[index]
}

// Slider event
monthSlider.addEventListener('input', (e) => {
  const index = parseInt(e.target.value)
  currentMonthIndex = index
  updateParticles(datasets[index], index)
})

// Scroll
let scrollY = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

// Initial animations
document.addEventListener('DOMContentLoaded', () => {
  animateSatellites()
  animateTitle()
  animateText()
})

// Scroll button
document.querySelector('.scroll-btn').addEventListener('click', () => {
  document
    .querySelector('.intro-container')
    .scrollIntoView({ behavior: 'smooth' })
})

// Draw gradient color bar
drawColorBar(CO_GLOBAL_MIN, CO_GLOBAL_MAX)

// Clock for rotation
const clock = new THREE.Clock()
const rotationPeriod = 60
const earthRotationSpeed = (2 * Math.PI) / rotationPeriod

// Globe tilt
globe.rotation.z = THREE.MathUtils.degToRad(-23.5)
globeParticles.rotation.z = THREE.MathUtils.degToRad(-23.5)

// Tick
export function tick() {
  const elapsedTime = clock.getElapsedTime()
  const sectionIndex = scrollY / sizes.height
  camera.position.y = sectionIndex * -DISTANCE

  globe.rotation.y = elapsedTime * earthRotationSpeed
  globeParticles.rotation.y = elapsedTime * earthRotationSpeed

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
