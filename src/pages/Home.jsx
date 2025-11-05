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
    </main>
  );
};

export default Home;
