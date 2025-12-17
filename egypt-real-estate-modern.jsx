'use client';

import React, { useMemo, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Properties from './components/Properties';
import Process from './components/Process';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { translations } from './content/translations';
import { globalStyles } from './styles/globalStyles';

const EgyptRealEstate = () => {
  const [language, setLanguage] = useState('cz');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({ sending: false, error: '', success: '' });

  const t = useMemo(() => translations[language], [language]);

  const smoothScrollTo = (targetY, duration = 700) => {
    const startY = window.scrollY || window.pageYOffset;
    const delta = targetY - startY;
    const startTime = performance.now();

    const easeOutQuad = (t) => t * (2 - t);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      window.scrollTo(0, startY + delta * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const offset = 80; // header height
      const targetY = rect.top + window.scrollY - offset;
      smoothScrollTo(targetY, 800);
    }
    setMobileOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ sending: true, error: '', success: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t.contact.form.error || 'Failed to send.');
      }
      setFormData({ name: '', email: '', phone: '', message: '' });
      setFormStatus({ sending: false, error: '', success: t.contact.form.success });
    } catch (error) {
      setFormStatus({ sending: false, error: error.message || t.contact.form.error, success: '' });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="page">
      <style>{globalStyles}</style>

      <Navigation
        t={t}
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={scrollToSection}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />

      <main>
        <Hero
          t={t}
          language={language}
          onPrimaryCta={() => scrollToSection('contact')}
          onSecondaryCta={() => scrollToSection('properties')}
        />
        <Properties t={t} language={language} />
        <Process t={t} />
        <About t={t} language={language} />
        <Contact
          t={t}
          language={language}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          formStatus={formStatus}
        />
      </main>

      <Footer t={t} onNavigate={scrollToSection} />
      <WhatsAppButton />
    </div>
  );
};

export default EgyptRealEstate;
