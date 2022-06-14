
const startBoard = JSON.parse(`[
    [{"color": "black", "piece": "rook", "castlable" : true},{"color": "black", "piece": "knight"},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "queen"},{"color": "black", "piece": "king", "castlable" : true},{"color": "black", "piece": "bishop"},{"color": "black", "piece": "knight"},{"color": "black", "piece": "rook", "castlable" : true}],
    [{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0},{"color": "black", "piece": "pawn", "enPassant": 0}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"},{"color": "null", "piece": "null"}],
    [{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0},{"color": "white", "piece": "pawn", "enPassant": 0}],
    [{"color": "white", "piece": "rook", "castlable" : true},{"color": "white", "piece": "knight"},{"color": "white", "piece": "bishop"},{"color": "white", "piece": "queen"},{"color": "white", "piece": "king", "castlable" : true},{"color": "white", "piece": "bishop"},{"color": "white", "piece": "knight"},{"color": "white", "piece": "rook", "castlable" : true}]
]`);

class OnlineGame extends React.Component {

    state = {
        
        gameId: "",
        move: -1,
        selectedSquare: null,
        history: [[]],
        isWhiteTurn: true,
        isWhite: true,
        player2: false,
        playerId: this.props.playerId,
        checking: false,
        failedToConnect: false,
        firstFetchDone: false,
    }

    constructor(props) {

        super(props)

        this.firstFetch();

    }

