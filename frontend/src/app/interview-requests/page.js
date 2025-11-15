'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  Award,
  CheckCircle,
  XCircle,
  Star,
  Coins,
  MessageSquare,
  Eye,
  Filter
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function InterviewRequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('available'); // available, assigned, completed
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [activeTab, user]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      
      if (response.data.role !== 'interviewer') {
        toast.error('Only interviewers can access this page');
        router.push('/dashboard');
        return;
      }

      const creditsRes = await api.get('/credits/balance');
      setCredits(creditsRes.data.total_credits);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'available') {
        endpoint = '/interviews/requests/available';
      } else {
        endpoint = '/interviews/my-interviews';
      }

      const response = await api.get(endpoint);
      let fetchedRequests = response.data.requests || [];

      // Filter based on tab
      if (activeTab === 'assigned') {
        fetchedRequests = fetchedRequests.filter(r => r.status === 'ASSIGNED');
      } else if (activeTab === 'completed') {
        fetchedRequests = fetchedRequests.filter(r => r.status === 'COMPLETED');
      }

      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/interviews/requests/${requestId}/accept`);
      toast.success('Interview request accepted!');
      fetchRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast.error(error.response?.data?.detail || 'Failed to accept request');
    }
  };

  const openRatingModal = (request) => {
    setSelectedRequest(request);
    setShowRatingModal(true);
    // Initialize ratings for each skill
    const initialRatings = {};
    request.skills_to_verify?.forEach(skill => {
      initialRatings[skill] = 3.0;
    });
    setRatings(initialRatings);
  };

  const submitRating = async () => {
    try {
      const skillRatings = Object.entries(ratings).map(([skill, rating]) => ({
        skill,
        rating: parseFloat(rating)
      }));

      await api.post('/interviews/ratings', {
        interview_request_id: selectedRequest.request_id,
        skill_ratings: skillRatings,
        feedback: feedback || undefined
      });

      toast.success('Rating submitted successfully! You earned 500 credits.');
      setShowRatingModal(false);
      setSelectedRequest(null);
      setRatings({});
      setFeedback('');
      fetchRequests();
      
      // Refresh credits
      const creditsRes = await api.get('/credits/balance');
      setCredits(creditsRes.data.total_credits);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit rating');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'yellow', text: 'Pending' },
      ASSIGNED: { color: 'blue', text: 'Assigned' },
      COMPLETED: { color: 'green', text: 'Completed' },
      CANCELLED: { color: 'red', text: 'Cancelled' }
    };
    const badge = badges[status] || badges.PENDING;
    
    return (
      <span className={`px-3 py-1 bg-${badge.color}-500/20 text-${badge.color}-400 border border-${badge.color}-500/30 rounded-lg text-sm font-medium`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Interview Requests</h1>
              <p className="text-gray-400 text-sm mt-1">Manage and complete interview verifications</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Coins className="h-5 w-5 text-white" />
                <span className="font-bold text-white">{credits}</span>
              </div>
              <button
                onClick={() => router.push('/interviewer/dashboard')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Available Requests
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'assigned'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Interviews
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No requests found</h3>
            <p className="text-gray-400">
              {activeTab === 'available' && 'No available interview requests at the moment'}
              {activeTab === 'assigned' && 'You have no assigned interviews'}
              {activeTab === 'completed' && 'You have not completed any interviews yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <div
                key={request.request_id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                      {request.jobseeker_name?.[0] || 'J'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{request.jobseeker_name || 'Job Seeker'}</h3>
                      <p className="text-gray-400 text-sm">{request.jobseeker_position || 'Professional'}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                  {request.scheduled_at && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-sm">Scheduled: {new Date(request.scheduled_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Skills to Verify */}
                {request.skills_to_verify && request.skills_to_verify.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Skills to verify:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.skills_to_verify.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  {activeTab === 'available' && request.status === 'PENDING' && (
                    <button
                      onClick={() => acceptRequest(request.request_id)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Accept Interview
                    </button>
                  )}

                  {activeTab === 'assigned' && request.status === 'ASSIGNED' && (
                    <button
                      onClick={() => openRatingModal(request)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Star className="h-5 w-5" />
                      Submit Rating
                    </button>
                  )}

                  {activeTab === 'completed' && request.overall_rating && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-medium">Rating: {request.overall_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Interview Rating</h2>
            <p className="text-gray-400 mb-6">Rate the candidate's skills (0.5 - 5.0 scale)</p>

            <div className="space-y-6 mb-6">
              {selectedRequest.skills_to_verify?.map((skill) => (
                <div key={skill}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{skill}</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.5"
                      value={ratings[skill] || 3.0}
                      onChange={(e) => setRatings(prev => ({ ...prev, [skill]: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-white font-bold w-12 text-center">{(ratings[skill] || 3.0).toFixed(1)}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(ratings[skill] || 3.0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Feedback (Optional)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Provide detailed feedback about the candidate's performance..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedRequest(null);
                  setRatings({});
                  setFeedback('');
                }}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Submit Rating & Earn 500 Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
