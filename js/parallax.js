// parallax.js
class ParallaxEffect {
    constructor() {
        this.layers = document.querySelectorAll('.layer');
        this.bounds = {
            mouse: { min: -15, max: 15 },
            scroll: { min: -25, max: 25 }
        };
        
        this.init();
    }

    init() {
        window.addEventListener('mousemove', this.handleMouse.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.preloadImages();
    }

    handleMouse(e) {
        requestAnimationFrame(() => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            this.layers.forEach(layer => {
                // Pegar o speed do data-attribute
                const speed = parseFloat(layer.dataset.speed || 0);
                
                // Não move se for background ou mountain
                if (layer.id === 'background' || layer.id === 'mountain') return;

                const x = (e.clientX - centerX) * speed;
                const y = (e.clientY - centerY) * speed;
                
                const boundedX = this.boundValue(x, this.bounds.mouse.min, this.bounds.mouse.max);
                const boundedY = this.boundValue(y, this.bounds.mouse.min, this.bounds.mouse.max);
                
                layer.style.transform = `translate3d(${boundedX}px, ${boundedY}px, 0)`;
            });
        });
    }

    handleScroll() {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            this.layers.forEach(layer => {
                // Pegar o speed do data-attribute
                const speed = parseFloat(layer.dataset.speed || 0);
                
                // Não move se for background ou mountain
                if (layer.id === 'background' || layer.id === 'mountain') return;

                const yOffset = -(scrolled * speed);
                const boundedY = this.boundValue(yOffset, this.bounds.scroll.min, this.bounds.scroll.max);
                
                // Mantém o deslocamento horizontal do mouse enquanto aplica o scroll
                const currentTransform = window.getComputedStyle(layer).transform;
                let xOffset = 0;
                if (currentTransform !== 'none') {
                    const matrix = new DOMMatrix(currentTransform);
                    xOffset = matrix.m41;
                }
                
                layer.style.transform = `translate3d(${xOffset}px, ${boundedY}px, 0)`;
            });
        });
    }

    boundValue(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    preloadImages() {
        const themes = ['light', 'dark'];
        const imageNames = [
            'background', 'mountain', 'clouds', 'castle', 
            'field1', 'field2', 'field3', 'field4', 
            'field5', 'field6'
        ];

        themes.forEach(theme => {
            imageNames.forEach(name => {
                const img = new Image();
                const suffix = theme === 'dark' ? '_night' : '';
                img.src = `./img/${theme}/${name}${suffix}.png`;
            });
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
});