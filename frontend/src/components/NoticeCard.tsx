import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notice } from '../types';
import { formatDate, formatRelativeTime, isExpired, truncateText } from '../utils/helpers';
import { Calendar, User, Tag, AlertCircle, Clock, Eye, Maximize2 } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

interface NoticeCardProps {
  notice: Notice;
  showActions?: boolean;
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
  }
};

const getAudienceColor = (audience: string) => {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  ];
  
  // Simple hash function to get consistent colors
  const hash = audience.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

const NoticeCard: React.FC<NoticeCardProps> = ({ 
  notice, 
  showActions = false, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const expired = isExpired(notice.expiryDate);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    navigate(`/notice/${notice._id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer transform hover:scale-[1.02] ${expired ? 'opacity-60' : ''}`}
      onClick={handleCardClick}
    >
      {/* Image Carousel */}
      <div className="h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-700">
        {(notice.images && notice.images.length > 0) || notice.image ? (
          <ImageCarousel
            images={notice.images && notice.images.length > 0 ? notice.images : notice.image ? [notice.image] : []}
            title={notice.title}
            className="h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          
        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="text-white text-center">
            <Eye className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm font-medium">View Details</span>
          </div>
        </div>
        
        {/* Quick Expand Button */}
        {((notice.images && notice.images.length > 0) || notice.image) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Trigger fullscreen on the carousel
              const carousel = e.currentTarget.closest('.h-48')?.querySelector('img') as HTMLImageElement;
              if (carousel) {
                carousel.click();
              }
            }}
            className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 action-button"
            aria-label="Expand image"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Header with Priority and Expiry Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
              <AlertCircle className="w-3 h-3 mr-1" />
              {notice.priority}
            </span>
            {expired && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                <Clock className="w-3 h-3 mr-1" />
                Expired
              </span>
            )}
          </div>
          
          {showActions && onEdit && onDelete && (
            <div className="flex space-x-2 action-button">
              <button
                onClick={(e) => handleActionClick(e, () => onEdit(notice))}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={(e) => handleActionClick(e, () => onDelete(notice))}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {notice.title}
        </h3>

        {/* Description Preview */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {truncateText(notice.description, 150)}
        </p>

        {/* Tags */}
        {notice.tags && notice.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {notice.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {notice.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{notice.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAudienceColor(notice.targetAudience)}`}>
              {notice.targetAudience}
            </span>
            <span className="inline-flex items-center">
              <User className="w-4 h-4 mr-1" />
              {notice.createdBy?.name || 'Admin'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center" title={`Expires: ${formatDate(notice.expiryDate)}`}>
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(notice.expiryDate)}
            </span>
            <span title={formatDate(notice.createdAt)}>
              {formatRelativeTime(notice.createdAt)}
            </span>
          </div>
        </div>

        {/* Read More Indicator */}
        {!showActions && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              Click to view full details
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeCard;
