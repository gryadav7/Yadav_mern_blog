import React from "react";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import BlogCard from "@/components/BlogCard";

const Index = () => {
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/all-public`,
    {
      method: "GET",
    }
  );

  if (loading) return <Loading />;
  if (error) return <div>Error loading blogs</div>;

  return (
    <div className="grid sm:grid-cols-3 sm:grid-cols-2  gap-cols-1 gap-10">
      {blogData?.blog?.length > 0 ? (
        blogData.blog.map((item) => (
          <BlogCard key={item._id} props={item} />
        ))
      ) : (
        "Data Not Found"
      )}
    </div>
  );
};

export default Index;
