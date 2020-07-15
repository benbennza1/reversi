// eslint-disable-next-line
import {_, pieceVal} from '../components/Piece';
import {GreedyAI, RandomAI} from './dumbAIs';
import MinMaxAlgo from './minMaxAI';

class reversiLogic{
	constructor(grid = null, turn = null){
		this.grid = grid;
		if (grid === null){
			this.grid = reversiLogic._initBoard();
			this.extremisPieces = this.initExtremisPiece();
		} else {
			this.grid = grid;
			this.extremisPieces = this.recomputeExtremePiece();
		}

		this.turn = turn;
		if (turn === null){
			this.turn = pieceVal.BLACK;
		}

		this.wouldBeFlippedPieces = this.getAvailableMoves(this.extremisPieces, this.turn);
		this.over = false;
	}

	getGrid(){
		return this.grid;
	}

	getDuplicateGrid(){
		let ret = [];
		for (let i = 0; i < this.grid.length; i++){
			let row = new Array(8)
			for (let j = 0; j < this.grid[i].length; j++){
				row[j] = this.grid[i][j];
			}
			ret.push(row);
		}
		return ret;
	}

	getPossibleMovesAndFlip(){
		return this.wouldBeFlippedPieces;
	}

	getTurn(){
		return this.turn;
	}

	getOver(){
		return this.over;
	}

