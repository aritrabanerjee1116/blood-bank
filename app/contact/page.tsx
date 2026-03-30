import { Mail, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
              Have questions about blood donation, need assistance with your account, or want to report an issue? Our team is here to help.
            </p>
          </div>

          <div className="space-y-8 animate-slide-up">
            <div className="glass-card p-8 sm:p-12">
              <h2 className="text-2xl font-bold mb-8 text-center">Get In Touch</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Our Location</h3>
                    <p className="text-[var(--color-muted)]">
                      123 Lifeline Avenue<br />
                      Medical District<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone Number</h3>
                    <p className="text-[var(--color-muted)]">
                      Emergency: 1-800-BLOOD-YES<br />
                      Support: +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:col-span-2 md:justify-center">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(220,38,38,0.1)] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Address</h3>
                    <p className="text-[var(--color-muted)]">
                      support@bloodlink.tech<br />
                      partnerships@bloodlink.tech
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 sm:p-12 bg-[rgba(220,38,38,0.05)] border-[rgba(220,38,38,0.2)] text-center">
              <h3 className="font-bold text-2xl mb-3 text-[var(--color-primary)]">Emergency Contacts</h3>
              <p className="text-[var(--color-muted)] mb-6 max-w-xl mx-auto">
                For immediate medical emergencies or urgent blood requirements, please contact your nearest hospital or our 24/7 dedicated emergency hotline.
              </p>
              <div className="inline-block px-8 py-4 rounded-xl bg-[var(--color-primary)] text-white text-2xl font-bold shadow-[var(--shadow-glow)]">
                Emergency: 911
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
