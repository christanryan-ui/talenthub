'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Award,
  Mail,
  Phone,
  Building,
  Star,
  Coins,
  Lock,
  Unlock,
  Filter,
  X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function SearchTalentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [revealedContacts, setRevealedContacts] = useState({});
  const [credits, setCredits] = useState(0);
  const [contactRevealCost, setContactRevealCost] = useState(10000);

  const [filters, setFilters] = useState({
    query: '',
    location: '',
    experience_min: '',
    experience_max: '',
    skills: '',
    verified_only: false,
    sort_by: 'relevance'
  });

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  useEffect(() => {
    searchTalents();
  }, [filters.verified_only, filters.sort_by]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      
      if (response.data.role !== 'employer') {
        toast.error('Only employers can access talent search');
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

  const fetchSettings = async () => {
    try {
      const response = await api.get('/credits/settings');
      setContactRevealCost(response.data.contact_reveal_cost || 10000);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const searchTalents = async () => {
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.location) params.append('location', filters.location);
      if (filters.experience_min) params.append('experience_min', filters.experience_min);
      if (filters.experience_max) params.append('experience_max', filters.experience_max);
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.verified_only) params.append('verified_only', 'true');
      params.append('sort_by', filters.sort_by);

      const response = await api.get(`/profiles/jobseeker/search?${params.toString()}`);
      setTalents(response.data.profiles || []);
      
      // Check which contacts are already revealed
      const accessResponse = await api.get('/contacts/my-access');
      const revealed = {};
      accessResponse.data.access_list?.forEach(access => {
        revealed[access.jobseeker_id] = true;
      });
      setRevealedContacts(revealed);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to search talents:', error);
      setTalents([]);
      setLoading(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTalents();
  };

  const revealContact = async (jobseekerId) => {
    if (credits < contactRevealCost) {
      toast.error(`Insufficient credits. You need ${contactRevealCost} credits to reveal contact.`);
      return;
    }

    try {
      const response = await api.post('/contacts/reveal', {
        jobseeker_id: jobseekerId
      });

      toast.success('Contact revealed successfully! Access valid for 1 year.');
      setRevealedContacts(prev => ({ ...prev, [jobseekerId]: true }));
      setCredits(prev => prev - contactRevealCost);
      
      // Refresh the talent list to show revealed info
      searchTalents();
    } catch (error) {
      console.error('Failed to reveal contact:', error);
      toast.error(error.response?.data?.detail || 'Failed to reveal contact');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Search Talent</h1>
              <p className="text-gray-400 text-sm mt-1">Find verified professionals for your team</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Coins className="h-5 w-5 text-white" />
                <span className="font-bold text-white">{credits}</span>
              </div>
              <button
                onClick={() => router.push('/employer/dashboard')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, skills, title..."
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                </button>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Experience (years)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.experience_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience_min: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Experience (years)</label>
                    <input
                      type="number"
                      placeholder="20"
                      value={filters.experience_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience_max: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                    <select
                      value={filters.sort_by}
                      onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="experience">Experience</option>
                      <option value="recent">Recently Updated</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verified_only}
                        onChange={(e) => setFilters(prev => ({ ...prev, verified_only: e.target.checked }))}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-green-500 focus:ring-green-500"
                      />
                      <span>Verified Only</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : talents.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No talents found</h3>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {talents.map((talent) => (
              <div
                key={talent.user_id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {talent.first_name?.[0]}{talent.last_name?.[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {talent.first_name} {talent.last_name}
                        </h3>
                        {talent.verification_status === 'verified' && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg">
                            <Award className="h-4 w-4 text-blue-400" />
                            <span className="text-xs text-blue-400 font-medium">Verified</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 mb-3">{talent.current_position || 'Professional'}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        {talent.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {talent.location}
                          </div>
                        )}
                        {talent.experience_years && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {talent.experience_years} years exp
                          </div>
                        )}
                        {talent.current_company && (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {talent.current_company}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {talent.primary_skills && talent.primary_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {talent.primary_skills.slice(0, 6).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {talent.primary_skills.length > 6 && (
                            <span className="px-3 py-1 text-sm text-gray-400">
                              +{talent.primary_skills.length - 6} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Contact Info */}
                      {revealedContacts[talent.user_id] ? (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-4">
                          <div className="flex items-center gap-2 text-green-400 mb-3">
                            <Unlock className="h-5 w-5" />
                            <span className="font-medium">Contact Revealed</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-white">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {talent.email || 'Not available'}
                            </div>
                            <div className="flex items-center gap-2 text-white">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {talent.phone || 'Not available'}
                            </div>
                            {talent.current_company && (
                              <div className="flex items-center gap-2 text-white">
                                <Building className="h-4 w-4 text-gray-400" />
                                {talent.current_company}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Lock className="h-5 w-5" />
                              <span className="text-sm">Contact information hidden</span>
                            </div>
                            <button
                              onClick={() => revealContact(talent.user_id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
                            >
                              <Coins className="h-4 w-4" />
                              Reveal ({contactRevealCost} credits)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
