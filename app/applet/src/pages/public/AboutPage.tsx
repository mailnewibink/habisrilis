import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-gray-200">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/dvy4znkvy/image/upload/v1786332080/h_4_sxrvod.png" alt="habisrilis.web.id logo" className="h-6 w-auto object-contain" />
            <span className="font-bold text-lg tracking-tighter hidden sm:block">habisrilis<span className="text-gray-600">.web.id</span></span>
          </Link>
          <div className="flex items-center gap-4">
             <Link to="/" className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-black hover:opacity-50 transition-opacity">
               <ArrowLeft className="w-4 h-4" /> Back to Home
             </Link>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto space-y-24">
        
        {/* WHAT Section */}
        <section className="space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              What
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter uppercase leading-[1.1]">
              One place for everything about your release.
            </h1>
          </div>
          <div className="prose prose-gray prose-p:text-lg prose-p:leading-relaxed">
            <p className="font-bold text-black">
              HabisRilis is a dedicated platform for artists, bands, soloists, managers, and labels to create a single page for every music release.
            </p>
            <p>
              Think of it as <strong>your own release hub</strong> — one link where your audience can find everything connected to your music.
            </p>
            <p>
              Streaming platforms, music videos, social media, release information, credits, and more — all organized in one clean, easy-to-share page.
            </p>
            <p className="font-bold uppercase tracking-widest text-sm pt-4 border-t border-gray-100">
              One Release. One Link.
            </p>
          </div>
        </section>

        {/* WHY Section */}
        <section className="space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              Why
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase leading-[1.1]">
              Because releasing your music is only the beginning.
            </h2>
          </div>
          <div className="prose prose-gray prose-p:text-lg prose-p:leading-relaxed">
            <p>One song can live across multiple platforms.</p>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              <li>Spotify.</li>
              <li>Apple Music.</li>
              <li>YouTube Music.</li>
              <li>YouTube.</li>
              <li>TikTok.</li>
              <li>And more.</li>
            </ul>
            <p>Then there are social profiles, credits, release details, and other important links.</p>
            <p>
              Instead of sending your audience in different directions, <strong>bring everything together in one HabisRilis page.</strong>
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mt-12 mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Easy to Share</h3>
                <p className="text-base text-gray-500">Share one link with your audience, media, communities, or across your social platforms.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Clean & Organized</h3>
                <p className="text-base text-gray-500">Keep everything related to a release in one structured place.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Built for Music</h3>
                <p className="text-base text-gray-500">Your release gets its own dedicated page — designed around how music is actually shared and discovered.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Simple & Practical</h3>
                <p className="text-base text-gray-500">No more collecting and sending multiple links. One page connects your audience to everything they need.</p>
              </div>
            </div>

            <p className="font-bold text-black border-l-2 border-black pl-4">
              Your music is already out there. Make it easier for people to find it.
            </p>
          </div>
        </section>

        {/* HOW Section */}
        <section className="space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              How
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase leading-[1.1]">
              Create. Complete. Publish. Share.
            </h2>
          </div>
          
          <div className="space-y-10">
            <div className="flex gap-4 sm:gap-6">
              <div className="font-bold text-sm text-gray-400 mt-1">01</div>
              <div>
                <h3 className="text-lg font-bold tracking-tighter uppercase mb-2">Create Your Release</h3>
                <p className="text-gray-500">Create a new page for your single, EP, album, or any other release.</p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="font-bold text-sm text-gray-400 mt-1">02</div>
              <div>
                <h3 className="text-lg font-bold tracking-tighter uppercase mb-2">Add Everything</h3>
                <p className="text-gray-500">Add your cover artwork, release details, streaming links, music videos, social profiles, credits, and more.</p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="font-bold text-sm text-gray-400 mt-1">03</div>
              <div>
                <h3 className="text-lg font-bold tracking-tighter uppercase mb-2">Publish</h3>
                <p className="text-gray-500">Once everything is ready, publish your release and get your own HabisRilis link.</p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6">
              <div className="font-bold text-sm text-gray-400 mt-1">04</div>
              <div>
                <h3 className="text-lg font-bold tracking-tighter uppercase mb-2">Share</h3>
                <p className="text-gray-500">Put your link in your bio, social media, WhatsApp, press releases, communities, or anywhere you promote your music.</p>
              </div>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-gray-100">
            <p className="font-bold text-xl uppercase tracking-tighter mb-8">
              That's it.
            </p>
            
            <div className="space-y-1 font-medium text-gray-500 text-lg mb-8">
              <p>One release.</p>
              <p>One page.</p>
              <p>One link.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2">HabisRilis.</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Your Release. One Link.
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-white py-12 text-center border-t border-gray-100">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">habisrilis.web.id © 2026 — Made for Music</p>
      </footer>
    </div>
  );
};
