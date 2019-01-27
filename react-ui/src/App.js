import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { fadeIn } from 'react-animations'
import _ from 'underscore';
import styled from 'styled-components';
import Radium from 'radium';
import io from 'socket.io-client';

const styles = {
  fadeIn: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeIn, 'fadeIn')
  }
};

window._ = _;

class App extends Component {
  constructor(props) {
    super(props);

    window.findme = this;

    this.state = {
      donations: [
        {id: 'a', user: 'Ken Oak', amount: '10', date: ''},
        {id: 'b', user: 'Jonathan Saylor', amount: '42', date: ''},
        {id: 'c', user: 'Michael Wright', amount: '50', date: ''},
        {id: 'd', user: 'Albert Martinez', amount: '99', date: ''},
      ]
    }
  }

  componentDidMount() {
    const socket = io('http://localhost:1234');

    socket.on('connect', () => {
      console.log('conncted')
    })

    socket.on('newDonation', (newDonation) => {
      console.log('newDonation: ', newDonation);
      this.addDonation(newDonation.id, newDonation.user, newDonation.amount);
    });
  }

  addDonation(id, user, amount) {
    this.setState((prevState) => {
      const oldDonations = prevState.donations;
      const newDonations = _.clone(oldDonations);
      newDonations.unshift({id: id, user: user, amount: amount, date: ''});
      return {
        donations: newDonations
      };
    });
  }

  render() {
    return <div style={{display: 'flex', alignItems: 'center', marginTop: '2rem', flexDirection: 'column'}}>
      <div style={{display: 'flex'}}>

      </div>
      <h3>Leaderboard</h3>
      <div>
        {
          _.map(this.state.donations, (donation) => {
            return <div key={donation.id} style={{marginTop: '1rem', animation: 'myFadeIn 2s'}}>
                  {donation.user} donated {donation.amount}!
            </div>
          })
        }
      </div>
    </div>
  }
}

export default App;

// Old render
// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <p>
//       Edit <code>src/App.js</code> and save to reload.
//     </p>
//     <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//     >
//       Learn React
//     </a>
//   </header>
// </div>