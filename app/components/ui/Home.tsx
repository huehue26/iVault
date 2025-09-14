"use client";

import { useInsure } from "../../store/insureStore";
import { useEffect, useState, useMemo } from "react";

// Type declarations for external libraries
declare global {
  interface Window {
    gsap: {
      registerPlugin: (plugin: unknown) => void;
      fromTo: (targets: string | HTMLElement, fromVars: object, toVars: object) => void;
      to: (targets: string | HTMLElement, vars: object) => void;
    };
    ScrollTrigger: {
      trigger: string;
      start: string;
      end: string;
      onEnter: () => void;
      onLeaveBack: () => void;
    };
    anime: {
      (params: object): void;
    };
  }
}

export default function Home() {
  const { showLoginPage } = useInsure();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const messages = useMemo(() => [
    "One secure place for all your policies.",
    "Smarter insights for better decisions.",
    "Hassle-free claims processing.",
    "AI-powered policy analysis.",
    "Save up to 40% on premiums.",
    "24/7 claim assistance support."
  ], []);

  const handleLoginClick = () => {
    showLoginPage();
  };

  // Typing effect logic
  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentMessage.length) {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    }, isDeleting ? 50 : 100); // Faster deletion, slower typing

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentMessageIndex, messages]);

  useEffect(() => {
    // Load external scripts
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js');
        
        // Initialize GSAP animations after scripts load
        if (window.gsap) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          initializeAnimations();
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScripts();
  }, []);

  const initializeAnimations = () => {
    // Header scroll animation
    const header = document.getElementById('header');
    if (header && window.gsap) {
      window.gsap.to(header, {
        scrollTrigger: {
          trigger: "body",
          start: "50px top",
          end: "bottom bottom",
          onEnter: () => header.classList.add('bg-white/95', 'shadow-lg'),
          onLeaveBack: () => header.classList.remove('bg-white/95', 'shadow-lg')
        }
      });
    }

    // Hero animations
    if (window.gsap) {
      // Animate the main heading with staggered effect
      window.gsap.fromTo("#hero h1 span", 
        { opacity: 0, y: 50, scale: 0.9 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1.2, 
          stagger: 0.3,
          ease: "power3.out",
          delay: 0.2
        }
      );
      
      // Animate the subtitle
      window.gsap.fromTo("#hero p", 
        { opacity: 0, y: 30, scale: 0.95 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1, 
          delay: 0.8, 
          ease: "power3.out" 
        }
      );
      
      // Animate the upload zone
      window.gsap.fromTo("#upload-zone", 
        { opacity: 0, scale: 0.9, y: 40 }, 
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 1.2, 
          delay: 1.2, 
          ease: "back.out(1.7)" 
        }
      );
    }
  };

  return (
    <div className="bg-white text-neutral-900 overflow-x-hidden">
      <style jsx global>{`
        :root {
          --primary-blue: #0055DE;
          --primary-blue-hover: #0047C7;
        }
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; }
        body { font-family: var(--font-inter), sans-serif; }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .upload-zone {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%);
          border: 2px dashed rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        .upload-zone:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 64, 175, 0.15) 100%);
          border-color: rgba(59, 130, 246, 0.5);
          transform: scale(1.02);
        }
        .star-rating {
          color: #fbbf24;
          filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.5));
        }
        .testimonial-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .hero-bg {
          background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }
        .section-divider {
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
          height: 1px;
        }
        #insights {
          position: relative;
          overflow: hidden;
        }
        #insights::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background-image: linear-gradient(90deg, rgba(191, 219, 254, 0.4) 1px, transparent 1px),
                            linear-gradient(180deg, rgba(191, 219, 254, 0.4) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: move-bg 20s linear infinite;
          opacity: 0.7;
          z-index: 0;
        }
        #insights > .container {
          position: relative;
          z-index: 1;
        }
        @keyframes move-bg {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }
        .hero-text-animate {
          animation: heroTextReveal 1.5s ease-out forwards;
        }
        @keyframes heroTextReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .hero-subtitle-animate {
          animation: heroSubtitleReveal 1.2s ease-out 0.6s forwards;
          opacity: 0;
        }
        @keyframes heroSubtitleReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .typing-cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div id="page-wrapper" className="bg-white text-neutral-900">
        {/* Header */}
        <header id="header" className="fixed top-0 w-full glass-morphism border-b border-neutral-200/20 z-50 transition-all duration-300">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="fa-solid fa-shield-halved text-3xl gradient-text"></i>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur opacity-20 animate-pulse-slow"></div>
              </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">iVault</span>
            </div>
              
              <div className="hidden lg:flex items-center space-x-8">
                <a href="#hero" className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer font-medium relative group">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer font-medium relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#how-it-works" className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer font-medium relative group">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#insights" className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer font-medium relative group">
                Insights
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#reviews" className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer font-medium relative group">
                  Reviews
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#footer" className="text-neutral-600 hover:text-neutral-900 transition-all duration-300 cursor-pointer font-medium relative group">
                Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLoginClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Login
              </button>
                
                <button className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                  <i className="fa-solid fa-bars text-xl"></i>
                </button>
            </div>
          </div>
          </nav>
      </header>

      {/* Hero Section */}
        <section id="hero" className="relative pt-32 pb-20 px-6 min-h-[700px] flex items-center hero-bg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50"></div>
          <div className="hero-blob absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="hero-blob absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '-3s'}}></div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 bg-clip-text text-transparent">Your Insurance.</span><br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent animate-pulse-slow">Secured. Simplified.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-600 mb-16 max-w-3xl mx-auto font-medium leading-relaxed min-h-[3rem] flex items-center justify-center">
                <span className="text-center">
                  {displayedText}
                  <span className="typing-cursor text-blue-600 font-bold">|</span>
                </span>
              </p>
              
              <div className="w-full mx-auto">
                <div id="upload-zone" className="upload-zone rounded-2xl p-8 md:p-12 cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="mb-6 relative w-16 h-16 mx-auto">
                      <i className="fa-solid fa-cloud-arrow-up text-6xl text-blue-500 group-hover:text-blue-700 transition-all duration-300 animate-bounce-slow"></i>
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <p className="text-xl text-neutral-700 font-semibold mb-2">Drag & Drop Your Policies</p>
                    <p className="text-neutral-500 font-medium">PDF, Word, or Image files</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">PDF</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">DOCX</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">JPG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How iVault Works */}
        <section id="how-it-works" className="py-20 px-6 bg-white overflow-hidden">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">Three Simple Steps</h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-medium">Insurance clarity and optimization made easy.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              {/* Step 1 */}
              <div className="step-item flex items-center">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 border-2 border-dashed border-teal-400 rounded-full"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <i className="fa-solid fa-upload text-3xl text-teal-500 mb-3"></i>
                    <h3 className="text-lg font-bold text-neutral-800 uppercase">Upload Policy</h3>
                    <p className="text-neutral-500 text-xs leading-tight mt-2">Secure drag & drop with encrypted storage for your documents.</p>
                  </div>
              </div>
                </div>

              {/* Arrow */}
              <div className="step-connector text-5xl text-teal-500 md:mx-4 my-4 md:my-0 md:transform-none transform rotate-90">
                <i className="fa-solid fa-arrow-right-long"></i>
                </div>

              {/* Step 2 */}
              <div className="step-item flex items-center">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 border-2 border-dashed border-amber-400 rounded-full"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <i className="fa-solid fa-brain text-3xl text-amber-500 mb-3"></i>
                    <h3 className="text-lg font-bold text-neutral-800 uppercase">Get AI Analysis</h3>
                    <p className="text-neutral-500 text-xs leading-tight mt-2">Our AI highlights premiums, exclusions, and coverage gaps.</p>
                </div>
              </div>
            </div>

              {/* Arrow */}
              <div className="step-connector text-5xl text-amber-500 md:mx-4 my-4 md:my-0 md:transform-none transform rotate-90">
                <i className="fa-solid fa-arrow-right-long"></i>
              </div>
              
              {/* Step 3 */}
              <div className="step-item flex items-center">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-full"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <i className="fa-solid fa-dollar-sign text-3xl text-blue-500 mb-3"></i>
                    <h3 className="text-lg font-bold text-neutral-800 uppercase">Optimize & Save</h3>
                    <p className="text-neutral-500 text-xs leading-tight mt-2">Get personalized recommendations and cost optimization strategies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Uncover Hidden Risks */}
        <section id="insights" className="py-20 px-6 bg-blue-50">
          <div className="container mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">Uncover Your Hidden Risks</h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto font-medium">Life is unpredictable. Your insurance coverage shouldn&apos;t be. Here are some common gaps people discover too late.</p>
          </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Insight Card 1: Health */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-gray-200 text-center flex flex-col">
                <div className="mb-4">
                  <i className="fa-solid fa-hospital-user text-5xl text-red-500"></i>
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3">The High Cost of Health</h3>
                <p className="text-neutral-600 flex-grow">A single major medical event can lead to financial hardship. Over 60% of bankruptcies are tied to medical bills, often affecting those who thought they were covered.</p>
                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold w-full">Analyze My Health Policy</button>
              </div>
              
              {/* Insight Card 2: Property */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-gray-200 text-center flex flex-col">
                <div className="mb-4">
                  <i className="fa-solid fa-house-damage text-5xl text-amber-500"></i>
              </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3">When Disaster Strikes Home</h3>
                <p className="text-neutral-600 flex-grow">Standard home insurance doesn&apos;t cover everything. Floods, earthquakes, and even simple water damage from a burst pipe can cost tens of thousands in unexpected repairs.</p>
                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold w-full">Review Home & Auto Coverage</button>
            </div>
              
              {/* Insight Card 3: Income/Life */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-gray-200 text-center flex flex-col">
                <div className="mb-4">
                  <i className="fa-solid fa-shield-heart text-5xl text-green-500"></i>
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-3">Protecting Your Family&apos;s Future</h3>
                <p className="text-neutral-600 flex-grow">Is your family prepared for the loss of your income? Without adequate life or disability insurance, loved ones could face financial instability within a few months.</p>
                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold w-full">Assess My Life Insurance</button>
            </div>
          </div>
        </div>
      </section>

        {/* Core Features */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="container mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">Everything You Need</h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-medium">Comprehensive tools to manage, analyze, and optimize your insurance portfolio</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto" style={{perspective: '1000px'}}>
              {/* Card 1 */}
              <div className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-blue-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-chart-line text-4xl text-blue-500 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Premium Analysis</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Track and analyze premium trends with detailed insights and predictive analytics for better financial planning.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-teal-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-magnifying-glass text-4xl text-teal-500 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Coverage Review</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Comprehensive policy reviews with AI-powered analysis to identify gaps and optimization opportunities.</p>
          </div>
              {/* Card 3 */}
              <div className="bg-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-amber-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-piggy-bank text-4xl text-amber-500 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Cost Optimization</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Find savings opportunities through smart comparisons and personalized recommendations from top insurers.</p>
                </div>
              {/* Card 4 */}
              <div className="bg-rose-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-rose-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-vault text-4xl text-rose-500 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Vault Storage</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Secure document storage with military-grade encryption and instant access from any device, anywhere.</p>
            </div>
              {/* Card 5 */}
              <div className="bg-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-teal-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-tags text-4xl text-teal-500 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Featured Offers</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Exclusive insurance deals and promotions tailored to your profile with up to 40% savings potential.</p>
                </div>
              {/* Card 6 */}
              <div className="bg-rose-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-rose-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-hands-helping text-4xl text-rose-500 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Claim Assistance</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Streamlined claim process with 24/7 support and automated documentation for faster settlements.</p>
            </div>
              {/* Card 7 */}
              <div className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-blue-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-magic-wand-sparkles text-4xl text-blue-500 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Policy Genie</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">AI-powered recommendations engine that learns your preferences and suggests optimal coverage options.</p>
                </div>
              {/* Card 8 */}
              <div className="bg-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-transparent hover:border-amber-200 group">
                <div className="relative mb-6">
                  <i className="fa-solid fa-bell text-4xl text-amber-500 group-hover:scale-110 transition-transform duration-300"></i>
              </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800">Smart Alerts</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Never miss important dates with intelligent notifications for renewals, payments, and policy updates.</p>
            </div>
          </div>
        </div>
      </section>

        {/* Customer Reviews */}
        <section id="reviews" className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-blue-50/20"></div>
          <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">What Our Customers Say</h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-medium">Trusted by thousands of policyholders worldwide with a 4.9/5 rating</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="testimonial-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 card-hover">
                <div className="flex items-center mb-6">
                  <img src="https://placehold.co/64x64/3B82F6/ffffff?text=SJ" alt="Sarah Johnson" className="w-16 h-16 rounded-full mr-4 shadow-lg" />
                  <div>
                    <h4 className="text-lg font-bold text-neutral-800">Sarah Johnson</h4>
                    <p className="text-neutral-600 text-sm">Marketing Director</p>
                    <div className="flex star-rating mt-1">
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-700 leading-relaxed italic">&quot;iVault saved me $800 on my insurance premiums. The AI analysis found gaps I never knew existed. The platform is incredibly intuitive and the insights are spot-on.&quot;</p>
                <div className="mt-4 flex items-center text-sm text-neutral-500">
                  <i className="fa-solid fa-calendar-check mr-2"></i>
                  Verified Customer • 3 months ago
                </div>
          </div>
              
              <div className="testimonial-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 card-hover">
                <div className="flex items-center mb-6">
                  <img src="https://placehold.co/64x64/1E40AF/ffffff?text=MC" alt="Michael Chen" className="w-16 h-16 rounded-full mr-4 shadow-lg" />
                  <div>
                    <h4 className="text-lg font-bold text-neutral-800">Michael Chen</h4>
                    <p className="text-neutral-600 text-sm">Small Business Owner</p>
                    <div className="flex star-rating mt-1">
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
              </div>
            </div>
              </div>
                <p className="text-neutral-700 leading-relaxed italic">&quot;Finally, all my policies in one place. The insights dashboard is incredibly helpful for planning. The claim assistance feature saved me hours of paperwork.&quot;</p>
                <div className="mt-4 flex items-center text-sm text-neutral-500">
                  <i className="fa-solid fa-calendar-check mr-2"></i>
                  Verified Customer • 6 months ago
            </div>
              </div>
              
              <div className="testimonial-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 card-hover">
                <div className="flex items-center mb-6">
                  <img src="https://placehold.co/64x64/3B82F6/ffffff?text=ER" alt="Emily Rodriguez" className="w-16 h-16 rounded-full mr-4 shadow-lg" />
                  <div>
                    <h4 className="text-lg font-bold text-neutral-800">Emily Rodriguez</h4>
                    <p className="text-neutral-600 text-sm">Financial Advisor</p>
                    <div className="flex star-rating mt-1">
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
                      <i className="fa-solid fa-star text-sm"></i>
            </div>
              </div>
            </div>
                <p className="text-neutral-700 leading-relaxed italic">&quot;The claim assistance feature made filing a claim so much easier. Highly recommend iVault! The security features give me complete peace of mind.&quot;</p>
                <div className="mt-4 flex items-center text-sm text-neutral-500">
                  <i className="fa-solid fa-calendar-check mr-2"></i>
                  Verified Customer • 1 month ago
              </div>
            </div>
              </div>

            <div className="text-center mt-12">
              <div className="inline-flex flex-wrap items-center justify-center space-x-4 md:space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-center p-2">
                  <div className="text-3xl font-bold text-neutral-800">4.9/5</div>
                  <div className="flex star-rating justify-center mb-1">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
            </div>
                  <div className="text-sm text-neutral-600">Average Rating</div>
              </div>
                <div className="w-px h-12 bg-neutral-300 hidden md:block"></div>
                <div className="text-center p-2">
                  <div className="text-3xl font-bold text-neutral-800">50K+</div>
                  <div className="text-sm text-neutral-600">Happy Customers</div>
            </div>
                <div className="w-px h-12 bg-neutral-300 hidden md:block"></div>
                <div className="text-center p-2">
                  <div className="text-3xl font-bold text-neutral-800">$2.1M</div>
                  <div className="text-sm text-neutral-600">Total Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
        <footer id="footer" className="bg-gradient-to-br from-neutral-50 to-blue-50/30 py-16 px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <i className="fa-solid fa-shield-halved text-3xl gradient-text"></i>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur opacity-20"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">iVault</span>
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed">Secure insurance management for the modern world. Trusted by thousands of users worldwide.</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <i className="fa-brands fa-facebook"></i>
                  </a>
              </div>
            </div>
              
            <div>
                <h4 className="text-lg font-bold text-neutral-800 mb-6">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Features</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Pricing</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Security</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">API</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Integrations</a></li>
              </ul>
            </div>
              
            <div>
                <h4 className="text-lg font-bold text-neutral-800 mb-6">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Help Center</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Contact Us</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium flex items-center">
                    <i className="fa-brands fa-whatsapp mr-2 text-blue-500"></i>
                    WhatsApp
                  </a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Community</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Status</a></li>
              </ul>
            </div>
              
            <div>
                <h4 className="text-lg font-bold text-neutral-800 mb-6">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Privacy Policy</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Terms of Service</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">Cookie Policy</a></li>
                  <li><a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium">GDPR</a></li>
                </ul>
              </div>
            </div>
            
            <div className="section-divider mb-8"></div>
            
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <p className="text-neutral-600 font-medium">© 2025 iVault. All rights reserved.</p>
              <div className="flex items-center space-x-6 mt-4 lg:mt-0">
                <span className="text-sm text-neutral-500">Made with</span>
                <i className="fa-solid fa-heart text-blue-500 animate-pulse"></i>
                <span className="text-sm text-neutral-500">for better insurance</span>
          </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}