// Socket Types

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    confirmMove: (player: Player) => void;
    rejectMove: () => void;
    sendGameboard: (gameboard: Gameboard) => void;
    playersUpdate: (players: Players) => void;
}

interface ClientToServerEvents {
    move: (move: string) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

// Game related Types

type Gameboard = Array<Array<Tile>>;

type Tile = 'GRASS' | 'LAVA' | 'ROCK' | 'WATER';

type Position = {
    x: number;
    y: number;
};

type Player = {
    id: string;
    position: Position;
    name: string;
};

type Players = { [key: string]: Player };
