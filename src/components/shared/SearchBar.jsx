// import React, { useEffect, useState } from 'react'
// import { FaSearch } from "react-icons/fa";
// import { IoMdCloseCircle } from "react-icons/io";
// import { twMerge } from "tailwind-merge";

// // SearchBar component accepts optional className for external styling overrides
// const SearchBar = ({ className }) => {
//   // State to store fetched users data
//   const [data, setData] = useState([]);

//   // State to store the current search input value
//   const [searchQuery, setSearchQuery] = useState("");

//   // Function to fetch random users from API
//   const fetchData = async () => {
//     const response = await fetch("https://randomuser.me/api/?results=20");
//     const data = await response.json();
//     setData(data.results); // Store users in state
//   };

//   // Run fetchData once when component mounts
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Filter users based on search query (case-insensitive)
//   const filterData = data.filter(user =>
//     `${user.name.first} ${user.name.last}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   return (
//     // Main container (twMerge allows overriding styles via props)
//     <div className={twMerge("w-full max-w-md relative", className)}>
      
//       {/* Search Input Box */}
//       <div
//         className={twMerge(
//           // Base styles
//           "flex items-center bg-neutral-main border border-gray-200 rounded-xl shadow-sm px-3 py-2 transition",
//           // Focus styles
//           "focus-within:ring-2 focus-within:ring-brand-primary"
//         )}
//       >
//         {/* Search icon */}
//         <FaSearch className="text-brand-primary mr-2" size={18} />
        
//         {/* Input field */}
//         <input
//           type="text"
//           placeholder="Search users..."
//           className={twMerge(
//             "flex-1 outline-none border-none text-sm bg-transparent"
//           )}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)} // Update search state
//         />

//         {/* Clear button (only appears when there is input) */}
//         {searchQuery && (
//           <IoMdCloseCircle
//             className={twMerge(
//               "text-brand-primary cursor-pointer transition",
//               "hover:text-brand-light"
//             )}
//             size={20}
//             onClick={() => setSearchQuery("")} // Clear input
//           />
//         )}
//       </div>

//       {/* Dropdown results (only shown when user is typing) */}
//       {searchQuery && (
//         <div
//           className={twMerge(
//             "absolute mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-64 overflow-y-auto"
//           )}
//         >
//           {/* If there are matching users */}
//           {filterData.length > 0 ? (
//             filterData.map((user, index) => (
//               <div
//                 key={index}
//                 className={twMerge(
//                   "flex items-center gap-3 px-4 py-2 transition cursor-pointer",
//                   "hover:bg-gray-50"
//                 )}
//               >
//                 {/* User avatar */}
//                 <img
//                   src={user.picture.thumbnail}
//                   alt=""
//                   className={twMerge("w-9 h-9 rounded-full border")}
//                 />

//                 {/* User full name */}
//                 <span className={twMerge("text-sm text-gray-700")}>
//                   {user.name.first} {user.name.last}
//                 </span>
//               </div>
//             ))
//           ) : (
//             // Fallback when no results match
//             <div className={twMerge("text-center text-gray-400 py-6 text-sm")}>
//               No results found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { twMerge } from "tailwind-merge";

const sizeClasses = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-xl",
  full: "w-full",
};

const SearchBar = ({
  data = [],
  placeholder = "Search...",
  onSelect,
  onSubmit,
  filterFunction,
  className,
  size = "md",
}) => {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  const containerRef = useRef(null);

  const filteredData = useMemo(() => {
    if (filterFunction) {
      return data.filter((item) =>
        filterFunction(item, searchQuery)
      );
    }

    return data.filter((item) =>
      item
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery, filterFunction]);

  const handleSelect = (value) => {
    setSearchQuery(value);

    setIsOpen(false);

    if (onSelect) {
      onSelect(value);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(searchQuery);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !containerRef.current?.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative w-full",
        sizeClasses[size],
        className
      )}
    >
      <div
        className={twMerge(
          "flex items-center gap-2",
          "bg-white border border-gray-200",
          "rounded-xl px-3 py-2",
          "shadow-sm transition",
          "focus-within:ring-2",
          "focus-within:ring-blue-500"
        )}
      >
        <FaSearch className="text-gray-400 shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          placeholder={placeholder}
          className={twMerge(
            "flex-1 bg-transparent outline-none",
            "text-sm min-w-0 border-none"
          )}
          onChange={(e) => {
            setSearchQuery(e.target.value);

            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        {searchQuery && (
          <IoMdCloseCircle
            size={18}
            className={twMerge(
              "cursor-pointer text-gray-400",
              "hover:text-gray-600 transition"
            )}
            onClick={() => {
              setSearchQuery("");

              inputRef.current?.focus();
            }}
          />
        )}
      </div>

      {isOpen && searchQuery && (
        <div
          className={twMerge(
            "absolute left-0 top-full mt-2 z-50",
            "w-full overflow-hidden",
            "rounded-xl border border-gray-100",
            "bg-white shadow-lg"
          )}
        >
          {filteredData.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {filteredData.map(
                (item, index) => (
                  <button
                    key={index}
                    type="button"
                    className={twMerge(
                      "w-full text-left",
                      "px-4 py-3 text-sm",
                      "transition hover:bg-gray-50"
                    )}
                    onClick={() =>
                      handleSelect(item)
                    }
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;