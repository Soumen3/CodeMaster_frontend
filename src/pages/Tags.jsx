import React from 'react'

const Tags = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="max-w-3xl p-8">
        <h1 className="text-2xl font-semibold mb-4">Tags</h1>
        <p className="text-gray-300 mb-6">Browse problems by tags. This page will list tags and counts and allow filtering problems by topic.</p>
        <div className="flex flex-wrap gap-3">
          {['arrays','graphs','dp','strings','greedy','trees'].map(tag => (
            <a key={tag} href={`/problems?tag=${tag}`} className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-sm hover:bg-indigo-600 hover:text-white transition">#{tag}</a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tags
