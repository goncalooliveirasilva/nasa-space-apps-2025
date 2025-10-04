import { PerspectiveCamera } from 'three'
import sizes from './size.js'

const camera = new PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 15)

export default camera
