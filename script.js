// Animação de revelação ao rolar
function reveal() {
  const elements = document.querySelectorAll('.section');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// Efeito neon no título
const title = document.querySelector('header h1');
setInterval(() => {
  title.style.color = title.style.color === 'white' ? '#ff4081' : 'white';
}, 1000);
