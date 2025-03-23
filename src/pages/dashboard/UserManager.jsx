import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Form from '../../components/common/Form.jsx';
import Table from '../../components/common/Table.jsx';
import { useForm } from '../../hooks/useForm';
import { useTable } from '../../hooks/useTable';
import { useResource } from '../../hooks/useResource';
import { useModal } from '../../hooks/useModal';

const UserManager = () => {
    //Data giả
    const initialData = [
        {
            id: 1,
            username: "user1",
            email: "user1@example.com",
            role: "User",
            status: "Active",
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
        data: users, 
        addItem, 
        updateItem, 
        deleteItem 
    } = useTable(initialData);

    const { 
        create, 
        update, 
        remove, 
        isLoading 
    } = useResource('users');

    const { 
        isVisible: isDeleteModalVisible, 
        modalContent: selectedUser,
        showModal: showDeleteModal,
        hideModal: hideDeleteModal
    } = useModal();

    const handleSubmit = async (formData) => {
        if (selectedUser) {
            await update(selectedUser.id, formData);
            updateItem(selectedUser.id, formData);
        } else {
            const newUser = await create(formData);
            addItem(newUser);
        }
        hideForm();
        resetForm();
    };

    const handleEdit = (user) => {
        showForm();
        setFormData(user);
    };

    const handleDelete = (user) => {
        showDeleteModal(user);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            await remove(selectedUser.id);
            deleteItem(selectedUser.id);
            hideDeleteModal();
        }
    };

    const columns = [
        { key: "username", label: "Tên người dùng" },
        { key: "email", label: "Email" },
        { key: "role", label: "Vai trò" },
        { key: "status", label: "Trạng thái" },
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
                    title={selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
                    fields={[
                        { name: "username", label: "Tên người dùng", type: "text" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "role", label: "Vai trò", type: "text" },
                        { name: "status", label: "Trạng thái", type: "text" },
                    ]}
                    initialValues={formData}
                    onSubmit={handleSubmit}
                />

                {isDeleteModalVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#282828] p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                            <h2 className="text-white text-xl font-bold mb-4">Xác nhận xóa</h2>
                            <p className="text-gray-300 mb-6">
                                Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.username}" không?
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
                        data={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManager;