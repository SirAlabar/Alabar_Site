
document.addEventListener('mousemove', function(e) {
    const x = (e.clientX / window.innerWidth) * 10 - 5;
    const y = (e.clientY / window.innerHeight) * 10 - 5;
    document.body.style.backgroundPosition = `${20 + x}% ${20 + y}%`;
});

window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const intensity = scrollPosition / 50
    document.body.style.backgroundPosition = `${20 + intensity}% ${20 + intensity}%`;
});
