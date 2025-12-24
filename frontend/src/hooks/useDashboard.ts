import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/api/dashboard';
import type { DashboardResponse, StatsResponse } from '../types/dashboard.types';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch complete dashboard data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);
      setStats(data.stats);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch only statistics
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dashboardService.getStats();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Clear data
  const clearData = useCallback(() => {
    setDashboardData(null);
    setStats(null);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    stats,
    loading,
    error,
    lastUpdated,
    fetchDashboard,
    fetchStats,
    refresh,
    clearData,
    clearError,
  };
};