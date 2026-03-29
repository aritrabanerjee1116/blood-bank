'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import Navbar from '@/components/Navbar';
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export default function HospitalRegistrationPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    hospital_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact_person: '',
    phone: '',
    address: '',
    license_number: '',
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
      role: 'hospital',
      full_name: form.contact_person,
      phone: form.phone,
      hospital_name: form.hospital_name,
      license_number: form.license_number,
      address: form.address,
      contact_person: form.contact_person,
    });

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    router.push('/hospital');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Register Hospital</h1>
            <p className="text-[var(--color-muted)] text-sm">
              Register your hospital to request blood and track deliveries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-sm text-[var(--color-danger)]">
                {error}
              </div>
            )}

            <div>
              <label className="input-label" htmlFor="hospital_name">Hospital Name</label>
              <div className="input-icon-wrapper">
                <Building2 className="input-icon" />
                <input id="hospital_name" type="text" value={form.hospital_name} onChange={(e) => updateField('hospital_name', e.target.value)} className="input-field" placeholder="City General Hospital" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="contact_person">Contact Person</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" />
                  <input id="contact_person" type="text" value={form.contact_person} onChange={(e) => updateField('contact_person', e.target.value)} className="input-field" placeholder="Dr. Jane Smith" required />
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
              <label className="input-label" htmlFor="email">Official Email</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" />
                <input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="input-field" placeholder="admin@hospital.com" required />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="license_number">License Number</label>
              <div className="input-icon-wrapper">
                <FileText className="input-icon" />
                <input id="license_number" type="text" value={form.license_number} onChange={(e) => updateField('license_number', e.target.value)} className="input-field" placeholder="HSP-XXXX-XXXX" required />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="address">Hospital Address</label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon" />
                <input id="address" type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)} className="input-field" placeholder="123 Medical Ave, City, State" required />
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

            <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] text-sm text-[var(--color-warning)]">
              Note: Hospital registrations require admin approval before access is granted.
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Hospital
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              Already registered?{' '}
              <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">Sign In</Link>
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              Want to donate?{' '}
              <Link href="/register/donor" className="text-[var(--color-primary)] hover:underline font-medium">Donor Registration</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
