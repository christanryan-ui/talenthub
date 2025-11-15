'use client';

import Link from 'next/link';
import { Award, DollarSign, Clock, Star, CheckCircle, ArrowRight, Users, TrendingUp } from 'lucide-react';

export default function InterviewersLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">TalentHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Login
            </Link>
            <Link
              href="/interviewers/register"
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Join as Interviewer
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Earn by
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"> Verifying </span>
              Talent
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Become a certified interviewer. Conduct skill assessments, earn credits, and help job seekers showcase their true abilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/interviewers/register"
                className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Interviewing
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-all font-medium text-lg"
              >
                Learn More
              </Link>
            </div>
            <p className="text-sm text-gray-500 pt-4">
              <strong>500 free credits</strong> on signup • Earn 500 credits per interview
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Become an Interviewer</h2>
            <p className="text-lg text-gray-600">Flexible work that makes an impact</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Credits</h3>
              <p className="text-gray-600 leading-relaxed">
                Get 500 credits for every successful interview. Use credits to access premium features or save them.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Schedule</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose your own hours. Accept interview requests when it suits you. Work from anywhere.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Make an Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Help job seekers get verified and land their dream jobs. Build your reputation as a trusted interviewer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple process to start earning</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your interviewer profile with your expertise' },
              { step: '02', title: 'Get Certified', desc: 'Complete verification by another certified interviewer or admin' },
              { step: '03', title: 'Accept Requests', desc: 'Receive interview requests matching your skills' },
              { step: '04', title: 'Conduct & Earn', desc: 'Complete interviews and earn 500 credits each' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interviewer Requirements</h2>
            <p className="text-lg text-gray-600">What we look for in our interviewers</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-green-200 p-8">
            <ul className="space-y-4">
              {[
                'Professional experience in your field (3+ years preferred)',
                'Strong communication and assessment skills',
                'Ability to provide constructive feedback',
                'Commitment to fair and unbiased evaluation',
                'Availability for scheduled interviews',
                'Verified by existing certified interviewer or admin',
              ].map((req, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Earning Potential</h2>
            <p className="text-lg text-gray-600">Credits you can earn</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">500</div>
              <div className="text-gray-600">Credits per Interview</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">500</div>
              <div className="text-gray-600">Signup Bonus</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">∞</div>
              <div className="text-gray-600">Unlimited Potential</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Interviewing?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of certified interviewers and start earning today.
          </p>
          <Link
            href="/interviewers/register"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
          >
            Become an Interviewer
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-600 text-sm">&copy; 2025 TalentHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
