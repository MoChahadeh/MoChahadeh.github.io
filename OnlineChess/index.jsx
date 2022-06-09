const rootElement = document.getElementById("root");

class App extends React.Component {

    render() {
        return <LocalGame />
    }

}

ReactDOM.render( <App />, rootElement);