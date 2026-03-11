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

const contactMailSuccess = {
  cz: 'Otevreme vas email s predvyplnenou zpravou, staci odeslat.',
  en: 'We open your mail app with the message ready to send.',
  de: 'Wir oeffnen Ihr Mail-Programm mit der fertigen Nachricht.',
};

const contactMailError = {
  cz: 'Nepodarilo se otevrit e-mail klienta. Napiste prosim na Info@egyptskoceskareality.cz.',
  en: 'Could not open the mail app. Please write to Info@egyptskoceskareality.cz.',
  de: 'Mail-App konnte nicht geoeffnet werden. Bitte schreiben Sie an Info@egyptskoceskareality.cz.',
};

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ sending: true, error: '', success: '' });
    try {
      const to = t?.contact?.info?.email || 'Info@egyptskoceskareality.cz';
      const subject = 'Web enquiry';
      const body = [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone}`,
        '',
        formData.message,
      ].join('\n');

      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      setFormData({ name: '', email: '', phone: '', message: '' });
      setFormStatus({
        sending: false,
        error: '',
        success: contactMailSuccess[language] || contactMailSuccess.en,
      });
    } catch (error) {
      console.error('contact submit mailto failed', error);
      setFormStatus({
        sending: false,
        error: contactMailError[language] || contactMailError.en,
        success: '',
      });
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
        <section className="logo-break">
          <div className="container">
            <img src="/MAINLOGO.png" alt="Egyptsko Česká Reality" className="logo-break-img" />
          </div>
        </section>
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
