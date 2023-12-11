import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import confetti from "canvas-confetti";
import './App.css'

const TURNS = {
  X: 'x',
  O: 'o'
}

const Square = ({children, isSelected, updateBoard, index}) => {
    const className = `square ${isSelected ? 'is-selected' : ''}`
    const handleClick = () =>{
        updateBoard(index);
    }
    return (
        <div className={className} onClick={handleClick}>
            {children}
        </div>
    )
}

const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function App() {
    //const [board, setBoard] = useState(0)
    const [board, setBoard] = useState(Array(9).fill(null))
    const [turn, setTurn] = useState(TURNS.X)
    const [winner, setWinner] = useState(null)
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
        const newWinner = checkWinner(newBoard)
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
            //Verificamos si hubo empate
            setWinner(false)
        }
    }

    const checkWinner = (boardtoCheck) =>{
        //Revisamos todas las combinaciones ganadoras para ver si x u o ganó
        for (const combo of WINNER_COMBOS){
            const [a, b, c] = combo;
            if(boardtoCheck[a] && boardtoCheck[a] === boardtoCheck[b] && boardtoCheck[a] === boardtoCheck[c] ){
                return boardtoCheck[a]
            }
        }
        return null
    }

    const checkEndGame = (boardtoCheck) => {
        return boardtoCheck.every(square => square != null )
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(TURNS.X)
        setWinner(null)
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
            {/*Renderizado condicional*/}
            {
                winner != null && (
                    <section className="winner">
                        <div className="text">
                            <h2>{winner === false ? 'Empate' : 'Ganó: '}</h2>
                            <header className="win">
                                <Square>{winner}</Square>
                            </header>
                            <footer>
                                <button onClick={resetGame}>Empezar de nuevo</button>
                            </footer>
                        </div>
                    </section>
                )
            }
        </main>
    )
}

export default App
