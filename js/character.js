class Character {
    constructor() {
        this.element = document.getElementById('character');
        this.position = { x: 100, y: 100 };
        this.speed = 3;
        this.direction = 'down';
        this.isMoving = false;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.bounds = {
            left: 0,
            right: document.querySelector('.movement-area').clientWidth - 32,
            top: 0,
            bottom: document.querySelector('.movement-area').clientHeight - 32
        };        
        this.setupControls();
        this.gameLoop();
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

    updateAnimation() {
        this.element.classList.remove(
            'idle-up', 'idle-down', 'idle-left', 'idle-right',
            'walk-up', 'walk-down', 'walk-left', 'walk-right'
        );

        this.isMoving = Object.values(this.keys).some(key => key);

        if (this.keys.ArrowUp) this.direction = 'up';
        if (this.keys.ArrowDown) this.direction = 'down';
        if (this.keys.ArrowLeft) this.direction = 'left';
        if (this.keys.ArrowRight) this.direction = 'right';

        const animationClass = this.isMoving ? 'walk-' : 'idle-';
        this.element.classList.add(animationClass + this.direction);
    }

    updatePosition() {
        let newX = this.position.x;
        let newY = this.position.y;

        if (this.keys.ArrowLeft) newX -= this.speed;
        if (this.keys.ArrowRight) newX += this.speed;
        if (this.keys.ArrowUp) newY -= this.speed;
        if (this.keys.ArrowDown) newY += this.speed;

        // Aplica os limites da área de movimento
        this.position.x = Math.max(this.bounds.left, Math.min(newX, this.bounds.right));
        this.position.y = Math.max(this.bounds.top, Math.min(newY, this.bounds.bottom));

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
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