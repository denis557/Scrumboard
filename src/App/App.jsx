import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Scrumboard from '../pages/scrumboard/scrumboard.jsx';
import Friends from '../pages/friends/friends.jsx';
import Settings from '../pages/settings/settings.jsx';
import Login from '../pages/login/login.jsx';
import Signup from '../pages/signup/signup.jsx';
import './App.css';

const routes = (
  <Router>
    <Routes>
      <Route path='/scrumboard' exact element={<Scrumboard />} />
      <Route path='/friends' exact element={<Friends />} />
      <Route path='/settings' exact element={<Settings />} />
      <Route path='/login' exact element={<Login />} />
      <Route path='/signup' exact element={<Signup />} />
    </Routes>
  </Router>
)

function App() {

  return (<>{routes}</>)
}

export default App;