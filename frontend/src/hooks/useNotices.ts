import { useState, useEffect, useCallback } from 'react';
import { Notice, NoticesResponse, FilterOptions, DashboardStats } from '../types';
import api from '../utils/api';

export const useNotices = (initialFilters: FilterOptions = {}) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  const fetchNotices = useCallback(async (filters: FilterOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.audience) params.append('audience', filters.audience);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.includeExpired !== undefined) params.append('includeExpired', filters.includeExpired.toString());

      const response = await api.get<NoticesResponse>(`/notices?${params.toString()}`);
      
      console.log('Public notices response:', response.data);
      setNotices(response.data.notices);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotice = async (formData: FormData): Promise<Notice> => {
    const response = await api.post<{ success: boolean; notice: Notice }>('/notices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.notice;
  };

  const updateNotice = async (id: string, formData: FormData): Promise<Notice> => {
    const response = await api.put<{ success: boolean; notice: Notice }>(`/notices/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.notice;
  };

  const deleteNotice = async (id: string): Promise<void> => {
    await api.delete(`/notices/${id}`);
  };

  const refreshNotices = () => {
    fetchNotices(initialFilters);
  };

  useEffect(() => {
    fetchNotices(initialFilters);
  }, [fetchNotices, initialFilters]);

  return {
    notices,
    loading,
    error,
    pagination,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    refreshNotices,
  };
};

export const useAdminNotices = (initialFilters: FilterOptions = {}) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  const fetchAdminNotices = useCallback(async (filters: FilterOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.audience) params.append('audience', filters.audience);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.includeExpired !== undefined) params.append('includeExpired', filters.includeExpired.toString());

      const response = await api.get<NoticesResponse>(`/notices/admin?${params.toString()}`);
      
      console.log('Admin notices response:', response.data);
      setNotices(response.data.notices);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNotice = async (id: string): Promise<void> => {
    await api.delete(`/notices/${id}`);
  };

  useEffect(() => {
    fetchAdminNotices(initialFilters);
  }, [fetchAdminNotices, initialFilters]);

  return {
    notices,
    loading,
    error,
    pagination,
    fetchAdminNotices,
    deleteNotice,
    refreshNotices: () => fetchAdminNotices(initialFilters),
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ success: boolean; stats: DashboardStats }>('/notices/stats/overview');
      setStats(response.data.stats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};
