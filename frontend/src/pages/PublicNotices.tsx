import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NoticeCard from '../components/NoticeCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotices } from '../hooks/useNotices';
import { FilterOptions } from '../types';

const PublicNotices: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    audience: 'All',
    search: '',
    page: 1,
    limit: 12,
  });

  const { notices, loading, error, pagination, fetchNotices } = useNotices(filters);

  useEffect(() => {
    fetchNotices(filters);
  }, [filters, fetchNotices]);

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleAudienceFilter = (audience: string) => {
    setFilters({ ...filters, audience, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">
            Failed to load notices
          </div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => fetchNotices(filters)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Notices
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay informed with the latest announcements and updates
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onSearch={handleSearch}
          onAudienceFilter={handleAudienceFilter}
          searchQuery={filters.search || ''}
          selectedAudience={filters.audience || 'All'}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* No Results */}
        {!loading && notices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              {filters.search || filters.audience !== 'All'
                ? 'No notices match your filters'
                : 'No notices available at the moment'}
            </div>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Check back later for new announcements
            </p>
          </div>
        )}

        {/* Notices Grid */}
        {!loading && notices.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice._id}
                  notice={notice}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={filters.limit || 12}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Admin Login Link */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Are you an administrator?{' '}
            <a
              href="/admin/login"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PublicNotices;
