import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import slugify from "slugify";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RouteBlog } from "@/helpers/RouteName";
import { decode } from 'entities';
import Loading from "@/components/Loading";


const EditBlog = () => {
  const { blogid } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    {
      method: "get",
      credentials: "include",
    }
  );

  const { data: BlogData,loading:blogLoading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/edit/${blogid}`,
    {
      method: "get",
      credentials: "include",
    },
    [blogid]
  );

  

  const [filePreview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // ✅ Zod schema – names fixed
  const formSchema = z.object({
    category: z.string().min(1, "Please select a category"),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    blogContent: z
      .string()
      .min(3, "Blog content must be at least 3 characters long."),
  });

  // ✅ useForm Hook
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const BlogTitle = form.watch("title");

  useEffect(() => {
    if (BlogData && BlogData.blog) {
      setPreview(BlogData.blog.featuredImage)
      form.setValue("category", BlogData.blog.category._id);
      form.setValue("title", BlogData.blog.title);
      form.setValue("slug", BlogData.blog.slug);
      form.setValue("blogContent", decode(BlogData.blog.blogContent));
    }
  }, [BlogData]);

  // ✅ Submit Function
  async function onSubmit(values) {
    try {

    

      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog/update/${blogid}`,
        {
          method: "put",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message || "Something went wrong");
      }

      form.reset();
      setFile(null);
      setPreview(null);

      showToast("success", data.message || "Blog added successfully.");
      navigate(RouteBlog);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  const handleFileSelection = (files) => {
    const file = files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setFile(file);
    setPreview(preview);
  };
 
  if(blogLoading) <Loading/>
  return (
    <div>
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
        <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Category */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>

                          <SelectContent>
                            {categoryData &&
                              categoryData.category?.length > 0 &&
                              categoryData.category.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Slug */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Featured Image */}
              <div className="mb-3">
                <span className="mb-2 block">Featured Image</span>
                <Dropzone onDrop={handleFileSelection}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed rounded">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-gray-400 text-center">
                            Click or drop image here
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* Blog Content (CKEditor) */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog content</FormLabel>
                      <FormControl>
                        <Editor
                          initialData={field.value}
                          onChange={(data) => field.onChange(data)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlog;
