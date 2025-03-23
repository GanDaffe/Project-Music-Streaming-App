
import { useState } from 'react';

export const useTable = (initialData = []) => {
    const [data, setData] = useState(initialData);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});

    const addItem = (item) => {
        const newId = data.length + 1;
        const newItem = { id: newId, ...item };
        setData([...data, newItem]);
    };

    const updateItem = (id, updatedItem) => {
        setData(data.map(item => 
            item.id === id ? { ...item, ...updatedItem } : item
        ));
    };

    const deleteItem = (id) => {
        setData(data.filter(item => item.id !== id));
    };

    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        
        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };

    const filterData = (filterConfig) => {
        setFilters(filterConfig);
        // Implement filtering logic here
    };

    return {
        data,
        setData,
        addItem,
        updateItem,
        deleteItem,
        sortData,
        filterData,
        sortConfig,
        filters
    };
};