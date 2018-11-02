import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { InputTemplate , MainTemplate } from '../pages';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App" style={{backgroundColor:"#f2f2f2"}}>
        <Route exact path="/" component={InputTemplate}/>
        <Route exact path="/timetable" component={MainTemplate}/>
      </div>
    );
  }
}

export default App;
