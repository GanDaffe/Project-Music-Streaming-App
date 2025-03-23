import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Form from '../../components/common/Form.jsx';
import Table from '../../components/common/Table.jsx';
import { useForm } from '../../hooks/useForm';
import { useTable } from '../../hooks/useTable';
import { useResource } from '../../hooks/useResource';
import { useModal } from '../../hooks/useModal';

const ArtistManager = () => {
    //Data giả
    const initialData = [
        {
            id: 1,
            name: "Nghệ sĩ A",
            genre: "Pop",
            country: "Việt Nam",
            active: "Đang hoạt động",
        }
    ];

    const { 
        formData, 
        isFormVisible, 
        handleInputChange, 
        showForm, 
        hideForm,
        resetForm 
    } = useForm();

    const { 
        data: artists, 
        addItem, 
        updateItem, 
        deleteItem 
    } = useTable(initialData);

    const { 
        create, 
        update, 
        remove, 
        isLoading 
    } = useResource('artists');

    const { 
        isVisible: isDeleteModalVisible, 
        modalContent: selectedArtist,
        showModal: showDeleteModal,
        hideModal: hideDeleteModal
    } = useModal();

    const handleSubmit = async (formData) => {
        if (selectedArtist) {
            await update(selectedArtist.id, formData);
            updateItem(selectedArtist.id, formData);
        } else {
            const newArtist = await create(formData);
            addItem(newArtist);
        }
        hideForm();
        resetForm();
    };

    const handleEdit = (artist) => {
        showForm();
        setFormData(artist);
    };

    const handleDelete = (artist) => {
        showDeleteModal(artist);
    };

    const confirmDelete = async () => {
        if (selectedArtist) {
            await remove(selectedArtist.id);
            deleteItem(selectedArtist.id);
            hideDeleteModal();
        }
    };

    const columns = [
        { key: "name", label: "Tên nghệ sĩ" },
        { key: "genre", label: "Thể loại" },
        { key: "country", label: "Quốc gia" },
        { key: "active", label: "Trạng thái" },
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
                    title={selectedArtist ? "Chỉnh sửa nghệ sĩ" : "Thêm nghệ sĩ"}
                    fields={[
                        { name: "name", label: "Tên nghệ sĩ", type: "text" },
                        { name: "genre", label: "Thể loại", type: "text" },
                        { name: "country", label: "Quốc gia", type: "text" },
                        { name: "active", label: "Trạng thái", type: "text" },
                    ]}
                    initialValues={formData}
                    onSubmit={handleSubmit}
                />

                {isDeleteModalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#282828] p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                            <h2 className="text-white text-xl font-bold mb-4">Xác nhận xóa</h2>
                            <p className="text-gray-300 mb-6">
                                Bạn có chắc chắn muốn xóa nghệ sĩ "{selectedArtist?.name}" không?
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
                        data={artists}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArtistManager;