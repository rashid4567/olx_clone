import { useState } from "react";
import "./navBar.css";
import arrow from "../../assets/arrow-down.svg";
import search from "../../assets/search.svg";
import symbol from "../../assets/symbol.png";
import addButton from "../../assets/addButton.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firbase/firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

export const NavBar = (props) => {
  const [user] = useAuthState(auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const { toggleModal, toggleSellModal } = props;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav>
      <div className="fixed top-0 z-50 w-full bg-slate-100 border-b-4 border-white shadow-md">
        <div className="max-w-[350px] sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1500px] mx-auto p-2 flex items-center">
          <Link to="/">
            <img
              src={symbol}
              alt="logo"
              className="w-10 sm:w-12 cursor-pointer"
            />
          </Link>

          <div className="relative ml-3 sm:ml-5 location-search">
            <img
              src={search}
              alt="search"
              className="absolute top-3 left-2 w-4 sm:w-5 z-10"
            />
            <input
              type="text"
              placeholder="Search area or locality"
              className="w-[50px] sm:w-[150px] md:w-[250px] lg:w-[270px] p-2 sm:p-3 pl-8 border-2 border-black rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
            />
            <img
              src={arrow}
              alt="arrow"
              className="absolute top-4 right-3 w-3 sm:w-4 cursor-pointer"
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
            <img
              src={arrow}
              alt="arrow"
              className="w-4 sm:w-5 cursor-pointer"
            />
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
                className="flex items-center cursor-pointer py-2 px-3 rounded-md hover:bg-gray-200 transition-colors duration-200"
                onClick={toggleDropdown}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                  <span className="text-sm font-bold text-gray-600">
                    {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <p
                  style={{ color: "#002f34" }}
                  className="font-bold text-sm hidden sm:block"
                >
                  {user.displayName?.split(" ")[0] || "User"}
                </p>
                <img
                  src={arrow}
                  alt="dropdown arrow"
                  className={`w-3 ml-2 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showDropdown && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-lg font-bold text-gray-600">
                            {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/my-ads"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        My Ads
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <img
            src={addButton}
            onClick={user ? toggleSellModal : toggleModal}
            className="w-20 sm:w-24 mx-1 sm:ml-5 sm:mr-2 shadow-xl rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            alt="Add item"
          />
        </div>
      </div>

      <div className="w-full relative z-0 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists bg-white">
        <ul className="list-none flex items-center justify-between w-full text-sm">
          <div className="flex flex-shrink-0 items-center cursor-pointer hover:text-blue-600">
            <p className="font-semibold uppercase all-cats">All categories</p>
            <img className="w-4 ml-2" src={arrow} alt="" />
          </div>

          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden sm:block">
            Cars
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden md:block">
            Motorcycles
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden md:block">
            Mobile Phones
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden lg:block">
            For sale : Houses & Apartments
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden lg:block">
            Scooter
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden xl:block">
            Commercial & Other Vehicles
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors hidden xl:block">
            For rent : Houses & Apartments
          </li>
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
