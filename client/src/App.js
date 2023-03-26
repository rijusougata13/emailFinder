import React, { Component }  from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { GlobalProvider } from './context/searchParamContext';
import Landing from './pages/Landing/Landing';
import { UserDetails } from './pages/UserDetails/UserDetails';

function App() {
  return (
    <div className="App">
      <GlobalProvider>
      <Header/>
      <Landing/>
      <UserDetails/>
      <Footer/>
      </GlobalProvider>
      
    </div>
  );
}

export default App;
