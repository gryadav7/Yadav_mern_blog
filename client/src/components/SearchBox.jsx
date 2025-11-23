import React, { useState } from 'react'
import { Input } from './ui/input'
import { RouteSearch } from '@/helpers/RouteName';
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const getInput = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(RouteSearch(query));
   window.location.reload()
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="q"
        onInput={getInput}
        placeholder="Search here..."
        className="h-9 rounded-full bg-gray-50"
      />
    </form>
  );
};

export default SearchBox;