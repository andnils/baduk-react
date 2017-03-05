import React, { Component } from 'react';
import './Go.css';
import _ from 'lodash';

const boardSizePixels = 500;
const boardColor = "rgb(250, 213, 94)";
const EMPTY = '';
const BLACK = 'black';
const WHITE = 'white';

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
	this.state = {board: genEmptyBoard(19),
		      ghostCol: null,
		      ghostRow: null,
		      currentPlayer: BLACK};
    }

    updateCoords(evt) {
	const e = evt.target;
	const dim = e.getBoundingClientRect();
	const x = evt.clientX - dim.left;
	const y = evt.clientY - dim.top;

	const col = 1 + parseInt( x / this.getUnitSize(), 10);
	const row = 1 + parseInt( y / this.getUnitSize(), 10);
	this.setState({ghostCol: col, ghostRow: row});
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
	//       (1) stone in place already=
	//       (2) suicide? ko?
	const col = this.state.ghostCol;
	const row = this.state.ghostRow;
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

    /**
     * For a 9x9 board - return 9.
     * For a 19x19 board - return 19.
     **/
    getBoardSize() {
	return this.state.board[0].length;
    }

    /**
     * Return the distance (in pixels) between two lines.
     **/
    getUnitSize() {
	const size = this.getBoardSize() - 1;
	return boardSizePixels / size;
	
    }

    drawCols() {
	const n = this.getBoardSize();
	return doTimes(n, this.drawCol.bind(this));
    }

    drawRows() {
	const n = this.getBoardSize();
	return doTimes(n, this.drawRow.bind(this));
    }

    drawRow(i) {
	const padding = this.getUnitSize();
	return (
	    <line key={'row' + i}
		  x1={padding}
		  y1={(i+1) * padding}
		  x2={padding+boardSizePixels}
		  y2={(i+1) * padding}
		  stroke="black"/>
	);
    }

    drawCol(i) {
	const padding = this.getUnitSize();
	return (
	    <line key={'col' + i}
		  x1={(i+1) * padding}
		  y1={padding}
		  x2={(i+1) * padding}
		  y2={padding+boardSizePixels}
		  stroke="black"/>
	);
    }


    drawStarPoint(col, row) {
	const x = col * this.getUnitSize();
	const y = row * this.getUnitSize();
	const starPointRadius = 2;
	const key = 'starPoint-' + col + '-' + row;
	return (
	    <circle key={key}
		    cx={x} cy={y}
		    r={starPointRadius}
		    fill="black" stroke="black" />);
    }
    
    drawStarPoints() {
	const boardSize = this.getBoardSize();
	let starPoints = [];
	if (boardSize === 9) {	    
	    starPoints = [[3,3], [7,3], [5, 5], [3,7], [7,7]];
	} else if (boardSize === 13) {
	    starPoints = [[4,4], [10,4], [7,7], [4,10], [10,10]];
	} else if (boardSize === 19) {
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
	const boardSize = this.getBoardSize();

	const indexedRows = _.zip(board, _.range(boardSize));
	const temp = _.map(indexedRows, ([data, idx]) => {
	    return this.drawStonesInRow(data, idx);
	});

	return _.flatten(temp);
    }

    


    drawStone(col, row, color) {
	const unitSize = this.getUnitSize();
	const stoneRadius = (unitSize / 2) - 1;
	const key = `key-${color}-${col}-${row}`;
	return (
	    <circle key={key}
		    cx={unitSize * col}
		    cy={unitSize * row}
		    r={stoneRadius}
		    fill={color}
		    stroke="black" />
	);
    }

    drawGhostStone() {
	const unitSize = this.getUnitSize();
	const stoneRadius = 4;
	return (
	    <circle cx={unitSize * this.state.ghostCol}
		    cy={unitSize * this.state.ghostRow}
		    r={stoneRadius}
		    fill="none"
		    stroke="green" />
	);
    }
    
    
    render() {
	const unitSize = this.getUnitSize();
	return (
	    <div className="Go" onClick={this.clickHandler.bind(this)}>

	      <svg version="1.1"
		   baseProfile="full"
		   width={boardSizePixels + (2 * unitSize)} height={boardSizePixels + (2 * unitSize)}
		   xmlns="http://www.w3.org/2000/svg">
		
		<rect width={boardSizePixels + unitSize} height={boardSizePixels + unitSize}
		      x={unitSize/2} y={unitSize/2}
		      fill={boardColor}
		      onMouseMove={this.updateCoords.bind(this)} 
		      />
		
		{this.drawCols()}
		{this.drawRows()}
		{this.drawStarPoints()}

		{this.drawStones()}

		{this.drawGhostStone()}

	      </svg>
	      
	    </div>
	);
    }
}

export default Go;
