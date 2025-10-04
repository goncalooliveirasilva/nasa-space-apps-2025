import gsap from 'gsap'

export function animateSatellites() {
  const satellites = document.querySelectorAll('.satellite img')

  satellites.forEach((sat) => {
    const randomDuration = 1.3 + Math.random() * 0.4
    const randomY = 10 + Math.random() * 10
    const randomRotation = 1 + Math.random() * 2
    const randomDelay = Math.random() * 1

    gsap.to(sat, {
      y: -randomY,
      rotation: randomRotation,
      duration: randomDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: randomDelay,
    })
  })
}
