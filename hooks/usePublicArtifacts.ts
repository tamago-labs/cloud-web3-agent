import { useState, useEffect } from 'react';
import { artifactAPI } from '@/lib/api';
import { getCurrentUser } from 'aws-amplify/auth';

interface ArtifactFilters {
  searchQuery?: string;
  category?: string;
  blockchainNetwork?: string[];
  dataFreshness?: string;
  chartType?: string;
  qualityFilter?: string;
  sortBy?: 'popular' | 'recent' | 'liked';
  limit?: number;
  isPublic?: boolean;
}

interface UsePublicArtifactsReturn {
  artifacts: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePublicArtifacts = (filters: ArtifactFilters = {}): UsePublicArtifactsReturn => {
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtifacts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      let isLoggedIn = false;
      try {
        await getCurrentUser();
        isLoggedIn = true;
      } catch {
        isLoggedIn = false;
      }

      const data = await artifactAPI.getPublicArtifacts(isLoggedIn, {
        category: filters.category,
        searchQuery: filters.searchQuery,
        sortBy: filters.sortBy || 'recent',
        limit: filters.limit || 50,
        blockchainNetwork: filters.blockchainNetwork,
        dataFreshness: filters.dataFreshness,
        chartType: filters.chartType,
        qualityFilter: filters.qualityFilter
      });

      setArtifacts(data || []);
    } catch (err) {
      console.error('Error fetching artifacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch artifacts');
      setArtifacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, [
    filters.searchQuery, 
    filters.category, 
    filters.blockchainNetwork, 
    filters.dataFreshness,
    filters.chartType,
    filters.qualityFilter,
    filters.sortBy, 
    filters.limit
  ]);

  const refetch = () => {
    fetchArtifacts();
  };

  return {
    artifacts,
    loading,
    error,
    refetch
  };
};