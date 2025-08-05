'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  ClockIcon,
  TagIcon 
} from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  category: string
  tags: string
  views: number
  createdAt: string
  author: {
    name: string
  }
}

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [search, selectedCategory])

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/knowledge-base?${params}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(articles.map(article => article.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Knowledge Base
          </h1>
          <p className="text-xl text-gray-600">
            ค้นหาคำตอบสำหรับปัญหาที่พบบ่อยและคู่มือการใช้งาน
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="ค้นหาบทความ, คู่มือ, หรือคำแนะนำ..."
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                หมวดหมู่
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ทั้งหมด ({articles.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category} ({articles.filter(a => a.category === category).length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="lg:w-3/4">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ไม่พบบทความที่ค้นหา
                </h3>
                <p className="text-gray-500">
                  ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่ที่แตกต่าง
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/knowledge-base/${article.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {article.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {article.views}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(article.createdAt).toLocaleDateString('th-TH')}
                      <span className="mx-2">•</span>
                      โดย {article.author.name}
                    </div>
                    
                    {article.tags && (
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {article.tags.split(',').map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
