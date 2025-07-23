import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageCarousel from '../components/ImageCarousel';
import { Notice } from '../types';
import { formatDate, formatRelativeTime, isExpired } from '../utils/helpers';
import { Calendar, User, Tag, AlertCircle, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import api from '../utils/api';

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchNotice();
    checkBookmarkStatus();
  }, [id]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notices/${id}`);
      setNotice(response.data.notice);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notice');
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_notices') || '[]');
    setIsBookmarked(bookmarks.includes(id));
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_notices') || '[]');
    let updatedBookmarks;
    
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== id);
    } else {
      updatedBookmarks = [...bookmarks, id];
    }
    
    localStorage.setItem('bookmarked_notices', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const shareNotice = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: notice?.title,
          text: notice?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
    
    const hash = audience.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !notice) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-medium mb-2">
            {error || 'Notice not found'}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notices
          </button>
        </div>
      </Layout>
    );
  }

  const expired = isExpired(notice.expiryDate);

  return (
    <Layout title="Notice Details" subtitle="View complete notice information">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notices
        </button>

        {/* Main Notice Card */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${expired ? 'opacity-75' : ''}`}>
          {/* Header with Image Carousel */}
          <div className="relative h-64 md:h-80 overflow-hidden bg-gray-200 dark:bg-gray-700">
            {(notice.images && notice.images.length > 0) || notice.image ? (
              <ImageCarousel
                images={notice.images && notice.images.length > 0 ? notice.images : notice.image ? [notice.image] : []}
                title={notice.title}
                className="h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg">
                    {imageError ? 'Image could not be loaded' : 'No Image Available'}
                  </span>
                  {(notice.images?.[0] || notice.image) && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Image path: {notice.images?.[0] || notice.image}</p>
                      <a 
                        href={`http://localhost:5000${notice.images?.[0] || notice.image}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        Try opening image directly
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>
              
              {/* Actions Overlay */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isBookmarked 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
                >
                  <Bookmark className="h-5 w-5" />
                </button>
                <button
                  onClick={shareNotice}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                  title="Share notice"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

          <div className="p-8">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(notice.priority)}`}>
                <AlertCircle className="w-4 h-4 mr-1" />
                {notice.priority} Priority
              </span>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAudienceColor(notice.targetAudience)}`}>
                {notice.targetAudience}
              </span>
              
              {expired && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                  <Clock className="w-4 h-4 mr-1" />
                  Expired
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {notice.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>By {notice.createdBy?.name || 'Admin'}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Published {formatRelativeTime(notice.createdAt)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Expires {formatDate(notice.expiryDate)}</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {notice.description}
              </div>
            </div>

            {/* Tags */}
            {notice.tags && notice.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {notice.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated {formatRelativeTime(notice.updatedAt)}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={toggleBookmark}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isBookmarked
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                
                <button
                  onClick={shareNotice}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery - Show all images if multiple */}
        {notice.images && notice.images.length > 1 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Image Gallery ({notice.images.length} images)
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {notice.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image}`}
                      alt={`${notice.title} - Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        console.log('Gallery image load error for:', image);
                        // Try direct URL
                        const directUrl = `http://localhost:5000${image}`;
                        (e.target as HTMLImageElement).src = directUrl;
                        // If still fails, hide the image
                        setTimeout(() => {
                          if ((e.target as HTMLImageElement).complete && (e.target as HTMLImageElement).naturalHeight === 0) {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }
                        }, 2000);
                      }}
                      onClick={() => {
                        // Open image in new tab
                        window.open(`http://localhost:5000${image}`, '_blank');
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Information */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notice Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Notice ID:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">{notice._id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className={`ml-2 ${expired ? 'text-red-600' : 'text-green-600'}`}>
                {expired ? 'Expired' : 'Active'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{formatDate(notice.createdAt)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Last Modified:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{formatDate(notice.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NoticeDetail;
