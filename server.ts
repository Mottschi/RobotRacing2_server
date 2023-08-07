import { Server } from 'socket.io';

const PORT = 3000;

const rows = 10;
const columns = 10;

const gameboard: Gameboard = new Array(rows).fill(
    new Array(columns).fill('GRASS'),
);

const players: Players = {};

let playerCount = 0;

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>({
    cors: {
        origin: 'http://localhost:5173',
    },
});

io.on('connection', (socket) => {
    console.log('socket connected - new player:', socket.id);
    playerCount++;
    const player: Player = {
        id: socket.id,
        position: { x: 0, y: 0 },
        name: `P${playerCount}`,
    };

    players[socket.id] = player;

    socket.on('move', (move: string) => {
        const player = players[socket.id];
        const currentPosition = player.position;
        let newPosition = currentPosition;
        console.log('moving', move);
        switch (move) {
            case 'LEFT':
                newPosition = {
                    ...newPosition,
                    x: Math.max(0, newPosition.x - 1),
                };
                break;
            case 'RIGHT':
                newPosition = {
                    ...newPosition,
                    x: Math.min(columns - 1, newPosition.x + 1),
                };
                break;
            case 'UP':
                newPosition = {
                    ...newPosition,
                    y: Math.max(0, newPosition.y - 1),
                };
                break;
            case 'DOWN':
                newPosition = {
                    ...newPosition,
                    y: Math.min(rows - 1, newPosition.y + 1),
                };
                break;
            default:
                break;
        }
        player.position = newPosition;

        socket.emit('confirmMove', player);
        io.emit('playersUpdate', players);
        console.log(players);
    });

    // console.log('sending gameboard', gameboard);
    socket.emit('sendGameboard', gameboard);
    io.emit('playersUpdate', players);
    console.log(players);
});

io.listen(PORT);
console.log('listening');
