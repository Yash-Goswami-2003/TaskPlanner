'use client';

import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import TaskPlannerPreview from '../components/landing/TaskPlannerPreview';
import AICapabilities from '../components/landing/AICapabilities';
import Comparison from '../components/landing/Comparison';
import Testimonials from '../components/landing/Testimonials';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Navigation Header */}
      <Header />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Interactive Task Planner Visual Hero Preview */}
      <TaskPlannerPreview />

      {/* 4. AI Capabilities Breakdown */}
      <AICapabilities />

      {/* 5. Modern vs Legacy Comparison */}
      <Comparison />

      {/* 6. Social Proof / Testimonials */}
      <Testimonials />

      {/* 7. Bottom Call to Action */}
      <CTASection />

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
