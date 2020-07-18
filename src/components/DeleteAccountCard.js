import React, { Component } from 'react';

import '../css/board.css';

class DeleteAccountCard extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="card text-center h-100">
            <h5 className="card-header bg-dark text-light noSelect"><span role="img" aria-label="del">❌‍</span> Delete your account <span role="img" aria-label="del">❌‍</span></h5>
                <div className="card-body">
                    <h5 className="card-title">We promise to never:</h5>
                    <p className="card-text">
                        Share your E-mail with anyone else<br />
                        Send you any E-mail - your E-mail is only ever used as a username<br />
                    </p>
                </div>
            </div>
        );
      };
}

export default DeleteAccountCard;