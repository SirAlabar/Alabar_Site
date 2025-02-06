class Character {
    constructor() {
        this.element = document.getElementById('character');
        this.position = { x: 100, y: 0 };
        this.speed = 3;
        this.direction = 'down';
        this.isMoving = false;
        this.scale = 1;
        
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
        
        this.updateBounds();
        
        window.addEventListener('resize', () => {
            this.updateBounds();
            this.adjustPosition();
        });
        
        this.setupControls();
        this.gameLoop();
        this.updatePosition();
    }

    updateBounds() {
        const charWidth = 128 * this.scale;
        const charHeight = 128 * this.scale;
        const movementArea = document.querySelector('.movement-area');
        
        this.bounds = {
            left: charWidth / 2,
            right: movementArea.clientWidth - charWidth,
            top: 0,
            bottom: movementArea.clientHeight - charHeight
        };
    }

    adjustPosition() {
        this.position.x = Math.max(this.bounds.left, Math.min(this.position.x, this.bounds.right));
        this.position.y = Math.max(this.bounds.top, Math.min(this.position.y, this.bounds.bottom));
        this.updatePosition();
    }

    getResponsiveScale() {
        if (window.innerWidth <= 480) return 1.5;
        if (window.innerWidth <= 768) return 1.75;
        return 2;
    }

    updateAnimation() {
        this.element.classList.remove(
            'idle-up', 'idle-down', 'idle-left', 'idle-right',
            'walk-up', 'walk-down', 'walk-left', 'walk-right'
        );
    
        this.isMoving = Object.values(this.keys).some(key => key);
    
        if (this.keys.ArrowDown || this.keys.s || this.keys.S) this.direction = 'down';
        if (this.keys.ArrowLeft || this.keys.a || this.keys.A) this.direction = 'left';
        if (this.keys.ArrowRight || this.keys.d || this.keys.D) this.direction = 'right';
        if (this.keys.ArrowUp || this.keys.w || this.keys.W) this.direction = 'up';
    
        const animationClass = this.isMoving ? 'walk-' : 'idle-';
        this.element.classList.add(animationClass + this.direction);
    }
    

    updatePosition() {
        let newX = this.position.x;
        let newY = this.position.y;

        if (this.keys.ArrowLeft || this.keys.a || this.keys.A) newX -= this.speed;
        if (this.keys.ArrowRight || this.keys.d || this.keys.D) newX += this.speed;
        if (this.keys.ArrowUp || this.keys.w || this.keys.W) newY -= this.speed;
        if (this.keys.ArrowDown || this.keys.s || this.keys.S) newY += this.speed;

        this.position.x = Math.max(this.bounds.left, Math.min(newX, this.bounds.right));
        this.position.y = Math.max(this.bounds.top, Math.min(newY, this.bounds.bottom));

        this.scale = this.getResponsiveScale();
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