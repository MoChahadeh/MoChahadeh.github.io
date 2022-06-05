const rootElement = document.getElementById("root");

const startBoard = JSON.parse(`[
    [{"color": "black", "piece": "rook"},{"color": "black", "piece": "knight"},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "queen"},{"color": "black", "piece": "king"},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "knight"},{"color": "black", "piece": "rook"}],
    [{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"}],
    [{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"}],
    [{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"}],
    [{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"}],
    [{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"},{"color": "null", "piece": "nul"}],
    [{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"},{"color": "white", "piece": "pawn"}],
    [{"color": "white", "piece": "rook"},{"color": "white", "piece": "knight"},{"color": "white", "piece": "bishop"},{"color": "white", "piece": "queen"},{"color": "white", "piece": "king"},{"color": "white", "piece": "bishop"},{"color": "white", "piece": "knight"},{"color": "white", "piece": "rook"}]
]`);

class App extends React.Component {

    state = {
        
        selectedSquare: null,
        history: [startBoard],
        isWhiteTurn: false,
    }

    render() {
        return (
            <div id="container">
                <Board onSquareClicked={this.onSquareClicked} />
            </div>
        )
    }

    onSquareClicked = (rowIndex, colIndex) => {

        if(this.state.selectedSquare) {
            document.getElementById(this.state.selectedSquare.id).classList.remove("clickedSquare");
            this.setState({
                selectedSquare: null
            })
            return;
        } 

        const currentBoard = this.state.history[this.state.history.length];
        const clickedPiece = startBoard[rowIndex][colIndex];

        if(clickedPiece.color == "null") return;

        document.getElementById(`sq${rowIndex}${colIndex}`).classList.add("clickedSquare");
        this.setState({
            selectedSquare: {id: `sq${rowIndex}${colIndex}`, color : clickedPiece.color, piece: clickedPiece.piece}
        });

    }

}

const Board = (props) => {

    return(
        <div id="board">
            {
                new Array(8).fill(null).map((a,rowIndex) => {
                    return <div className="row" id={`row${rowIndex}`} style={{marginTop : rowIndex == 0? 0 : -2}}>
                        {
                            new Array(8).fill(null).map((b, colIndex) => {
                                return <Square id={`sq${rowIndex}${colIndex}`} piece={startBoard[rowIndex][colIndex]} color={getColorOfSquare(rowIndex, colIndex)}  onSquareClicked={() => {console.log("hello"); props.onSquareClicked(rowIndex, colIndex)}} />
                            })
                        }
                    </div>
                })
            }
        </div>
    );

}


const Square = (props) => {

    const imgUrl = props.piece.color == "null" ? "" : `./assets/chessPieces/${props.piece.color}/${props.piece.piece}.png`;

    return (
        <div onClick={props.onSquareClicked} id={props.id} className={"square " + props.color}>
            <div className="pieceImg" style={{backgroundImage: imgUrl ? `url("${imgUrl}")` : "none"}} />
        </div>
    );
}

function getColorOfSquare(row, col) {

    switch(row%2) {

        case 0:
            switch(col%2) {
                case 0:
                    return 'white';
                case 1:
                    return 'gray';
            }
            break;
        case 1:
            switch(col%2) {
                case 0:
                    return 'gray';
                case 1:
                    return 'white';
            }
            break;
    }

}



ReactDOM.render( <App />, rootElement);