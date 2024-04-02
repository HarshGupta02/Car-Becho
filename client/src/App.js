import React from 'react';
import { Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

const App = () => {

  return (
    <>
      <Navbar />
      <Route exact path="/">
        <Home />
      </Route>
    </>
  )
}

export default App