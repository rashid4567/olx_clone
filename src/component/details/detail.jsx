import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ItemsContext } from "../context/item"
import { NavBar } from '../navBar/navBar';
import Login from '../modal/login';
import Sell from '../modal/sell';

const Detail = () => {
    const location = useLocation();
    const { item } = location.state || {};

    const [openModal, setOpenModal] = useState(false);
    const [sellModal, setSellModal] = useState(false);

    const itemsCtx = ItemsContext();
    
    const toggleModal = () => setOpenModal(!openModal);
    const toggleModalSell = () => setSellModal(!sellModal);


    if (!item) {
        return (
            <div>
                <NavBar toggleModalSell={toggleModalSell} toggleModal={toggleModal} />
                <Login toggleModal={toggleModal} status={openModal} />
                <div className="p-10 text-center">
                    <p className="text-xl font-bold text-gray-600">No item found</p>
                    <p className="text-gray-500">Please go back and select an item</p>
                </div>
                <Sell 
                    setItems={itemsCtx?.setItems} 
                    toggleSellModal={toggleModalSell} 
                    status={sellModal} 
                />
            </div>
        );
    }

    return (
        <div>
            <NavBar toggleModalSell={toggleModalSell} toggleModal={toggleModal} />
            <Login toggleModal={toggleModal} status={openModal} />

            <div className="grid gap-0 sm:gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 p-10 px-5 sm:px-15 md:px-30 lg:px-40">
                <div className="border-2 w-full rounded-lg flex justify-center overflow-hidden h-96">
                    {item.imageUrl ? (
                        <img 
                            className="object-cover w-full" 
                            src={item.imageUrl} 
                            alt={item.title || 'Product image'} 
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <p className="text-gray-500">No image available</p>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col relative w-full">
                    <p className="p-1 pl-0 text-2xl font-bold">
                        ₹ {item.price ? Number(item.price).toLocaleString('en-IN') : 'N/A'}
                    </p>
                    <p className="p-1 pl-0 text-base text-gray-600">
                        {item.category || 'Uncategorized'}
                    </p>
                    <p className="p-1 pl-0 text-xl font-bold">
                        {item.title || 'No title'}
                    </p>
                    <p className="p-1 pl-0 sm:pb-0 break-words text-ellipsis overflow-hidden w-full text-gray-700">
                        {item.description || 'No description available'}
                    </p>
                    
                    <div className="w-full relative sm:relative md:absolute bottom-0 flex justify-between mt-4 md:mt-0">
                        <p className="p-1 pl-0 font-bold text-gray-800">
                            Seller: {item.userName || 'Anonymous'}
                        </p>
                        <p className="p-1 pl-0 text-sm text-gray-500">
                            {item.createdAt || 'Date not available'}
                        </p>
                    </div>
                </div>
            </div>

            <Sell 
                setItems={itemsCtx?.setItems} 
                toggleSellModal={toggleModalSell} 
                status={sellModal} 
            />
        </div>
    )
}

export default Detail