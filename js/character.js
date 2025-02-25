class Character {
    constructor() {
        this.element = document.getElementById('character');
        this.position = { x: 100, y: 0 };
        this.speed = 3;
        this.direction = 'down';
        this.isMoving = false;
        this.scale = 1;
        this.isAttacking = false;
        this.health = ENTITY_CONFIGS.PLAYER.maxHealth;
        this.maxHealth = ENTITY_CONFIGS.PLAYER.maxHealth;
        
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
            D: false,
            e: false,
            E: false
        };
        
        this.combatSystem = new CombatEntity(this.element, ENTITY_CONFIGS.PLAYER);
        this.attackRange = ENTITY_CONFIGS.PLAYER.attackRange;
        this.hitbox = CollisionSystem.getHitbox(this.element);

        if (window.collisionSystem) {
            window.collisionSystem.createMaskFromSprite(this.element, {
                baseWidth: 128,
                baseHeight: 128,
                getScale: () => this.getResponsiveScale()
            });
        }

        this.updateBounds();
        
        window.addEventListener('resize', () => {
            this.updateBounds();
            this.adjustPosition();
        });
        
        this.setupControls();
        this.gameLoop();
        this.updatePosition();
        this.setInitialState();
        this.combatSystem.createHealthBar();
        this.combatSystem.updateHealthBar();     
    }

    setInitialState() {
        this.element.classList.add('idle', 'idle-down');
    }

    handleAttack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.element.classList.remove('idle', 'walking');
            this.element.classList.add('attacking');
            this.element.classList.add('attack-' + this.direction);
    
            // window.monsterManager.monsters.forEach(monster => {
            //     if (CollisionSystem.checkAttackRange(this.element, monster.element, this.attackRange)) {
            //         monster.takeDamage(this.combatSystem.calculateDamage());
            //     }
            // });

            setTimeout(() => {
                this.isAttacking = false;
                this.element.classList.remove('attacking', 'attack-' + this.direction);
                this.updateAnimation();
            }, 500);
        }
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
        if (this.isAttacking) return;

        this.element.classList.remove(
            'idle-up', 'idle-down', 'idle-left', 'idle-right',
            'walk-up', 'walk-down', 'walk-left', 'walk-right',
            'attack-up', 'attack-down', 'attack-left', 'attack-right'
        );
    
        this.isMoving = Object.entries(this.keys).some(([key, value]) => 
            key !== 'e' && key !== 'E' && value === true
        );
    
        if (this.keys.ArrowDown || this.keys.s || this.keys.S) this.direction = 'down';
        if (this.keys.ArrowLeft || this.keys.a || this.keys.A) this.direction = 'left';
        if (this.keys.ArrowRight || this.keys.d || this.keys.D) this.direction = 'right';
        if (this.keys.ArrowUp || this.keys.w || this.keys.W) this.direction = 'up';
    
        this.element.classList.remove('idle', 'walking', 'attacking');

        if (this.isMoving) {
            this.element.classList.add('walking');
            this.element.classList.add('walk-' + this.direction);
        } else {
            this.element.classList.add('idle');
            this.element.classList.add('idle-' + this.direction);
        }
    }

    updatePosition() {
        if (this.isAttacking) return;

        let newX = this.position.x;
        let newY = this.position.y;

        if (this.keys.ArrowLeft || this.keys.a || this.keys.A) newX -= this.speed;
        if (this.keys.ArrowRight || this.keys.d || this.keys.D) newX += this.speed;
        if (this.keys.ArrowUp || this.keys.w || this.keys.W) newY -= this.speed;
        if (this.keys.ArrowDown || this.keys.s || this.keys.S) newY += this.speed;

        this.scale = this.getResponsiveScale();

        // this.position.x = Math.max(this.bounds.left, Math.min(newX, this.bounds.right));
        // this.position.y = Math.max(this.bounds.top, Math.min(newY, this.bounds.bottom));

        const tempHitbox = {
            x: newX,
            y: newY,
            width: this.element.clientWidth * this.scale,
            height: this.element.clientHeight * this.scale
        };
    let collided = false;
                // Verifica se o slimeManager e slimes estão definidos
        if (window.slimeManager && window.slimeManager.slimes) {
            window.slimeManager.slimes.forEach(slime => {
                const slimeScale = slime.scale;
                const slimeRect = slime.element.getBoundingClientRect();
                const slimeHitbox = {
                    x: slimeRect.left,
                    y: slimeRect.top,
                    width: slimeRect.width * slimeScale,
                    height: slimeRect.height * slimeScale
                };

                // Verifica a colisão entre o tempHitbox e a hitbox do slime
                if (CollisionSystem.checkCollision(tempHitbox, slimeHitbox)) {
                    collided = true;  // Colisão detectada
                }
            });
        }

        if (!collided) {
            // Se não houve colisão, atualiza a posição do personagem
            this.position.x = Math.max(this.bounds.left, Math.min(newX, this.bounds.right));
            this.position.y = Math.max(this.bounds.top, Math.min(newY, this.bounds.bottom));
        }

        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;

        CollisionSystem.debugHitbox(this.element);
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
                if (e.key === 'e' || e.key === 'E') {
                    this.handleAttack();
                } else {
                    this.updateAnimation();
                }
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
        if (this.isMoving && !this.isAttacking) {
            this.updatePosition();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gamePlayer = new Character();
});