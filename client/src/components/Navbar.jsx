import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useClerk } from '@clerk/clerk-react';

const Navbar = () => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk(); // Correct function for opening sign-in modal

  return (
    <div className='flex justify-between items-center mx-4 py-3 lg:mx-44 shadow-md'>
      <Link to={'/'}>
        <img className='w-32 sm:w-44' src={assets.logo} alt="Logo" />
      </Link>

      {isSignedIn ? (
        <UserButton />
      ) : (
        <button
          onClick={() => openSignIn()} // Correct function call
          className='bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-4 sm:px-8 sm:py-3 text-sm hover:bg-blue-600 transition duration-300'
        >
          Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="Arrow" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
