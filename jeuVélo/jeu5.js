document.addEventListener('DOMContentLoaded', (event) => {
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    const playerName = sessionStorage.getItem('playerName') || 'Sans pseudo';
    playerNameDisplay.textContent = playerName;

let score = 0;
let timeLeft = 20;
let gameInterval;
let level = 1;
let imagesOnBoard = [];
const gameBoard = document.getElementById('gameBoard');
let isGameRunning = false;
let clickCount = 0; // SUB'Stats: total clics durant la partie

const startBtn = document.getElementById('startButton');
if (startBtn) startBtn.addEventListener('click', startGame);

function startGame() {
    isGameRunning = true;
    score = 0;
    timeLeft = 20;
    clickCount = 0;
    const startButton = document.getElementById('startButton');
    startButton.style.display = 'none'; // ou startButton.remove(); pour le supprimer complètement
    console.log("Le jeu commence !");
    level = 1;
    imagesOnBoard = [];
    updateScore();
    if (!gameBoard) return;
    gameBoard.innerHTML = '';
    initializeImages();
    gameInterval = setInterval(updateTimer, 1000); // Ajoute cet intervalle
}

function initializeImages() {
    // Vider le tableau de jeu et la liste des images
    if (!gameBoard) return;
    gameBoard.innerHTML = '';
    imagesOnBoard = [];

    // Logique pour ajouter des images
    let images = ['Bike.png'];
    if (level >= 2) images.push('Ballon.png');
    if (level >= 3) images.push('Skateboard.png');
    if (level >= 4) images.push('Scooter.png');

    images.forEach(image => {
        addImage(image);
    });
}

function addImage(imageName) {
    if (!gameBoard) return;
    const imgElement = document.createElement('img');
    imgElement.src = `./Images/${imageName}`;
    imgElement.classList.add('gameImage');
    imgElement.style.left = `0px`;
    imgElement.style.top = `0px`;
    imgElement.style.visibility = 'hidden';
    gameBoard.appendChild(imgElement);

    // Mesure réelle une fois dans le DOM
    const imgWidth = imgElement.offsetWidth || 50;
    const imgHeight = imgElement.offsetHeight || imgWidth;
    const maxLeft = Math.max(0, gameBoard.clientWidth - imgWidth);
    const maxTop = Math.max(0, gameBoard.clientHeight - imgHeight);

    let position;
    let attempts = 0;
    do {
        position = {
            left: Math.random() * maxLeft,
            top: Math.random() * maxTop
        };
        attempts++;
        if (attempts > 50) break; // échappe en cas de forte densité
    } while (isOverlapping(position, imgWidth, imgHeight));

    imgElement.style.left = `${position.left}px`;
    imgElement.style.top = `${position.top}px`;
    imgElement.style.visibility = 'visible';
    imgElement.onclick = () => {
        handleImageClick(imageName);
        clickCount++; // comptabilise le clic sur une image
        levelUp();
    };
    imagesOnBoard.push({ imgElement, position, width: imgWidth, height: imgHeight });
}

function isOverlapping(newPosition, w, h) {
    const nx1 = newPosition.left, ny1 = newPosition.top;
    const nx2 = nx1 + w, ny2 = ny1 + h;
    return imagesOnBoard.some(({ position, width, height }) => {
        const x1 = position.left, y1 = position.top;
        const x2 = x1 + (width || 50), y2 = y1 + (height || width || 50);
        // Test chevauchement rectangles
        return !(nx2 <= x1 || nx1 >= x2 || ny2 <= y1 || ny1 >= y2);
    });
}

// Recalage basique lors des changements de taille du board
const ro = new ResizeObserver(() => {
    if (!gameBoard) return;
    imagesOnBoard.forEach(obj => {
        const img = obj.imgElement;
        const w = img.offsetWidth || obj.width || 50;
        const h = img.offsetHeight || obj.height || w;
        const maxLeft = Math.max(0, gameBoard.clientWidth - w);
        const maxTop = Math.max(0, gameBoard.clientHeight - h);
        obj.position.left = Math.min(obj.position.left, maxLeft);
        obj.position.top = Math.min(obj.position.top, maxTop);
        img.style.left = `${obj.position.left}px`;
        img.style.top = `${obj.position.top}px`;
        obj.width = w; obj.height = h;
    });
});
if (gameBoard) ro.observe(gameBoard);

function handleImageClick(imageName) {
    switch(imageName) {
        case 'Bike.png':
            score += 2;
            break;
        case 'Ballon.png':
            score -= 1;
            break;
        case 'Skateboard.png':
            score -= 2;
            break;
        case 'Scooter.png':
            score -= 4;
            break;
    }
    updateScore();
}

function levelUp() {
    level++;
    initializeImages();
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
    } else {
        clearInterval(gameInterval);
        endGame();
    }
}

function endGame() {
    isGameRunning = false;
    try { if (window.SUBStats) window.SUBStats.addClicks(playerName, clickCount); } catch(e) {}
    alert(`Jeu terminé ! Votre score est : ${score}`);
    // Ajoutez ici la logique pour enregistrer le score dans Firebase si nécessaire
            // Ajoutez ici la logique pour vérifier et mettre à jour le meilleur score
            updateBestScoreIfNecessary();
}

function updateBestScoreIfNecessary() {
    try {
        if (!window.ScoreUtil) { redirectToGameOverPage(); return; }
        window.ScoreUtil.setMaxScore(playerName, 'jeu5', score)
          .then(({updated}) => { if (updated) alert('Nouveau meilleur score enregistré !'); })
          .finally(() => { redirectToGameOverPage(); });
    } catch(_) { redirectToGameOverPage(); }
}

function redirectToGameOverPage() {
    window.location.href = 'finJeu5.html'; // Assurez-vous que le chemin est correct
}
});
