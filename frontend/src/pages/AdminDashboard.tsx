import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboardStats } from '../hooks/useNotices';
import { Plus, BarChart3, Users, Calendar, LogOut } from 'lucide-react';
import AdminNoticeList from '../components/AdminNoticeList';
import NoticeForm from '../components/NoticeForm';
import { useTheme } from '../context/ThemeContext';

type TabType = 'overview' | 'notices' | 'create';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingNotice, setEditingNotice] = useState(null);
  
  const { state, logout } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { isDark, toggleTheme } = useTheme();

  const handleCreateNotice = () => {
    setEditingNotice(null);
    setActiveTab('create');
  };

  const handleEditNotice = (notice: any) => {
    setEditingNotice(notice);
    setActiveTab('create');
  };

  const handleNoticeSubmitted = () => {
    setEditingNotice(null);
    setActiveTab('notices');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'notices', name: 'Manage Notices', icon: Calendar },
    { id: 'create', name: 'Create Notice', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {state.admin?.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              
              <a
                href="/"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                View Public Site
              </a>
              
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Notices</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Notices</div>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Expired Notices</div>
                  <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.byAudience.reduce((sum, item) => sum + item.count, 0)}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleCreateNotice}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Notice
                </button>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Notices
                </button>
              </div>
            </div>

            {/* Audience Distribution */}
            {stats && stats.byAudience.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notices by Audience</h3>
                <div className="space-y-3">
                  {stats.byAudience.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item._id}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-4">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${Math.max((item.count / stats.total) * 100, 5)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900 dark:text-white ml-4">
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notices' && (
          <AdminNoticeList
            onEdit={handleEditNotice}
            onCreateNew={handleCreateNotice}
          />
        )}

        {activeTab === 'create' && (
          <NoticeForm
            notice={editingNotice}
            onSubmit={handleNoticeSubmitted}
            onCancel={() => setActiveTab('notices')}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
