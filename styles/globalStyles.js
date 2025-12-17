import { palette } from '../theme/palette';

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

  :root {
    --navy: ${palette.navy};
    --navy-deep: ${palette.navyDeep};
    --sky: ${palette.sky};
    --sand: ${palette.sand};
    --sand-deep: #e6c79d;
    --cream: #f8f1e4;
    --mint: ${palette.mint};
    --text: ${palette.text};
    --muted: ${palette.textMuted};
    --accent: ${palette.accent};
    --accent-soft: ${palette.accentSoft};
    --gold: ${palette.accent};
    --gold-soft: ${palette.accentSoft};
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
    background:
      radial-gradient(120% 80% at 12% 18%, rgba(31,186,198,0.14), transparent 48%),
      radial-gradient(120% 80% at 84% 10%, rgba(217,179,106,0.14), transparent 52%),
      radial-gradient(140% 110% at 30% 86%, rgba(12,53,82,0.08), transparent 62%),
      linear-gradient(180deg, #f9f2e6 0%, #f0dfc4 36%, #e6c79d 72%, #f7ecda 100%);
    color: var(--text);
    font-family: 'Montserrat', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  button { font-family: inherit; }

  .page {
    min-height: 100vh;
    background:
      radial-gradient(120% 90% at 16% 24%, rgba(31,186,198,0.08), transparent 42%),
      radial-gradient(120% 90% at 80% 60%, rgba(7,28,41,0.06), transparent 48%),
      linear-gradient(180deg, rgba(248,240,226,0.92), rgba(237,213,174,0.9), rgba(229,195,150,0.9));
  }
  .section {
    padding: 110px 28px;
    position: relative;
    scroll-margin-top: 90px;
    background: linear-gradient(180deg, rgba(248,240,226,0.88), rgba(239,218,186,0.9), rgba(246,236,220,0.94));
    overflow: hidden;
  }
  .section::before,
  .section::after {
    content: '';
    position: absolute;
    inset: auto;
    pointer-events: none;
    filter: blur(4px);
    mix-blend-mode: normal;
    opacity: 0.35;
  }
  .section::before {
    width: 420px;
    height: 420px;
    left: -140px;
    top: 40px;
    background:
      radial-gradient(90% 70% at 60% 40%, rgba(12,82,96,0.12), transparent 60%);
  }
  .section::after {
    width: 360px;
    height: 360px;
    right: -120px;
    bottom: -40px;
    background:
      radial-gradient(80% 70% at 40% 30%, rgba(217,179,106,0.16), transparent 60%);
  }
  .container { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }

  .personal-section {
    background: linear-gradient(135deg, rgba(245,232,209,0.9), rgba(241,224,193,0.94), rgba(234,209,171,0.92));
    border-top: 1px solid rgba(217,179,106,0.3);
    border-bottom: 1px solid rgba(7,28,41,0.08);
    position: relative;
    overflow: hidden;
  }

  .personal-section::before {
    content: '';
    position: absolute;
    inset: -10% -10% auto 12%;
    height: 220px;
    background:
      radial-gradient(circle at 40% 40%, rgba(217,179,106,0.2), transparent 68%),
      radial-gradient(120% 90% at 10% 40%, rgba(31,186,198,0.12), transparent 60%);
    filter: blur(12px);
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
    background:
      radial-gradient(circle at 28% 28%, rgba(31,186,198,0.14), transparent 58%),
      radial-gradient(circle at 70% 70%, rgba(217,179,106,0.16), transparent 62%);
    filter: blur(12px);
    z-index: 0;
  }

  .personal-image {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(7,28,41,0.2), 0 0 0 1px rgba(217,179,106,0.18);
    background: linear-gradient(145deg, rgba(255,252,245,0.96), rgba(244,228,205,0.96));
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
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,252,245,0.94), rgba(241,224,193,0.94));
    border: 1px solid rgba(217,179,106,0.3);
    box-shadow: 0 12px 26px rgba(7,28,41,0.12);
  }

  .personal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1fbac6, #0b2338);
    flex-shrink: 0;
    box-shadow: 0 6px 12px rgba(7,28,41,0.2);
  }

  .eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .eyebrow::before {
    content: '';
    width: 22px;
    height: 2px;
    background: linear-gradient(90deg, rgba(217,179,106,0.92), rgba(31,186,198,0.7));
    opacity: 0.9;
  }

  .title {
    font-family: 'Montserrat', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 600;
    margin: 14px 0 10px;
    color: var(--navy);
    letter-spacing: 0.2px;
  }

  .subtitle {
    font-size: 17px;
    color: rgba(11,35,56,0.72);
    line-height: 1.7;
    max-width: 760px;
    margin: 0 auto;
  }

  .btn-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }

  .btn-primary, .btn-secondary {
    border: 1px solid transparent;
    border-radius: 14px;
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
    background: linear-gradient(135deg, #0b2338, #0f7082 42%, #1fbac6 64%, #f0c77b 100%);
    color: #fff;
    border-color: rgba(217,179,106,0.65);
    box-shadow: 0 18px 36px rgba(7, 23, 40, 0.32), inset 0 0 0 1px rgba(255,255,255,0.18);
  }

  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 22px 46px rgba(7, 23, 40, 0.4); }

  .btn-secondary {
    background: linear-gradient(135deg, rgba(255,252,245,0.94), rgba(245,231,206,0.96));
    color: var(--navy);
    border-color: rgba(217,179,106,0.5);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.72), 0 14px 30px rgba(7,28,41,0.1);
  }

  .btn-secondary:hover { border-color: rgba(217,179,106,0.75); box-shadow: 0 16px 32px rgba(7,28,41,0.14); }

  .nav-shell {
    position: fixed;
    inset: 0 0 auto 0;
    background: linear-gradient(180deg, rgba(255,252,245,0.95), rgba(245,228,204,0.9));
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 40px rgba(7, 23, 40, 0.14);
    z-index: 20;
    border-bottom: 1px solid rgba(217,179,106,0.4);
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
    background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(255,255,255,0)), linear-gradient(135deg, #0b2338 0%, #0f7082 55%, #1fbac6 85%);
    display: grid;
    place-items: center;
    box-shadow: 0 12px 28px rgba(7,23,40,0.18);
    border: 1px solid rgba(217,179,106,0.55);
    position: relative;
    overflow: hidden;
  }

  .brand-mark::after {
    content: '';
    position: absolute;
    inset: 10px 12px;
    background: linear-gradient(180deg, rgba(217,179,106,0.95), rgba(176,140,58,0.85));
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    opacity: 0.82;
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
    background: linear-gradient(90deg, rgba(217,179,106,0.92), rgba(31,186,198,0.85));
    transition: width 0.22s ease;
  }

  .nav-link:hover { color: var(--accent); }
  .nav-link:hover::after { width: 100%; }

  .lang-switch {
    display: inline-flex;
    gap: 8px;
    padding-left: 18px;
    border-left: 1px solid rgba(11,35,56,0.12);
  }

  .lang-btn {
    border: 1px solid rgba(217,179,106,0.38);
    background: linear-gradient(135deg, rgba(255,252,245,0.9), rgba(242,224,194,0.9));
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
    background: linear-gradient(135deg, #0b2338, #0f7082 60%, #1fbac6);
    border-color: rgba(217,179,106,0.8);
    box-shadow: 0 12px 26px rgba(7,23,40,0.22);
  }

  .menu-toggle {
    display: none;
    background: none;
    border: 1px solid rgba(217,179,106,0.3);
    color: var(--navy);
    border-radius: 12px;
    padding: 10px 12px;
    cursor: pointer;
    background: linear-gradient(135deg, rgba(255,252,245,0.96), rgba(241,224,193,0.96));
    box-shadow: 0 10px 22px rgba(7,28,41,0.12);
  }

  .nav-mobile {
    display: none;
    flex-direction: column;
    gap: 12px;
    padding: 16px 24px 22px;
    border-top: 1px solid rgba(217,179,106,0.35);
    background: linear-gradient(180deg, rgba(255,252,245,0.95), rgba(244,228,204,0.92));
  }

  .hero {
    padding: 170px 28px 130px;
    position: relative;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(7,23,40,0.78), rgba(12,82,96,0.48)),
      url('/pozadi.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(140% 90% at 50% 96%, rgba(244,223,190,0.9), rgba(244,223,190,0.08)),
      linear-gradient(120deg, rgba(7,28,41,0.65), rgba(12,82,96,0.32)),
      var(--soft-gradient);
    opacity: 0.85;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: -20% -10% auto -10%;
    width: 720px;
    height: 720px;
    background:
      radial-gradient(80% 60% at 40% 50%, rgba(31,186,198,0.18), transparent 60%),
      radial-gradient(90% 70% at 70% 60%, rgba(217,179,106,0.16), transparent 64%);
    mix-blend-mode: screen;
    opacity: 0.4;
    filter: blur(8px);
    pointer-events: none;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 60px;
<<<<<<< ours
    align-items: center;
  }
  .hero-grid.single {
    display: flex;
    flex-direction: column;
=======
>>>>>>> theirs
    align-items: center;
    justify-content: center;
    gap: 28px;
  }

  .hero-copy .display {
    font-family: 'Montserrat', 'Segoe UI', system-ui, sans-serif;
    font-size: clamp(44px, 5vw, 70px);
    margin: 16px 0;
    letter-spacing: 0.2px;
    line-height: 1.05;
    color: #fff;
    text-shadow: 0 10px 28px rgba(8, 23, 36, 0.4);
  }

  .hero-copy .subtitle { color: rgba(255,255,255,0.88); text-align: left; }

  .hero-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .pill {
    padding: 12px 16px;
    border-radius: 14px;
    border: 1px solid rgba(217,179,106,0.65);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(31,186,198,0.12));
    font-size: 14px;
    color: #fff;
    box-shadow: 0 12px 26px rgba(7,23,40,0.24), inset 0 0 0 1px rgba(255,255,255,0.18);
  }

  .hero-media {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 26px 50px rgba(7,23,40,0.26);
    background: linear-gradient(160deg, rgba(7,23,40,0.92), rgba(12,82,96,0.9));
    border: 1px solid rgba(217,179,106,0.45);
  }

  .hero-media img {
    width: 100%;
    height: 520px;
    object-fit: cover;
    filter: saturate(1.02) brightness(0.97);
  }

  .media-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(7, 23, 40, 0.12) 0%, rgba(7, 23, 40, 0.82) 100%), radial-gradient(circle at 20% 20%, rgba(217,179,106,0.2), transparent 40%);
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
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(255,252,245,0.94), rgba(242,224,194,0.92));
    border: 1px solid rgba(217,179,106,0.4);
    color: var(--navy);
    box-shadow: 0 16px 30px rgba(7,23,40,0.2);
  }

  .badge {
    padding: 6px 10px;
    background: rgba(217, 179, 106, 0.2);
    border: 1px solid rgba(217, 179, 106, 0.55);
    border-radius: 999px;
    font-size: 12px;
    color: var(--navy);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.4);
  }

  .stat-card {
    position: absolute;
    top: 18px;
    right: 18px;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,218,180,0.9));
    border: 1px solid rgba(217,179,106,0.45);
    text-align: right;
    color: var(--navy);
    box-shadow: 0 20px 42px rgba(7,23,40,0.26);
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
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(217,179,106,0.45);
    font-weight: 600;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);
  }

  .section-header { text-align: center; margin-bottom: 64px; }

  .listing-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
    justify-content: center;
  }
  @media (max-width: 1024px) {
    .listing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .listing-grid { grid-template-columns: 1fr; }
  }

  .listing-card {
    background:
      radial-gradient(140% 120% at 10% 20%, rgba(31,186,198,0.06), transparent 52%),
      radial-gradient(120% 120% at 90% 10%, rgba(217,179,106,0.12), transparent 58%),
      linear-gradient(145deg, rgba(255,252,245,0.96), rgba(242,224,194,0.96));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(7,23,40,0.16);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .listing-card:hover { transform: translateY(-6px); box-shadow: 0 30px 68px rgba(7,23,40,0.24); border-color: rgba(217,179,106,0.55); }
  .listing-thumb { position: relative; height: 220px; overflow: hidden; }
  .listing-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; filter: saturate(1.02) brightness(0.98); }
  .listing-card:hover .listing-thumb img { transform: scale(1.05); }

  .price-tag {
    position: absolute;
    bottom: 14px;
    left: 14px;
    padding: 10px 14px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(7,23,40,0.92), rgba(12,82,96,0.9), rgba(31,186,198,0.82));
    color: #fff;
    border: 1px solid rgba(217,179,106,0.5);
    font-weight: 700;
    box-shadow: 0 14px 24px rgba(7,23,40,0.32);
  }

  .tag-chip {
    position: absolute;
    top: 14px;
    right: 14px;
    padding: 8px 12px;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(217,179,106,0.96), rgba(217,179,106,0.72));
    color: #0b2338;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 12px 24px rgba(7,23,40,0.18);
  }

  .listing-body { padding: 20px 22px 22px; display: grid; gap: 12px; }
  .listing-title { font-size: 20px; font-family: 'Montserrat', sans-serif; margin: 0; color: var(--navy); }
  .listing-meta { display: flex; gap: 10px; flex-wrap: wrap; color: var(--muted); font-size: 14px; }
  .meta-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 12px; background: #f5e8d2; border: 1px solid rgba(217,179,106,0.28); }

  .detail-overlay {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(120% 120% at 16% 12%, rgba(31,186,198,0.14), transparent 58%),
      linear-gradient(180deg, rgba(4, 16, 33, 0.88), rgba(7, 23, 40, 0.82));
    display: grid;
    place-items: center;
    padding: 20px;
    overflow: hidden;
    z-index: 50;
  }

  .detail-modal {
    width: min(1100px, 100%);
    background:
      radial-gradient(120% 120% at 14% 12%, rgba(31,186,198,0.06), transparent 50%),
      linear-gradient(150deg, rgba(255,252,245,0.96), rgba(242,224,194,0.94));
    border-radius: 22px;
    box-shadow: 0 32px 70px rgba(7,23,40,0.26);
    padding: 22px;
    position: relative;
    border: 1px solid rgba(217,179,106,0.38);
    max-height: 92vh;
    overflow: hidden;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    border: 1px solid rgba(217,179,106,0.45);
    background: #f8f1e4;
    color: var(--navy);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.58);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
    max-height: 92vh;
    overflow: auto;
  }

  .review-modal { max-width: 980px; padding: 28px 26px; }
  @media (max-width: 640px) { .review-modal { padding: 20px 18px; } }

  .review-detail {
    background: linear-gradient(165deg, rgba(255,252,245,0.96), rgba(244,228,205,0.92));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 16px;
    padding: 18px;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.45), 0 18px 32px rgba(7,23,40,0.14);
    display: grid;
    gap: 12px;
  }

  .review-detail-meta { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .review-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 12px;
    background: #f4e6d0;
    color: #0b2338;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.1px;
    border: 1px solid rgba(217,179,106,0.36);
  }

  .rating-chip {
    background: linear-gradient(135deg, #0b2338, #0f7082 65%, #1fbac6);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 10px 22px rgba(7,23,40,0.22);
  }

  .review-detail-header { display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; }
  .review-detail-stars { display: inline-flex; align-items: center; gap: 8px; }
  .review-detail-text { color: #1a2a38; line-height: 1.75; white-space: pre-wrap; font-size: 16px; }
  .review-name { margin: 0; font-size: 26px; color: var(--navy); }

  .detail-image {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 18px 34px rgba(7,23,40,0.18);
    position: sticky;
    top: 0;
  }

  .detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumb-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .detail-info {
    padding: 18px 22px 24px;
    align-self: start;
  }

  body.detail-open {
    overflow: hidden;
    touch-action: none;
  }

  .thumb-btn {
    width: 68px;
    height: 52px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    padding: 0;
    background: #f4e6d0;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(7,23,40,0.16);
  }

  .thumb-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb-btn.active { border-color: var(--gold); box-shadow: 0 10px 20px rgba(7,23,40,0.2); }

  .cta-banner {
    margin-top: 40px;
    background: linear-gradient(135deg, #0b2338, #0f7082 55%, #1fbac6 80%);
    color: #fff;
    padding: 28px 24px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    box-shadow: 0 18px 36px rgba(7,23,40,0.22);
    border: 1px solid rgba(217,179,106,0.45);
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .step-card {
    background: linear-gradient(145deg, rgba(255,252,245,0.94), rgba(244,228,205,0.92));
    border: 1px solid rgba(217,179,106,0.3);
    border-radius: 18px;
    padding: 18px 18px;
    min-height: 170px;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    box-shadow: 0 16px 32px rgba(7,23,40,0.12);
  }

  .step-number {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #0b2338, #0f7082 65%, #1fbac6);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 700;
    margin-bottom: 10px;
    box-shadow: 0 10px 18px rgba(7,23,40,0.22);
    border: 1px solid rgba(217,179,106,0.4);
  }

  .step-card:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(7,23,40,0.16); }

  .about-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 42px;
    align-items: center;
    background:
      radial-gradient(140% 120% at 90% 10%, rgba(31,186,198,0.08), transparent 52%),
      linear-gradient(155deg, rgba(255,252,245,0.94), rgba(242,224,194,0.92));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 24px;
    padding: 34px;
    box-shadow: 0 22px 44px rgba(7,23,40,0.16), inset 0 0 0 1px rgba(255,255,255,0.6);
  }

  .about-image {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 38px rgba(7,23,40,0.16);
    border: 1px solid rgba(217,179,106,0.34);
  }

  .trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .trust-card {
    background: linear-gradient(145deg, rgba(255,252,245,0.96), rgba(244,228,205,0.94));
    border: 1px solid rgba(217,179,106,0.26);
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 14px 28px rgba(7,23,40,0.12);
  }

  .review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }

  .review-card {
    padding: 20px;
    border-radius: 18px;
    background:
      radial-gradient(120% 120% at 20% 16%, rgba(31,186,198,0.08), transparent 50%),
      linear-gradient(145deg, rgba(255,252,245,0.98), rgba(244,228,205,0.95));
    border: 1px solid rgba(217,179,106,0.3);
    box-shadow: 0 18px 34px rgba(7,23,40,0.14);
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    color: #111;
  }

  .review-card:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(7,23,40,0.18); border-color: rgba(217,179,106,0.45); }
  .review-meta { color: #333; font-size: 14px; }

  .reviews-layout {
    display: grid;
    grid-template-columns: minmax(320px, 0.95fr) 1.05fr;
    gap: 18px;
    align-items: start;
  }

  .review-form-card {
    background: linear-gradient(155deg, rgba(255,252,245,0.96), rgba(244,228,205,0.94));
    border: 1px solid rgba(217,179,106,0.32);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 18px 34px rgba(7,23,40,0.16), inset 0 0 0 1px rgba(255,255,255,0.45);
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
    border: 1px solid rgba(217,179,106,0.32);
    background: #f5e8d2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
  }

  .star-button:hover { transform: translateY(-1px); border-color: rgba(217,179,106,0.9); box-shadow: 0 8px 18px rgba(217,179,106,0.2); }
  .rating-value { font-size: 13px; color: var(--muted); margin-left: 6px; }

  .review-status {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f7ebd8;
    border: 1px solid rgba(217,179,106,0.32);
    color: var(--text);
    margin: 8px 0;
  }

  .review-status.error { background: #fff4f4; color: #b42318; border-color: rgba(180,35,24,0.35); }
  .review-status.success { background: #f1f7ef; color: #2b7a0b; border-color: rgba(43,122,11,0.35); }
  .review-status.helper { background: #f2eadc; color: var(--muted); border-style: dashed; }

  .review-empty {
    padding: 18px;
    border: 1px dashed rgba(217,179,106,0.5);
    border-radius: 14px;
    color: var(--muted);
    background: #f7ecda;
  }

  .review-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(31,186,198,0.14), rgba(217,179,106,0.16));
    border: 1px solid rgba(217,179,106,0.32);
    box-shadow: 0 14px 30px rgba(7,23,40,0.14);
  }

  .avg-label { font-size: 13px; color: #a07728; text-transform: uppercase; letter-spacing: 0.3px; }
  .avg-score { font-size: 32px; font-weight: 800; color: #b68634; line-height: 1; }
  .avg-score .avg-total { font-size: 16px; font-weight: 600; color: #b68634; margin-left: 4px; }
  .avg-count { font-size: 13px; color: #7e6232; margin-top: 4px; }
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
    border: 1px solid rgba(217,179,106,0.32);
    background: linear-gradient(145deg, #fffaf1, #f4e6d0);
    cursor: pointer;
    font-weight: 700;
    color: #0b2b3d;
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .page-btn:hover:enabled { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(7,23,40,0.18); border-color: rgba(217,179,106,0.6); }
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
    background: linear-gradient(150deg, rgba(255,252,245,0.94), rgba(244,228,205,0.92));
    border: 1px solid rgba(217,179,106,0.34);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(7,23,40,0.18), inset 0 0 0 1px rgba(255,255,255,0.55);
  }

  .form-field {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  input, textarea {
    width: 100%;
    background: linear-gradient(145deg, rgba(255,252,245,0.92), rgba(244,228,205,0.88));
    border: 1px solid rgba(217,179,106,0.3);
    border-radius: 14px;
    padding: 14px 16px;
    color: var(--text);
    font-size: 15px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.62);
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: rgba(31,186,198,0.7);
    box-shadow: 0 0 0 3px rgba(31, 186, 198, 0.16);
  }

  textarea { resize: vertical; min-height: 140px; }

  .contact-info {
    display: grid;
    gap: 12px;
    padding: 18px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(255,252,245,0.94), rgba(244,228,205,0.9));
    border: 1px solid rgba(217,179,106,0.32);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.62);
  }

  .contact-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 16px 0;
  }

  .footer {
    padding: 70px 24px 46px;
    border-top: 1px solid rgba(217,179,106,0.4);
    background:
      radial-gradient(120% 80% at 12% 10%, rgba(31,186,198,0.16), transparent 52%),
      radial-gradient(120% 90% at 88% 6%, rgba(217,179,106,0.18), transparent 56%),
      linear-gradient(180deg, #06182a, #0b2338 55%, #0f3d52);
    color: #f4efe4;
    box-shadow: 0 -20px 46px rgba(7,23,40,0.32);
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
