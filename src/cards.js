export function setupCards() {
  const terraImg = document.querySelector(
    '.satellite img[alt="Terra Satellite"]',
  )
  const terraCard = document.getElementById('terraCard')
  const terraClose = terraCard.querySelector('.close-btn')
  terraImg.addEventListener('click', () => terraCard.classList.add('active'))
  terraClose.addEventListener('click', () =>
    terraCard.classList.remove('active'),
  )

  const aquaImg = document.querySelector('.satellite img[alt="Aqua Satellite"]')
  const aquaCard = document.getElementById('aquaCard')
  const aquaClose = aquaCard.querySelector('.close-btn')
  aquaImg.addEventListener('click', () => aquaCard.classList.add('active'))
  aquaClose.addEventListener('click', () => aquaCard.classList.remove('active'))

  const auraImg = document.querySelector('.satellite img[alt="Aura Satellite"]')
  const auraCard = document.getElementById('auraCard')
  const auraClose = auraCard.querySelector('.close-btn')
  auraImg.addEventListener('click', () => auraCard.classList.add('active'))
  auraClose.addEventListener('click', () => auraCard.classList.remove('active'))
}
