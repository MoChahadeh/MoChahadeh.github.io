const rootElement = document.getElementById("root");


class App extends React.Component {

    render() {
        return (
            <div id="container">
                <Board />
            </div>
        )
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
                                return <Square id={`${rowIndex}${colIndex}`} />
                            })
                        }
                    </div>
                })
            }
        </div>
    );

}


const Square = (props) => {

    return (
        <div className="square" id={props.id}>
            <p>{props.id}</p>
        </div>
    );
}



ReactDOM.render( <App />,rootElement)