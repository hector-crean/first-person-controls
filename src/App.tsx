import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom";
import CanvasImpl from './Canvas'

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <CanvasImpl/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
