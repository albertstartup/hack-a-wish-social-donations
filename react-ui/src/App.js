import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { fadeIn } from 'react-animations'
import _ from 'underscore';
import styled from 'styled-components';
import Radium from 'radium';
import io from 'socket.io-client';

import { Input, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
const AutoComplete = require('react-autocomplete');

const styles = {
  fadeIn: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeIn, 'fadeIn')
  }
};

window._ = _;
window.envfind = process.env;
window.wio = io;

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
    let socket;

    if (process.env.NODE_ENV === 'production') {
      socket = io(`https://wish-test1.herokuapp.com/`);
    } else {
      socket = io(`http://localhost:4242/`);
    }

    socket.on('connect', () => {
      console.log('conncted')
    });

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

  onChangeName(value) {
    this.setState({
      nameValue: value
    })
  }

  onSetName() {
    this.setState((prevState) => {
      return {
        name: prevState.nameValue
      };
    });
  }

  render() {
    return <div style={{display: 'flex', alignItems: 'center', marginTop: '2rem', flexDirection: 'column'}}>
      <h3>Donate:</h3>
      { !this.state.name &&
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <form style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}} onSubmit={(e) => {e.preventDefault(); this.onSetName()}}>
          <h4>Set your name:</h4>
          <div>
            <AutoComplete
                required
                menuStyle={{
                  position: 'static' // Pushes down other elements
                }}
                getItemValue={(item) => {
                  return item.name;
                }}
                // items={_.map(this.props.optionValues, (value, key) => {
                //   return {key: key, value: value};
                // })}
                items={[
                  {name: 'Raffaela Camera'},
                  {name: 'Amber Hameed'},
                  {name: 'Christina Kosmowski'},
                  {name: 'Milana Rabkin'},
                  {name: 'Tyler McPartland'},
                  {name: 'Bo Pearl'},
                  {name: 'Jonathan Shokrian'}
                ]}
                shouldItemRender={(item, queryChar) => {
                  return item.name.toLowerCase().indexOf(queryChar.toLowerCase()) > -1
                }}
                renderItem={(item, highlighted) => {
                  return <div style={{ backgroundColor: highlighted ? '#eee' : 'white'}}
                              key={item.name}>{item.name}</div>;
                }}
                value={this.state.nameValue}
                onChange={(e) => {this.onChangeName(e.target.value)}}
                onSelect={(item) => {
                  console.log(item);
                  this.onChangeName(item.name);
                  this.onSetName()
                }}
            />
          </div>
          <Button style={{marginTop: '1rem', marginLeft: '1rem', marginBottom: '4rem'}} color={'blue'}>Set Name</Button>
        </form>
      </div>
      }
      { this.state.name &&
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', animation: 'myFadeIn 2s'}}>
        <Button color={'pink'}>Donate $5!</Button>
      </div>
      }
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