import {Answer, CoordinatePair, GameMessage, Totem, TotemAnswer} from "./GameInterface";

type CoordinatesLine = boolean[]
type BooleanBoard = CoordinatesLine[]

export class Solver {
    private isOccupied: BooleanBoard;
    private baseCoordinate: CoordinatePair
    private numberOfTotems: number

    constructor() {
        // This method should be use to initialize some variables you will need throughout the challenge.
        this.baseCoordinate = [0, 0]
    }

    /*
     * Here is where the magic happens, for now the answer is a single 'I'. I bet you can do better ;)
     */
    getAnswer(gameMessage: GameMessage): Answer {
        const question = gameMessage.payload;
        console.log("Received Question: ", JSON.stringify(question));
        this.numberOfTotems = question.totems.length
        const receivedTotems = gameMessage.payload.totems;
        console.log("Number of shapes: ", this.numberOfTotems)

        let totems: TotemAnswer[] = []

        //set board dimensions
        //board dimensions heuristic: (this.numberOfTotems * 6) + 5) * (this.numberOfTotems * 6) + 5)
        let boardLine: CoordinatesLine = Array(this.numberOfTotems * 4).fill(true)
        this.isOccupied = Array(this.numberOfTotems * 4).fill(boardLine)

        //get next best baseCoordinate
        //BRUTEFORCE: random dans libre
        //MAYBE: array d'optimalCoordinates?
        this.baseCoordinate = this.getAvailableBaseCoordinate()

        let placedTotems = 0
        while (placedTotems < this.numberOfTotems) {
            placedTotems = 0
            for (const totemQuestion of receivedTotems) {
                let totemAnswer = this.getTotemAnswer(totemQuestion.shape, this.baseCoordinate)
                if (totemAnswer) {
                    totems.push(totemAnswer)
                    placedTotems++

                    //marquer les positions prises à false
                    for (const coordinate of totemAnswer.coordinates) {
                        this.isOccupied[coordinate[0]][coordinate[1]] = false
                    }

                    this.baseCoordinate = this.getAvailableBaseCoordinate()
                }
                // else if (totemAnswer === false) {
                //         //impossible de placer le totem; passer au suivant
                //         //MAYBE: aller à la prochaine optimalCoordinate
                //     }
            }
        }

        const answer = {totems};
        console.log("Sending Answer: ", JSON.stringify(answer));
        return answer;
    }

    private static getRotations(shape: Totem, basePosition: CoordinatePair): CoordinatePair[][] {
        const [i, j] = basePosition
        switch (shape) {
            case "O":
                return [[ //seul cas
                    [i, j],
                    [i + 1, j],
                    [i, j + 1],
                    [i + 1, j + 1]
                ]]
            case "I":
                return [
                    [ //I couché
                        [i, j],
                        [i + 1, j],
                        [i + 2, j],
                        [i + 3, j]
                    ],
                    [ //I levé
                        [i, j],
                        [i, j + 1],
                        [i, j + 2],
                        [i, j + 3]
                    ],
                ]
            case "L":
                return [
                    [ //L base à gauche
                        [i, j],
                        [i + 1, j],
                        [i, j + 1],
                        [i, j + 2]
                    ],
                    [ //L base à droite
                        [i, j],
                        [i - 1, j],
                        [i, j - 1],
                        [i, j - 2]
                    ],
                    [ //L base en bas
                        [i, j],
                        [i + 1, j],
                        [i + 2, j],
                        [i + 2, j + 1]
                    ],
                    [ //L base en haut
                        [i, j],
                        [i, j + 1],
                        [i + 1, j + 1],
                        [i + 2, j + 1]
                    ],
                ]
            case "J":
                return [
                    [ //J base à gauche
                        [i, j],
                        [i + 1, j],
                        [i, j - 1],
                        [i, j - 2]
                    ],
                    [ //J base à droite
                        [i, j],
                        [i + 1, j],
                        [i + 1, j + 1],
                        [i + 1, j + 2]
                    ],
                    [ //J base en bas
                        [i, j],
                        [i + 1, j],
                        [i + 2, j],
                        [i, j + 1]
                    ],
                    [ //J base en haut
                        [i, j],
                        [i + 1, j],
                        [i + 2, j],
                        [i + 2, j - 1]
                    ],
                ]
            case "T":
                return [
                    [ //T base à gauche
                        [i, j],
                        [i + 1, j],
                        [i, j + 1],
                        [i, j - 1]
                    ],
                    [ //T base à droite
                        [i, j],
                        [i + 1, j],
                        [i + 1, j + 1],
                        [i + 1, j - 1]
                    ],
                    [ //T base en bas
                        [i, j],
                        [i + 1, j],
                        [i + 2, j],
                        [i + 1, j + 1]
                    ],
                    [ //T base en haut
                        [i, j],
                        [i + 1, j],
                        [i + 2, j],
                        [i + 1, j - 1]

                    ],
                ]
            case "S":
                return [
                    [ //S cas 1
                        [i, j],
                        [i + 1, j],
                        [i, j + 1],
                        [i + 1, j - 1]
                    ],
                    [ //S cas 2
                        [i, j],
                        [i + 1, j],
                        [i + 1, j + 1],
                        [i + 2, j + 1]
                    ]
                ]
            case "Z":
                return [
                    [ //Z cas 1
                        [i, j],
                        [i + 1, j],
                        [i + 1, j - 1],
                        [i + 2, j - 1]
                    ],
                    [ //Z cas 2
                        [i, j],
                        [i, j + 1],
                        [i + 1, j + 1],
                        [i + 1, j + 2]
                    ]
                ]
        }
        return []
    }

    private isCoordinateFree(coordinate: CoordinatePair): boolean {
        return this.isOccupied[coordinate[0]][coordinate[1]]
    }

    private isRotationPossible(coordinates: CoordinatePair[]): boolean {
        return coordinates.every((coordinate) => this.isCoordinateFree(coordinate))
    }

    private getTotemAnswer(shape: Totem, basePosition: CoordinatePair): TotemAnswer | false {
        let rotations = Solver.getRotations(shape, basePosition)

        //essayer toutes les rotations possibles sinon on retourne false
        for (const rotation of rotations) {
            if (this.isRotationPossible(rotation)) {
                return {shape, coordinates: rotation}
            }
        }
        return false
    }

    private getAvailableBaseCoordinate(): CoordinatePair {
        for (let i = 0; i < this.numberOfTotems * 4; i++) {
            for (let j = 0; j < this.numberOfTotems * 4; j++) {
                if (this.isOccupied[i][j]) {
                    return [i, j];
                }
            }
        }
    }
}
