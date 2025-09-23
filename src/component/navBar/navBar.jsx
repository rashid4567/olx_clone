import { useState } from "react";
import "./navBar.css";
import arrow from "../../assets/arrow-down.svg";
import search from "../../assets/search.svg";
import symbol from "../../assets/symbol.png";
import addButton from "../../assets/addButton.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firbase/firebase";
import { signOut } from "firebase/auth";

export const NavBar = (props) => {
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const { toggleModal, toggleSellModal } = props;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav>
      <div className="fixed top-0 z-50 w-[350px] sm:w-[600px] md:w-[900px] lg:w-[1100px] xl:w-[1500px] mx-auto overflow-auto p-2 shadow-md bg-slate-100 border-b-4 border-white flex items-center rounded-md">
     
        <img src={symbol} alt="logo" className="w-10 sm:w-12" />

       
        <div className="relative ml-3 sm:ml-5 location-search">
          <img
            src={search}
            alt="search"
            className="absolute top-3 left-2 w-4 sm:w-5"
          />
          <input
            type="text"
            placeholder="Search area or locality"
            className="w-[50px] sm:w-[150px] md:w-[250px] lg:w-[270px] p-2 sm:p-3 pl-8 border-2 border-black rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
          />
          <img
            src={arrow}
            alt="arrow"
            className="absolute top-4 left-3 w-3 sm:w-4 cursor-pointer"
          />
        </div>

        
        <div className="ml-3 sm:ml-5 mr-2 relative flex-1 main-search">
          <input
            type="text"
            placeholder="Find card, mobile and phones"
            className="w-full p-2 sm:p-3 border-2 border-black rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
          />

          <div className="flex justify-center items-center absolute top-0 right-0 h-full w-10 sm:w-12 bg-[#002f34] rounded-e-md">
            <img
              className="w-4 sm:w-5 filter invert"
              src={search}
              alt="search"
            />
          </div>
        </div>

      
        <div className="ml-3 sm:ml-5 flex items-center lang">
          <p className="font-bold mr-2 text-sm sm:text-base">ENGLISH</p>
          <img src={arrow} alt="arrow" className="w-4 sm:w-5 cursor-pointer" />
        </div>

    
        {!user ? (
          <p
            className="font-bold underline ml-5 cursor-pointer"
            style={{ color: "#002f34" }}
            onClick={toggleModal}
          >
            Login
          </p>
        ) : (
          <div className="relative ml-5">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <p
                style={{ color: "#002f34" }}
                className="font-bold"
              >
                {user.displayName?.split(" ")[0]}
              </p>
              <img 
                src={arrow} 
                alt="dropdown arrow" 
                className={`w-3 ml-1 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              />
            </div>
            
          
            {showDropdown && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{user.displayName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        
        <img
          src={addButton}
          onClick={user ? toggleSellModal : toggleModal}
          className="w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer"
          alt="Add item"
        />
      </div>

 
      <div className="w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists">
        <ul className="list-none flex items-center justify-between w-full">
          <div className="flex flex-shrink-0">
            <p className="font-semibold uppercase all-cats">All categories</p>
            <img className="w-4 ml-2" src={arrow} alt="" />
          </div>

          <li>Cars</li>
          <li>Motorcycles</li>
          <li>Mobile Phones</li>
          <li>For sale : Houses & Apartments</li>
          <li>Scooter</li>
          <li>Commercial & Other Vehicles</li>
          <li>For rent : Houses & Apartments</li>
        </ul>
      </div>
      
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};