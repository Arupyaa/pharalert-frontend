import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";

// SearchBar component accepts optional className for external styling overrides
const SearchBar = ({ className }) => {
  // State to store fetched users data
  const [data, setData] = useState([]);

  // State to store the current search input value
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch random users from API
  const fetchData = async () => {
    const response = await fetch("https://randomuser.me/api/?results=20");
    const data = await response.json();
    setData(data.results); // Store users in state
  };

  // Run fetchData once when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Filter users based on search query (case-insensitive)
  const filterData = data.filter(user =>
    `${user.name.first} ${user.name.last}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    // Main container (twMerge allows overriding styles via props)
    <div className={twMerge("w-full max-w-md relative", className)}>
      
      {/* Search Input Box */}
      <div
        className={twMerge(
          // Base styles
          "flex items-center bg-neutral-main border border-gray-200 rounded-xl shadow-sm px-3 py-2 transition",
          // Focus styles
          "focus-within:ring-2 focus-within:ring-brand-primary"
        )}
      >
        {/* Search icon */}
        <FaSearch className="text-brand-primary mr-2" size={18} />
        
        {/* Input field */}
        <input
          type="text"
          placeholder="Search users..."
          className={twMerge(
            "flex-1 outline-none border-none text-sm bg-transparent"
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search state
        />

        {/* Clear button (only appears when there is input) */}
        {searchQuery && (
          <IoMdCloseCircle
            className={twMerge(
              "text-brand-primary cursor-pointer transition",
              "hover:text-brand-light"
            )}
            size={20}
            onClick={() => setSearchQuery("")} // Clear input
          />
        )}
      </div>

      {/* Dropdown results (only shown when user is typing) */}
      {searchQuery && (
        <div
          className={twMerge(
            "absolute mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-64 overflow-y-auto"
          )}
        >
          {/* If there are matching users */}
          {filterData.length > 0 ? (
            filterData.map((user, index) => (
              <div
                key={index}
                className={twMerge(
                  "flex items-center gap-3 px-4 py-2 transition cursor-pointer",
                  "hover:bg-gray-50"
                )}
              >
                {/* User avatar */}
                <img
                  src={user.picture.thumbnail}
                  alt=""
                  className={twMerge("w-9 h-9 rounded-full border")}
                />

                {/* User full name */}
                <span className={twMerge("text-sm text-gray-700")}>
                  {user.name.first} {user.name.last}
                </span>
              </div>
            ))
          ) : (
            // Fallback when no results match
            <div className={twMerge("text-center text-gray-400 py-6 text-sm")}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;