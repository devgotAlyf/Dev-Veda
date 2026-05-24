'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle, 
  BrainCircuit, 
  Sparkles, 
  Pointer
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-navy font-sans">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-cream border-b-2 border-navy/10 shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-navy" size={28} />
          <span className="font-serif text-xl font-black text-navy tracking-tight">VedaAI</span>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:py-32 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber/40 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sage/30 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <svg className="absolute top-1/2 left-0 transform -translate-y-1/2" fill="none" height="200" viewBox="0 0 1440 200" width="100%">
              <path d="M0 100C150 50 300 150 450 100C600 50 750 150 900 100C1050 50 1200 150 1440 100" stroke="#4D7C6F" strokeDasharray="10 10" strokeWidth="1"></path>
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <h1 className="font-serif text-5xl md:text-7xl font-black text-navy leading-[1.15]">
                Smart AI Assessments For <span className="text-amber">Modern Education</span>
              </h1>
              <p className="text-lg md:text-xl text-navy/70 font-sans leading-relaxed max-w-xl">
                Empower your teaching with VedaAI. Generate rigorous, curriculum-aligned exams and assessments in seconds. Spend less time formatting and more time educating.
              </p>
              <div className="pt-4">
                <Link 
                  href="/create"
                  className="bg-amber text-white px-8 py-4 rounded-lg font-sans font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-3"
                >
                  Generate Assessment
                  <ArrowRight size={24} />
                </Link>
              </div>
            </div>
            
            {/* Mandatory Empty Second Column */}
            <div className="hidden md:block min-h-[400px]"></div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6">
          <div className="border-t border-b border-navy/10 h-1 w-full my-8"></div>
        </div>

        {/* Features Section */}
        <section className="px-6 py-20 pb-32 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy">Product Features</h2>
            <p className="font-sans text-navy/60 max-w-2xl mx-auto">
              A suite of academic tools designed to elevate the standard of digital evaluation and feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white border border-navy/5 rounded-xl hover:border-sage/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage group-hover:text-white transition-colors duration-300 text-sage">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-navy">High Quality</h3>
              <p className="font-sans text-sm text-navy/70 leading-relaxed">
                Assessments are cross-referenced with educational standards to ensure academic rigor and accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white border border-navy/5 rounded-xl hover:border-sage/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage group-hover:text-white transition-colors duration-300 text-sage">
                <BrainCircuit size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-navy">Intelligent Design</h3>
              <p className="font-sans text-sm text-navy/70 leading-relaxed">
                AI-driven logic creates balanced papers with varying difficulty levels based on your criteria.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white border border-navy/5 rounded-xl hover:border-sage/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage group-hover:text-white transition-colors duration-300 text-sage">
                <Sparkles size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-navy">Latest Technology</h3>
              <p className="font-sans text-sm text-navy/70 leading-relaxed">
                Powered by the most advanced LLMs trained specifically for pedagogical content generation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-white border border-navy/5 rounded-xl hover:border-sage/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage group-hover:text-white transition-colors duration-300 text-sage">
                <Pointer size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-navy">User Friendly</h3>
              <p className="font-sans text-sm text-navy/70 leading-relaxed">
                Intuitive workspace that feels like a familiar notebook. No complex prompt engineering required.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
