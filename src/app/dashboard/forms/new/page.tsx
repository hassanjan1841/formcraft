'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FieldPalette } from '@/components/builder/FieldPalette'
import { Canvas } from '@/components/builder/Canvas'
import { PropertiesPanel } from '@/components/builder/PropertiesPanel'
import { FormField, FieldType } from '@/types/form'
import { createField } from '@/lib/form-schema'

export default function NewFormPage() {
  const [title, setTitle] = useState('Untitled Form')
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

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
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, schema: { fields }, published: publish })
    })
    const form = await res.json()
    router.push(`/dashboard/forms/${form.id}`)
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">← Back to Dashboard</Link>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Form title..."
            className="text-xl font-semibold bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none px-2 py-1"
          />
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Publish
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