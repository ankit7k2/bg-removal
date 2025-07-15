// Upload.jsx

import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Upload = () => {
  const { removeBg, setImage } = useContext(AppContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      removeBg(file); // Optional: trigger background removal after upload
    }
  };

  return (
    <div className="pb-16">
      {/* 🪄 Title */}
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6">
        See the magic. Try now
      </h1>

      {/* 📁 Upload button */}
      <div className="text-center mb-24">
        <input
          type="file"
          accept="image/*"
          id="upload2"
          hidden
          onChange={handleFileChange}
        />
        <label
          htmlFor="upload2"
          className="inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:scale-105 transition-all duration-700"
        >
          <img
            width={20}
            src={assets.upload_btn_icon}
            alt="Upload icon"
            className="object-contain"
          />
          <p className="text-white text-sm">Upload your image</p>
        </label>
      </div>
    </div>
  );
};

export default Upload;
