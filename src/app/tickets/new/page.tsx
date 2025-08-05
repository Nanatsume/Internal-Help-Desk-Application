'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  PaperClipIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

export default function NewTicket() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('priority', formData.priority)
      
      files.forEach((file, index) => {
        submitData.append(`files`, file)
      })

      const response = await fetch('/api/tickets', {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        router.push('/tickets')
      } else {
        alert('เกิดข้อผิดพลาดในการสร้าง Ticket')
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('เกิดข้อผิดพลาดในการสร้าง Ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              สร้าง Ticket ใหม่
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              แจ้งปัญหาหรือขอความช่วยเหลือจากทีม IT Support
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                หัวข้อปัญหา <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="เช่น ไม่สามารถเข้าถึง Email ได้"
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                ระดับความสำคัญ
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="LOW">ต่ำ - ไม่เร่งด่วน</option>
                <option value="MEDIUM">ปานกลาง - ปกติ</option>
                <option value="HIGH">สูง - ต้องการความช่วยเหลือเร็ว</option>
                <option value="URGENT">เร่งด่วน - ส่งผลต่องานอย่างมาก</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                รายละเอียดปัญหา <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="อธิบายปัญหาที่พบ, ขั้นตอนที่ทำ, และข้อผิดพลาดที่เกิดขึ้น..."
              />
              <p className="mt-1 text-sm text-gray-500">
                โปรดระบุรายละเอียดให้ครบถ้วนเพื่อให้ทีมงานสามารถช่วยเหลือได้อย่างรวดเร็ว
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                แนบไฟล์ (ถ้ามี)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                <div className="text-center">
                  <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="files" className="cursor-pointer">
                      <span className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        เลือกไฟล์
                      </span>
                      <input
                        id="files"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    รองรับ: รูปภาพ, PDF, Word, Text files (สูงสุด 10MB ต่อไฟล์)
                  </p>
                </div>
              </div>
              
              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ไฟล์ที่เลือก:
                  </h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ลบ
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    เคล็ดลับการแจ้งปัญหา
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>ระบุขั้นตอนที่นำไปสู่ปัญหา</li>
                      <li>แนบ Screenshot หรือไฟล์ที่เกี่ยวข้อง</li>
                      <li>ระบุเวลาที่เกิดปัญหา</li>
                      <li>บอกว่าปัญหานี้เกิดขึ้นทุกครั้งหรือบางครั้ง</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'กำลังส่ง...' : 'สร้าง Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
