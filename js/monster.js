class Monster {
    constructor(id, startX, startY, type = 'SLIME') {
        this.element = document.createElement('div');
        this.element.id = `monster-${id}`;
        this.element.className = `monster ${type.toLowerCase()} idle idle-down`;
        document.querySelector('.movement-area').appendChild(this.element);
        
        this.position = { x: startX, y: startY };
        this.speed = type === 'SLIME' ? 1.5 : 2;
        this.isMoving = false;
        this.scale = type === 'SLIME' ? 3 : 2.5;
        this.direction = 'down';
        this.currentState = 'idle';
        this.isDead = false;
        this.type = type;
        
        const config = type === 'SLIME' ? ENTITY_CONFIGS.SLIME : ENTITY_CONFIGS.GOBLIN;
        this.combatSystem = new CombatEntity(this.element, config);
        this.attackRange = config.attackRange;
        this.aggroRange = config.aggroRange;
        this.attackCooldown = config.attackCooldown;
        this.canAttack = true;
        
        this.isAngry = false;
        this.angerDuration = 5000;
        
        this.updateBounds();
        this.startBehavior();
        
        window.addEventListener('resize', () => {
            this.updateBounds();
            this.adjustPosition();
        });

        this.gameLoop();
    }

    takeDamage(damage) {
        this.combatSystem.takeDamage(damage);
        
        if (this.type === 'SLIME' && !this.isDead) {
            this.becomeAngry();
        }
    }

    becomeAngry() {
        this.isAngry = true;
        this.speed = 2.5;
        
        setTimeout(() => {
            if (!this.isDead) {
                this.isAngry = false;
                this.speed = 1.5;
                this.setState('idle');
            }
        }, this.angerDuration);
    }

    setState(newState) {
        this.element.classList.remove('idle', 'walking', 'hurt', 'dying', 'attacking');
        this.element.classList.add(newState);
        this.currentState = newState;
    }

    startBehavior() {
        if (this.type === 'SLIME') {
            this.startSlimeBehavior();
        } else {
            this.startGoblinBehavior();
        }
    }

    startSlimeBehavior() {
        setInterval(() => {
            if (!this.isDead && this.currentState !== 'hurt' && this.currentState !== 'dying') {
                if (this.isAngry) {
                    const player = document.querySelector('#character');
                    const distance = this.getDistanceToPlayer(player);

                    if (distance <= this.aggroRange && this.canAttack) {
                        this.attack();
                    } else {
                        this.setState('walking');
                        this.isMoving = true;
                        this.moveTowardsPlayer(player);
                    }
                } else {
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
                            if (!this.isDead && !this.isAngry) {
                                this.setState('idle');
                            }
                        }, Math.random() * 2000 + 1000);
                    } else {
                        this.setState('idle');
                    }
                }
            }
        }, Math.random() * 3000 + 2000);
    }

    startGoblinBehavior() {
        setInterval(() => {
            if (!this.isDead && this.currentState !== 'hurt' && this.currentState !== 'dying' && this.currentState !== 'attacking') {
                const player = document.querySelector('#character');
                const distance = this.getDistanceToPlayer(player);

                if (distance <= this.aggroRange && this.canAttack) {
                    this.attack();
                } else if (distance <= this.aggroRange * 1.5) {
                    this.setState('walking');
                    this.isMoving = true;
                    this.moveTowardsPlayer(player);
                } else {
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
                    } else {
                        this.setState('idle');
                        this.isMoving = false;
                    }
                }
            }
        }, 1000);
    }

    getDistanceToPlayer(player) {
        const playerRect = player.getBoundingClientRect();
        const monsterRect = this.element.getBoundingClientRect();
        
        return Math.sqrt(
            Math.pow(playerRect.x - monsterRect.x, 2) +
            Math.pow(playerRect.y - monsterRect.y, 2)
        );
    }

    moveTowardsPlayer(player) {
        const playerRect = player.getBoundingClientRect();
        const monsterRect = this.element.getBoundingClientRect();
        
        const dx = playerRect.x - monsterRect.x;
        const dy = playerRect.y - monsterRect.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.moveDirection = {
            x: dx / distance,
            y: dy / distance
        };
    }

    attack() {
        if (!this.isDead && this.currentState !== 'hurt' && this.currentState !== 'dying' && this.canAttack) {
            this.setState('attacking');
            this.canAttack = false;
    
            const player = document.querySelector('#character');
            if (CollisionSystem.checkAttackRange(this.element, player, this.attackRange)) {
                window.gamePlayer.combatSystem.takeDamage(this.combatSystem.calculateDamage());
            }

            setTimeout(() => {
                if (!this.isDead) {
                    this.setState('idle');
                }
            }, 500);

            setTimeout(() => {
                this.canAttack = true;
            }, this.attackCooldown);
        }
    }

    updateBounds() {
        const monsterWidth = 64 * this.scale;
        const monsterHeight = 64 * this.scale;
        const movementArea = document.querySelector('.movement-area');
        
        this.bounds = {
            left: monsterWidth / 2,
            right: movementArea.clientWidth - monsterWidth,
            top: 0,
            bottom: movementArea.clientHeight - monsterHeight
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

    die() {
        this.isDead = true;
        this.setState('dying');
        setTimeout(() => {
            this.element.remove();
        }, 500);
    }

    gameLoop() {
        this.updatePosition();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class MonsterManager {
    constructor() {
        this.monsters = [];
        this.maxSlimes = 2;
        this.maxGoblins = 1;
        
        this.spawnInitialMonsters();
        this.startRandomSpawnSystem();
    }

    spawnInitialMonsters() {
        this.spawnMonster(200, 200, 'SLIME');
        this.spawnMonster(300, 150, 'GOBLIN');
    }

    spawnMonster(x, y, type) {
        const currentTypeCount = this.monsters.filter(m => m.type === type).length;
        const maxForType = type === 'SLIME' ? this.maxSlimes : this.maxGoblins;

        if (currentTypeCount < maxForType) {
            const monster = new Monster(this.monsters.length, x, y, type);
            this.monsters.push(monster);
            return monster;
        }
        return null;
    }

    startRandomSpawnSystem() {
        setInterval(() => {
            const slimeCount = this.monsters.filter(m => m.type === 'SLIME').length;
            const goblinCount = this.monsters.filter(m => m.type === 'GOBLIN').length;

            if (Math.random() < 0.3) {
                if (slimeCount < this.maxSlimes) {
                    const x = Math.random() * (window.innerWidth * 0.4);
                    const y = Math.random() * (window.innerHeight * 0.5);
                    this.spawnMonster(x, y, 'SLIME');
                }
            }

            if (Math.random() < 0.2) {
                if (goblinCount < this.maxGoblins) {
                    const x = Math.random() * (window.innerWidth * 0.4);
                    const y = Math.random() * (window.innerHeight * 0.5);
                    this.spawnMonster(x, y, 'GOBLIN');
                }
            }
        }, 10000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.monsterManager = new MonsterManager();
});