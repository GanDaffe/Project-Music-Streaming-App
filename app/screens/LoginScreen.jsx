import React from 'react';

const LoginScreen = ({ goBack }) => {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white p-6">
            <div className="flex items-center mb-8">
                <button onClick={goBack} className="text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-4">Đăng nhập</h1>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm">Email hoặc tên người dùng</label>
                    <input type="text" className="bg-gray-800 p-3 rounded" />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm">Mật khẩu</label>
                    <input type="password" className="bg-gray-800 p-3 rounded" />
                </div>

                <button className="bg-green-500 text-white py-3 rounded-full font-medium mt-4">
                    Đăng nhập
                </button>

                <div className="text-center mt-4">
                    <a href="#" className="text-gray-400 underline">Quên mật khẩu?</a>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;