import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Search = () => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTerm(e.target.value);
  };

  return (
    <div>
      <form
        onSubmit={() => {
          navigate(`/search-view/${term}`);
        }}
      >
        <input
          className="search-input"
          placeholder="Search..."
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default Search;
