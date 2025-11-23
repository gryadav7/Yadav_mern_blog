import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import React, { useState } from "react";
import { data, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FiEdit } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import { comment } from "postcss";

const Comments = () => {
  const [refreshData, setRefreshData] = useState(false);

  const {
    data: commentData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/comment/get-all-comment`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );



  const handleDelete = async(id)=>{
    const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/comment/delete/${id}`)
    if(response){
      setRefreshData(!refreshData)
      showToast('success','Data deleted')
    }else{
      showToast('error','Data not deleted')
    }
  }
  // // console.log(commentData)

  if (loading) return <Loading />;
  return (
    <div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blog</TableHead>
                <TableHead>Comment By</TableHead>
                {/* <TableHead>Date</TableHead> */}
                <TableHead>Comment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {commentData?.comments?.length > 0 ? (
                commentData.comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>{comment?.blogid?.title}</TableCell>
                    <TableCell>{comment?.user?.name}</TableCell>
                    <TableCell>{comment?.comment}</TableCell>

                    <TableCell className="flex gap-3">
                      <Button
                        onClick={() => {
                          handleDelete(comment._id);
                        }}
                        variant="outline"
                        className="hover:bg-violet-500 hover:text-white"
                      >
                        <FiTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3">Data not found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comments;
