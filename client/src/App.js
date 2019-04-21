import React, { Component } from "react";
import DogList from "./DogList";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
	render() {
		return (
			<Router>
				<Route path="/" exact component={DogList} />
			</Router>
		);
	}
}

export default App;
