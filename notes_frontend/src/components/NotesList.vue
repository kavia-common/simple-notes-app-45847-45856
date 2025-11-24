<script setup lang="ts">
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { formatRelativeDate } from '@/utils/date'

const store = useNotesStore()

const notes = computed(() => store.items)
const selectedId = computed(() => store.selectedId)

function onSelect(id: string) {
  store.select(id)
}

async function onDelete(id: string) {
  const note = store.items.find(n => n.id === id)
  const title = note?.title || 'this note'
  if (confirm(`Delete "${title}"? This cannot be undone.`)) {
    // select the note to be deleted if different, so removeSelected works
    store.select(id)
    await store.removeSelected()
  }
}
</script>

<template>
  <section class="notes-section card">
    <div class="header">
      <h2>Notes</h2>
      <button class="btn primary" @click="store.addNote()">New Note</button>
    </div>

    <div v-if="store.loading" class="info">Loading…</div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>
    <ul v-else class="list">
      <li
        v-for="n in notes"
        :key="n.id"
        :class="['item', { active: n.id === selectedId }]"
        @click="onSelect(n.id)"
      >
        <div class="title-row">
          <span class="title">{{ n.title || 'Untitled' }}</span>
          <button class="icon-btn danger" title="Delete" @click.stop="onDelete(n.id)">✕</button>
        </div>
        <div class="meta">Updated {{ formatRelativeDate(n.updatedAt) }}</div>
      </li>
      <li v-if="!notes.length" class="empty">No notes yet. Create your first note.</li>
    </ul>
  </section>
</template>

<style scoped>
.notes-section {
  padding: 1rem;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: .5rem;
}
h2 {
  font-size: 1.125rem;
  color: var(--oc-text);
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: .5rem;
}
.item {
  border: 1px solid var(--oc-border);
  background: var(--oc-surface);
  border-radius: .75rem;
  padding: .75rem .875rem;
  cursor: pointer;
  transition: box-shadow .2s ease, border-color .2s ease, transform .05s ease;
  box-shadow: var(--oc-shadow-sm);
}
.item:hover {
  box-shadow: var(--oc-shadow);
  border-color: var(--oc-primary-300);
}
.item.active {
  border-color: var(--oc-primary);
  box-shadow: 0 0 0 3px var(--oc-primary-50);
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
}
.title {
  font-weight: 600;
  color: var(--oc-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  font-size: .8rem;
  color: var(--oc-muted);
  margin-top: .25rem;
}
.empty {
  color: var(--oc-muted);
  text-align: center;
  padding: .75rem;
  border: 1px dashed var(--oc-border);
  border-radius: .75rem;
  background: linear-gradient(135deg, var(--oc-gradient-1), var(--oc-gradient-2));
}
.info { color: var(--oc-muted); }
.error { color: var(--oc-error); }

.btn {
  appearance: none;
  border: 1px solid var(--oc-border);
  border-radius: .5rem;
  padding: .5rem .75rem;
  background: var(--oc-surface);
  color: var(--oc-text);
  font-weight: 600;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.btn.primary {
  border-color: var(--oc-primary);
  background: var(--oc-primary);
  color: white;
  box-shadow: 0 6px 16px rgba(37, 99, 235, .25);
}
.btn.primary:hover { filter: brightness(0.97); }
.icon-btn {
  border: none;
  background: transparent;
  color: var(--oc-muted);
  border-radius: .375rem;
  width: 28px; height: 28px;
}
.icon-btn:hover { background: var(--oc-bg-soft); color: var(--oc-error); }
.icon-btn.danger { color: var(--oc-error); }
.card {
  background: var(--oc-surface);
  border-radius: 1rem;
  box-shadow: var(--oc-shadow);
  border: 1px solid var(--oc-border);
}
</style>
