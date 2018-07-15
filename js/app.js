/*  TODO: 
 *  Better implementation of reload game
 *  Interval between keyPress  
 *  Implement a better restart function
 *  Change game design
 *  Implement a service worker
 */

// Enemies our player must avoid
let allEnemies = [];

let Enemy = function(x, y) {
    this.sprite = "images/enemy-bug.png";
    this.x = x;
    this.y = y;
    this.radius = 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < 520){
        this.x += 600 * dt;
    }
    else{
        this.x = Math.floor(Math.random()*(-400 - (-50) +1)+ (-50));
    }
};

/*
 *  TODO: transform loop to function
 *  Problem: accessing data 
*/

for(let i = 0; i < 4; i++){
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

/*
    TODO: implement more enemies:
    problem: more enemies in same line are often overlapped
*/

function enemyStartPos(x, y){
    allEnemies[0].x = -120;
    allEnemies[0].y = 50;
    allEnemies[1].x = -400;
    allEnemies[1].y = 140;
    allEnemies[2].x = -700;
    allEnemies[2].y = 230;
    allEnemies[3].x = -300;
    allEnemies[3].y = 300;
    return allEnemies;
};

function checkCollisions(){
    allEnemies.forEach(function(x, i){
        let dx = player.x - allEnemies[i].x;
        let dy = player.y - allEnemies[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + allEnemies[i].radius) {
            player.x = 202;
            player.y = 412;
            lostStar();
        }
    });
}

function addStars(){
    let ul = document.createElement("ul");
    ul.classList = 'stars';
    let body = document.querySelector('BODY');
    body.prepend(ul);    
    for (let i = 1; i <= 4; i++)
    {
        let li = document.createElement("li");  
        let i = document.createElement("i");
        i.className = "fa fa-star";

        li.appendChild(i);
        ul.appendChild(li);
    }
}

function lostStar(){
    let star = document.querySelectorAll('.stars li');
    for(let i = 0; i < star.length; star++){
        star[i].remove();
        if(star.length === 1){
            modalContent = modal();
            gameOver(modalContent);
            allEnemies = [];
            return allEnemies;
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function(w, h){
    this.sprite = 'images/char-cat-girl.png';
    this.x = 202;
    this.y = 412;
    this.radius = 20;
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// prevent the sprite to go off-canvas
Player.prototype.handleInput = function(keyPress){
    if(keyPress === 'left' && this.x > 0){
        this.x -= 102;
    }

    if(keyPress === 'right' && this.x < 400) {
        this.x += 102;
    }

    if(keyPress === 'up' && this.y > 0) {
        this.y -= 90;
        if(this.y < 0){
            let modalContent = modal();
            won(modalContent);
        }
   }

    if(keyPress === 'down' && this.y < 400) {
        this.y += 102;
    }
};



Player.prototype.update = function(){
    checkCollisions();
};

let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function modal(){
    let modal = document.createElement('div');
    let modalContent = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);
    modal.appendChild(modalContent);
    modalContent.classList.add('modalContent');
    return modalContent;
}

function won(modalContent){
    modalContent.innerHTML = '<h2>You Won!</h2><span>Wanna play again?</span><button class="playAgain">Play Again</button>';
    restartButton(modalContent);
}

function gameOver(modalContent){
    modalContent.innerHTML = '<h2>Game Over!</h2><span>Wanna play again?</span><button class="playAgain">Play Again</button>';
    restartButton(modalContent);
}

function restartButton(modalContent){
    let restart = document.querySelector('.playAgain');
    restart.addEventListener('click', function(){
        modalContent.parentElement.remove();
        addStars();
        // TODO: implement a better alternative
        window.location.reload()
    });
}

