const ENTITY_CONFIGS = {
    PLAYER: {
        maxHealth: 100,
        minDamage: 20,
        maxDamage: 30,
        attackRange: 50
    },
    SLIME: {
        maxHealth: 50,
        minDamage: 10,
        maxDamage: 15,
        attackRange: 30,
        aggroRange: 150,
        attackCooldown: 2000
    },
   /* GOBLIN: {
        maxHealth: 75,
        minDamage: 15,
        maxDamage: 25,
        attackRange: 40,
        aggroRange: 200,
        attackCooldown: 1500
    }*/
};

class CombatEntity {
    constructor(element, config) {
        this.element = element;
        this.health = config.maxHealth;
        this.maxHealth = config.maxHealth;
        this.minDamage = config.minDamage;
        this.maxDamage = config.maxDamage;
        this.isInvulnerable = false;
        this.isDead = false;
        this.healthBar = null;
        this.healthBarVisible = false;
    }

    createHealthBar() {
        if (!this.healthBar) {
            const healthBar = document.createElement('div');
            healthBar.className = 'health-bar';
            
            const healthFill = document.createElement('div');
            healthFill.className = 'health-bar-fill';
            healthFill.style.width = '100%';
            
            healthBar.appendChild(healthFill);
            this.element.appendChild(healthBar);
            this.healthBar = healthBar;
            this.healthFill = healthFill;
        }
        this.healthBar.style.display = 'block';
        this.healthBarVisible = true;
    }

    updateHealthBar() {
        if (!this.healthBarVisible) {
            this.createHealthBar();
        }
        const percentage = (this.health / this.maxHealth) * 100;
        this.healthFill.style.width = `${percentage}%`;
    }

    takeDamage(damage) {
        if (this.isInvulnerable || this.isDead) return;

        this.health -= damage;
        this.updateHealthBar();
        this.showDamageIndicator(damage);
        
        this.element.classList.add('damaged');
        setTimeout(() => this.element.classList.remove('damaged'), 500);

        if (this.health <= 0) {
            this.die();
        } else {
            this.makeInvulnerable();
        }
    }

    makeInvulnerable() {
        this.isInvulnerable = true;
        setTimeout(() => {
            this.isInvulnerable = false;
        }, 500);
    }

    showDamageIndicator(damage) {
        const indicator = document.createElement('div');
        indicator.className = 'damage-indicator';
        indicator.textContent = damage;
        
        const rect = this.element.getBoundingClientRect();
        indicator.style.left = `${rect.left + rect.width/2}px`;
        indicator.style.top = `${rect.top}px`;
        
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 1000);
    }

    calculateDamage() {
        return Math.floor(Math.random() * (this.maxDamage - this.minDamage + 1)) + this.minDamage;
    }

    die() {
        this.isDead = true;
        this.health = 0;
        this.updateHealthBar();
    }
}

class CollisionSystem {
    static getHitbox(element, hitboxSize = { width: 0.5, height: 0.5 }) {
        const rect = element.getBoundingClientRect();
        // Reduz a hitbox para uma porcentagem do tamanho total
        const width = rect.width * hitboxSize.width;
        const height = rect.height * hitboxSize.height;
        
        // Centraliza a hitbox
        const x = rect.left + (rect.width - width) / 2;
        const y = rect.top + (rect.height - height) / 2;
        
        return { x, y, width, height };
    }

    static checkCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y);
    }

    static getCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    static getDistance(element1, element2) {
        const center1 = this.getCenter(element1);
        const center2 = this.getCenter(element2);
        
        return Math.sqrt(
            Math.pow(center2.x - center1.x, 2) +
            Math.pow(center2.y - center1.y, 2)
        );
    }

    static checkAttackRange(attacker, target, range) {
        const distance = this.getDistance(attacker, target);
        return distance <= range;
    }

    // Opcional: Visualizar hitboxes para debug
    static debugHitbox(element, color = 'red') {
        const hitbox = this.getHitbox(element);
        
        let debugElement = document.getElementById(`debug-${element.id}`);
        if (!debugElement) {
            debugElement = document.createElement('div');
            debugElement.id = `debug-${element.id}`;
            debugElement.style.position = 'absolute';
            debugElement.style.border = `2px solid ${color}`;
            debugElement.style.pointerEvents = 'none';
            debugElement.style.zIndex = '9999';
            document.body.appendChild(debugElement);
        }
        
        debugElement.style.left = `${hitbox.x}px`;
        debugElement.style.top = `${hitbox.y}px`;
        debugElement.style.width = `${hitbox.width}px`;
        debugElement.style.height = `${hitbox.height}px`;
    }
}