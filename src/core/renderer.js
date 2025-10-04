import { WebGLRenderer } from 'three'
import sizes from './size.js'

const canvas = document.querySelector('canvas.webgl')

const renderer = new WebGLRenderer({ canvas, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

export default renderer
