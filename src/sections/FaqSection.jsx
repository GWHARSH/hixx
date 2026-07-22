import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_FAQS = [
  {
    q: 'How can I request custom video editing or VFX packages?',
    a: 'You can reach out directly through the Discord profile widget, or browse the Packages page to view standard tiers. Custom inquiries are handled with tailored project briefs.',
  },
  {
    q: 'What file formats are included in the downloadable packages?',
    a: 'Packages include project files (.aep, .prproj, .blend), 4K ProRes alpha video overlays, sound effects (.wav), and LUTs/Presets ready for drag-and-drop workflow.',
  },
  {
    q: 'How do I access premium or admin-exclusive content?',
    a: 'Login through the Login portal. Authenticated users and admins gain instant access to download mirrors, detailed asset specs, and dashboard management tools.',
  },
  {
    q: 'Are commercial rights included with the package assets?',
    a: 'Yes! All packages purchased or downloaded through Immortal Web come with standard commercial usage licenses for YouTube, Twitch, social media, and client projects.',
  },
  {
    q: 'How often are new uploads and assets published?',
    a: 'New project highlights and asset drops are added regularly. Keep an eye on the Uploads page or check the Discord live status updates for real-time announcements.',
  },
];

export default function FaqSection() {
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');

  const getFaqs = () => {
    if (!settings?.faq_data) return DEFAULT_FAQS;
    try {
      const parsed = typeof settings.faq_data === 'string'
        ? JSON.parse(settings.faq_data)
        : settings.faq_data;
      return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  };

  const faqs = getFaqs();

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="faq-section" id="faq">
      <div className="faq-section__inner">
        <motion.div
          className="section-preview__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Clarifications</span>
          <h2 className="section-title">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about assets, workflow, and access.
          </p>
        </motion.div>

        {/* Search */}
        <div className="faq-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Accordion list */}
        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="empty-state">
              <p>No questions matching "{search}".</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question__text">
                      <HelpCircle size={18} className="faq-question__icon" />
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="faq-question__arrow"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="faq-answer__inner">
                          <p>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
