import React, { useEffect, useState } from 'react'
import { NavBar } from '../../navBar/navBar'
import Login from '../../modal/login';
import Sell from '../../modal/sell';
import  Card  from '../../Card/card';
import { ItemsContext } from '../../context/item';
import { fetchFromFireStore } from '../../Firbase/firebase';

export const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSellModal, setopenSellModal] = useState(false);
  const toggleModal = () => { setOpenModal(!openModal) }
  const toggleSellModal = () => { setopenSellModal(!openSellModal) }
  

  const itemCtx = ItemsContext();

  useEffect(()=>{
    const getItems = async () =>{
      const datas = await fetchFromFireStore();
      itemCtx ?.setItems(datas)
    }
    getItems();
  },[])
  
  useEffect(()=>{
    console.log('updated items  : ', itemCtx.items)
  },[itemCtx.items])
  return (
    <div>
      <NavBar toggleModal={toggleModal} toggleSellModal={toggleSellModal} />
      <Login toggleModal={toggleModal} status={openModal} />
      <Sell setItems = {(itemCtx).setItems} toggleSellModal={toggleSellModal} status={openSellModal} /> 
      <Card items={itemCtx.items || []}/>
    </div>
  )
}