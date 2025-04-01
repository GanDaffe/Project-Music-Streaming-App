import React, { useState } from 'react';
import { Calendar, ChevronDown, Tag, Disc, ArrowUp } from 'lucide-react';

const DataListeningGenre = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortBy, setSortBy] = useState('listens'); // 'listens' or 'name'

    const periods = [
        { id: 'day', label: 'Hôm nay' },
        { id: 'week', label: 'Tuần này' },
        { id: 'month', label: 'Tháng này' },
        { id: 'year', label: 'Năm nay' }
    ];

    // Mock data - thay thế bằng data thực tế sau
    const genreData = [
        { genre: 'Nhạc Trẻ', count: 2500, trend: '+15%', color: '#1DB954' },
        { genre: 'Ballad', count: 2100, trend: '+8%', color: '#1ED760' },
        { genre: 'Hip Hop', count: 1800, trend: '+12%', color: '#20BD50' },
        { genre: 'Rock', count: 1500, trend: '-3%', color: '#1DB954' },
        { genre: 'Jazz', count: 1200, trend: '+5%', color: '#1ED760' },
        { genre: 'Classical', count: 900, trend: '+2%', color: '#20BD50' }
    ];

    const maxCount = Math.max(...genreData.map(item => item.count));

    const sortedData = [...genreData].sort((a, b) => {
        if (sortBy === 'listens') {
            return b.count - a.count;
        }
        return a.genre.localeCompare(b.genre);
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-[#121212]">
            <div className="p-6">
                {/* Control Panel */}
                <div className="mb-8 flex justify-between items-center">
                    {/* Time Filter */}
                    <div className="relative inline-block">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-[#282828] text-white px-4 py-2 rounded-full hover:bg-[#3e3e3e] transition-colors duration-300"
                        >
                            <Calendar size={20} />
                            <span>{periods.find(p => p.id === selectedPeriod)?.label}</span>
                            <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute mt-2 w-48 bg-[#282828] rounded-lg shadow-lg overflow-hidden z-10">
                                {periods.map(period => (
                                    <button
                                        key={period.id}
                                        onClick={() => {
                                            setSelectedPeriod(period.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition-colors duration-300
                                            ${selectedPeriod === period.id ? 'text-green-500' : 'text-white'}`}
                                    >
                                        {period.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('listens')}
                            className={`px-4 py-2 rounded-full transition-colors duration-300
                                ${sortBy === 'listens' 
                                    ? 'bg-green-500 text-black' 
                                    : 'bg-[#282828] text-white hover:bg-[#3e3e3e]'}`}
                        >
                            Lượt nghe
                        </button>
                        <button
                            onClick={() => setSortBy('name')}
                            className={`px-4 py-2 rounded-full transition-colors duration-300
                                ${sortBy === 'name' 
                                    ? 'bg-green-500 text-black' 
                                    : 'bg-[#282828] text-white hover:bg-[#3e3e3e]'}`}
                        >
                            Tên thể loại
                        </button>
                    </div>
                </div>

                {/* Genre Chart */}
                <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-[#282828] p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Disc className="text-green-500" />
                        Lượt nghe theo thể loại
                    </h2>

                    <div className="space-y-4">
                        {sortedData.map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="flex items-center gap-4">
                                    <div className="w-32 text-gray-400">{item.genre}</div>
                                    <div className="flex-1">
                                        <div className="h-8 bg-[#282828] rounded-lg overflow-hidden group-hover:bg-[#3e3e3e] transition-colors duration-300">
                                            <div
                                                className="h-full relative"
                                                style={{
                                                    width: `${(item.count / maxCount) * 100}%`,
                                                    backgroundColor: item.color + '33' // Adding transparency
                                                }} />
                                        </div>
                                    </div>
                                    <div className="w-20 text-right text-white font-semibold">{item.count}</div>
                                </div>
                                <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#282828]">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DataListeningGenre;