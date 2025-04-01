import React, { useState } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar.jsx';

const DataListeningTime = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const periods = [
        { id: 'day', label: 'Hôm nay' },
        { id: 'week', label: 'Tuần này' },
        { id: 'month', label: 'Tháng này' },
        { id: 'year', label: 'Năm nay' }
    ];

    // Mock data - thay thế bằng data thực tế sau
    const listeningData = [
        { time: '00:00 - 04:00', count: 150 },
        { time: '04:00 - 08:00', count: 320 },
        { time: '08:00 - 12:00', count: 580 },
        { time: '12:00 - 16:00', count: 750 },
        { time: '16:00 - 20:00', count: 890 },
        { time: '20:00 - 24:00', count: 650 }
    ];

    const maxCount = Math.max(...listeningData.map(item => item.count));

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-[#121212]">
            <div className="p-6">
                {/* Bộ lọc thời gian */}
                <div className="mb-8">
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
                </div>

                {/* Biểu đồ */}
                <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-[#282828] p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="text-green-500" />
                        Lượt nghe theo khung giờ
                    </h2>

                    <div className="space-y-4">
                        {listeningData.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-center gap-4">
                                    <div className="w-32 text-gray-400">{item.time}</div>
                                    <div className="flex-1">
                                        <div className="h-8 bg-[#282828] rounded-lg overflow-hidden">
                                            <div
                                                className="h-full bg-green-500/20 relative"
                                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-green-400/40" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-20 text-right text-white font-medium">
                                        {item.count.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataListeningTime;