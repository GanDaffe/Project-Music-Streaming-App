
import { useState } from 'react';

export const useForm = (initialValues = {}) => {
    const [formData, setFormData] = useState(initialValues);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (file, onFileUpload) => {
        if (onFileUpload && file) {
            onFileUpload(file);
        }
    };

    const resetForm = () => {
        setFormData(initialValues);
    };

    const showForm = () => setIsFormVisible(true);
    const hideForm = () => setIsFormVisible(false);

    return {
        formData,
        setFormData,
        isFormVisible,
        handleInputChange,
        handleFileChange,
        resetForm,
        showForm,
        hideForm
    };
};