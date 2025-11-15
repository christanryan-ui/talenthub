'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Building, Loader2, CheckCircle, X, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function PostJobPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    job_title: '',
    job_type: 'full-time',
    location: '',
    work_mode: 'onsite',
    description: '',
    responsibilities: [],
    requirements: [],
    required_skills: [],
    preferred_skills: [],
    min_experience: 0,
    max_experience: '',
    min_salary: '',
    max_salary: '',
    number_of_openings: 1,
    status: 'active',
  });

  const [newResponsibility, setNewResponsibility] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newRequiredSkill, setNewRequiredSkill] = useState('');
  const [newPreferredSkill, setNewPreferredSkill] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.role !== 'employer') {
          router.push('/dashboard');
          return;
        }
        setUser(response.data);
      } catch (err) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/jobs/jobs', formData);
      setMessage({ type: 'success', text: 'Job posted successfully!' });
      setTimeout(() => {
        router.push('/employer/dashboard');
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to post job' });
    } finally {
      setSaving(false);
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData({ ...formData, responsibilities: [...formData.responsibilities, newResponsibility.trim()] });
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index) => {
    setFormData({ ...formData, responsibilities: formData.responsibilities.filter((_, i) => i !== index) });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement.trim()] });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setFormData({ ...formData, requirements: formData.requirements.filter((_, i) => i !== index) });
  };

  const addRequiredSkill = () => {
    if (newRequiredSkill.trim() && !formData.required_skills.includes(newRequiredSkill.trim())) {
      setFormData({ ...formData, required_skills: [...formData.required_skills, newRequiredSkill.trim()] });
      setNewRequiredSkill('');
    }
  };

  const removeRequiredSkill = (skill) => {
    setFormData({ ...formData, required_skills: formData.required_skills.filter(s => s !== skill) });
  };

  const addPreferredSkill = () => {
    if (newPreferredSkill.trim() && !formData.preferred_skills.includes(newPreferredSkill.trim())) {
      setFormData({ ...formData, preferred_skills: [...formData.preferred_skills, newPreferredSkill.trim()] });
      setNewPreferredSkill('');
    }
  };

  const removePreferredSkill = (skill) => {
    setFormData({ ...formData, preferred_skills: formData.preferred_skills.filter(s => s !== skill) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/employer/dashboard" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">TalentHub</span>
          </Link>
          <Link href="/employer/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Job</h1>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                <select
                  required
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode *</label>
                <select
                  required
                  value={formData.work_mode}
                  onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Number of Openings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Openings *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.number_of_openings}
                  onChange={(e) => setFormData({ ...formData, number_of_openings: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Mumbai, India"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe the role, company culture, and what makes this opportunity great..."
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add responsibility"
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">• {resp}</span>
                    <button type="button" onClick={() => removeResponsibility(index)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add requirement"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">• {req}</span>
                    <button type="button" onClick={() => removeRequirement(index)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newRequiredSkill}
                    onChange={(e) => setNewRequiredSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredSkill())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., React"
                  />
                  <button
                    type="button"
                    onClick={addRequiredSkill}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill, index) => (
                    <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      <span>{skill}</span>
                      <button type="button" onClick={() => removeRequiredSkill(skill)} className="hover:text-purple-900">
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Skills</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPreferredSkill}
                    onChange={(e) => setNewPreferredSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., AWS"
                  />
                  <button
                    type="button"
                    onClick={addPreferredSkill}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.preferred_skills.map((skill, index) => (
                    <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      <span>{skill}</span>
                      <button type="button" onClick={() => removePreferredSkill(skill)} className="hover:text-gray-900">
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience & Salary */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required (Years)</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.min_experience}
                    onChange={(e) => setFormData({ ...formData, min_experience: parseFloat(e.target.value) })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.max_experience}
                    onChange={(e) => setFormData({ ...formData, max_experience: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (₹/year)</label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={formData.min_salary}
                    onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={formData.max_salary}
                    onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Posting Job...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Post Job</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/employer/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
