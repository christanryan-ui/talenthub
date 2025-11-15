'use client';

import Link from 'next/link';
import { Building, Users, Target, TrendingUp, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function CompaniesLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">TalentHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Login
            </Link>
            <Link
              href="/companies/register"
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Hire
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Verified </span>
              Talent Faster
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access pre-verified candidates with skill ratings from certified interviewers. Save time and hire with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/companies/register"
                className="w-full sm:w-auto bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Hiring Now
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg hover:bg-purple-50 transition-all font-medium text-lg"
              >
                Learn More
              </Link>
            </div>
            <p className="text-sm text-gray-500 pt-4">
              <strong>10,000 free credits</strong> on signup • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Companies Choose TalentHub</h2>
            <p className="text-lg text-gray-600">Everything you need to build your dream team</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Profiles</h3>
              <p className="text-gray-600 leading-relaxed">
                Every candidate is interviewed and rated by certified professionals. Know exactly what skills they possess.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skill-Based Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Search by specific skills with detailed ratings. Filter by experience level and verification badges.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Hiring Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Skip the initial screening. Access contact details instantly with credits and schedule interviews faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Start hiring in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and get 10,000 free credits instantly' },
              { step: '02', title: 'Search Talent', desc: 'Browse verified profiles with skill ratings' },
              { step: '03', title: 'Connect & Hire', desc: 'Use credits to reveal contacts and schedule interviews' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Credit-Based Pricing</h2>
            <p className="text-lg text-gray-600">Pay only for what you use</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="text-center space-y-6">
              <div>
                <div className="text-5xl font-bold mb-2">₹0.01</div>
                <div className="text-purple-100">per credit</div>
              </div>
              <div className="border-t border-purple-400 pt-6">
                <div className="text-2xl font-semibold mb-4">Contact Reveal: 10,000 credits</div>
                <p className="text-purple-100">Unlock candidate's email, phone, and location for 1 year</p>
              </div>
              <ul className="space-y-3 text-left max-w-md mx-auto">
                {[
                  '10,000 free credits on signup',
                  'No monthly fees or subscriptions',
                  'Credits never expire',
                  'Unlimited job postings',
                  'Access to all verified candidates',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Build Your Team?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of companies hiring verified talent on TalentHub.
          </p>
          <Link
            href="/companies/register"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
          >
            Get Started with 10,000 Free Credits
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
