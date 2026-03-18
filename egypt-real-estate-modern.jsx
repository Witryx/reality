'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileOpen);
    return () => document.body.classList.remove('nav-open');
  }, [mobileOpen]);

  const handleLanguageChange = useCallback((nextLanguage) => {
    setLanguage(nextLanguage);
    setMobileOpen(false);
  }, []);

  const scrollToSection = useCallback((id) => {
    const performScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;

      const headerEl = document.querySelector('.nav-shell');
      const headerHeight = Math.ceil(headerEl?.getBoundingClientRect().height || 88);
      const targetY = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({
        top: Math.max(targetY, 0),
        behavior: 'smooth',
      });
    };

    if (mobileOpen) {
      setMobileOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(performScroll);
      });
      return;
    }

    performScroll();
  }, [mobileOpen]);

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
        onLanguageChange={handleLanguageChange}
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
