const rootElement = document.getElementById("root");

class App extends React.Component {
	state = {
		choice: "",
		onlineGameRequestString: "",
		domain: "https://onlinechessmc.herokuapp.com",
		playerId: makeid(20),
	};

	render() {
		return (
			
			this.state.choice.length == 0 || this.state.choice == "Online" ? (
				<div id="mainMenuContainer">
				<div id="frame">
					<div id="chessImg" />
					<h1 id="onlineChessTitle">Online Chess</h1>
						
						
						{!this.state.choice.includes("Online") ? 
						<div id = "choiceRow">
							<a className="playButton" onClick={() => this.setState({choice: "Online"})}>
							<h2>Online Game</h2>
							</a>
							<a className="playButton" onClick={() => this.setState({ choice: "local" })}>
								<h2>Local Game</h2>
							</a>
						</div>
						:
						<div id="choiceRow">
							<a onClick={() => this.setState({ choice: "newOnline", onlineGameRequestString: "newGame" })} className="playButton">
							<h2>New Game</h2>
							</a>
							<a onClick={this.showPrompt} className="playButton">
								<h2>Join Game</h2>
							</a>
						</div>
						}
						
				</div>

				<a href="https://mochahadeh.github.io/" target="_blank" id="copyright">©2022 Mohamad Chahadeh</a>
			</div>

			) :

			this.state.choice.toLowerCase().includes("local") ? <LocalGame /> :
			<OnlineGame playerId={this.state.playerId}  domain={this.state.domain} requestString={this.state.onlineGameRequestString}/>
			
		);
	}

	showPrompt = () => {
		let gameId = prompt("Enter Game Id (Case sensitive): ");

		if(gameId != null && gameId.length > 0) {
			this.setState({
				onlineGameRequestString: `join/${gameId}`,
				choice: "joinOnline"
			})
		}
	}
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


ReactDOM.render(<App />, rootElement);
