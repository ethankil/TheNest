import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("");

  const handleSearch = () => {
    onSearch({ keyword, sort}); 
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="Academic">Academic</option>
        <option value="Career">Career</option>
        <option value="Housing">Housing</option>
        <option value="Scholarship">Scholarship</option>
        <option value="Classes">Classes</option>
        <option value="Internship">Internship</option>
      </select>

      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
