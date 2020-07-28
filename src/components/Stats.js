import React, { Component } from 'react';

import '../css/board.css';
import { pieceVal } from './Piece';

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            white: 2,
            black: 2,
            empty: 60,
            moves: 0,
            turn: "⚫ Black",
            lastMove: "No Moves Made Yet!",
            opponent: "🤖 Beep-Boop",
            someoneWon: false,
            winnerMsg: "",
            whiteTime: 100,
            blackTime: 100,
            whiteMinute: 29,
            blackMinute: 29,
        };
        this.timerCounter = 0;
        this.interval = null;
        this.elapsedMinute = 0;
        this.secondaryTime = 0;

    }

    componentDidMount = () => {
        this.props.updateDetails.turn(this.setTurn);
        this.props.updateDetails.count(this.setPieceCount);
        this.props.updateDetails.opp(this.setOpp);
        this.props.updateDetails.lastMove(this.setLastMove);
        this.props.updateDetails.winner(this.setWinner);
        //this.test();
    }

    setPieceCount = (inCount) => {
        let white = inCount.white;
        let black = inCount.black;
        let empty = 64 - (white + black);
        this.setState({
            white: white,
            black: black,
            empty: empty,
        });
      }
      
      startInterval = (piece) =>{
          //1667 is 1 second
        this.secondaryTime = (piece === pieceVal.BLACK) ? this.state.blackTime: this.state.whiteTime;
        this.secondaryTime = (60-Math.round(60*this.secondaryTime/100));
        this.interval = setInterval(this.timerFunc, 300, piece);
      }

      async test(){
          this.startInterval(pieceVal.BLACK);
          await new Promise(r => setTimeout(r, 30000));
          this.getElapsedTime();
          this.startInterval(pieceVal.WHITE);
          await new Promise(r => setTimeout(r, 30000)); 
          this.getElapsedTime();
          this.startInterval(pieceVal.BLACK);
          await new Promise(r => setTimeout(r, 30000)); 
          this.getElapsedTime();
          this.startInterval(pieceVal.WHITE);
      }

      timerFunc = (piece) => {
        this.timerCounter += 1;
        this.secondaryTime += 1;
        let secondHand = 100 - Math.round(100*this.secondaryTime/60);
        if (piece === pieceVal.BLACK){
            this.setState({
                blackTime: secondHand,
            });
        } else {
            this.setState({
                whiteTime: secondHand,
            });
        }

        if (this.timerCounter >= 60){
            this.elapsedMinute += 1;
            this.timerCounter = 0;
        }

        if (this.secondaryTime >= 60){
            this.secondaryTime = 0;
            if (piece === pieceVal.BLACK){
                this.setState({
                    blackMinute: this.state.blackMinute - 1,
                });
            } else {
                this.setState({
                    whiteMinute: this.state.whiteMinute - 1,
                });
            }
        }
        //console.log(this.elapsedMinute * 60 + this.timerCounter)
      }

      getElapsedTime = () =>{
        clearInterval(this.interval);
        this.interval = null;
        let ret = this.elapsedMinute * 60 + this.timerCounter;
        this.elapsedMinute = 0;
        this.timerCounter = 0;
        return ret;
      }


      setWinner = (won, winner) => {
        let winningPiece = "⚫⚪ Its a Tie!"
        winningPiece = (winner === pieceVal.BLACK) ? "⚫ Black Has Won!" :"⚪ White Has Won!";
        if (won){
            this.setState({
                someoneWon: won,
                winnerMsg: winningPiece,
            });
        }
      }

      setTurn = (blackTurn, moves) => {
        this.setState({
            moves: moves,
            turn: (blackTurn) ? "⚫ Black" :"⚪ White",
        });
      }

      setOpp = (opp) => {
        this.setState({
            opponent: opp,
        });
      }

      setLastMove = (mov) =>{
        let move = "No Moves Made Yet!";
        if (mov !== null){
            move = (mov.by === pieceVal.BLACK)? "⚫": "⚪";
        }
        move = `${move} Placed a Piece at Row ${mov.row + 1} Column ${mov.col + 1}, Capturing ${mov.count} Pieces!`
        this.setState({
            lastMove: move
        });
      }

    render(){
        return (
            <div className="col-4 w-100 noSelect">
                {!this.state.someoneWon && <div className="row">
                    <div className="col-12">
                        <h2 className="text-center">Current Turn</h2>
                        <p className="text-center">➡{this.state.turn} to Move</p>
                        <p className="text-center">{this.state.moves} Moves Made so Far!</p>
                    </div>
                </div>}
                {this.state.someoneWon && <div className="row">
                    <div className="col-12">
                        <h2 className="text-center"> <span role="img" aria-label="winner">👑</span>Winner</h2>
                        <p className="text-center"> {this.state.winnerMsg} </p>
                        <a href="/home" className="btn btn-outline-dark w-100"> Go Home </a>
                    </div>
                </div>}
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center">Current Pieces</h2>
                        <p className="text-center"><span role="img" aria-label="emptySquare">🔲</span> Empty X {this.state.empty}</p>

                        <p className="text-center"><span role="img" aria-label="whiteCircle">⚪</span> White X {this.state.white}</p>
                        <p className="text-center"><span role="img" aria-label="blackCircle">⚫</span> Black X {this.state.black}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center">Current Opponent</h2>
                        <p className="text-center">{this.state.opponent}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-4">
                        <h6><span role="img" aria-label="blkCircle">⚫</span> {this.state.blackMinute} Min</h6>
                    </div>
                    <div className="col-4">
                        <div className="progress">
                        <div className="progress-bar bg-info" role="progressbar" style={{width:`${this.state.blackTime}%`}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-4">
                        <h6><span role="img" aria-label="whiteCircle">⚪</span> {this.state.whiteMinute} Min</h6>
                    </div>
                    <div className="col-4">
                        <div className="progress">
                        <div className="progress-bar bg-info" role="progressbar" style={{width:`${this.state.whiteTime}%`}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div className="col-2"></div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center">Last Move</h2>
                        <p className="text-center">{this.state.lastMove}</p>
                    </div>
                </div>
            </div>
        );
      };
}

export default Stats;
