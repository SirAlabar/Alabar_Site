class Character {
    constructor() {
        this.element = document.getElementById('character');
        this.position = { x: 100, y: 0 };
        this.speed = 3;
        this.direction = 'down';
        this.isMoving = false;
        this.scale = 2;
        
        // Adicionando suporte para WASD
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            w: false,
            s: false,
            a: false,
            d: false,
            W: false,
            S: false,
            A: false,
            D: false
        };
        
        const charWidth = 64 * this.scale;
        const charHeight = 64 * this.scale;
        
        this.bounds = {
            left: charWidth/2,
            right: document.querySelector('.movement-area').clientWidth - charWidth,
            top: 0,
            bottom: document.querySelector('.movement-area').clientHeight - charHeight
        };
        
        this.setupControls();
        this.gameLoop();
        this.updatePosition();
    }

    updateAnimation() {
        this.element.classList.remove(
            'idle-up', 'idle-down', 'idle-left', 'idle-right',
            'walk-up', 'walk-down', 'walk-left', 'walk-right'
        );

        this.isMoving = Object.values(this.keys).some(key => key);

        // Checando tanto setas quanto WASD
        if (this.keys.ArrowUp || this.keys.w || this.keys.W) this.direction = 'up';
        if (this.keys.ArrowDown || this.keys.s || this.keys.S) this.direction = 'down';
        if (this.keys.ArrowLeft || this.keys.a || this.keys.A) this.direction = 'left';
        if (this.keys.ArrowRight || this.keys.d || this.keys.D) this.direction = 'right';

        const animationClass = this.isMoving ? 'walk-' : 'idle-';
        this.element.classList.add(animationClass + this.direction);
    }

    updatePosition() {
        let newX = this.position.x;
        let newY = this.position.y;

        // Checando tanto setas quanto WASD
        if (this.keys.ArrowLeft || this.keys.a || this.keys.A) newX -= this.speed;
        if (this.keys.ArrowRight || this.keys.d || this.keys.D) newX += this.speed;
        if (this.keys.ArrowUp || this.keys.w || this.keys.W) newY -= this.speed;
        if (this.keys.ArrowDown || this.keys.s || this.keys.S) newY += this.speed;

        this.position.x = Math.max(this.bounds.left, Math.min(newX, this.bounds.right));
        this.position.y = Math.max(this.bounds.top, Math.min(newY, this.bounds.bottom));

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
                this.updateAnimation();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
                this.updateAnimation();
            }
        });
    }

    gameLoop() {
        if (this.isMoving) {
            this.updatePosition();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Character();
});