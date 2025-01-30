class ParallaxEffect {
    constructor() {
        this.layers = document.querySelectorAll('.layer');
        this.bounds = {
            mouse: { min: -2, max: 2 },
            scroll: { min: -5, max: 5 }
        };
        
        this.smoothFactor = 0.025;
        this.currentPositions = new Map();
        
        this.init();
    }

    init() {
        this.layers.forEach(layer => {
            this.currentPositions.set(layer, { x: 0, y: 0 });
        });

        window.addEventListener('mousemove', this.handleMouse.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.animate();
    }

    handleMouse(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed || 0) * 0.5;
            
            if (layer.id === 'background' || layer.id === 'mountain') return;

            const targetX = (e.clientX - centerX) * speed;
            const targetY = (e.clientY - centerY) * speed;
            
            const current = this.currentPositions.get(layer);
            const boundedX = this.boundValue(targetX, this.bounds.mouse.min, this.bounds.mouse.max);
            const boundedY = this.boundValue(targetY, this.bounds.mouse.min, this.bounds.mouse.max);
            
            current.targetX = boundedX;
            current.targetY = boundedY;
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed || 0) * 0.3;
            
            if (layer.id === 'background' || layer.id === 'mountain') return;

            const yOffset = -(scrolled * speed);
            const boundedY = this.boundValue(yOffset, this.bounds.scroll.min, this.bounds.scroll.max);
            
            const current = this.currentPositions.get(layer);
            current.targetY = boundedY;
        });
    }

    animate() {
        this.layers.forEach(layer => {
            const current = this.currentPositions.get(layer);
            if (!current.targetX) current.targetX = 0;
            if (!current.targetY) current.targetY = 0;
            
            current.x = this.lerp(current.x || 0, current.targetX || 0, this.smoothFactor);
            current.y = this.lerp(current.y || 0, current.targetY || 0, this.smoothFactor);
            
            layer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    boundValue(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
});