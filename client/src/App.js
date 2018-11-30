import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import 'antd/dist/antd.css';
import ko_KR from 'antd/lib/locale-provider/ko_KR';
import BasicLayout from './components/BasicLayout';
import Home from './components/Home';
import Project from './components/Project';
import './App.css';

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={ko_KR}>
        <Router>
          <div>
            <BasicLayout>
              <Route exact path="/" component={Home} />
              <Route path="/project" component={Project} />
            </BasicLayout>
          </div>
        </Router>
      </LocaleProvider>
    );
  }
}

export default App;
