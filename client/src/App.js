import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import BasicLayout from './components/BasicLayout';
import Home from './components/Home';
import Project from './components/Project';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <BasicLayout>
            <Route exact path="/" component={Home} />
            <Route path="/project" component={Project} />
          </BasicLayout>
        </div>
      </Router>
    );
  }
}

export default App;
