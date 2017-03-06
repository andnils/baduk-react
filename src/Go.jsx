import React, { Component } from 'react';
import './Go.css';
import _ from 'lodash';

const boardSizePixels = 500;
const boardColor = "rgb(250, 213, 94)";
const EMPTY = '';
const BLACK = 'black';  // this const doubles as the html color value
const WHITE = 'white';  // this const doubles as the html color value

function doTimes(numTimes, fn) {
    return _.map(_.range(numTimes), (i)=>fn(i));
}

/**
 * Size should be one of 9, 13 or 19.
 **/
function genEmptyBoard(size) {
    return doTimes(size, (i) => _.fill(Array(size), EMPTY));
}

class Go extends Component {

    constructor(props) {
	super(props);
	this.boardSize = 9;
	// unitSize: the distance (in pixels) between two lines.
	this.unitSize = boardSizePixels / (this.boardSize - 1);
	this.state = {board: genEmptyBoard(this.boardSize),
		      pointerCol: null,
		      pointerRow: null,
		      currentPlayer: BLACK};
    }

    
    updateCoords(evt) {
	const e = evt.target;
	const dim = e.getBoundingClientRect();
	const x = evt.clientX - dim.left;
	const y = evt.clientY - dim.top;

	const col = 1 + parseInt( x / this.unitSize, 10);
	const row = 1 + parseInt( y / this.unitSize, 10);
	this.setState({pointerCol: col, pointerRow: row});
    }

    
    getNextPlayer(currentPlayer) {
	if (currentPlayer === BLACK) {
	    return WHITE;
	} else {
	    return BLACK;
	}
    }

    
    clickHandler(evt) { 
	// TODO: verify valid placement
	//       (1) stone in place already?  FIXED!
	//       (2) suicide? ko?
	const col = this.state.pointerCol;
	const row = this.state.pointerRow;
	const currentPlayer = this.state.currentPlayer;
	const board = this.state.board;
	if (board[row-1][col-1]) {
	    console.log("This point (" + col + "," + row + ") is already taken.");
	    return;
	}
	board[row-1][col-1] = currentPlayer;
	this.setState({board: board,
		       currentPlayer: this.getNextPlayer(currentPlayer)});
    }

    
    drawCols() {
	const n = this.boardSize;
	return doTimes(n, this.drawCol.bind(this));
    }

    
    drawRows() {
	const n = this.boardSize;
	return doTimes(n, this.drawRow.bind(this));
    }

    
    drawRow(i) {
	const padding = this.unitSize;
	return (
	    <line key={'row' + i}
		  pointerEvents="none"
		  x1={padding}
		  y1={(i+1) * padding}
		  x2={padding+boardSizePixels}
		  y2={(i+1) * padding}
		  stroke="black"/>
	);
    }

    
    drawCol(i) {
	const padding = this.unitSize;
	return (
	    <line key={'col' + i}
		  pointerEvents="none"
		  x1={(i+1) * padding}
		  y1={padding}
		  x2={(i+1) * padding}
		  y2={padding+boardSizePixels}
		  stroke="black"/>
	);
    }


    drawStarPoint(col, row) {
	const x = col * this.unitSize;
	const y = row * this.unitSize;
	const starPointRadius = 2;
	const key = 'starPoint-' + col + '-' + row;
	return (
	    <circle key={key}
		    pointerEvents="none"
		    cx={x} cy={y}
		    r={starPointRadius}
		    fill="black" stroke="black" />);
    }

    
    drawStarPoints() {
	let starPoints = [];
	if (this.boardSize === 9) {	    
	    starPoints = [[3,3], [7,3], [5, 5], [3,7], [7,7]];
	} else if (this.boardSize === 13) {
	    starPoints = [[4,4], [10,4], [7,7], [4,10], [10,10]];
	} else if (this.boardSize === 19) {
	    starPoints = [[4,4], [10,4], [16,4],
			  [4,10], [10,10], [16,10],
			  [4,16], [10,16], [16,16]];
	}
	return _.map(starPoints, (([col,row]) => this.drawStarPoint(col,row)));
    }

    
    drawStonesInRow(rowData, rowIdx) {
	const indexedRowData = _.zip(rowData, _.range(rowData.length));
	return _.map(indexedRowData, ([data, idx]) => {
	    if (data) {
		return this.drawStone(idx+1, rowIdx+1, data);
	    } else {
		return null;
	    }
	});
    }

    
    drawStones() {
	const board = this.state.board;
	const boardSize = this.boardSize;

	const indexedRows = _.zip(board, _.range(boardSize));
	const temp = _.map(indexedRows, ([data, idx]) => {
	    return this.drawStonesInRow(data, idx);
	});

	return _.flatten(temp);
    }

    
    drawStone(col, row, color) {
	const unitSize = this.unitSize;
	const stoneRadius = (unitSize / 2) - 1;
	const key = `key-${color}-${col}-${row}`;
	return (
	    <circle key={key}
		    pointerEvents="none"
		    cx={unitSize * col}
		    cy={unitSize * row}
		    r={stoneRadius}
		    fill={color}
		    stroke="black" />
	);
    }

    
    drawPointer() {
	const unitSize = this.unitSize;
	const stoneRadius = 4;
	return (
	    <circle cx={unitSize * this.state.pointerCol}
		    cy={unitSize * this.state.pointerRow}
		    r={stoneRadius}
		    fill="none"
		    stroke="green" />
	);
    }
    
    
    render() {
	return (
	    <div className="Go" onClick={this.clickHandler.bind(this)}>

	      <svg version="1.1"
		   baseProfile="full"
		   width={boardSizePixels + (2 * this.unitSize)}
		   height={boardSizePixels + (2 * this.unitSize)}
		   xmlns="http://www.w3.org/2000/svg">
		
		<rect width={boardSizePixels + this.unitSize}
		      height={boardSizePixels + this.unitSize}
		      x={this.unitSize/2}
		      y={this.unitSize/2}
		      fill={boardColor}
		      onMouseMove={this.updateCoords.bind(this)} />
		
		{this.drawCols()}
		{this.drawRows()}
		{this.drawStarPoints()}
		{this.drawStones()}
		{this.drawPointer()}
	      </svg>
	      
	    </div>
	);
    }
}

export default Go;
