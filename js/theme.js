class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.body = document.body;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.body.setAttribute('data-theme', savedTheme);
            this.updateToggleButton(savedTheme);
        }
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        const currentTheme = this.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateToggleButton(newTheme);
    }
    
    updateToggleButton(theme) {
        this.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌑';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});