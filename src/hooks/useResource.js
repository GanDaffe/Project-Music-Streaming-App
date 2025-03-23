
import { useState } from 'react';

export const useResource = (resourceType, initialData = []) => {
    const [resources, setResources] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (data) => {
        try {
            setIsLoading(true);
            // Implement API call here
            const newResource = { id: resources.length + 1, ...data };
            setResources([...resources, newResource]);
            return newResource;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const read = async (id) => {
        try {
            setIsLoading(true);
            // Implement API call here
            return resources.find(resource => resource.id === id);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id, data) => {
        try {
            setIsLoading(true);
            // Implement API call here
            const updatedResources = resources.map(resource =>
                resource.id === id ? { ...resource, ...data } : resource
            );
            setResources(updatedResources);
            return updatedResources.find(resource => resource.id === id);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const remove = async (id) => {
        try {
            setIsLoading(true);
            // Implement API call here
            setResources(resources.filter(resource => resource.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        resources,
        isLoading,
        error,
        create,
        read,
        update,
        remove
    };
};