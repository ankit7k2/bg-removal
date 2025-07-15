import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const { resultImage, image } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="mx-4 my-3 lg:mx-44 min-h-[100vh]">
      <div className="bg-white rounded-lg px-8 py-6 drop-shadow-sm">
        {/* Image Container */}
        <div className="flex flex-col sm:grid grid-cols-2 gap-8">
          {/* Left side - Original Image */}
          <div>
            <p className="font-semibold text-gray-600 mb-2">Original</p>
            {image ? (
              <img
                className="rounded-md border"
                src={URL.createObjectURL(image)}
                alt="Original uploaded"
              />
            ) : (
              <p className="text-sm text-gray-500">No image selected.</p>
            )}
          </div>

          {/* Right side - Background Removed */}
          <div className="flex flex-col">
            <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
            <div className="rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden flex items-center justify-center">
              {resultImage ? (
                <img src={resultImage} alt="Background removed result" className="rounded-md" />
              ) : image ? (
                <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
                  <div className="border-4 border-violet-400 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No result yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {resultImage && (
          <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6">
            <button
              className="px-8 py-2 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700"
              onClick={() => navigate("/")} // ✅ Now redirects to home
            >
              Try another image
            </button>
            <a
              href={resultImage}
              download="background_removed.png"
              className="px-8 py-2 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full hover:scale-105 transition-all duration-700"
            >
              Download image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
