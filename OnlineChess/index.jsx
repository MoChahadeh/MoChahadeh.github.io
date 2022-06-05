const rootElement = document.getElementById("root");

const startBoard = JSON.parse(`[
    [{"color": "black", "piece": "rook"},{"color": "black", "piece": "knight"},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "queen"},{"color": "black", "piece": "king"},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "knight"},{"color": "black", "piece": "rook"}],
    [{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"},{"color": "black", "piece": "pawn"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "black", "piece": "pawn"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
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

            const possibleDests = this.getPossibleDestinations(this.state.selectedSquare);

            if(possibleDests.some(obj => (obj.row == rowIndex && obj.col == colIndex))) {

                this.movePiece(this.state.selectedSquare, {row:rowIndex, col: colIndex});
                console.log("hello");
                return;
            }

            document.getElementById(this.state.selectedSquare.id).classList.remove("clickedSquare");
            
            possibleDests.map((sq) => {
                document.getElementById(`sq${sq.row}${sq.col}`)?.classList.remove("possibleDestination");
            });

            this.setState({
                selectedSquare: null
            })
            return;
        } 

        const currentBoard = this.state.history[this.state.history.length-1];
        const selectedPiece = currentBoard[rowIndex][colIndex];
        const selectedSquare = {id: `sq${rowIndex}${colIndex}`,color: selectedPiece.color, piece: selectedPiece.piece };

        if(selectedSquare.color == "null") return;

        if(this.getPossibleDestinations(selectedSquare).length > 0) {

            document.getElementById(`sq${rowIndex}${colIndex}`).classList.add("clickedSquare");
            this.setState({ selectedSquare });

            this.getPossibleDestinations(selectedSquare).map((sq) => {
                document.getElementById(`sq${sq.row}${sq.col}`)?.classList.add("possibleDestination");
            });

        }

    }

    getPossibleDestinations = (selectedSquare) => {

        const currentBoard = this.state.history[this.state.history.length-1];
        
        const {color, piece} = selectedSquare;
        const row = parseInt(selectedSquare.id.substring(2,3));
        const col = parseInt(selectedSquare.id.substring(3));

        switch(piece) {

            case "pawn":
                const pawnArr = [];

                const direction = color == "white" ? -1 : 1;

                if((direction == 1 && row < 7) || (direction == -1 && row > 0)) {

                    if(currentBoard[row+direction][col].color == "null") {

                        pawnArr.push({row: row+direction, col});

                        if((direction == 1 && row == 1) || (direction == -1 && row == 6)) {

                            if(currentBoard[row+(2*direction)][col].color == "null") {
                                pawnArr.push({row: row+(2*direction), col});
                            }

                        }
                    }

                    
                    if(col > 0 && currentBoard[row+(direction)][col-1].color != "null" && currentBoard[row+(direction)][col-1].color != color) {
                            pawnArr.push({row: row+(direction), col: col-1});
                    }

                    if(col < 7 && currentBoard[row+(direction)][col+1].color != "null" && currentBoard[row+(direction)][col+1].color != color) {
                        pawnArr.push({row: row+(direction), col: col+1});
                    }

                }
               
            return pawnArr;
            
        }

        return [];

    }

    movePiece = (from, to) => {

        const currentBoard = JSON.parse(JSON.stringify(this.state.history[this.state.history-1]));

        if(from.piece == "pawn") {
            if((from.color == "black" && to.row == 7) || (from.color == "white") && to.row == 7) {
                from.piece = "queen";
            }
        }


        return ;
    }

}

function Board(props){

    return(
        <div id="board">
            {
                new Array(8).fill(null).map((a,rowIndex) => {
                    return <div className="row" id={`row${rowIndex}`} style={{marginTop : rowIndex == 0? 0 : -2}}>
                        {
                            new Array(8).fill(null).map((b, colIndex) => {
                                return <Square id={`sq${rowIndex}${colIndex}`} piece={startBoard[rowIndex][colIndex]} color={getColorOfSquare(rowIndex, colIndex)}  onSquareClicked={() =>  props.onSquareClicked(rowIndex, colIndex)} />
                            })
                        }
                    </div>
                })
            }
        </div>
    );

}


function Square(props){

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