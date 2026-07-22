import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Content Creator (1.2M Subs)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    content: 'Immortal transformed my YouTube branding completely! The editing speed, visual effects, and attention to detail are on another level.',
    rating: 5,
    tag: 'VFX & Editing',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Game Studio Director',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    content: 'The custom 3D motion packages were delivered ahead of schedule and exceeded every expectation. Smooth communication throughout.',
    rating: 5,
    tag: '3D Assets',
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Digital Agency Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    content: 'Unmatched aesthetic quality! The web app experience and preset packs gave our launch campaign massive momentum.',
    rating: 5,
    tag: 'Web & Presets',
  },
];

export default function TestimonialsSection() {
  const { settings } = useSettings();
  const [current, setCurrent] = useState(0);

  const getReviews = () => {
    if (!settings?.testimonials_data) return DEFAULT_REVIEWS;
    try {
      const parsed = typeof settings.testimonials_data === 'string'
        ? JSON.parse(settings.testimonials_data)
        : settings.testimonials_data;
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  };

  const reviews = getReviews();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const activeReview = reviews[current] || reviews[0];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-section__inner">
        <motion.div
          className="section-preview__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Endorsements</span>
          <h2 className="section-title">
            Client & Community <span className="text-accent">Reviews</span>
          </h2>
          <p className="section-subtitle">
            What creators, clients, and partners say about working with Immortal.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="testimonials-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id || current}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="testimonial-card__quote-icon">
                <Quote size={40} />
              </div>

              <div className="testimonial-card__rating">
                {[...Array(Number(activeReview.rating) || 5)].map((_, i) => (
                  <Star key={i} size={18} fill="#00F0FF" color="#00F0FF" />
                ))}
              </div>

              <p className="testimonial-card__text">"{activeReview.content}"</p>

              <div className="testimonial-card__user">
                <img
                  src={activeReview.avatar || 'https://picsum.photos/seed/user/200/200'}
                  alt={activeReview.name}
                  className="testimonial-card__avatar"
                />
                <div>
                  <h4 className="testimonial-card__name">{activeReview.name}</h4>
                  <p className="testimonial-card__role">{activeReview.role}</p>
                </div>
                {activeReview.tag && <span className="testimonial-card__tag">{activeReview.tag}</span>}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {reviews.length > 1 && (
            <div className="testimonials-controls">
              <button className="testimonial-btn" onClick={prevSlide} aria-label="Previous review">
                <ChevronLeft size={20} />
              </button>

              <div className="testimonials-dots">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    className={`testimonial-dot ${current === idx ? 'testimonial-dot--active' : ''}`}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button className="testimonial-btn" onClick={nextSlide} aria-label="Next review">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
