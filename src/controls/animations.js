import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const animateSatellites = () => {
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

export const animateTitle = () => {
  const title = document.querySelector('.intro-content h1')
  const subtitle = document.querySelector('.intro-content h2')
  const content = document.querySelector('.intro-content p')
  gsap.from(title, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    delay: 0,
  })
  gsap.from(subtitle, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    delay: 0.1,
  })
  gsap.from(content, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    delay: 0.2,
  })
}

export const animateText = () => {
  const textElements = document.querySelectorAll('.intro-container > *') // all children of intro-container

  gsap.from(textElements, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.2, // each element starts 0.2s after the previous
    scrollTrigger: {
      trigger: '.intro-container', // when intro-container enters viewport
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })
}
