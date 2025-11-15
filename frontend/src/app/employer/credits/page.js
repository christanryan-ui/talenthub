'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coins, Check, Users, TrendingUp, CreditCard, Building } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function EmployerCreditsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCredits, setCurrentCredits] = useState(0);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50000,
      price: 199,
      popular: false,
      reveals: '~4 contacts',
      perCredit: 0.00398,
      features: ['Instant credit delivery', '30-day money-back', 'Email support', 'Valid for 1 year']
    },
    {
      id: 'growth',
      name: 'Growth Pack',
      credits: 150000,
      price: 499,
      popular: true,
      reveals: '~12 contacts',
      perCredit: 0.00333,
      savings: 17,
      features: ['Instant credit delivery', '30-day money-back', 'Priority support', 'Valid for 1 year', 'Dedicated account manager']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      credits: 300000,
      price: 899,
      popular: false,
      reveals: '~25 contacts',
      perCredit: 0.003,
      savings: 25,
      features: ['Instant credit delivery', '30-day money-back', 'Priority support', 'Valid for 1 year', 'Dedicated account manager', 'Custom integrations']
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userRes = await api.get('/auth/me');
      if (userRes.data.role !== 'employer') {
        toast.error('Only employers can access this page');
        router.push('/dashboard');
        return;
      }
      setUser(userRes.data);

      const creditsRes = await api.get('/credits/balance');
      setCurrentCredits(creditsRes.data.total_credits);
    } catch (err) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg) => {
    // TODO: Integrate with payment gateway
    toast('Payment integration coming soon! This will connect to Stripe.', { icon: '💳' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Purchase Credits</h1>
            <Link
              href="/employer/dashboard"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Balance */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Current Balance</p>
              <p className="text-5xl font-bold text-white mb-2">{currentCredits.toLocaleString()}</p>
              <p className="text-green-100 text-sm">credits available for contact reveals</p>
            </div>
            <Building className="h-20 w-20 text-white opacity-20" />
          </div>
        </div>

        {/* Usage Info */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">How Employer Credits Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">Contact Reveal</p>
                <p className="text-sm text-gray-400">12,000 credits per candidate contact reveal</p>
                <p className="text-xs text-gray-500 mt-1">Access valid for 1 year</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">ATS Ranking</p>
                <p className="text-sm text-gray-400">Free unlimited candidate ranking</p>
                <p className="text-xs text-gray-500 mt-1">AI-powered matching</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-1">No Expiry</p>
                <p className="text-sm text-gray-400">Your credits never expire</p>
                <p className="text-xs text-gray-500 mt-1">Use at your own pace</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-8 hover:scale-105 transition-all ${
                pkg.popular ? 'border-green-500 shadow-2xl shadow-green-500/20' : 'border-white/10'
              } relative`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                  <span className="text-white text-sm font-bold">BEST VALUE</span>
                </div>
              )}

              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold text-white mb-3">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">${pkg.price}</span>
                  <span className="text-gray-400 text-lg">USD</span>
                </div>
                <p className="text-gray-300 text-lg font-semibold mb-2">{pkg.credits.toLocaleString()} credits</p>
                <p className="text-gray-400 text-sm">{pkg.reveals}</p>
                {pkg.savings && (
                  <div className="inline-block mt-3 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                    <span className="text-green-400 text-sm font-bold">Save {pkg.savings}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 shadow-lg'
                    : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <CreditCard className="h-6 w-6" />
                Purchase Package
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">${pkg.perCredit.toFixed(5)} per credit</p>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Need More?</h3>
          <p className="text-gray-300 mb-6">Enterprise solutions with custom credit packages, dedicated support, and API access</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
