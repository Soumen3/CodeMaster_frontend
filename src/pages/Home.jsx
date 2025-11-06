import React from "react";

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 antialiased">
      <section className="relative overflow-hidden">
        {/* animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black opacity-90" />
          <svg className="w-full h-full opacity-20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#071028" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Build your coding skills
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-300 ml-2">with real problems</span>
              </h1>

              <p className="mt-4 text-gray-300 max-w-xl">
                Practice algorithm and system-design problems, tag and filter by topics, and submit code that runs in our sandboxed runner.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/problems" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md transform hover:-translate-y-1 transition">
                  Browse Problems
                </a>
                <a href="/login" className="inline-flex items-center gap-2 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  Sign in
                </a>
              </div>

              <div className="mt-8 text-sm text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Trusted test runner • Fast feedback
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-md p-6 bg-linear-to-br from-gray-800/60 to-gray-900/60 rounded-2xl backdrop-blur-md border border-gray-800 shadow-xl transform transition-all hover:scale-105">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Live Code</div>
                <pre className="mt-3 bg-transparent text-sm text-green-300 rounded-md overflow-auto" style={{maxHeight: 320}}>
{`#include <bits/stdc++.h>
using namespace std;

int main(){
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  int n; cin>>n; cout<<n*2<<"\n";
}
`}
                </pre>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-md text-sm">Run</button>
                  <button className="px-3 py-1 bg-transparent border border-gray-700 rounded-md text-sm">Copy</button>
                </div>
              </div>

              {/* subtle floating dots for motion */}
              <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-indigo-500 opacity-10 animate-pulse" />
              <div className="absolute -right-10 -bottom-6 w-32 h-32 rounded-full bg-cyan-400 opacity-8 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

  <section className="bg-gray-800/40 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6">Featured Topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:scale-105 transform transition">Arrays</div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:scale-105 transform transition">Graphs</div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:scale-105 transform transition">Dynamic Programming</div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:scale-105 transform transition">System Design</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CodeMaster?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to excel in coding interviews and improve your problem-solving skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Code Execution</h3>
              <p className="text-gray-400">
                Write and test your code instantly with our fast, sandboxed code runner supporting multiple languages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-400">
                Monitor your improvement with detailed statistics and see how you compare with other developers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Tags & Filters</h3>
              <p className="text-gray-400">
                Organize problems by topics, difficulty, and companies to focus on what matters most to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">500+</div>
              <div className="text-gray-400">Coding Problems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">10+</div>
              <div className="text-gray-400">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Practice Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started in three simple steps and begin your coding journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Problem</h3>
                <p className="text-gray-400">
                  Browse our extensive library and pick a problem that matches your skill level and interests.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-600 -z-10"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Write Your Solution</h3>
                <p className="text-gray-400">
                  Code your solution in your preferred language with our intuitive online editor.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 -z-10"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Test & Submit</h3>
                <p className="text-gray-400">
                  Run test cases, debug your code, and submit when you're ready. Get instant feedback!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-800/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-400">Join thousands of developers improving their skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  AS
                </div>
                <div className="ml-3">
                  <div className="font-semibold">Alex Smith</div>
                  <div className="text-sm text-gray-400">Software Engineer</div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "CodeMaster helped me land my dream job at a FAANG company. The problems are well-curated and the platform is super smooth!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                  MK
                </div>
                <div className="ml-3">
                  <div className="font-semibold">Maria Kim</div>
                  <div className="text-sm text-gray-400">Full Stack Developer</div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The real-time code execution and immediate feedback make learning so much faster. Best coding platform I've used!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  RJ
                </div>
                <div className="ml-3">
                  <div className="font-semibold">Raj Patel</div>
                  <div className="text-sm text-gray-400">CS Student</div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "As a student, CodeMaster has been invaluable for interview prep. The tag system helps me focus on specific topics."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Skills?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join CodeMaster today and start solving problems that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/login" 
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Get Started Free
            </a>
            <a 
              href="/problems" 
              className="px-8 py-3 border border-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
              Explore Problems
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
