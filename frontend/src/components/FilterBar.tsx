import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { AUDIENCE_OPTIONS } from '../types';
import { debounce } from '../utils/helpers';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onAudienceFilter: (audience: string) => void;
  searchQuery: string;
  selectedAudience: string;
  showExpiredToggle?: boolean;
  includeExpired?: boolean;
  onExpiredToggle?: (include: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onAudienceFilter,
  searchQuery,
  selectedAudience,
  showExpiredToggle = false,
  includeExpired = false,
  onExpiredToggle,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const debouncedSearch = debounce((query: string) => {
    onSearch(query);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setLocalSearch('');
    onSearch('');
  };

  const clearFilters = () => {
    setLocalSearch('');
    onSearch('');
    onAudienceFilter('All');
    if (onExpiredToggle) onExpiredToggle(false);
  };

  const hasActiveFilters = searchQuery || selectedAudience !== 'All' || includeExpired;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notices by title, description, or tags..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={localSearch}
            onChange={handleSearchChange}
          />
          {localSearch && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Toggle and Clear Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            {/* Audience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience
              </label>
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_OPTIONS.map((audience) => (
                  <button
                    key={audience}
                    onClick={() => onAudienceFilter(audience)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedAudience === audience
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {audience}
                  </button>
                ))}
              </div>
            </div>

            {/* Expired Toggle */}
            {showExpiredToggle && onExpiredToggle && (
              <div className="flex items-center">
                <input
                  id="include-expired"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={includeExpired}
                  onChange={(e) => onExpiredToggle(e.target.checked)}
                />
                <label htmlFor="include-expired" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Include expired notices
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
