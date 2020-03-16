const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;


const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 600;

const ENEMIES_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;


const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    enemies: []
};

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px, ${y}px)`;
}

function constrain(v, min, max){
    if (v < min) {
        return min;
    }
    else if (v > max) {
        return max;
    }
    else {
        return v;
    }
}

function createPlayer($container){
    GAME_STATE.playerX = GAME_WIDTH /2;
    GAME_STATE.playerY = GAME_HEIGHT - 50;
    const $player = document.createElement("img");
    $player.src = "img/player-blue-1.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
};

function init() {
    const $container = document.querySelector(".game");
    createPlayer($container);

    const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / 
        (ENEMIES_PER_ROW - 1);
    for (let j = 0; j < 3; j++){
        const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
        for (let i = 0; i < ENEMIES_PER_ROW; i++){
            const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
            createEnemy($container, x, y);
        }
    }
}

function updatePlayer(deltaTime, $container){
    if (GAME_STATE.leftPressed) {
        GAME_STATE.playerX -= deltaTime * PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
        GAME_STATE.playerX += deltaTime * PLAYER_MAX_SPEED;
    }

    GAME_STATE.playerX = constrain(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);

    const $player = document.querySelector(".player");
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createEnemy($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "img/enemy-blue-1.png";
    $element.className = "enemy";
    $container.appendChild($element);
    const enemy = {
        x,
        y,
        $element
    };
    GAME_STATE.enemies.push(enemy);
    setPosition($element, x, y);
}

function updateEnemies(deltaTime){
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

    const enemies = GAME_STATE.enemies;
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const x = enemy.x + dx;
        const y = enemy.y + dy;
        setPosition(enemy.$element, x, y);
    }
}

function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - GAME_STATE.lastTime) / 1000;
    updatePlayer(deltaTime);
    updateEnemies(deltaTime);

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

function onKeyDown(e){
    if (e.keyCode === KEY_CODE_LEFT) {
        GAME_STATE.leftPressed = true;
    }
    else if (e.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.rightPressed = true;
    }
    else if (e.keyCode === KEY_CODE_SPACE){
        GAME_STATE.spacePressed = true;
    }
}

function onKeyUp(e){
    if (e.keyCode === KEY_CODE_LEFT) {
        GAME_STATE.leftPressed = false;
    }
    else if (e.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.rightPressed = false;
    }
    else if (e.keyCode === KEY_CODE_SPACE){
        GAME_STATE.spacePressed = false;
    }
}

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);