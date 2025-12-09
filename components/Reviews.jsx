import React from 'react';
import { Star } from 'lucide-react';
import SectionHeader from './SectionHeader';

const Reviews = ({ t }) => (
  <section id="reviews" className="section">
    <div className="container">
      <SectionHeader
        eyebrow={t.nav.reviews}
        title={t.reviews.title}
        subtitle={t.reviews.subtitle}
      />

      <div className="review-grid">
        {t.reviews.items.map((review) => (
          <article key={review.name} className="review-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: 16 }}>{review.name}</strong>
                <div className="review-meta">{review.location}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} color="#c7a04f" fill="#c7a04f" />
                ))}
              </div>
            </div>
            <p style={{ marginTop: 12, color: '#111', lineHeight: 1.65 }}>{review.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
