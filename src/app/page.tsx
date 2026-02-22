import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070910] text-[#f8fafc] selection:bg-indigo-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#070910]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20" />
            <span className="font-bold text-lg tracking-tight">LiteDash</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="https://docs.litellm.ai/docs/" target="_blank" className="hover:text-white transition-colors">Documentation</a>
            <Link href="/login" className="px-5 py-2 rounded-full bg-white text-black hover:bg-slate-200 transition-all font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="relative px-6 max-w-7xl mx-auto text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-400 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: Enhanced Multi-Model Management
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            One Gateway for all <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              your AI Infrastructure
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            LiteDash is the premium dashboard for LiteLLM. Manage 100+ LLMs with a single API, control budgets, and gain deep observability into your AI spend.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2">
              Deploy Instantly
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <a href="https://docs.litellm.ai/docs/" target="_blank" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center justify-center">
              View Documentation
            </a>
          </div>

          {/* Feature Showcase / Dashboard Preview */}
          <div className="relative group max-w-6xl mx-auto mb-32">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0e1a] shadow-2xl">
              <div className="flex items-center gap-2 px-6 h-12 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                </div>
                <div className="flex-grow text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">dashboard_preview.v1</div>
              </div>
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src="/dashboard_preview.png"
                  alt="LiteDash Dashboard Overview"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="opacity-90 contrast-[1.1] saturate-[1.1]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e1a] via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 max-w-7xl mx-auto mb-32 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Scaling Enterprise AI</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Enterprise-grade controls that don't compromise on ease of use.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Unified LLM Access',
                desc: 'Connect to OpenAI, Anthropic, Azure, Google, and 100+ others through a single, standardized endpoint.',
                icon: 'M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 0110 0v1h1a1 1 0 110 2h-1v1a5 5 0 01-10 0v-1H4a1 1 0 110-2h1v-1z'
              },
              {
                title: 'Granular Budgets',
                desc: 'Prevent runaway costs with user-level, key-level, and model-level budget caps and real-time tracking.',
                icon: 'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v5.25H7.5a.75.75 0 000 1.5h4.5a.75.75 0 00.75-.75V6z'
              },
              {
                title: 'Global Observability',
                desc: 'Comprehensive logging and auditing for every single request. Gain instant insights into performance and usage.',
                icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-400">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 max-w-5xl mx-auto mb-32">
          <div className="relative p-12 md:p-24 rounded-[3rem] overflow-hidden text-center">
            <div className="absolute inset-0 bg-indigo-600 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Ready to take control <br /> of your AI stack?</h2>
              <Link href="/login" className="inline-flex px-10 py-5 rounded-2xl bg-white text-indigo-600 font-bold hover:scale-105 transition-transform duration-300 shadow-2xl">
                Get Started Now — It's Free
              </Link>
              <p className="mt-6 text-indigo-100 text-sm font-medium opacity-80">Simple self-hosting. No credit card required.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-6 h-6 rounded bg-white" />
            <span className="font-bold text-sm tracking-tight text-white">LiteDash</span>
          </div>
          <p className="text-slate-500 text-xs">© 2026 LiteDash. Built for the LiteLLM Community.</p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="https://docs.litellm.ai/docs/" target="_blank" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://docs.litellm.ai/docs/" target="_blank" className="hover:text-white transition-colors">Discord</a>
            <a href="https://docs.litellm.ai/docs/" target="_blank" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
