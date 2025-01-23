// Função para mover o fundo com o mouse
document.addEventListener('mousemove', function(e) {
    const x = (e.clientX / window.innerWidth) * 10 - 5; // Ajusta a intensidade do movimento horizontal
    const y = (e.clientY / window.innerHeight) * 10 - 5; // Ajusta a intensidade do movimento vertical

    // Mova o fundo com base na posição do mouse
    document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
});

// Função para mover o fundo com o scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY; // Pega a posição do scroll
    const intensity = scrollPosition / 100; // Ajusta a intensidade do movimento com o scroll

    // Move o fundo com base no scroll da página
    document.body.style.backgroundPosition = `${50 + intensity}% ${50 + intensity}%`;
});
