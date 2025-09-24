import React from 'react'
import { Home } from './component/pages/Home/home'
import { Route, Routes } from 'react-router-dom'
import Detail from './component/details/detail'
import MyAds from './component/myAds/myAds'

export default function App() {
  return (
      <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/details" element={<Detail/>}/>
        <Route path="/my-ads" element={<MyAds/>}/>
      </Routes>
      </>
  )
}