	getPieceCount(){
		let blk = 0;
		let wht = 0;

		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j] === pieceVal.BLACK) {
					blk += 1;
				}
				else if(this.grid[i][j] === pieceVal.WHITE){
					wht += 1
				}
			}
		}
		return {black: blk, white: wht};
	}


	makeMoveServer(move){
		//No need to bother Server
		if (this.over){
			return null;
		}
		//TODO Contact Server here
		let moveKey = reversiLogic.keyFromObj(move);
		if (moveKey in this.wouldBeFlippedPieces){
			this.grid[move.row][move.col] = this.turn;
		} else {
			return null;
		}

		let toFlip = [...this.wouldBeFlippedPieces[moveKey]];

		this.flipPieces(toFlip);
		this.recomputeExtremePiece(move.row, move.col);
		let normalNext = reversiLogic.oppsitePiece(this.turn);
		let nextWouldbeFlipped = this.getAvailableMoves(this.extremisPieces, normalNext);

		//Cannot move, flip normalNext to current again.
		if (Object.keys(nextWouldbeFlipped).length === 0){
			normalNext = this.turn;
			this.wouldBeFlippedPieces = this.getAvailableMoves(this.extremisPieces, normalNext);
			if (Object.keys(this.wouldBeFlippedPieces).length === 0){
				this.over = true;
			}
		} else {
			this.wouldBeFlippedPieces = nextWouldbeFlipped;
		}

		let retObj = {
			thisTurn: this.turn,
			nextTurn: normalNext,
			wouldbeFlipped: [...toFlip],
		};

		this.turn = normalNext;

		return retObj;
	}

	makeMove(move){
		if (this.over){
			return null;
		}

		let moveKey = reversiLogic.keyFromObj(move);
		if (moveKey in this.wouldBeFlippedPieces){
			this.grid[move.row][move.col] = this.turn;
		} else {
			return null;
		}

		let toFlip = [...this.wouldBeFlippedPieces[moveKey]];

		this.flipPieces(toFlip);
		this.recomputeExtremePiece(move.row, move.col);
		let normalNext = reversiLogic.oppsitePiece(this.turn);
		let nextWouldbeFlipped = this.getAvailableMoves(this.extremisPieces, normalNext);

		//Cannot move, flip normalNext to current again.
		if (Object.keys(nextWouldbeFlipped).length === 0){
			normalNext = this.turn;
			this.wouldBeFlippedPieces = this.getAvailableMoves(this.extremisPieces, normalNext);
			if (Object.keys(this.wouldBeFlippedPieces).length === 0){
				this.over = true;
			}
		} else {
			this.wouldBeFlippedPieces = nextWouldbeFlipped;
		}

		let retObj = {
			thisTurn: this.turn,
			nextTurn: normalNext,
			wouldbeFlipped: [...toFlip],
		};

		this.turn = normalNext;

		return retObj;
	}

	//Make AI move means:
	//Make your move, (tell me in the move paramter)
	//AI will move after you (The AI may recursively call this method)
	makeAIMove(move, AiDiff, AiTurn){
		if (this.over){
			return null;
		}

		let moveKey = reversiLogic.keyFromObj(move);
		if (moveKey in this.wouldBeFlippedPieces){
			this.grid[move.row][move.col] = this.turn;
		} else {
			return null;
		}

		let toFlip = [...this.wouldBeFlippedPieces[moveKey]];

		this.flipPieces(toFlip);
		this.recomputeExtremePiece(move.row, move.col);
		let normalNext = reversiLogic.oppsitePiece(this.turn);
		let nextWouldbeFlipped = this.getAvailableMoves(this.extremisPieces, normalNext);

		//Cannot move, flip normalNext to current again.
		if (Object.keys(nextWouldbeFlipped).length === 0){
			normalNext = this.turn;
			this.wouldBeFlippedPieces = this.getAvailableMoves(this.extremisPieces, normalNext);
			if (Object.keys(this.wouldBeFlippedPieces).length === 0){
				this.over = true;
			}
		} else {
			this.wouldBeFlippedPieces = nextWouldbeFlipped;
		}

		this.turn = normalNext;
		let AiMove = null;
		if (AiTurn === this.turn){
			switch(AiDiff){
				case 0:
					AiMove = RandomAI.getRandomMove(nextWouldbeFlipped);
					this.makeAIMove(AiMove, AiDiff, AiTurn);
					break;
				case 1:
					AiMove = GreedyAI.getGreedyMove(nextWouldbeFlipped);
					this.makeAIMove(AiMove, AiDiff, AiTurn);
					break;
				case 2:
					break;
			}
		}
	}

	flipPieces(toFlip){
		for (let i = 0; i < toFlip.length; i++){
			this.grid[toFlip[i].row][toFlip[i].col] = reversiLogic.oppsitePiece(this.grid[toFlip[i].row][toFlip[i].col]);
		}
	}

	getAvailableMoves(moves, turn){
		let toTest = null;
		let wouldBeFlippedPieces = {};

		for (let move = 0; move < moves.length; move++) {
			toTest = moves[move];
			let toTestKey = reversiLogic.keyFromObj(toTest);
			for (let a = -1; a <=1; a++) { //Computer the 8 directions for the move
				for (let b = -1; b <=1; b++) {
					if (a !== 0 || b !== 0) {
						let evalResult = this.computeDirectionalUntilRepeat(toTest.row, toTest.col, a, b, turn);

						if (evalResult.length > 0) {
							if (!wouldBeFlippedPieces[toTestKey]) {
								wouldBeFlippedPieces[toTestKey] = [];
							}
							wouldBeFlippedPieces[toTestKey] = wouldBeFlippedPieces[toTestKey].concat(evalResult);
						}
					}
				}
			}
		}
		return wouldBeFlippedPieces;
	}


	computeDirectionalUntilRepeat(i, j, iIter, jIter, type) {
		let otherType = reversiLogic.oppsitePiece(type);
		let inBetweenPieces = []

		//Does not bring us to an edge
		if ((i + iIter >= 0 && i + iIter < 8) && (j + jIter >= 0 && j + jIter < 8))
		{

			//next piece exists
			if (this.grid[i+iIter][j+jIter] === pieceVal.EMPTY) {
				return [];
			}

			//Next Piece is oppsite
			if (this.grid[i+iIter][j+jIter] === otherType) {

				//Loop until we find another of us
				inBetweenPieces.push(
					{
						row: i+iIter,
						col: j+jIter,
					}
				);
				for (let x = i + 2*iIter, y = j + 2*jIter; (x >= 0) && (x <= 7) && (y >= 0) && (y <= 7); x += iIter, y += jIter) {

					//Next, next piece is end, so cant do anything here...
					if ((x > 7) || (x < 0) || (y > 7) || (y < 0)){
						return [];
					}

					//End of Line
					if (this.grid[x][y] === pieceVal.EMPTY) {
						return [];
					}

					if (this.grid[x][y] === type) {
						return inBetweenPieces;
					}

					inBetweenPieces.push(
						{
							row: x,
							col: y,
						}
					);

				}
			}
		}

		return [];
	}


	initExtremisPiece(){
		let filled = this.getFilledSpaces()
		let curRow = 0;
		let curCol = 0;
		let adj =  [];

		for (let i = 0; i< filled.length; i++) {
			curRow = filled[i].row;
			curCol = filled[i].col;
			for (let z = curRow - 1; z <= (curRow + 1); z++) {
				for (let x = curCol - 1; x <= (curCol + 1); x++){
					if (!reversiLogic._isCoordinateDup(adj, z, x) &&
						reversiLogic._isCordValid(z, x) &&
						!this._isPiecePresent(z, x)) {
						adj.push(
							{
								row: z,
								col: x,
							}
						);
					}
				}
			}
		}
		return adj;
	}

	/* In Reversi, you can only make a move if a opposing piece is turned over
	It can be safely said that when a move is made, it is made on an 'extreme' location
	therefore, we can just recompute based on that piece */
	recomputeExtremePiece(i, j) {
		for (let z = 0; z < this.extremisPieces.length; z++) {
			if (this.extremisPieces[z].row === i && this.extremisPieces[z].col === j)
			{
				this.extremisPieces.splice(z, 1);
				break;
			}
		}

		for (let z = i - 1; z <= (i + 1) && z <= 7; z++) {
			for (let x = j - 1; x <= (j + 1) && x <= 7; x++){
				if (!reversiLogic._isCoordinateDup(this.extremisPieces, z, x) &&
					reversiLogic._isCordValid(z, x) &&
					!this._isPiecePresent(z, x)) {
						this.extremisPieces.push(
							{
								row: z,
								col: x,
							}
						);
				}
			}
		}
	}

	getFilledSpaces() {
		let ret = [];
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[i].length; j++) {
				if (this._isPiecePresent(i,j)) {
					ret.push(
						{
							row: i,
							col: j,
						}
					);
				}
			}
		}
		return ret;
	}

	_isPiecePresent(i, j){
		if (this.grid[i][j] === pieceVal.WHITE ||
			this.grid[i][j] === pieceVal.BLACK) {
			return true
		}

		return false;
	}

	static oppsitePiece(piece){
		return (piece === pieceVal.WHITE)? pieceVal.BLACK: pieceVal.WHITE;
	}

	static keyFromObj(obj){
		return `R${obj.row}C${obj.col}`;
	}

	static _isCoordinateDup(arr, i, j) {
		for (let z = 0; z < arr.length; z++) {
			if (arr[z].row === i && arr[z].col === j)
			{
				return true;
			}
		}
		return false;
	}

	static _isCordValid(i, j) {
		if (i < 8 && i >=0 && j < 8 && j >= 0) {
			return true;
		}

		return false;
	}

	static _initBoard(){
		let grid = [];
		let boardCheckerCount = 8;

		for (let i = 0; i < boardCheckerCount; i++) {
			grid[i] = [];
			for (let j = 0; j < boardCheckerCount; j++) {
				grid[i][j] = pieceVal.EMPTY;
			}
		}
		return reversiLogic._initPiece(grid);
	}

	static _initPiece(grid){
		grid[3][3] = pieceVal.WHITE;
		grid[4][4] = pieceVal.WHITE;
		grid[3][4] = pieceVal.BLACK;
		grid[4][3] = pieceVal.BLACK;
		return grid;
	}
}

export default reversiLogic;