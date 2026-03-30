import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-6">
              About BloodLink
            </h1>
            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
              We are on a mission to build a comprehensive, seamless blood bank management platform that connects donors, hospitals, and administrators to save lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-slide-up">
            {/* Our Motive */}
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,transparent_70%)] rounded-full"></div>
              <div className="w-14 h-14 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center text-[var(--color-primary)] mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Motive</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                The primary motive behind BloodLink is to eliminate the gap between blood demand and supply. Every year, millions of people face critical situations due to the unavailability of blood. Our platform acts as a bridge, ensuring that blood reaches those who need it most, precisely when they need it. We believe that technology, combined with human kindness, can eradicate the shortage of life-saving blood.
              </p>
            </div>

            {/* Our Vision */}
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] rounded-full"></div>
              <div className="w-14 h-14 rounded-xl bg-[rgba(249,115,22,0.1)] flex items-center justify-center text-[var(--color-primary)] mb-6 truncate text-orange-500">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                We envision a world where no life is lost due to a lack of available blood. By leveraging real-time tracking, intelligent matching, and a highly responsive community of donors and medical professionals, we strive to build an ecosystem of trust and transparency. Our long-term vision is to establish BloodLink as the global standard for modern, secure, and efficient blood bank networks.
              </p>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(220,38,38,0.05)] flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-bold mb-2">Real-time Speed</h3>
              <p className="text-sm text-[var(--color-muted)]">Instant alerts and live tracking for emergency requests.</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(220,38,38,0.05)] flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-bold mb-2">Vast Network</h3>
              <p className="text-sm text-[var(--color-muted)]">Connecting thousands of willing donors with hospitals.</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(220,38,38,0.05)] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-bold mb-2">Save Lives</h3>
              <p className="text-sm text-[var(--color-muted)]">Every single drop contributes towards the greater good.</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(220,38,38,0.05)] flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-bold mb-2">Total Reliability</h3>
              <p className="text-sm text-[var(--color-muted)]">Secure verification keeps our community trustworthy.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
