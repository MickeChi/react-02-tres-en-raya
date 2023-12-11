import {WINNER_COMBOS} from "../constants.js";

export const checkWinner = (boardtoCheck) =>{
    //Revisamos todas las combinaciones ganadoras para ver si x u o ganó
    for (const combo of WINNER_COMBOS){
        const [a, b, c] = combo;
        if(boardtoCheck[a] && boardtoCheck[a] === boardtoCheck[b] && boardtoCheck[a] === boardtoCheck[c] ){
            return boardtoCheck[a]
        }
    }
    return null
}

export const checkEndGame = (boardtoCheck) => {
    return boardtoCheck.every(square => square != null )
}

export const resetGameStorage = () => {
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
    window.localStorage.removeItem('winner')
}

export const saveGameStorage = ({board, turn, winner}) => {
    window.localStorage.setItem('board', JSON.stringify(board))
    window.localStorage.setItem('turn', turn)
    window.localStorage.setItem('winner', JSON.stringify(winner))

}

