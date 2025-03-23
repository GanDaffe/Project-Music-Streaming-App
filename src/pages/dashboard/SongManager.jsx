import React from 'react';
import Navbar from "../../components/Navbar.jsx";
import Form from "../../components/common/Form.jsx";
import Table from "../../components/common/Table.jsx";
import { useForm } from '../../hooks/useForm';
import { useTable } from '../../hooks/useTable';
import { useResource } from '../../hooks/useResource';
import { useModal } from '../../hooks/useModal';

const SongManager = () => {
    const initialData = [
        {
            id: 1,
            title: "Bài hát 1",
            genre: "Pop",
            artist: "Nghệ sĩ A",
            year: 2023,
        }
    ];

    const { 
        formData, 
        isFormVisible, 
        handleInputChange, 
        showForm, 
        hideForm,
        resetForm,
        setFormData 
    } = useForm();

    const { 
        data: songs, 
        addItem, 
        updateItem, 
        deleteItem 
    } = useTable(initialData);

    const { 
        create, 
        update, 
        remove, 
        isLoading 
    } = useResource('songs');

    const { 
        isVisible: isDeleteModalVisible, 
        modalContent: selectedSong,
        showModal: showDeleteModal,
        hideModal: hideDeleteModal
    } = useModal();

    const handleSubmit = async (formData) => {
        if (selectedSong) {
            await update(selectedSong.id, formData);
            updateItem(selectedSong.id, formData);
        } else {
            const newSong = await create(formData);
            addItem(newSong);
        }
        hideForm();
        resetForm();
    };

    const handleEdit = (song) => {
        showForm();
        setFormData(song);
    };

    const handleDelete = (song) => {
        showDeleteModal(song);
    };

    const confirmDelete = async () => {
        if (selectedSong) {
            await remove(selectedSong.id);
            deleteItem(selectedSong.id);
            hideDeleteModal();
        }
    };

    const handleFileUpload = (file) => {
        console.log("File uploaded:", file);
    };

    const columns = [
        { key: "title", label: "Tên bài hát" },
        { key: "genre", label: "Thể loại" },
        { key: "artist", label: "Nghệ sĩ" },
        { key: "year", label: "Năm phát hành" },
    ];

    return (
        <div className="flex flex-col h-full">
            <Navbar onAddClick={() => {
                resetForm();
                showForm();
            }} />
            
            <div className="container mx-auto p-4 flex-1">
                <Form
                    isVisible={isFormVisible}
                    onClose={hideForm}
                    title={selectedSong ? "Chỉnh sửa bài hát" : "Thêm bài hát"}
                    fields={[
                        { name: "title", label: "Tên bài hát", type: "text" },
                        { name: "genre", label: "Thể loại", type: "text" },
                        { name: "artist", label: "Nghệ sĩ", type: "text" },
                        { name: "year", label: "Năm phát hành", type: "number" },
                        { name: "file", label: "Upload file nhạc", type: "file" },
                    ]}
                    initialValues={formData}
                    onSubmit={handleSubmit}
                    onFileUpload={handleFileUpload}
                />

                {isDeleteModalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#282828] p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                            <h2 className="text-white text-xl font-bold mb-4">Xác nhận xóa</h2>
                            <p className="text-gray-300 mb-6">
                                Bạn có chắc chắn muốn xóa bài hát "{selectedSong?.title}" không?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={hideDeleteModal}
                                    className="px-4 py-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <Table 
                        columns={columns} 
                        data={songs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default SongManager;