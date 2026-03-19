'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FieldPalette } from '@/components/builder/FieldPalette'
import { Canvas } from '@/components/builder/Canvas'
import { PropertiesPanel } from '@/components/builder/PropertiesPanel'
import { FormField, FieldType, Form as FormType } from '@/types/form'
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
    if (res.ok) {
      setPublished(publish ? true : published)
      if (publish) alert('Form published! Share link: /f/' + params.id)
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-gray-600 hover:text-gray-900">← Back to Dashboard</Link>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none px-2 py-1"
          />
          <span className={`px-2 py-1 rounded text-sm ${published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {published ? 'Published' : 'Draft'}
          </span>
          <button
            onClick={() => router.push(`/f/${params.id}`)}
            className="text-blue-600 hover:underline text-sm"
          >
            Preview
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {published ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      <main className="p-6 flex gap-6">
        <FieldPalette onAdd={handleAddField} />
        <Canvas
          fields={fields}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
        <div>
          <PropertiesPanel field={selectedField} onUpdate={handleUpdateField} />
          {selectedId && (
            <button
              onClick={() => handleDeleteField(selectedId)}
              className="mt-4 w-64 bg-red-50 text-red-600 p-2 rounded border border-red-200 hover:bg-red-100"
            >
              Delete Field
            </button>
          )}
        </div>
      </main>
    </div>
  )
}