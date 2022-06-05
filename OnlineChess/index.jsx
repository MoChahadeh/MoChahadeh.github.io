const rootElement = document.getElementById("root");

const startBoard = JSON.parse(`[
    [{"color": "black", "piece": "rook", "castlable" : true},{"color": "black", "piece": "knight"},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "queen"},{"color": "black", "piece": "king", "castable" : true},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "knight"},{"color": "black", "piece": "rook", "castlable" : true}],
    [{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0}],
    [{"color": "white", "piece": "rook", "castlable" : true},{"color": "white", "piece": "knight"},{"color": "white", "piece": "bishop"},{"color": "white", "piece": "queen"},{"color": "white", "piece": "king", "castable" : true},{"color": "white", "piece": "bishop"},{"color": "white", "piece": "knight"},{"color": "white", "piece": "rook", "castlable" : true}]
]`);

class App extends React.Component {

    state = {
        
        selectedSquare: null,
        history: [startBoard],
        isWhiteTurn: true,
    }

    render() {
        return (
            <div id="container">
                <Board isWhiteTurn={this.state.isWhiteTurn} boardArray={this.state.history[this.state.history.length-1]} onSquareClicked={this.onSquareClicked} />
            </div>
        )
    }

    onSquareClicked = (rowIndex, colIndex) => {

        if(this.state.selectedSquare) {

            const possibleDests = this.getPossibleDestinations(this.state.selectedSquare);

            if(possibleDests.some(obj => (obj.row == rowIndex && obj.col == colIndex))) {

                this.movePiece(this.state.selectedSquare, possibleDests.filter(obj => (obj.row == rowIndex && obj.col == colIndex))[0]);
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

        const selectedSquare = JSON.parse(JSON.stringify(currentBoard[rowIndex][colIndex]));
        selectedSquare.id= `sq${rowIndex}${colIndex}`;

        if(selectedSquare.color == "null") return;

        if(this.getPossibleDestinations(selectedSquare).length > 0 && (selectedSquare.color == "white") == this.state.isWhiteTurn) {

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

                    if(selectedSquare.enPassant) {
                        console.log(selectedSquare.enPassant)
                        pawnArr.push({row: row+direction , col: col+selectedSquare.enPassant, enPassantRow: -direction});
                    }


                }
               
            return pawnArr;

            case "rook":
                let rookArr = [];

                for(let i = row-1; i > -1; i-- ) {

                    if(currentBoard[i][col].color == color) {break;}

                    rookArr.push({row: i, col});

                    if(currentBoard[i][col].color != "null") {break;}

                }

                for(let i = row+1; i < 8; i++) {
                    if(currentBoard[i][col].color == color) {break;}

                    rookArr.push({row: i, col});

                    if(currentBoard[i][col].color != "null") {break;}
                    
                }

                for(let i = col-1; i > -1; i--) {
                    if(currentBoard[row][i].color == color) {break;}

                    rookArr.push({row, col: i});

                    if(currentBoard[row][i].color != "null") break;
                    
                }

                for(let i = col+1; i < 8; i++) {
                    if(currentBoard[row][i].color == color) break;

                    rookArr.push({row, col: i});

                    if(currentBoard[row][i].color != "null") break;
                    
                }

                return rookArr;
            
            case "bishop":

                let bishopArr = [];

                let completed = [false, false, false, false];

                let i = 1;
                while(completed.some((b) => (b == false))){

                    if(row-i > -1 && col-i > -1 && !completed[0]) {
                        if(currentBoard[row-i][col-i].color == color) {
                            completed[0] = true;
                        }
                        else {
                            bishopArr.push({row: row-i, col: col-i});
                            if(currentBoard[row-i][col-i].color != "null") {
                                completed[0] = true
                            }
                                
                        }
                    } else {
                        completed[0] = true;
                    }

                    if(row-i > -1 && col+i < 8 && !completed[1]) {

                        if(currentBoard[row-i][col+i].color == color) {
                            completed[1] = true;
                        }
                        else {
                            bishopArr.push({row: row-i, col: col+i});
                            if(currentBoard[row-i][col+i].color != "null") {
                                completed[1] = true;
                        }}

                    }else {
                        completed[1] = true;
                    }

                    if(row+i < 8 && col-i > -1 && !completed[2]) {

                        if(currentBoard[row+i][col-i].color == color) {
                            completed[2] = true;
                        }
                        else {
                            bishopArr.push({row: row+i, col: col-i});
                            if(currentBoard[row+i][col-i].color != "null") {
                                completed[2] = true;
                            }
                        }

                    }else {
                        completed[2] = true;
                    }

                    if(row+i < 8 && col+i < 8 && !completed[3]) {

                        if(currentBoard[row+i][col+i].color == color) {
                            completed[3] = true;

                        }
                        else {
                            bishopArr.push({row: row+i, col: col+i});
                            if(currentBoard[row+i][col+i].color != "null") {
                                completed[3] = true;
                            }
                        }

                    }else {
                        completed[3] = true;
                    }
                    i++;
                }

                return bishopArr;

            case "queen" :

                let queenArr = [];
                const manipulated = JSON.parse(JSON.stringify(selectedSquare));
                manipulated.piece = "rook";
                queenArr = this.getPossibleDestinations(manipulated);

                manipulated.piece = "bishop";

                queenArr = queenArr.concat(this.getPossibleDestinations(manipulated));

                return queenArr;

            case "king" :

                const possibleKingMoves = [
                    {row: -1, col: -1},
                    {row: -1, col: 0},
                    {row: -1, col: 1},
                    {row: 0, col: -1},
                    {row: 0, col: 1},
                    {row: 1, col: -1},
                    {row: 1, col: 0},
                    {row: 1, col: 1},
                ]

                let kingArr = [];
                possibleKingMoves.map((sq) => {

                    let newPosRow = row+sq.row;
                    let newPosCol = col+sq.col;

                    if(newPosRow < 8 && newPosRow > -1 && newPosCol < 8 && newPosCol > -1 && currentBoard[newPosRow][newPosCol].color != color) {
                        kingArr.push({row: newPosRow, col: newPosCol});
                    }

                })

                return kingArr;
            
            case "knight":

                const possibleKnightMoves = [
                    {row: -2, col: -1},
                    {row: -2, col: 1},
                    {row: 2, col: -1},
                    {row: 2, col: 1},
                    {row: -1, col: -2},
                    {row: -1, col: 2},
                    {row: 1, col: -2},
                    {row: 1, col: 2},
                ]

                const knightArr = [];

                possibleKnightMoves.map((sq) => {

                    let newPosRow = row+sq.row;
                    let newPosCol = col+sq.col;

                    if(newPosRow < 8 && newPosRow > -1 && newPosCol < 8 && newPosCol > -1 && currentBoard[newPosRow][newPosCol].color != color) {
                        knightArr.push({row: newPosRow, col: newPosCol});
                    }

                })

                return knightArr;
                
                
        }

        return [];

    }

    movePiece = (from, to) => {

        const currentBoard = JSON.parse(JSON.stringify(this.state.history[this.state.history.length-1]));

        const row = parseInt(from.id.substring(2,3));
        const col = parseInt(from.id.substring(3));

        let {piece, color} = from;

        if(piece == "pawn") {
            if((color == "black" && to.row == 7) || (color == "white" && to.row == 0)) {
                piece = "queen";
            }

            if(to.enPassantRow) {
                currentBoard[to.row+to.enPassantRow][to.col] = {
                    color: "null",
                    piece: "null",
                }
            }


            if(Math.abs(row - to.row) == 2) {
                if(col-1 > -1 && currentBoard[to.row][to.col-1].piece == "pawn" && currentBoard[to.row][to.col-1].color != color) {
                    currentBoard[to.row][to.col-1].enPassant = 1;
                    console.log("EN PASSANT!!");
                }
                if(col+1 < 8 && currentBoard[to.row][to.col+1].piece == "pawn" && currentBoard[to.row][to.col+1].color != color) {
                    currentBoard[to.row][to.col+1].enPassant = -1;
                    console.log("EN PASSANT!!");

                }
            }
        }


        currentBoard[to.row][to.col] = {
            color: color,
            piece: piece,
            enPassant: 0
        }
        currentBoard[row][col] = {
            color: "null",
            piece: "null",
        }


        document.getElementById(`sq${row}${col}`).classList.remove("clickedSquare");
        this.getPossibleDestinations(from).map((obj) => {
            document.getElementById(`sq${obj.row}${obj.col}`).classList.remove("possibleDestination");
        })

        this.setState({
            history: this.state.history.concat([currentBoard]),
            selectedSquare: null,
            isWhiteTurn: !this.state.isWhiteTurn
        });

        return ;
    }

}

function Board(props){

    return(
        <div id="board" style={{flexDirection: props.isWhiteTurn ? "column" : "column-reverse"}}> 
            {
                props.boardArray.map((row,rowIndex) => {
                    return <div className="row" id={`row${rowIndex}`} style={{marginTop : props.isWhiteTurn ? (rowIndex == 0 ? 0 : -2) : -2, flexDirection: props.isWhiteTurn ? "row" : "row-reverse"}}>
                        {
                            row.map((SqObj, colIndex) => {
                                return <Square id={`sq${rowIndex}${colIndex}`} piece={SqObj} color={getColorOfSquare(rowIndex, colIndex)}  onSquareClicked={() =>  props.onSquareClicked(rowIndex, colIndex)} />
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