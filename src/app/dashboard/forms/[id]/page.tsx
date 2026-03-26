'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from '@/lib/toast'
import { FieldPalette } from '@/components/builder/FieldPalette'
import { Canvas } from '@/components/builder/Canvas'
import { PropertiesPanel } from '@/components/builder/PropertiesPanel'
import { ResponsesTable } from '@/components/dashboard/ResponsesTable'
import { FormField, FieldType } from '@/types/form'
import { createField } from '@/lib/form-schema'

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('Loading...')
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submissionsCount, setSubmissionsCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'builder' | 'responses'>('builder')

  useEffect(() => {
    async function loadForm() {
      const res = await fetch(`/api/forms/${params.id}`)
      if (res.ok) {
        const form = await res.json()
        setTitle(form.title)
        setFields(form.schema.fields)
        setPublished(form.published)
        setSubmissionsCount(form.submissionsCount || 0)
      }
      setLoading(false)
    }
    loadForm()
  }, [params.id])

  const selectedField = fields.find(f => f.id === selectedId) || null

  function handleAddField(type: FieldType) {
    const newField = createField(type)
    setFields([...fields, newField])
    setSelectedId(newField.id)
  }

  function handleUpdateField(updated: FormField) {
    setFields(fields.map(f => (f.id === updated.id ? updated : f)))
  }

  function handleDeleteField(id: string) {
    setFields(fields.filter(f => f.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  async function handleSave(publish = false) {
    setSaving(true)
    const res = await fetch(`/api/forms/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, schema: { fields }, published: publish || published })
    })
    if (!res.ok) {
      toast.error('Failed to save form')
      setSaving(false)
      return
    }
    setPublished(publish ? true : published)
    toast.success(publish ? 'Form published!' : 'Form saved!')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading form...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none px-3 py-1.5 min-w-[200px] transition-all"
          />
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {published ? 'Published' : 'Draft'}
          </span>
          <button
            onClick={() => router.push(`/f/${params.id}`)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
          >
            Preview
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 font-medium transition-all"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 font-medium hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all"
          >
            {published ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white px-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-5 py-3 font-medium text-sm transition-all relative ${
              activeTab === 'builder' 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Builder
            {activeTab === 'builder' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-5 py-3 font-medium text-sm transition-all relative ${
              activeTab === 'responses' 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Responses ({submissionsCount})
            {activeTab === 'responses' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'responses' && (
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <ResponsesTable formId={params.id as string} fields={fields.map(f => ({ id: f.id, label: f.label }))} />
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <main className="p-6 flex gap-6">
          <FieldPalette onAdd={handleAddField} />
          <Canvas
            fields={fields}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
          <div className="space-y-4">
            <PropertiesPanel field={selectedField} onUpdate={handleUpdateField} />
            {selectedId && (
              <button
                onClick={() => handleDeleteField(selectedId)}
                className="w-72 flex items-center justify-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 hover:bg-red-100 transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Field
              </button>
            )}
          </div>
        </main>
      )}
    </div>
  )
}