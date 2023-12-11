import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import confetti from "canvas-confetti";
import {TURNS, WINNER_COMBOS} from "./constants.js";
import {checkWinner, checkEndGame, resetGameStorage, saveGameStorage} from "./logic/game.js";
import './App.css'
import {WinnerModal} from "./components/WinnerModal.jsx";
import {Square} from "./components/Square.jsx";



function App() {
    //const [board, setBoard] = useState(0)
    const [board, setBoard] = useState(() => {
        const boardLs = window.localStorage.getItem('board')
        if(boardLs) return JSON.parse(boardLs)
        return Array(9).fill(null)
    })
    const [turn, setTurn] = useState(() => {
        const turnLs = window.localStorage.getItem('turn')
        return turnLs ?? TURNS.X
    })
    const [winner, setWinner] = useState(()=>{
        const winnerLs = window.localStorage.getItem('winner')
        if(winnerLs) return JSON.parse(winnerLs)
        return null
    })
    //Se pasan funciones como parametro por que en ocasiones no queremos que las funciones se ejecuten cuando
    // se renderiza un componente padre, si no cuando realmente queramos que se ejecuten
    const updateBoard = (index) => {
        console.log("updateBoard: ", index)
        //No actualizar la posición tiene
        if(board[index] || winner) return
        //NOTA: Siempre hay que tratar que el estado permanezca siempre inmutable, para hacer esto
        // es necesario tener buenos fundamenteos del spread y rest operatos
        const newBoard = [...board];
        newBoard[index] = turn; //le seteo el valor del turno al square
        setBoard(newBoard)//Establezco el valor del tablero del estado, no se modifico el estado ya que sigue siendo un array

        //Se cambia el turno para el nuevo jugador
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);

        //Revisamos quien es el ganador
        let newWinner = checkWinner(newBoard)
        if(newWinner){
            //NOTA: el cambio de estado es asincrono, por lo que la 2da instrucción puede mostrar información desactualizad del estado
            //es recomendable que si vamos a pasar un valor de estado a otra función, previo o posterior a un update de estado,
            // es mejor pasar el valor de la variable que se acutlizara y no el estado, ya que como es asincrono puede no estar actualizado
            //setWinner(newWinner)
            setWinner((prevWinner) => {
                //aqui se puede usar el valor anterior del estado
                console.log(`Ganador: ${newWinner}, el anterior : ${prevWinner}`);
                return newWinner
            })
            console.log("newWinner: ", newWinner)
            confetti()

        }else if(checkEndGame(newBoard)){
            newWinner = false;
            //Verificamos si hubo empate
            setWinner(newWinner)
        }

        //Guardar partida, el tablero y el turno
        saveGameStorage({board: newBoard, turn: newTurn, winner: newWinner})
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(TURNS.X)
        setWinner(null)
        resetGameStorage()
    }

    return (
        <main className="board">
            <h1>Tres en raya</h1>
            <button onClick={resetGame}>Empezar de nuevo</button>
            <section className='game'>
                {
                    board.map((cell, index) => {
                        return (
                            <Square key={index} index={index} updateBoard={updateBoard}>
                                {board[index]}
                            </Square>
                        )
                    })
                }
            </section>
            <section className='turn'>
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
            </section>
            <WinnerModal winner={winner} resetGame={resetGame}/>
        </main>
    )
}

export default App
