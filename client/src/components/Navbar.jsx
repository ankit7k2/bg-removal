import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useUser, UserButton, useClerk } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { credit, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
    }
  }, [isSignedIn, loadCreditsData]);

  return (
    <div className="flex justify-between items-center mx-4 py-3 lg:mx-44 shadow-md">
      <Link to="/">
        <img className="w-32 sm:w-44" src={assets.logo} alt="Logo" />
      </Link>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            {/* Credits button */}
            <button
              className="flex items-center gap-2 bg-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 transition duration-300 text-sm"
              onClick={() => {
                console.log("Credits button clicked");
                navigate("/buy");
              }}
            >
              <img
                className="w-5 h-5"
                src={assets.credit_icon}
                alt="Credits icon"
              />
              💳 Credits: <strong>{credit}</strong>
            </button>

            {/* Greeting text */}
            <p className="text-sm text-gray-700 hidden sm:block">
              👋 Hi, <strong>{user?.fullName || user?.firstName}</strong>
            </p>

            <UserButton />
          </>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 sm:px-6 sm:py-3 text-sm hover:bg-blue-600 transition duration-300"
          >
            Get Started
            <img
              className="w-3 sm:w-4"
              src={assets.arrow_icon}
              alt="Arrow icon"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
