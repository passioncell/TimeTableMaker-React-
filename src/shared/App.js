import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { InputTemplate , MainTemplate } from '../pages';
import { ToastContainer, ToastStore } from 'react-toasts';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App" style={{backgroundColor:"#f2f2f2", height:"100%"}}>
        <Route exact path="/" component={InputTemplate} />
        <Route exact path="/timetable" component={MainTemplate} />
        <ToastContainer store={ToastStore}/>
      </div>
    );
  }
}

export default App;
