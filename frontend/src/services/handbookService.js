// Handbook Service - API calls for handbook management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get handbook data by year and month
export const getHandbookData = async (year, month) => {
    try {
        const response = await fetch(`${API_BASE_URL}/handbook?year=${year}&month=${month}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch handbook data');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching handbook data:', error);
        throw error;
    }
};

// Get all available years
export const getAvailableYears = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/handbook/years`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch available years');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching available years:', error);
        throw error;
    }
};

// Get available months for a specific year
export const getAvailableMonths = async (year) => {
    try {
        const response = await fetch(`${API_BASE_URL}/handbook/months?year=${year}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch available months');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching available months:', error);
        throw error;
    }
};

// Delete handbook data
export const deleteHandbook = async (year, month) => {
    try {
        const response = await fetch(`${API_BASE_URL}/handbook/delete?year=${year}&month=${month}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to delete handbook');
        }
        
        return data;
    } catch (error) {
        console.error('Error deleting handbook:', error);
        throw error;
    }
};

// Upload handbook file
export const uploadHandbook = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/handbook/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to upload handbook');
        }
        
        return data;
    } catch (error) {
        console.error('Error uploading handbook:', error);
        throw error;
    }
};