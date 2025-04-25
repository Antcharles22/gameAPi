import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Home  from './componets/pages/home.jsx'
import Gameinfo  from './componets/pages/gameinfo.jsx'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route index element={<Home />} />
    <Route path="/" element={<Gameinfo />} />
   </Routes> 
  </BrowserRouter>,
)
