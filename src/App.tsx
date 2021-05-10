import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Game from './pages/Game';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game" strict>
          <Game />
        </Route>
        <Route path="/" strict>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
