'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import Navbar from '@/components/Navbar';
import {
  Droplets,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
} from 'lucide-react';
import type { BloodGroup } from '@/lib/types';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorRegistrationPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    blood_group: '' as BloodGroup | '',
    location: '',
    date_of_birth: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(form.email, form.password, {
      role: 'donor',
      full_name: form.full_name,
      phone: form.phone,
      blood_group: form.blood_group,
      location: form.location,
      date_of_birth: form.date_of_birth,
    });

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    router.push('/donor');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Become a Donor</h1>
            <p className="text-[var(--color-muted)] text-sm">
              Join our donor network and help save lives
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-sm text-[var(--color-danger)]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="full_name">Full Name</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" />
                  <input id="full_name" type="text" value={form.full_name} onChange={(e) => updateField('full_name', e.target.value)} className="input-field" placeholder="John Doe" required />
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="phone">Phone Number</label>
                <div className="input-icon-wrapper">
                  <Phone className="input-icon" />
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="input-field" placeholder="+91 9876543210" required />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" />
                <input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="input-field" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="blood_group">Blood Group</label>
                <div className="input-icon-wrapper">
                  <Droplets className="input-icon" />
                  <select id="blood_group" value={form.blood_group} onChange={(e) => updateField('blood_group', e.target.value)} className="select-field" required>
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="date_of_birth">Date of Birth</label>
                <div className="input-icon-wrapper">
                  <Calendar className="input-icon" />
                  <input id="date_of_birth" type="date" value={form.date_of_birth} onChange={(e) => updateField('date_of_birth', e.target.value)} className="input-field" required />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="location">Location</label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon" />
                <input id="location" type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} className="input-field" placeholder="City, State" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="password">Password</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" />
                  <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateField('password', e.target.value)} className="input-field" style={{ paddingRight: '44px' }} placeholder="Min 6 characters" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-white" style={{ position: 'absolute' }}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" />
                  <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className="input-field" placeholder="Confirm password" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
                Sign In
              </Link>
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              Registering a hospital?{' '}
              <Link href="/register/hospital" className="text-[var(--color-primary)] hover:underline font-medium">
                Hospital Registration
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
