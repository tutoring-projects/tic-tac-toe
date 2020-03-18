const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

const queue = []

wss.on('connection', client => {
    client.reply = json => client.send(JSON.stringify(json))

    queue.push(client)
})

const messageHandler = (message, client, players) => {
    const parsedMessage = JSON.parse(message)

    const { event, data } = parsedMessage

    const grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]

    switch (event) {
        case 'ready':
            if (!client.ready) {
                console.log('Ready')
                players.push(client)
                client.ready = true

                if (players.length === 2) {
                    client.player = 2

                    console.log('Players Ready')

                    for (const client of players) {
                        client.reply({ 
                            event: 'start',
                            data: {
                                player: client.player
                            }
                        })                        
                    }
                } else {
                    client.player = 1
                }
            }
            break

        case 'move':
            const { x, y } = data

            if (grid[x][y] === 0) {
                grid[x][y] = client.player
            }
            

            for (const client of players) {
                client.reply({
                    event: 'move',
                    data: grid
                })                    
            }

            break
    }
}

setInterval(() => {
    if (queue.length > 1) {
        const match = queue.splice(0, 2)

        const players = []

        for (const client of match) {
            client.on('message', message => messageHandler(message, client, players))

            client.reply({ event: "match" }) 
        }

        setTimeout(() => {
            if (players.length < 2) {
                for (const client of match) {
                    client.reply({ event: "timeout" })
                }
            }

            if (players.length === 1) {
                const [readyPlayer] = players.splice(0, 1)
                
                players.unshift(
                    readyPlayer // first item in array
                )
            }
        }, 10000)
    }
}, 2000);

console.log('WebSocket server listening on port 8080')