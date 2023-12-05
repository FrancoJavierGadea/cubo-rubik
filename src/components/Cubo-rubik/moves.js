
export const CUBE_MOVES = {

    "F": { angle: -90, face: "front", reverse: "F'" },
    "F'": { angle: 90, face: "front", reverse: "F" },

    "B": { angle: 90, face: "back", reverse: "B'" },
    "B'": { angle: -90, face: "back", reverse: "B" },

    "R": { angle: -90, face: "right", reverse: "R'" },
    "R'": { angle: 90, face: "right", reverse: "R" },

    "L": { angle: 90, face: "left", reverse: "L'" },
    "L'": { angle: -90, face: "left", reverse: "L" },

    "U": { angle: -90, face: "top", reverse: "U'" },
    "U'": { angle: 90, face: "top", reverse: "U" },

    "D": { angle: 90, face: "bottom", reverse: "D'" },
    "D'": { angle: -90, face: "bottom", reverse: "D" },

    //Middle faces
    "M": { angle: 90, face: "middleX", reverse: "M'" },
    "M'": { angle: -90, face: "middleX", reverse: "M" },

    "E": { angle: 90, face: "middleY", reverse: "E'" },
    "E'": { angle: -90, face: "middleY", reverse: "E" },

    "S": { angle: -90, face: "middleZ", reverse: "S'" },
    "S'": { angle: 90, face: "middleZ", reverse: "S" },
}

export function getMoves(string = ''){

    return string.split(' ').map(key => {

        return CUBE_MOVES[key];
    });
}

export function getInverseMoves(moves = []){

    return moves.toReversed().map(move => {

        return CUBE_MOVES[move.reverse];
    });
}