import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forceHttps } from '../utils/security';

export default function PackageCard({ pkg, index = 0 }) {
  // 3D Tilt calculation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          to={`/packages/${pkg.slug || pkg.id}`}
          className="card card--package tilt-card"
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <div className="card__image-wrap">
            <img
              src={forceHttps(pkg.thumbnail) || `https://picsum.photos/seed/pkg${pkg.id}/600/400`}
              alt={pkg.title}
              className="card__image"
              loading="lazy"
            />
            <div className="card__category-badge card__category-badge--pkg">
              {pkg.category || 'Standard'}
            </div>
            <div className="card__overlay-icon">
              <ArrowUpRight size={20} />
            </div>
            <div className="card__shine" />
          </div>
          <div className="card__body">
            <h3 className="card__title">{pkg.title}</h3>
            <p className="card__desc">{pkg.description}</p>
            <div className="card__meta">
              {pkg.rating && (
                <span className="card__rating">
                  <Star size={14} fill="currentColor" /> {pkg.rating}
                </span>
              )}
              <span>
                <Zap size={14} /> {pkg.category || 'Standard'}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
