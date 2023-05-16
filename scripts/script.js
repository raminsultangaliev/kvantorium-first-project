const canvas = document.getElementById(" canvas");
const $ = canvas.getContext("2d");
const w = canvas.width;
const h = canvas.height;

const playerImage = new Image()
playerImage.src = "media/space ship.png"
const enemyImage = new Image()
enemyImage.src = "media/alien.png"

const rows = 13
const cols = 20

const cube = {
    w: 30,
    h: 30,
    padding: 10,
    offsetX: 15,
    offsetY: 15,
    visible: true
}

const cubes = []
for (let i = 0; i < rows; i++) {
    cubes[i] = []
    for (let j = 0; j < cols; j++) {
        const x = j * (cube.w + cube.padding) + cube.offsetX
        const y = i * (cube.h + cube.padding) + cube.offsetY

        cubes[i][j] = {
            x,
            y,
            ...cube
        }
    }
}

let playerX = cubes[0][Math.round(cols / 2)].x
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
        if (playerX < cubes[0][cols - 1].x) {
            playerX = playerX + (cube.w + cube.padding)
        }
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        if (playerX > cubes[0][0].x) {
            playerX = playerX - (cube.w + cube.padding)
        }
    }
})

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand) * (cube.w + cube.padding) + cube.offsetX
}

function drawPlayer() {
    $.fillStyle = 'white'
    $.font = '50px Helvetica'
    $.fillText('Score: '+String(score), w-230, 600)
    cubes.forEach((raw) => {
        raw.forEach((cube) => {
            if (cube.x == playerX && cube.y == cubes[rows - 1][0].y) {
                $.drawImage(playerImage, cube.x, cube.y, cube.w, cube.h + 15)
                $.clearRect(0, cube.y, cube.x, cube.h + 15)
                $.clearRect(cube.x + cube.w, cube.y, w, cube.h + 15)
            }
        })
    })
}

let obstX = [cubes[0][0].x, cubes[0][Math.round(cols / 2)].x, cubes[0][cols - 1].x]
let obstY = cube.offsetY - 2 * (cube.h + cube.padding)
let elementCount = 3
let score = 0
window.setInterval(() => {
    $.clearRect(0, 0, w, h)
    cubes.forEach((raw) => {
        raw.forEach((cube) => {
            obstX.forEach((element) => {
                if (cube.x == element && cube.y == obstY) {
                    // $.fillStyle = "red"
                    // $.fillRect(element, obstY + (cube.w + cube.padding), cube.w, cube.h)
                    $.drawImage(enemyImage, element-2.5, obstY-5, cube.w+5, cube.h+15)
                }
            })
        })
    })
    if (obstY == cubes[rows - 1][0].y) {
        obstX.forEach((element) => {
            if (playerX == element) {
                localStorage.setItem('score', String(score))
                window.location.href = 'game over.html'
            }
        })
        score++
        if (score < cols - 1) {
            elementCount = score
        }

        for (let i = 0; i < elementCount; i++) {
            obstX[i] = randomInteger(0, cols - 1)
            obstY = cube.offsetY - 2 * (cube.h + cube.padding)
        }
    }
    obstY = obstY + (cube.w + cube.padding)
}, 100)

function update() {
    drawPlayer()
    requestAnimationFrame(update)
}

update()

var str = "Game      "
let list = []
for (let i in str) {
    list.push(str[i])
}

window.setInterval(function () {
    list.push(list.shift())
    document.title = list.join('')
}, 300)

