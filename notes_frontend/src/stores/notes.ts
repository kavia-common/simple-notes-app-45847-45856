import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Note } from '@/types/note'
import { listNotes, createNote, updateNote, deleteNote } from '@/services/notesService'

export const useNotesStore = defineStore('notes', () => {
  const items = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedId = ref<string | null>(null)

  const selected = computed<Note | null>(() => {
    return items.value.find((n) => n.id === selectedId.value) || null
  })

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      items.value = await listNotes()
      if (items.value.length && !selectedId.value) {
        selectedId.value = items.value[0].id
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'message' in e) {
        error.value = String((e as { message?: unknown }).message ?? 'Failed to load notes')
      } else {
        error.value = 'Failed to load notes'
      }
    } finally {
      loading.value = false
    }
  }

  async function addNote(title = 'Untitled', content = '') {
    const note = await createNote({ title, content })
    items.value = [note, ...items.value]
    selectedId.value = note.id
  }

  async function saveSelected(patch: Partial<Pick<Note, 'title' | 'content'>>) {
    if (!selectedId.value) return
    const updated = await updateNote(selectedId.value, patch)
    const idx = items.value.findIndex((n) => n.id === selectedId.value)
    if (idx !== -1) {
      items.value[idx] = updated
      // re-sort by updatedAt desc
      items.value = [...items.value].sort((a, b) => b.updatedAt - a.updatedAt)
    }
  }

  async function removeSelected() {
    if (!selectedId.value) return
    const id = selectedId.value
    await deleteNote(id)
    items.value = items.value.filter((n) => n.id !== id)
    selectedId.value = items.value.length ? items.value[0].id : null
  }

  function select(id: string) {
    selectedId.value = id
  }

  return {
    items,
    loading,
    error,
    selectedId,
    selected,
    refresh,
    addNote,
    saveSelected,
    removeSelected,
    select,
  }
})
