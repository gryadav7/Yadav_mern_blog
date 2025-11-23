import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { useSelector } from "react-redux";

const CommentList = ({ blogid, newComment }) => {
  const user = useSelector((state) => state.user);

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/comment/get/${blogid}`,
    {
      method: "get",
      credentials: "include",
    }
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* -------- COMMENT COUNT -------- */}
      {/* <h4 className="text-2xl font-bold">
        <span className="me-2">
          {newComment
            ? (data?.comments?.length || 0) + 1
            : data?.comments?.length}
        </span>
        Comments
      </h4> */}

      <h4 className="font-bold text-2xl">
  {data && data.comments.length} Comments
</h4>


      <div className="mt-5">
        {/* -------- SHOW NEW COMMENT INSTANTLY -------- */}
        {newComment && (
          <div className="flex gap-2 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={user?.user?.avatar || usericon}
                className="rounded-full object-cover"
              />
            </Avatar>

            <div>
              <p className="font-bold">{user?.user?.name}</p>
              <p>{moment(newComment?.createdAt).format("DD-MM-YYYY")}</p>
              <div className="pt-3">{newComment?.comment}</div>
            </div>
          </div>
        )}

        {/* -------- SHOW EXISTING COMMENTS -------- */}
        {data?.comments?.length > 0 &&
          data.comments.map((comment) => (
            <div key={comment._id} className="flex gap-2 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={comment?.user?.avatar || usericon}
                  className="rounded-full object-cover"
                />
              </Avatar>

              <div>
                <p className="font-bold">{comment?.user?.name}</p>
                <p>{moment(comment?.createdAt).format("DD-MM-YYYY")}</p>
                <div className="pt-3">{comment.comment}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentList;
