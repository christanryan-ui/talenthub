'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Briefcase, Mail, MapPin, Phone, Upload, Loader2, CheckCircle, Plus, X, Save, Trash2, GraduationCap, Award } from 'lucide-react';
import Link from 'next/link';

export default function JobSeekerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    headline: '',
    about: '',
    location: '',
    total_experience_years: 0,
    expected_salary: '',
    notice_period_days: 30,
  });

  // Skills state
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    years_of_experience: 0,
    is_primary: true,
    weightage: 50,
  });

  // Experience state
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  // Education state
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    start_year: new Date().getFullYear() - 4,
    end_year: new Date().getFullYear(),
    grade: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      
      if (userResponse.data.role !== 'jobseeker') {
        router.push('/dashboard');
        return;
      }

      try {
        const profileResponse = await api.get('/profiles/jobseeker/profile');
        setProfile(profileResponse.data);
        setFormData({
          full_name: profileResponse.data.full_name || '',
          headline: profileResponse.data.headline || '',
          about: profileResponse.data.about || '',
          location: profileResponse.data.location || '',
          total_experience_years: profileResponse.data.total_experience_years || 0,
          expected_salary: profileResponse.data.expected_salary || '',
          notice_period_days: profileResponse.data.notice_period_days || 30,
        });
        setSkills(profileResponse.data.skills || []);
        setExperiences(profileResponse.data.experience || []);
        setEducation(profileResponse.data.education || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setIsEditing(true);
        }
      }
    } catch (err) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const profilePayload = {
      ...formData,
      skills: skills,
      experience: experiences,
      education: education,
    };

    try {
      if (profile) {
        await api.put('/profiles/jobseeker/profile', profilePayload);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        await api.post('/profiles/jobseeker/profile', profilePayload);
        setMessage({ type: 'success', text: 'Profile created successfully!' });
      }
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  // Skill management
  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill, rating: null }]);
      setNewSkill({ name: '', years_of_experience: 0, is_primary: true, weightage: 50 });
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Experience management
  const addExperience = () => {
    if (newExperience.company.trim() && newExperience.position.trim()) {
      setExperiences([...experiences, newExperience]);
      setNewExperience({
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
      });
    }
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Education management
  const addEducation = () => {
    if (newEducation.institution.trim() && newEducation.degree.trim()) {
      setEducation([...education, newEducation]);
      setNewEducation({
        institution: '',
        degree: '',
        field_of_study: '',
        start_year: new Date().getFullYear() - 4,
        end_year: new Date().getFullYear(),
        grade: '',
      });
    }
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setMessage({ type: 'error', text: 'Only PDF, DOC, and DOCX files are allowed' });
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 20MB' });
      return;
    }

    setUploadingResume(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/profiles/jobseeker/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({ type: 'success', text: 'Resume uploaded and converted successfully!' });
      fetchProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to upload resume' });
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TalentHub</span>
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Mumbai, India"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Headline</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Senior Software Engineer | Full Stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                  <textarea
                    disabled={!isEditing}
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Tell us about yourself, your skills, and experience..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Experience (Years)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      disabled={!isEditing}
                      value={formData.total_experience_years}
                      onChange={(e) => setFormData({ ...formData, total_experience_years: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary (₹/year)</label>
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={formData.expected_salary}
                      onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="1200000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period (Days)</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEditing}
                      value={formData.notice_period_days}
                      onChange={(e) => setFormData({ ...formData, notice_period_days: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-6 w-6 mr-2 text-blue-600" />
                Skills
              </h2>
              
              {isEditing && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid md:grid-cols-4 gap-4 mb-3">
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Skill name (e.g., React)"
                    />
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={newSkill.years_of_experience}
                      onChange={(e) => setNewSkill({ ...newSkill, years_of_experience: parseFloat(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Years of exp"
                    />
                    <select
                      value={newSkill.is_primary}
                      onChange={(e) => setNewSkill({ ...newSkill, is_primary: e.target.value === 'true' })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Primary</option>
                      <option value="false">Secondary</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newSkill.weightage}
                      onChange={(e) => setNewSkill({ ...newSkill, weightage: parseInt(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Weightage %"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Skill
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${skill.is_primary ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {skill.is_primary ? 'Primary' : 'Secondary'}
                        </span>
                        {skill.rating && (
                          <span className="text-sm text-green-600 font-medium">★ {skill.rating}/5</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {skill.years_of_experience} years • Weightage: {skill.weightage}%
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                Work Experience
              </h2>
              
              {isEditing && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Company name"
                    />
                    <input
                      type="text"
                      value={newExperience.position}
                      onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Position/Title"
                    />
                    <input
                      type="text"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Location"
                    />
                    <div className="flex gap-2">
                      <input
                        type="month"
                        value={newExperience.start_date}
                        onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Start date"
                      />
                      <input
                        type="month"
                        value={newExperience.end_date}
                        disabled={newExperience.is_current}
                        onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="End date"
                      />
                    </div>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newExperience.is_current}
                      onChange={(e) => setNewExperience({ ...newExperience, is_current: e.target.checked, end_date: e.target.checked ? '' : newExperience.end_date })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Currently working here</span>
                  </label>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Description (optional)"
                  />
                  <button
                    type="button"
                    onClick={addExperience}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Experience
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {experiences.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{exp.position}</h3>
                        <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || 'N/A'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No experience added yet</p>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                Education
              </h2>
              
              {isEditing && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Institution name"
                    />
                    <input
                      type="text"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Degree (e.g., B.Tech)"
                    />
                    <input
                      type="text"
                      value={newEducation.field_of_study}
                      onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Field of study"
                    />
                    <input
                      type="text"
                      value={newEducation.grade}
                      onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Grade/CGPA (optional)"
                    />
                    <input
                      type="number"
                      value={newEducation.start_year}
                      onChange={(e) => setNewEducation({ ...newEducation, start_year: parseInt(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Start year"
                    />
                    <input
                      type="number"
                      value={newEducation.end_year}
                      onChange={(e) => setNewEducation({ ...newEducation, end_year: parseInt(e.target.value) || null })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="End year (optional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Education
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field_of_study}</h3>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {edu.start_year} - {edu.end_year || 'Present'}
                          {edu.grade && ` • ${edu.grade}`}
                        </p>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {education.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No education added yet</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Resume Upload Section */}
          {profile && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resume</h2>
              {profile.resume_url ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Resume uploaded</p>
                      <p className="text-sm text-gray-600">PDF format • Converted automatically</p>
                    </div>
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Replace Resume
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                </div>
              ) : (
                <label className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4 group-hover:text-blue-500" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Upload Resume</p>
                    <p className="text-sm text-gray-600 mb-1">PDF, DOC, or DOCX (Max 20MB)</p>
                    <p className="text-xs text-gray-500">DOC/DOCX will be converted to PDF automatically</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={uploadingResume}
                  />
                </label>
              )}
              {uploadingResume && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading and converting document...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
