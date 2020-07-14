import React from 'react';
// import logo from './logo.svg';
import AuthProvider from './context';
import AppRouter from './router';
import './App.css';

function App() {
  return (
 <AuthProvider>
   <AppRouter>
   </AppRouter>
 </AuthProvider>
  );
}

export default App;
