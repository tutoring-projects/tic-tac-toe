// Canvas

const canvas = document.querySelector('#grid')
const context = canvas.getContext('2d')

const drawX = (x, y) => {
    context.fillStyle = 'blue'
    context.fillRect(x, y, 1, 1)
}

const drawCircle = (x, y) => {
    context.fillStyle = 'red'
    context.fillRect(x, y, 1, 1)
}

const drawGrid = grid => {
    for (const x in grid) {
        const row = grid[x]
    
        for (const y in row) {
            if (grid[x][y] === 1) {
                drawX(x, y)
            } else if (grid[x][y] === 2) {
                drawCircle(x, y)
            }
        }
    }
}

let grid = [
    [1,1,0],
    [0,1,0],
    [2,0,0],
]

// drawGrid(grid)

// WebSockets

const ws = new WebSocket("ws://localhost:8080")

ws.onopen = () => {
    console.log('Connected to Server')
}

ws.reply = json => ws.send(JSON.stringify(json))

ws.onmessage = ({ data: message }) => {
    const parsedMessage = JSON.parse(message)
    const { event, data } = parsedMessage

    switch (event) {
        case 'match':
            ws.reply({ event: 'ready' })
            break

        case 'start':
            const { player } = data
            ws.player = player

            // start game
            break
        
        case 'move':
            drawGrid(data)
            break
    }   
}

const move = (x, y) => {
    ws.reply({
        event: 'move',
        data: { x, y }
    })
}