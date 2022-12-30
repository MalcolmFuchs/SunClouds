import './App.scss';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Impressum from './components/Impressum';

import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

class App extends React.Component {
  render() {
    return(
      <div className='app'>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/Impressum' element={<Impressum />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
  )
  }
}

export default App;

