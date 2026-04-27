import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  Award,
  Zap,
  Shield,
  Trophy,
  Play,
} from "lucide-react";

import SEO from "../components/seo/SEO";
import "./Home.css";

function Home() {
  return (
    <>
      <SEO
        title="Bilim olishning yangi yo'li"
        description="Online ta'lim platformasi. Dasturlash, dizayn, marketing va boshqa sohalardan eng yaxshi mutaxassislardan o'rganing. 500+ dan ortiq kurslar mavjud."
        keywords="online kurs, darslik, dasturlash kursi, dizayn kursi, ta'lim, uzbek kurslar"
        url="/"
      />

      <div className="home">
        {/* ============ HERO SECTION ============ */}
        <section className="hero">
          {/* Animated background orbs */}
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-grid-bg"></div>

          <div className="container hero-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>Zamonaviy ta'lim platformasi</span>
              </div>

              <h1 className="hero-title">
                Bilim olishning <br />
                <span className="gradient-text">yangi usuli</span>
              </h1>

              <p className="hero-description">
                Eng yaxshi mutaxassislardan o'rganing. Istalgan vaqtda, istalgan
                joyda. 500+ dan ortiq kurslar va minglab faol o'quvchilar.
              </p>

              <div className="hero-actions">
                <Link to="/courses" className="btn btn-primary btn-lg">
                  Kurslarni ko'rish
                  <ArrowRight size={20} />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  <Play size={18} />
                  Boshlash
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ STATS SECTION ============ */}
        <section className="stats">
          <div className="container">
            <div className="stats-grid">
              {[
                { icon: Users, value: "10K+", label: "O'quvchilar" },
                { icon: BookOpen, value: "500+", label: "Kurslar" },
                { icon: Award, value: "50+", label: "O'qituvchilar" },
                { icon: Trophy, value: "95%", label: "Muvaffaqiyat" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="stat-card"
                >
                  <stat.icon className="stat-icon" size={32} />
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FEATURES SECTION ============ */}
        <section className="features">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <div className="section-badge">
                <Sparkles size={14} />
                <span>Bizning afzalliklarimiz</span>
              </div>
              <h2>
                Nega <span className="gradient-text">Darslik</span>?
              </h2>
              <p>Sizga eng yaxshi ta'lim tajribasini taqdim etamiz</p>
            </motion.div>

            <div className="features-grid">
              {[
                {
                  icon: Zap,
                  title: "Tez va samarali",
                  description:
                    "Istalgan vaqtda o'rganing, kursni o'z tempingizda tugating",
                },
                {
                  icon: Shield,
                  title: "Ishonchli kontent",
                  description:
                    "Barcha kurslar mutaxassislar tomonidan tekshirilgan va tasdiqlangan",
                },
                {
                  icon: Trophy,
                  title: "Sertifikat",
                  description:
                    "Kursni tugatganingizdan so'ng rasmiy sertifikat oling",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="feature-card"
                >
                  <div className="feature-icon-wrapper">
                    <feature.icon size={28} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA SECTION ============ */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="cta-card"
            >
              <div className="cta-glow"></div>
              <h2>
                Bilim olishni <span className="gradient-text">bugun</span>{" "}
                boshlang
              </h2>
              <p>
                10,000+ o'quvchi allaqachon bizga ishondi. Siz ham qo'shiling!
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Bepul ro'yxatdan o'tish
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
