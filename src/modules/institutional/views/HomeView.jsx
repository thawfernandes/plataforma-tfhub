import React, { useEffect, useState } from 'react';
import { mockDb } from '../../../services/mockDb';
import { youtubeService } from '../../../services/youtubeService';
import { Spinner } from '../../../components/index';

// Landing Page Sections
import HeroSection           from '../sections/HeroSection';
import FeaturedProductsSection from '../sections/FeaturedProductsSection';
import ServicesSection       from '../sections/ServicesSection';
import HowWeWorkSection      from '../sections/HowWeWorkSection';
import TeamSection           from '../sections/TeamSection';
import PortfolioSection      from '../sections/PortfolioSection';
import ContentSection        from '../sections/ContentSection';
import TestimonialsSection   from '../sections/TestimonialsSection';
import FAQSection            from '../sections/FAQSection';
import ContactSection        from '../sections/ContactSection';

export default function HomeView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      const p = mockDb.get('products') || [];
      const s = mockDb.get('services') || [];
      const c = mockDb.get('content') || [];
      const t = mockDb.get('testimonials') || [];
      const f = mockDb.get('faq') || [];
      const tm = mockDb.get('team') || [];
      const port = mockDb.get('portfolio') || [];
      const settings = mockDb.get('settings') || {};

      // Load YouTube videos
      const ytVideos = await youtubeService.getLatestVideos();

      setData({
        settings,
        products: p,
        services: s,
        content: [...c, ...ytVideos],
        portfolio: port,
        team: tm,
        testimonials: t,
        faq: f
      });
    };

    loadHomeData();

    // Listen for simulated uploads to update home page content
    const handleSync = () => {
      loadHomeData();
    };
    window.addEventListener('tf_youtube_synced', handleSync);
    return () => window.removeEventListener('tf_youtube_synced', handleSync);
  }, []);

  // Full-page loading state
  if (!data) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        color: 'var(--text-muted)',
        flexDirection: 'column'
      }}>
        <Spinner size="lg" />
        <p style={{ fontSize: '0.9rem' }}>Carregando a plataforma…</p>
      </div>
    );
  }

  return (
    <main>
      <HeroSection settings={data.settings} />
      <FeaturedProductsSection products={data.products} />
      <ServicesSection services={data.services} />
      <HowWeWorkSection />
      <TeamSection team={data.team} />
      <PortfolioSection projects={data.portfolio} />
      <ContentSection content={data.content} />
      <TestimonialsSection testimonials={data.testimonials} />
      <FAQSection faq={data.faq} />
      <ContactSection />
    </main>
  );
}
