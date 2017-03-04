import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
	return (
	    <div className="App">
              <div className="App-header">
		<img src={logo} className="App-logo" alt="logo" />
		<h2>Welcome to React</h2>
              </div>
              <div className="App-intro">
		<div className="foo">Hej</div>
	      </div>


	      <div className="relative1">
		Certain stone patterns on the board, like the black one in this diagram, deserve your close attention because they share two characteristics: they hover close to the border between life and death, and they appear frequently in real-life games. The idea is to get so familiar with these shapes that you know how to handle them correctly in a game without the need to spend a lot of time reading them out (or play them incorrectly). Invest time now, reap victories later!
    </div>
    <div className="relative2">
Certain stone patterns on the board, like the black one in this diagram, deserve your close attention because they share two characteristics: they hover close to the border between life and death, and they appear frequently in real-life games. The idea is to get so familiar with these shapes that you know how to handle them correctly in a game without the need to spend a lot of time reading them out (or play them incorrectly). Invest time now, reap victories later!
    </div>

	      
	    </div>
	);
    }
}

export default App;
