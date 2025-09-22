import React from 'react'
import { Home } from './component/pages/Home/home'
import { Route, Routes } from 'react-router-dom'
import Detail from './component/details/detail'

export default function App() {
  return (
      <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/details" element={<Detail/>}/>
      </Routes>
      </>
  )
}
