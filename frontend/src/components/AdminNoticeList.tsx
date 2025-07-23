import React, { useState } from 'react';
import { useAdminNotices } from '../hooks/useNotices';
import { FilterOptions, Notice } from '../types';
import NoticeCard from './NoticeCard';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import { Plus } from 'lucide-react';

interface AdminNoticeListProps {
  onEdit: (notice: Notice) => void;
  onCreateNew: () => void;
}

const AdminNoticeList: React.FC<AdminNoticeListProps> = ({ onEdit, onCreateNew }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    audience: 'All',
    search: '',
    page: 1,
    limit: 12,
    includeExpired: false,
  });

  const { 
    notices, 
    loading, 
    error, 
    pagination, 
    fetchAdminNotices, 
    deleteNotice,
    refreshNotices 
  } = useAdminNotices(filters);

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleAudienceFilter = (audience: string) => {
    setFilters({ ...filters, audience, page: 1 });
  };

  const handleExpiredToggle = (includeExpired: boolean) => {
    setFilters({ ...filters, includeExpired, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = async (notice: Notice) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteNotice(notice._id);
        refreshNotices();
      } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('Failed to delete notice. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium mb-2">
          Failed to load notices
        </div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => fetchAdminNotices(filters)}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Notices
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create, edit, and manage all college notices
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onSearch={handleSearch}
        onAudienceFilter={handleAudienceFilter}
        searchQuery={filters.search || ''}
        selectedAudience={filters.audience || 'All'}
        showExpiredToggle={true}
        includeExpired={filters.includeExpired}
        onExpiredToggle={handleExpiredToggle}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* No Results */}
      {!loading && notices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {filters.search || filters.audience !== 'All'
              ? 'No notices match your filters'
              : 'No notices created yet'}
          </div>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            {filters.search || filters.audience !== 'All'
              ? 'Try adjusting your filters'
              : 'Create your first notice to get started'}
          </p>
          {(!filters.search && filters.audience === 'All') && (
            <button
              onClick={onCreateNew}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Notice
            </button>
          )}
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
                showActions={true}
                onEdit={onEdit}
                onDelete={handleDelete}
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
    </div>
  );
};

export default AdminNoticeList;
