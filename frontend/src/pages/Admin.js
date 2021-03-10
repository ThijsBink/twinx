import React, { Component } from 'react'
import {  } from '../api/endpoints';
import apiContext from '../context/apiContext';

export default class Admin extends Component {
   static contextType = apiContext


   constructor(props) {
     super(props);
     this.emailEl = React.createRef();
   }
 
   doSomething = () => {
      console.log(this.context)
      console.log(this.emailEl.current.value)
   }

   render() {
      return (
         <div>
            <p>Invite a user</p>
            <label htmlFor='email'>E-mail</label>
            <input type='email' id='email' ref={this.emailEl} />
            <button onClick={() => this.doSomething()}>send</button>
         </div>
      )
   }
}
