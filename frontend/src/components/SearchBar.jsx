import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    onSearch({ keyword, tag, category });
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">All Tags</option>
        <option value="Django">Django</option>
        <option value="React">React</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Q&A">Q&A</option>
        <option value="News">News</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
