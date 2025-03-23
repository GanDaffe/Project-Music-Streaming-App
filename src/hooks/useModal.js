
import { useState } from 'react';

export const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const showModal = (content = null) => {
        setModalContent(content);
        setIsVisible(true);
    };

    const hideModal = () => {
        setIsVisible(false);
        setModalContent(null);
    };

    const toggleModal = () => {
        setIsVisible(prev => !prev);
    };

    return {
        isVisible,
        modalContent,
        showModal,
        hideModal,
        toggleModal
    };
};