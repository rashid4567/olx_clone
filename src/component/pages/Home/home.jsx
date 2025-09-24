import React, { useState, useEffect } from "react";
import { NavBar } from "../../NavBar/navBar";
import Card from "../../Card/card";
import Login from "../../modal/login";
import Sell from "../../modal/sell";
import { ItemsContext } from "../../context/item";

export const Home = () => {
  const [loginModalStatus, setLoginModalStatus] = useState(false);
  const [sellModalStatus, setSellModalStatus] = useState(false);
  const { items, setItems, loading } = ItemsContext();

  const toggleModal = () => {
    setLoginModalStatus(!loginModalStatus);
  };

  const toggleSellModal = () => {
    setSellModalStatus(!sellModalStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar toggleModal={toggleModal} toggleSellModal={toggleSellModal} />

      {items && items.length > 0 ? (
        <Card items={items} />
      ) : (
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#002f34" }}
            >
              No products available
            </h2>
            <p className="text-gray-600 mb-6">Be the first to post an item!</p>
            <button
              onClick={toggleSellModal}
              className="px-6 py-3 rounded-lg text-white hover:opacity-90"
              style={{ backgroundColor: "#002f34" }}
            >
              Post an Ad
            </button>
          </div>
        </div>
      )}

      {loginModalStatus && (
        <Login toggleModal={toggleModal} status={loginModalStatus} />
      )}

      {sellModalStatus && (
        <Sell
          toggleSellModal={toggleSellModal}
          status={sellModalStatus}
          setItems={setItems}
        />
      )}
    </>
  );
};