    async firstFetch() {
        try {
            
            const res = await fetch(`${this.props.domain}/${this.props.requestString}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({playerId: this.state.playerId})
            })

            const data = await res.json()
            console.log(data)
            this.setState({
                gameId: data.game.id,
                move: data.game.move,
                isWhiteTurn: data.game.isWhiteTurn,
                history: this.state.history.concat([data.game.board]),
                failedToConnect: false,
                isWhite: data.isWhite,
                player2: data.game.player2 != null,
                firstFetchDone: true,
            })
        
        } catch (err) {
            console.log(err);
            this.setState({
                failedToConnect: true
            })
        }
    }

    render() {

        if((this.state.isWhite != this.state.isWhiteTurn || !this.state.player2) && !this.state.checking && this.state.firstFetchDone) this.checkStatus();

        return (
            !this.state.failedToConnect && this.state.player2 ? <div id="container">
                <h4 id="gameIdText">{this.state.gameId}</h4>
                <OnlineBoard isWhite={this.state.isWhite} isWhiteTurn={this.state.isWhiteTurn} boardArray={this.state.history[this.state.history.length-1]} onSquareClicked={this.onSquareClicked} />
            </div> : (!this.state.player2 && !this.state.failedToConnect ? <p>Waiting for player 2.. GameID: {this.state.gameId}</p> : <p>Failed to connect</p>)
        )
    }

    checkStatus = () => {

        const statusInterval = setInterval(() => {
            console.log("Checking..")
            fetch(`${this.props.domain}/checkStatus/${this.state.gameId}`)
            .then(res => res.json())
            .then(data => {
                if(this.state.move != data.game.move || this.state.player2 != (data.game.player2 != null)) {
                    clearInterval(statusInterval);
                    this.setState({
                        history: this.state.history.concat([data.game.board]),
                        player2: data.game.player2 != null,
                        move: data.game.move,
                        isWhiteTurn: data.game.isWhiteTurn,
                        checking: false,
                    })
                }
        }).catch(err => {
            console.log(err);
            clearInterval(statusInterval);
            this.setState({
                failedToConnect: true,
            })
        })
        },500)

        this.setState({
            checking: true,
        })

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

        if(this.getPossibleDestinations(selectedSquare).length > 0 && (selectedSquare.color == "white") == this.state.isWhite && this.state.isWhite == this.state.isWhiteTurn) {

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
                    if(selectedSquare.castlable) {

                        let i;
                        let loopBroke = false;
                        for(i = 1; col + i < 7; i++ && !loopBroke) {
    
                            if(currentBoard[row][col+i].piece != "null") {
                                loopBroke = true;

                            }
    
                        }
                        if(!loopBroke && currentBoard[row][7].piece == "rook" && currentBoard[row][7].castlable) {
                            kingArr.push({row, col: col+2 , castleMove: -1});
                        }
                        loopBroke = false;
                        for(i = 1; col-i > 0; i++ && !loopBroke) {
    
                            if(currentBoard[row][col-i].piece != "null") {
                                loopBroke = true;
                            }
    
                        }
                        if(!loopBroke && currentBoard[row][0].piece == "rook" && currentBoard[row][0].castlable) {
                            kingArr.push({row, col: col-2, castleMove: 1});
                        }
    
                    }

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
                }
                if(col+1 < 8 && currentBoard[to.row][to.col+1].piece == "pawn" && currentBoard[to.row][to.col+1].color != color) {
                    currentBoard[to.row][to.col+1].enPassant = -1;
                }
            }
        }

        if(piece == "king") {

            if(to.castleMove) {
                
                let rookCol;

                if(to.col - col == 2) {
                    rookCol = 7;
                } else if(to.col - col == -2) {
                    rookCol = 0;
                }

                const rookToMove = JSON.parse(JSON.stringify(currentBoard[to.row][rookCol]));

                currentBoard[to.row][to.col+to.castleMove] = rookToMove;
                currentBoard[to.row][rookCol] = {
                    piece: "null",
                    color: "null"
                }

            }

        }


        currentBoard[to.row][to.col] = {
            color: color,
            piece: piece,
        }
        currentBoard[row][col] = {
            color: "null",
            piece: "null",
        }

        document.getElementById(`sq${row}${col}`).classList.remove("clickedSquare");
        this.getPossibleDestinations(from).map((obj) => {
            document.getElementById(`sq${obj.row}${obj.col}`).classList.remove("possibleDestination");
        })


        fetch(`${this.props.domain}/play/${this.state.gameId}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({board: currentBoard, playerId: this.state.playerId})
        }).then((res) => res.json()).then(data => {
            this.setState({
                history: this.state.history.concat([data.game.board]),
                isWhiteTurn: data.game.isWhiteTurn,
                failedToConnect: false,
            })
        }).catch((rej) => {
            console.log(rej.message)
        })

        // this.setState({
        //     history: this.state.history.concat([currentBoard]),
        //     selectedSquare: null,
        //     isWhiteTurn: !this.state.isWhiteTurn
        // });

        return ;
    }


}

function OnlineBoard(props) {

    return(
        <div id="board" style={{flexDirection: props.isWhite ? "column" : "column-reverse"}}> 
            {
                props.boardArray.map((row,rowIndex) => {
                    return <div className="row" id={`row${rowIndex}`} style={{marginTop : props.isWhite ? (rowIndex == 0 ? 0 : -2) : -2, flexDirection: props.isWhite ? "row" : "row-reverse"}}>
                        {
                            row.map((SqObj, colIndex) => {
                                return <OnlineSquare id={`sq${rowIndex}${colIndex}`} piece={SqObj} color={getColorOfSquare(rowIndex, colIndex)}  onSquareClicked={() =>  props.onSquareClicked(rowIndex, colIndex)} />
                            })
                        }
                    </div>
                })
            }
        </div>
    );

}


function OnlineSquare(props) {

    const imgUrl = props.piece.color == "null" ? "" : `./assets/chessPieces/${props.piece.color}/${props.piece.piece}.svg`;

    return (
        <div onClick={props.onSquareClicked} id={props.id} className={"square " + props.color}>
            <div className="pieceImg" style={{backgroundImage: imgUrl ? `url("${imgUrl}")` : "none"}} />
        </div>
    );
}

function etColorOfSquare(row, col) {

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


