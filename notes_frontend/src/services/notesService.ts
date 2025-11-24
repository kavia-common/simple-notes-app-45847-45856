import type { Note } from '@/types/note'

/**
 * PUBLIC_INTERFACE
 * getApiBase
 * Determine API base URL from environment variables.
 */
export function getApiBase(): string | null {
  // import.meta.env is typed as ImportMetaEnv; cast to known shape for Vite variables
  const env = (import.meta as ImportMeta).env as unknown as {
    VITE_API_BASE?: string
    VITE_BACKEND_URL?: string
  }
  const apiBase = env?.VITE_API_BASE || env?.VITE_BACKEND_URL
  if (apiBase && typeof apiBase === 'string' && apiBase.trim() !== '') {
    return apiBase.replace(/\/+$/, '')
  }
  return null
}

const STORAGE_KEY = 'notes-app-data-v1'

type StoredShape = { notes: Note[] }

function lsRead(): StoredShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { notes: [] }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.notes)) return { notes: [] }
    return { notes: parsed.notes as Note[] }
  } catch {
    return { notes: [] }
  }
}

function lsWrite(data: StoredShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota or privacy errors
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase()
  if (!base) throw new Error('No API base configured')
  const res = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${txt}`)
  }
  return res.json() as Promise<T>
}

/**
 * PUBLIC_INTERFACE
 * listNotes
 * List notes from API if configured; otherwise, from localStorage.
 */
export async function listNotes(): Promise<Note[]> {
  const base = getApiBase()
  if (base) {
    try {
      return await apiFetch<Note[]>('/notes')
    } catch {
      // Soft fallback
    }
  }
  return lsRead().notes.sort((a, b) => b.updatedAt - a.updatedAt)
}

/**
 * PUBLIC_INTERFACE
 * createNote
 * Create a note via API or localStorage fallback.
 */
export async function createNote(input: Pick<Note, 'title' | 'content'>): Promise<Note> {
  const base = getApiBase()
  if (base) {
    try {
      return await apiFetch<Note>('/notes', { method: 'POST', body: JSON.stringify(input) })
    } catch {
      // fallback
    }
  }
  const now = Date.now()
  const note: Note = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2)}`,
    title: input.title,
    content: input.content,
    createdAt: now,
    updatedAt: now,
  }
  const data = lsRead()
  data.notes.unshift(note)
  lsWrite(data)
  return note
}

/**
 * PUBLIC_INTERFACE
 * updateNote
 * Update a note via API or localStorage fallback.
 */
export async function updateNote(id: string, patch: Partial<Pick<Note, 'title' | 'content'>>): Promise<Note> {
  const base = getApiBase()
  if (base) {
    try {
      return await apiFetch<Note>(`/notes/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      })
    } catch {
      // fallback
    }
  }
  const data = lsRead()
  const idx = data.notes.findIndex((n) => n.id === id)
  if (idx === -1) throw new Error('Not found')
  const updated: Note = {
    ...data.notes[idx],
    ...patch,
    updatedAt: Date.now(),
  }
  data.notes[idx] = updated
  lsWrite(data)
  return updated
}

/**
 * PUBLIC_INTERFACE
 * deleteNote
 * Delete a note via API or localStorage fallback.
 */
export async function deleteNote(id: string): Promise<void> {
  const base = getApiBase()
  if (base) {
    try {
      await apiFetch<void>(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' })
      return
    } catch {
      // fallback
    }
  }
  const data = lsRead()
  data.notes = data.notes.filter((n) => n.id !== id)
  lsWrite(data)
}
