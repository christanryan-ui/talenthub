'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Plus, Trash2, DollarSign, Gift, Users, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function AdminCreditsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreditsIssued: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/credits/settings');
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load credit settings');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, transactionsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/credits/admin/transactions?page=1&limit=1')
      ]);
      
      setStats({
        totalUsers: usersRes.data.total || 0,
        totalCreditsIssued: transactionsRes.data.total || 0,
        totalTransactions: transactionsRes.data.total || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/credits/settings', settings);
      toast.success('Credit settings updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Credit Management</h1>
          <p className="text-gray-400 mt-2">Configure platform credit costs, bonuses, and earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-xl">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalTransactions}</p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Credits Issued</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalCreditsIssued}</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-xl">
                <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Credit Costs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-blue-400" />
            Credit Costs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Reveal Cost
              </label>
              <input
                type="number"
                value={settings?.contact_reveal_cost || 0}
                onChange={(e) => updateSetting('contact_reveal_cost', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10000"
              />
              <p className="text-xs text-gray-400 mt-1">Credits required to reveal job seeker contact</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interview Request Cost
              </label>
              <input
                type="number"
                value={settings?.interview_request_cost || 0}
                onChange={(e) => updateSetting('interview_request_cost', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000"
              />
              <p className="text-xs text-gray-400 mt-1">Credits required to request an interview</p>
            </div>
          </div>
        </div>

        {/* Credit Earnings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Credit Earnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interview Completion Earnings
              </label>
              <input
                type="number"
                value={settings?.interview_completion_earnings || 0}
                onChange={(e) => updateSetting('interview_completion_earnings', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="500"
              />
              <p className="text-xs text-gray-400 mt-1">Credits earned by interviewer per completed interview</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Referral Bonus
              </label>
              <input
                type="number"
                value={settings?.referral_bonus || 0}
                onChange={(e) => updateSetting('referral_bonus', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="50"
              />
              <p className="text-xs text-gray-400 mt-1">Bonus credits for successful referrals</p>
            </div>
          </div>
        </div>

        {/* Signup Bonuses */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Gift className="h-6 w-6 text-purple-400" />
            Signup Bonuses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Seeker Bonus
              </label>
              <input
                type="number"
                value={settings?.jobseeker_signup_bonus || 0}
                onChange={(e) => updateSetting('jobseeker_signup_bonus', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Employer Bonus
              </label>
              <input
                type="number"
                value={settings?.employer_signup_bonus || 0}
                onChange={(e) => updateSetting('employer_signup_bonus', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interviewer Bonus
              </label>
              <input
                type="number"
                value={settings?.interviewer_signup_bonus || 0}
                onChange={(e) => updateSetting('interviewer_signup_bonus', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
