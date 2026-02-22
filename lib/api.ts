const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch categories: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchCategories):", error);
        throw error;
    }
}

export async function fetchMedicines(params?: { category?: string; search?: string }) {
    try {
        const url = new URL(`${API_URL}/medicines`);
        if (params?.category) url.searchParams.append('category', params.category);
        if (params?.search) url.searchParams.append('search', params.search);

        const res = await fetch(url.toString());
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch medicines: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchMedicines):", error);
        throw error;
    }
}

export async function createMedicine(medicineData: any) {
    try {
        const res = await fetch(`${API_URL}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicineData),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to create medicine: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (createMedicine):", error);
        throw error;
    }
}

export async function updateMedicine(medicineId: string | number, medicineData: any) {
    try {
        const res = await fetch(`${API_URL}/medicines/${medicineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicineData),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to update medicine: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (updateMedicine):", error);
        throw error;
    }
}

export async function deleteMedicine(medicineId: string | number) {
    try {
        const res = await fetch(`${API_URL}/medicines/${medicineId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to delete medicine: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (deleteMedicine):", error);
        throw error;
    }
}

export async function createOrder(orderData: any) {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Order placement failed');
    }
    return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Status update failed');
    }
    return res.json();
}


export async function fetchAllOrders() {
    try {
        const res = await fetch(`${API_URL}/orders`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch orders: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchAllOrders):", error);
        throw error;
    }
}

export async function fetchUserOrders(userId: string) {
    try {
        const res = await fetch(`${API_URL}/orders/user/${userId}`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch user orders: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchUserOrders):", error);
        throw error;
    }
}

export async function fetchCustomers() {
    try {
        const res = await fetch(`${API_URL}/customers`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch customers: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchCustomers):", error);
        throw error;
    }
}

export async function fetchDashboardStats() {
    try {
        const res = await fetch(`${API_URL}/analytics/dashboard-stats`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch stats: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchDashboardStats):", error);
        throw error;
    }
}

export async function fetchRecentActivity() {
    try {
        const res = await fetch(`${API_URL}/analytics/recent-activity`);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || `Failed to fetch activity: ${res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("API Error (fetchRecentActivity):", error);
        throw error;
    }
}

