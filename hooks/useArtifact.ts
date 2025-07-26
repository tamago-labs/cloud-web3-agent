import { useState, useEffect } from 'react';
import { artifactAPI } from '@/lib/api'; 
import { getCurrentUser } from 'aws-amplify/auth';

interface UseArtifactReturn {
  artifact: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useArtifact = (artifactId: string): UseArtifactReturn => {
  const [artifact, setArtifact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtifact = async () => {
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

      const data = await artifactAPI.getArtifact(isLoggedIn, artifactId);
      setArtifact(data);
    } catch (err) {
      console.error('Error fetching artifact:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch artifact');
      setArtifact(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artifactId) {
      fetchArtifact();
    }
  }, [artifactId]);

  const refetch = () => {
    fetchArtifact();
  };

  return {
    artifact,
    loading,
    error,
    refetch
  };
};