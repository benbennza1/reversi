import React, { Component } from 'react';

class Rules extends Component {
    render(){
      return (
          <div>
            <h3 className="mt-4 fade-in to-be-animated" style={{animationDelay: "0.25s"}}><span role="img" aria-label="basic">📖</span> Basic Rules</h3>
            <ul className="list-group list-group-flush fade-in to-be-animated" style={{animationDelay: "0.25s"}}>
                <li className="list-group-item">The game is played on a 8x8 board</li>
                <li className="list-group-item">Alternating initial pieces are allocated in the 4 center spaces</li>
                <li className="list-group-item">Place flanking pieces to capture all vertically, horizontally and diagnally flanked pieces</li>
                <li className="list-group-item">A move must be placed on an empty square and MUST capture atleast 1 pieces</li>
                <li className="list-group-item">When there are no valid moves remaining, the color with the most pieces wins</li>
                <li className="list-group-item">There is a 30 minute limit for multi-player lobbies</li>
            </ul>
            <h3 className="mt-4 fade-in to-be-animated" style={{animationDelay: "0.5s"}}><span role="img" aria-label="special">🔖</span> Special Rules</h3>
            <ul className="list-group list-group-flush fade-in to-be-animated" style={{animationDelay: "0.5s"}}>
                <li className="list-group-item">Black pieces always goes first</li>
                <li className="list-group-item">If a played has no valid moves, the other player will gain an additional turn</li>
            </ul>
            <h3 className="mt-4 fade-in to-be-animated" style={{animationDelay: "0.75s"}}><span role="img" aria-label="ai">🤖</span> AI Notes</h3>
            <ul className="list-group list-group-flush fade-in to-be-animated" style={{animationDelay: "0.75s"}}>
                <li className="list-group-item">When playing the AI, the player always gets to go first</li>
                <li className="list-group-item">There is no time limit for AI games</li>
                <li className="list-group-item">The <i><span role="img" aria-label="ez">🍂</span> EZ</i> AI will make a random move</li>
                <li className="list-group-item">The <i><span role="img" aria-label="ok">🌱</span> Okay AI</i> will make the best current move</li>
                <li className="list-group-item">The <i><span role="img" aria-label="hard">🌲</span> !!!</i> AI will make the best move, forecasting 4 turns in advance</li>
            </ul>
        </div>
      );
    };
  }

export default Rules