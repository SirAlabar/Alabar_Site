class Slime {
    constructor(id, startX, startY) {
        this.element = document.createElement('div');
        this.element.id = `slime-${id}`;
        this.element.className = 'monster idle';
        document.querySelector('.movement-area').appendChild(this.element);

        this.position = { x: startX, y: startY };
        this.speed = 1.5;
        this.isMoving = false;
        this.scale = 1;
        this.currentState = 'idle';
        this.health = 100;
        this.isDead = false;
        
        this.updateBounds();
        this.startBehavior();
        
        window.addEventListener('resize', () => {
            this.updateBounds();
            this.adjustPosition();
        });

        this.gameLoop();
    }

    setState(newState) {
        this.element.classList.remove('idle', 'walking', 'hurt', 'dying', 'attacking');
        
        this.element.classList.add(newState);
        this.currentState = newState;
    }

    startBehavior() {
        setInterval(() => {
            if (!this.isDead && this.currentState !== 'hurt' && this.currentState !== 'dying' && this.currentState !== 'attacking') {
                const rand = Math.random();
                
                if (rand < 0.3) {
                    this.setState('walking');
                    this.isMoving = true;
                    
                    const angle = Math.random() * Math.PI * 2;
                    this.moveDirection = {
                        x: Math.cos(angle),
                        y: Math.sin(angle)
                    };
                    
                    setTimeout(() => {
                        this.isMoving = false;
                        if (!this.isDead) {
                            this.setState('idle');
                        }
                    }, Math.random() * 2000 + 1000);
                    
                } else if (rand < 0.4) {
                    this.attack();
                } else {
                    this.setState('idle');
                }
            }
        }, Math.random() * 3000 + 2000);
    }

    attack() {
        if (!this.isDead && this.currentState !== 'hurt' && this.currentState !== 'dying') {
            this.setState('attacking');
            
            setTimeout(() => {
                if (!this.isDead) {
                    this.setState('idle');
                }
            }, 500);
        }
    }

    takeDamage() {
        if (!this.isDead && this.currentState !== 'hurt' && this.currentState !== 'dying') {
            this.health -= 20;
            this.setState('hurt');
            
            setTimeout(() => {
                if (this.health <= 0) {
                    this.die();
                } else if (!this.isDead) {
                    this.setState('idle');
                }
            }, 400);
        }
    }

    die() {
        this.isDead = true;
        this.setState('dying');
        
        setTimeout(() => {
            this.element.remove();
        }, 500);
    }

    updateBounds() {
        const slimeWidth = 64 * this.scale;
        const slimeHeight = 64 * this.scale;
        const movementArea = document.querySelector('.movement-area');
        
        this.bounds = {
            left: slimeWidth / 2,
            right: movementArea.clientWidth - slimeWidth,
            top: 0,
            bottom: movementArea.clientHeight - slimeHeight
        };
    }

    adjustPosition() {
        this.position.x = Math.max(this.bounds.left, Math.min(this.position.x, this.bounds.right));
        this.position.y = Math.max(this.bounds.top, Math.min(this.position.y, this.bounds.bottom));
        this.updatePosition();
    }

    updatePosition() {
        if (this.isMoving && !this.isDead && this.currentState === 'walking') {
            this.position.x += this.moveDirection.x * this.speed;
            this.position.y += this.moveDirection.y * this.speed;
            
            this.position.x = Math.max(this.bounds.left, Math.min(this.position.x, this.bounds.right));
            this.position.y = Math.max(this.bounds.top, Math.min(this.position.y, this.bounds.bottom));
        }

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;
    }

    gameLoop() {
        this.updatePosition();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class SlimeManager {
    constructor(numberOfSlimes) {
        this.slimes = [];
        
        for (let i = 0; i < numberOfSlimes; i++) {
            const startX = Math.random() * (window.innerWidth - 100) + 50;
            const startY = Math.random() * (window.innerHeight - 100) + 50;
            this.slimes.push(new Slime(i, startX, startY));
        }
    }

    spawnSlime(x, y) {
        const id = this.slimes.length;
        const slime = new Slime(id, x, y);
        this.slimes.push(slime);
        return slime;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.slimeManager = new SlimeManager(3);
});