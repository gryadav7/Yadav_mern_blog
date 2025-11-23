import Comment from "@/components/comment";
import CommentList from "@/components/CommentList";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { decode } from "entities";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import RelatedBlog from "@/components/RelatedBlog";
import { current } from "@reduxjs/toolkit";

const SingleBlogDetails = () => {
  const { blog, category } = useParams();

  const [commentCount, setCommentCount] = useState(0);

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`,
    {
      method: "get",
      credentials: "include",
    },
    [blog]
  );

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
      <>
        {data && data.blog && (
          <div className="border rounded md:w-[70%] w-full p-5">
            {/* Blog Title */}
            <h1 className="text-2xl font-bold mb-5">{data.blog.title}</h1>

            {/* Author Section */}
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-5">
                <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                  <AvatarImage
                    src={data.blog.author.avatar}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
                <div>
                  <p className="font-bold"> {data.blog.author.name}</p>
                  <p>Date:{moment(data.blog.createdAt).format("DD-MM-YYYY")}</p>
                </div>
              </div>

              <div className="flex justify-between items-center gap-3">
                <LikeCount blogid={data.blog._id} />

                <CommentCount blogid={data.blog._id} />
              </div>
            </div>

            <div className="my-5">
              <img src={data.blog.featuredImage} className="rounded" />
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: decode(data.blog.blogContent) || "",
              }}
            ></div>

            {/* Comment Section */}
            <div className="border-t mt-5 pt-5">
              <Comment blogid={data.blog._id} /> {/* ✅ FIXED */}
            </div>
          </div>
        )}
      </>

      {/* Right Sidebar */}
      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog props={{ category: category, currentBlog: blog }} />
      </div>
    </div>
  );
};

export default SingleBlogDetails;
