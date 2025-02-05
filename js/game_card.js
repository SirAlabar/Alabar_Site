const games = [
    {
        title: "Game 1",
        description: "Uma aventura épica em WebAssembly",
        image: "./img/game1.gif",
        progress: 100,
        icon: "gamepad",
        playUrl: "/game1"
    },
    {
        title: "Game 2",
        description: "Puzzle game intrigante",
        image: "./img/game2.gif",
        progress: 30,
        icon: "puzzle-piece"
    },
    {
        title: "Game 3",
        description: "RPG estratégico",
        image: "./img/game3.gif",
        progress: 15,
        icon: "sword"
    }
];

let isTransitioning = false;

function updateGameProgress(game) {
    const progressDiv = document.getElementById('gameProgress');
    
    if (game.progress === 100) {
        progressDiv.innerHTML = `
            <button onclick="playGame('${game.playUrl}')" class="play-button">
                <i class="fas fa-play"></i>
                Jogar Agora
            </button>
        `;
    } else {
        progressDiv.innerHTML = `
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${game.progress}%"></div>
                <span class="progress-text">${game.progress}%</span>
            </div>
        `;
    }
}

function playGame(url) {
    window.location.href = url;
}

function selectGame(index) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const card = document.querySelector('.game-card');
    card.classList.add('transitioning');
    
    setTimeout(() => {
        const game = games[index];
        
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameDescription').textContent = game.description;
        document.getElementById('gameImage').src = game.image;
        
        updateGameProgress(game);
        
        document.querySelectorAll('.game-select-btn').forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        setTimeout(() => {
            card.classList.remove('transitioning');
            isTransitioning = false;
        }, 50);
    }, 300);
}