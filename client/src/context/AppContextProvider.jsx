// AppContextProvider.jsx

import { useAuth, useUser, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

const AppContextProvider = ({ children }) => {
  const [credit, setCredit] = useState(0);
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const loadCreditsData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("❗ No token received from Clerk.");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.success && typeof data.creditBalance === "number") {
        setCredit(data.creditBalance);
        console.log("✅ Credits loaded:", data.creditBalance);
      } else {
        toast.error(data?.error || "Failed to load credits.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  const removeBg = async (imageFile) => {
    try {
      if (!isSignedIn) {
        openSignIn();
        return;
      }

      if (!imageFile) {
        toast.warning("No image selected for background removal.");
        return;
      }

      setImage(imageFile);
      setResultImage(null);

      const token = await getToken();
      const formData = new FormData();
      formData.append("image_file", imageFile);
      formData.append("clerkId", user.id);

      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        setResultImage(data.data);
        if (typeof data.creditBalance === "number") {
          setCredit(data.creditBalance);
        }
        toast.success("Background removed successfully!");
        navigate("/result"); // ✅ Navigate only on success
      } else {
        toast.error(data?.error || "Failed to remove background.");

        if (data.redirect === "/buy") {
          navigate("/buy"); // ✅ Redirect to buy page
          return;
        }

        if (typeof data.creditBalance === "number") {
          setCredit(data.creditBalance);
        }
      }
    } catch (error) {
      const errData = error?.response?.data;
      toast.error(errData?.error || error.message);

      if (errData?.redirect === "/buy") {
        navigate("/buy"); // ✅ Redirect to buy page on error
      }
    }
  };

  const contextValue = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    resultImage,
    setResultImage,
    removeBg,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
