import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { FaRegComment } from "react-icons/fa";

const CommentCount = ({ blogid }) => {
  const { data, loading, error } = useFetch(
    `${getEnv('VITE_API_BASE_URL')}/comment/get-count/${blogid}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  return (
    <button
      type="button"
      className="flex items-center gap-1 "
    >
      <FaRegComment />
      {data?.commentCount }
    </button>
  );
};

export default CommentCount;




