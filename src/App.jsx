import React, { Component } from 'react';
import './App.css';
import Go from './Go';

class App extends Component {
    
    render() {
	return (
	    <div className="App">
              <div className="App-header">
		<h2> 囲碁 </h2>
              </div>

	      <Go />
	      
	    </div>
	);
    }
}

export default App;
