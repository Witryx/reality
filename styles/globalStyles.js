import { palette } from '../theme/palette';

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

  :root {
    --navy: ${palette.navy};
    --navy-deep: ${palette.navyDeep};
    --sky: ${palette.sky};
    --sand: ${palette.sand};
    --mint: ${palette.mint};
    --text: ${palette.text};
    --muted: ${palette.textMuted};
    --accent: ${palette.accent};
    --accent-soft: ${palette.accentSoft};
    --border: ${palette.border};
    --card: ${palette.card};
    --shadow: ${palette.shadow};
    --gradient: ${palette.gradient};
    --hero-overlay: ${palette.heroOverlay};
    --soft-gradient: ${palette.softGradient};
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    margin: 0;
    background: var(--sand);
    color: var(--text);
    font-family: 'Montserrat', 'Space Grotesk', 'Plus Jakarta Sans', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  button { font-family: inherit; }

  .page { min-height: 100vh; background: var(--sand); }
  .section { padding: 110px 28px; position: relative; scroll-margin-top: 90px; }
  .container { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }

  .personal-section {
    background: #f3ede5;
    border-top: 1px solid rgba(15,44,77,0.06);
    border-bottom: 1px solid rgba(15,44,77,0.06);
  }

  .personal-grid {
    display: grid;
    grid-template-columns: 0.5fr 1.1fr;
    gap: 24px;
    align-items: center;
  }

  .personal-image-wrap {
    position: relative;
    max-width: 360px;
    margin: 0 auto;
  }

  .personal-image-bg {
    position: absolute;
    inset: 12px;
    background: radial-gradient(circle at 30% 30%, rgba(15,44,77,0.08), transparent 60%);
    filter: blur(10px);
    z-index: 0;
  }

  .personal-image {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 32px rgba(15,44,77,0.18);
    background: #fff;
  }

  .personal-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }

  .personal-bullets {
    display: grid;
    gap: 10px;
    margin-bottom: 18px;
  }

  .personal-bullet {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid rgba(15,44,77,0.08);
    box-shadow: 0 12px 24px rgba(15,44,77,0.08);
  }

  .personal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0f2c4d;
    flex-shrink: 0;
  }

  .eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .eyebrow::before {
    content: '';
    width: 22px;
    height: 2px;
    background: var(--accent);
    opacity: 0.7;
  }

  .title {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(36px, 4vw, 54px);
    font-weight: 700;
    margin: 14px 0 10px;
    color: var(--navy);
    letter-spacing: -0.2px;
  }

  .subtitle {
    font-size: 17px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 760px;
    margin: 0 auto;
  }

  .btn-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }

  .btn-primary, .btn-secondary {
    border: 1px solid transparent;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: none;
    cursor: pointer;
    transition: all 0.22s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 16px 28px rgba(242, 156, 75, 0.35);
  }

  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(242, 156, 75, 0.42); }

  .btn-secondary {
    background: #fff;
    color: var(--navy);
    border-color: rgba(15,44,77,0.14);
  }

  .btn-secondary:hover { border-color: var(--navy); box-shadow: 0 10px 26px rgba(15,44,77,0.16); }

  .nav-shell {
    position: fixed;
    inset: 0 0 auto 0;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    z-index: 20;
  }

  .nav {
    max-width: 1280px;
    margin: 0 auto;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .nav-left { display: flex; align-items: center; gap: 14px; }
  .brand-mark {
    width: 46px; height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2f6fa3 0%, #0f2c4d 70%);
    display: grid;
    place-items: center;
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }

  .brand-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    letter-spacing: 0.3px;
    color: var(--navy);
    font-weight: 700;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .nav-link {
    font-size: 13px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.2px;
    color: var(--navy);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    position: relative;
    transition: color 0.2s ease;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0; bottom: -6px;
    width: 0%;
    height: 2px;
    background: var(--accent);
    transition: width 0.22s ease;
  }

  .nav-link:hover { color: var(--accent); }
  .nav-link:hover::after { width: 100%; }

  .lang-switch {
    display: inline-flex;
    gap: 8px;
    padding-left: 18px;
    border-left: 1px solid rgba(15,44,77,0.1);
  }

  .lang-btn {
    border: 1px solid rgba(15,44,77,0.12);
    background: #f3f6f9;
    color: var(--navy);
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.22s ease;
  }

  .lang-btn.active {
    color: #fff;
    background: var(--navy);
    border-color: var(--navy);
    box-shadow: 0 10px 24px rgba(15,44,77,0.22);
  }

  .menu-toggle {
    display: none;
    background: none;
    border: 1px solid rgba(15,44,77,0.14);
    color: var(--navy);
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
  }

  .nav-mobile {
    display: none;
    flex-direction: column;
    gap: 12px;
    padding: 16px 24px 22px;
    border-top: 1px solid rgba(15,44,77,0.1);
    background: #ffffff;
  }

  .hero {
    padding: 170px 28px 130px;
    position: relative;
    overflow: hidden;
    background: var(--hero-overlay), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&auto=format&fit=crop') center/cover no-repeat;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--soft-gradient);
    opacity: 0.5;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 60px;
    align-items: center;
  }

  .hero-copy .display {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(42px, 5vw, 68px);
    margin: 16px 0;
    letter-spacing: -0.8px;
    line-height: 1.05;
    color: #fff;
  }

  .hero-copy .subtitle { color: rgba(255,255,255,0.85); text-align: left; }

  .hero-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .pill {
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(255, 255, 255, 0.08);
    font-size: 14px;
    color: #fff;
  }

  .hero-media {
    position: relative;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.35);
    background: #0f1828;
  }

  .hero-media img {
    width: 100%;
    height: 520px;
    object-fit: cover;
  }

  .media-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(7, 11, 20, 0.1) 0%, rgba(7, 11, 20, 0.7) 100%);
  }

  .agent-card {
    position: absolute;
    bottom: 18px;
    left: 18px;
    right: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(15,44,77,0.08);
    color: var(--navy);
  }

  .badge {
    padding: 6px 10px;
    background: rgba(242, 156, 75, 0.14);
    border: 1px solid rgba(242, 156, 75, 0.4);
    border-radius: 999px;
    font-size: 12px;
    color: var(--accent);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .stat-card {
    position: absolute;
    top: 18px;
    right: 18px;
    padding: 14px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.9);
    border: 1px solid rgba(15,44,77,0.08);
    text-align: right;
    color: var(--navy);
  }

  .hero-support {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 32px;
    color: rgba(255,255,255,0.9);
  }

  .support-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    font-weight: 600;
  }

  .section-header { text-align: center; margin-bottom: 64px; }

  .listing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 26px;
  }

  .listing-card {
    background: var(--card);
    border: 1px solid rgba(15,44,77,0.08);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(15,44,77,0.12);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }

  .listing-card:hover { transform: translateY(-6px); box-shadow: 0 26px 55px rgba(15,44,77,0.18); }
  .listing-thumb { position: relative; height: 220px; overflow: hidden; }
  .listing-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .listing-card:hover .listing-thumb img { transform: scale(1.05); }

  .price-tag {
    position: absolute;
    bottom: 14px;
    left: 14px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(15,44,77,0.86);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    font-weight: 700;
  }

  .tag-chip {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 8px 18px rgba(242,156,75,0.3);
  }

  .listing-body { padding: 20px 22px 22px; display: grid; gap: 12px; }
  .listing-title { font-size: 20px; font-family: 'Montserrat', sans-serif; margin: 0; color: var(--navy); }
  .listing-meta { display: flex; gap: 10px; flex-wrap: wrap; color: var(--muted); font-size: 14px; }
  .meta-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; background: #f4f6fb; border: 1px solid rgba(15,44,77,0.08); }

  .detail-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 9, 18, 0.65);
    display: grid;
    place-items: center;
    padding: 20px;
    z-index: 50;
  }

  .detail-modal {
    width: min(1100px, 100%);
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.25);
    padding: 22px;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    border: none;
    background: #eef3f9;
    color: var(--navy);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 20px;
    align-items: center;
  }

  .detail-image {
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 16px 28px rgba(15,44,77,0.16);
  }

  .detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cta-banner {
    margin-top: 40px;
    background: #0f2c4d;
    color: #fff;
    padding: 28px 24px;
    border-radius: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    box-shadow: 0 20px 40px rgba(15,44,77,0.18);
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .step-card {
    background: #eef6f1;
    border: 1px solid rgba(15,44,77,0.08);
    border-radius: 16px;
    padding: 18px 18px;
    min-height: 170px;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 14px 28px rgba(15,44,77,0.08);
  }

  .step-number {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--navy);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .step-card:hover { transform: translateY(-4px); box-shadow: 0 18px 34px rgba(15,44,77,0.12); }

  .about-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 42px;
    align-items: center;
    background: #eef6f1;
    border: 1px solid rgba(15,44,77,0.08);
    border-radius: 22px;
    padding: 34px;
    box-shadow: 0 20px 40px rgba(15,44,77,0.12);
  }

  .about-image {
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 34px rgba(15,44,77,0.16);
  }

  .trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .trust-card {
    background: #fff;
    border: 1px solid rgba(15,44,77,0.08);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 12px 26px rgba(15,44,77,0.1);
  }

  .review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }

  .review-card {
    padding: 20px;
    border-radius: 16px;
    background: #fff;
    border: 1px solid rgba(15,44,77,0.08);
    box-shadow: 0 18px 32px rgba(15,44,77,0.12);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    color: #111;
  }

  .review-card:hover { transform: translateY(-4px); box-shadow: 0 20px 38px rgba(15,44,77,0.15); }
  .review-meta { color: #333; font-size: 14px; }

  .reviews-layout {
    display: grid;
    grid-template-columns: minmax(320px, 0.95fr) 1.05fr;
    gap: 18px;
    align-items: start;
  }

  .review-form-card {
    background: #fff;
    border: 1px solid rgba(15,44,77,0.08);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 18px 32px rgba(15,44,77,0.12);
  }

  .review-list { display: grid; gap: 16px; }

  .review-rating {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .star-button {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid rgba(15,44,77,0.12);
    background: #f7f9fb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
  }

  .star-button:hover { transform: translateY(-1px); border-color: rgba(199,160,79,0.9); box-shadow: 0 8px 18px rgba(199,160,79,0.2); }
  .rating-value { font-size: 13px; color: var(--muted); margin-left: 6px; }

  .review-status {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f7f9fb;
    border: 1px solid rgba(15,44,77,0.08);
    color: var(--text);
    margin: 8px 0;
  }

  .review-status.error { background: #fff4f4; color: #b42318; border-color: rgba(180,35,24,0.35); }
  .review-status.success { background: #f3f8ef; color: #2b7a0b; border-color: rgba(43,122,11,0.35); }
  .review-status.helper { background: #f7f9fb; color: var(--muted); border-style: dashed; }

  .review-empty {
    padding: 18px;
    border: 1px dashed rgba(15,44,77,0.18);
    border-radius: 14px;
    color: var(--muted);
    background: #f9fbfd;
  }

  .review-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 14px;
    background: #fff7ec;
    border: 1px solid rgba(199,160,79,0.25);
    box-shadow: 0 12px 24px rgba(199,160,79,0.12);
  }

  .avg-label { font-size: 13px; color: #a36a1b; text-transform: uppercase; letter-spacing: 0.3px; }
  .avg-score { font-size: 32px; font-weight: 800; color: #c2852f; line-height: 1; }
  .avg-score .avg-total { font-size: 16px; font-weight: 600; color: #c2852f; margin-left: 4px; }
  .avg-count { font-size: 13px; color: #8a611c; margin-top: 4px; }
  .avg-stars { display: flex; gap: 4px; }

  .review-pagination {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 4px;
  }

  .page-btn {
    width: 40px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(15,44,77,0.14);
    background: #fff;
    cursor: pointer;
    font-weight: 700;
    color: #0f2c4d;
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .page-btn:hover:enabled { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(15,44,77,0.16); border-color: rgba(15,44,77,0.22); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .page-info { font-size: 14px; color: var(--muted); font-weight: 700; }

  @media (max-width: 960px) {
    .reviews-layout {
      grid-template-columns: 1fr;
    }
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 26px;
  }

  .contact-card {
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(15,44,77,0.08);
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 18px 34px rgba(15,44,77,0.16);
  }

  .form-field {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  input, textarea {
    width: 100%;
    background: #f7f9fb;
    border: 1px solid rgba(15,44,77,0.12);
    border-radius: 12px;
    padding: 14px 16px;
    color: var(--text);
    font-size: 15px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(242, 156, 75, 0.18);
  }

  textarea { resize: vertical; min-height: 140px; }

  .contact-info {
    display: grid;
    gap: 12px;
    padding: 18px;
    border-radius: 14px;
    background: #f3f7fb;
    border: 1px solid rgba(15,44,77,0.08);
  }

  .contact-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 16px 0;
  }

  .footer {
    padding: 70px 24px 46px;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: linear-gradient(180deg, #0f2c4d, #0b2038);
    color: #eaf0f6;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 32px;
    margin-bottom: 32px;
  }

  .whatsapp {
    position: fixed;
    bottom: 26px;
    right: 26px;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: #25d366;
    display: grid;
    place-items: center;
    box-shadow: 0 16px 40px rgba(37, 211, 102, 0.4);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    z-index: 25;
  }

  .whatsapp:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 20px 46px rgba(37, 211, 102, 0.5); }

  @media (max-width: 1100px) {
    .nav-links { display: none; }
    .lang-switch { display: none; }
    .menu-toggle { display: inline-flex; }
    .nav-mobile { display: flex; }
    .hero-grid { grid-template-columns: 1fr; gap: 32px; }
    .agent-card { position: relative; inset: auto; margin-top: -80px; }
    .stat-card { top: 16px; right: 16px; }
    .about-grid { grid-template-columns: 1fr; padding: 28px; }
    .contact-grid { grid-template-columns: 1fr; }
    .personal-grid { grid-template-columns: 1fr; text-align: center; }
    .personal-image-wrap { margin-bottom: 18px; }
    .personal-bullet { justify-content: center; }
  }

  @media (max-width: 720px) {
    .section { padding: 90px 20px; }
    .hero { padding-top: 120px; }
    .nav { padding: 10px 14px; gap: 12px; }
    .brand-mark { width: 40px; height: 40px; }
    .brand-name { font-size: 18px; }
    .btn-row { width: 100%; flex-direction: column; align-items: stretch; }
    .btn-primary, .btn-secondary { flex: 1; justify-content: center; width: 100%; }
    .listing-thumb { height: 200px; }
    .hero-media img { height: 340px; }
    .personal-grid { gap: 16px; }
    .personal-image-wrap { max-width: 280px; }
    .detail-grid { grid-template-columns: 1fr; }
    .detail-modal { padding: 14px; }
    .close-btn { top: 8px; right: 8px; }
  }
`;
