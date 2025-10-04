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

// Loading screen elements
document.body.classList.add('loading')
const loadingScreen = document.getElementById('loadingScreen')
const loadingPercentEl = document.getElementById('loadingPercent')

// Fetch datasets
async function loadDatasets() {
  const response = await fetch('./data/fileList.json')
  const fileNames = await response.json()

  const datasets = []
  for (let i = 0; i < fileNames.length; i++) {
    const f = fileNames[i]
    const data = await fetch(`/data/json_files/${f}`).then((res) => res.json())
    datasets.push(data)

    // Update loading percentage
    const percent = Math.round(((i + 1) / fileNames.length) * 100)
    loadingPercentEl.innerText = `${percent}%`
  }
  return { datasets, fileNames }
}

// Load all datasets
const { datasets, fileNames } = await loadDatasets()

// Hide loading screen
loadingScreen.style.opacity = 0
setTimeout(() => {
  loadingScreen.style.display = 'none'
  document.body.classList.remove('loading')
}, 500)

animateSatellites()
animateTitle()
animateText()

// Labels for slider
const labels = fileNames.map((f) => {
  const match = f.match(/MOP03JM-(\d{6})/)
  if (match) {
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
  }
  return f
})

// Slider elements
const monthSlider = document.getElementById('monthSlider')
const sliderLabel = document.getElementById('sliderLabel')
monthSlider.max = datasets.length - 1
sliderLabel.innerText = labels[0]

// Play/Pause button
const playPauseBtn = document.getElementById('playPauseBtn')
let autoPlay = true
playPauseBtn.innerText = 'Pause'
playPauseBtn.addEventListener('click', () => {
  autoPlay = !autoPlay
  playPauseBtn.innerText = autoPlay ? 'Pause' : 'Play'
  if (autoPlay) playNextMonth()
})

// Globe and particles
const globe = createGlobe(3)
globe.position.y = -DISTANCE * 3.5
globeGroup.add(globe)

let currentMonthIndex = 0
let globeParticles = createParticlesFromJSON(
  datasets[currentMonthIndex],
  3.02,
  0.1,
)
globeParticles.position.y = -DISTANCE * 3.5
globeGroup.add(globeParticles)

// Update function for particles
function updateParticles(newData, index) {
  const positions = globeParticles.geometry.attributes.position.array
  const colors = globeParticles.geometry.attributes.color.array
  const coMin = CO_GLOBAL_MIN
  const coMax = CO_GLOBAL_MAX
  // Just to be better for the eyes
  const minimalDeviationFactor = 0.05

  newData.forEach((d, i) => {
    const pos = latLonToVector3(d.lat, d.lon, 3.02)
    const x = pos.x + (Math.random() - 0.5) * minimalDeviationFactor
    const y = pos.y + (Math.random() - 0.5) * minimalDeviationFactor
    const z = pos.z + (Math.random() - 0.5) * minimalDeviationFactor
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    const t = Math.min(Math.max((d.co - coMin) / (coMax - coMin), 0), 1)
    const color = new THREE.Color()
    color.setHSL((1 - t) * 0.7, 1, 0.5)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  })

  globeParticles.geometry.attributes.position.needsUpdate = true
  globeParticles.geometry.attributes.color.needsUpdate = true

  sliderLabel.innerText = labels[index]
}

// Slider input
monthSlider.addEventListener('input', (e) => {
  autoPlay = false
  playPauseBtn.innerText = 'Play'
  const index = parseInt(e.target.value)
  currentMonthIndex = index
  updateParticles(datasets[index], index)
})

// Automatic month cycling
const autoPlayInterval = 1000 // ms
function playNextMonth() {
  if (!autoPlay) return

  currentMonthIndex = (currentMonthIndex + 1) % datasets.length
  monthSlider.value = currentMonthIndex
  updateParticles(datasets[currentMonthIndex], currentMonthIndex)
  setTimeout(playNextMonth, autoPlayInterval)
}
playNextMonth()

// Background particles
scene.add(createBackgroundParticles())

// Scroll handling
let scrollY = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

setupResize(camera, renderer)

// Initial button scroll
document.querySelector('.scroll-btn').addEventListener('click', () => {
  document
    .querySelector('.intro-container')
    .scrollIntoView({ behavior: 'smooth' })
})

// Draw color bar
drawColorBar(CO_GLOBAL_MIN, CO_GLOBAL_MAX)

// Clock and rotation
const clock = new THREE.Clock()
const rotationPeriod = 60
const earthRotationSpeed = (2 * Math.PI) / rotationPeriod
globe.rotation.z = THREE.MathUtils.degToRad(-23.5)
globeParticles.rotation.z = THREE.MathUtils.degToRad(-23.5)

// Animation tick
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
