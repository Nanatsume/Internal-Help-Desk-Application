'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  UserIcon 
} from '@heroicons/react/24/outline'

interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string
  views: number
  createdAt: string
  updatedAt: string
  author: {
    name: string
  }
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge-base/${id}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      } else {
        router.push('/knowledge-base')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      router.push('/knowledge-base')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          กลับไปยัง Knowledge Base
        </button>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {article.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <EyeIcon className="h-4 w-4 mr-1" />
                {article.views} ครั้ง
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                โดย {article.author.name}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                สร้างเมื่อ {new Date(article.createdAt).toLocaleDateString('th-TH')}
              </div>
              {article.updatedAt !== article.createdAt && (
                <div className="flex items-center">
                  อัปเดตล่าสุด {new Date(article.updatedAt).toLocaleDateString('th-TH')}
                </div>
              )}
            </div>
            
            {article.tags && (
              <div className="flex items-center mt-4">
                <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose max-w-none">
              <div 
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                    .replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                    .replace(/## (.*)/g, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
                    .replace(/### (.*)/g, '<h3 class="text-lg font-medium text-gray-800 mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                    .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
                }}
              />
            </div>
          </div>
        </article>

        {/* Related Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ยังไม่พบคำตอบที่ต้องการ?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/tickets/new')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              สร้าง Ticket ใหม่
            </button>
            <button
              onClick={() => router.push('/knowledge-base')}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              ค้นหาบทความอื่น
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
