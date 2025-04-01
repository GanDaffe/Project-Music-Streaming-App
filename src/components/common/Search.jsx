import React from 'react';
import { Search as SearchIcon } from "lucide-react";

const Search = ({ onSearch, placeholder = "Tìm kiếm..." }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-[300px] bg-[#282828] text-white rounded-full
                    border border-[#404040] focus:outline-none focus:border-green-500
                    placeholder-gray-500 transition-all duration-300"
            />
        </div>
    );
};

export default Search;