import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

const LikeCount = ({ blogid }) => {
  const user = useSelector((state) => state.user);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const { data: blogLikeCount } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog-like/get-like/${blogid}?userid=${
      user?.isLoggedIn ? user.user._id : ""
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  

  useEffect(() => {
    if (blogLikeCount) {
      setLikeCount(blogLikeCount.likecount);
      setHasLiked(blogLikeCount.isUserLiked);
    }
  }, [blogLikeCount]);

  const handleLike = async () => {
    try {
      if (!user.isLoggedIn) {
        return showToast("error", "Please login into your account.");
      }

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog-like/do-like`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userid: user.user._id,
            blogid,
          }),
        }
      );

      const result = await response.json();

      setLikeCount(result.likecount);
      setHasLiked(!hasLiked);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-1">
      {!hasLiked ? <FaRegHeart /> : <FaHeart fill="red" />}
      {likeCount}
    </button>
  );
};

export default LikeCount;
