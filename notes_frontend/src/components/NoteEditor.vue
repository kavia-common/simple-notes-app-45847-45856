<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useNotesStore } from '@/stores/notes'

const store = useNotesStore()
const selected = computed(() => store.selected)

const localTitle = ref('')
const localContent = ref('')

watch(
  selected,
  async (n) => {
    localTitle.value = n?.title ?? ''
    localContent.value = n?.content ?? ''
    await nextTick()
  },
  { immediate: true },
)

let typingTimer: number | undefined
async function scheduleSave() {
  if (!store.selectedId) return
  if (typingTimer) window.clearTimeout(typingTimer)
  typingTimer = window.setTimeout(async () => {
    await store.saveSelected({ title: localTitle.value, content: localContent.value })
  }, 400)
}

async function saveNow() {
  if (!store.selectedId) return
  await store.saveSelected({ title: localTitle.value, content: localContent.value })
}
</script>

<template>
  <section class="editor-section card">
    <div class="header">
      <h2>Editor</h2>
      <div class="actions">
        <button class="btn outline" :disabled="!selected" @click="saveNow">Save</button>
        <button class="btn danger" :disabled="!selected" @click="store.removeSelected()">Delete</button>
      </div>
    </div>

    <div v-if="!selected" class="empty">Select a note or create a new one to begin.</div>

    <div v-else class="form">
      <input
        class="title-input"
        v-model="localTitle"
        type="text"
        placeholder="Title"
        @input="scheduleSave"
      />
      <textarea
        class="content-input"
        v-model="localContent"
        placeholder="Write your note..."
        rows="10"
        @input="scheduleSave"
      />
      <div class="hint">Changes are saved automatically.</div>
    </div>
  </section>
</template>

<style scoped>
.editor-section { padding: 1rem; margin-top: 1rem; }
.header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: .5rem;
}
h2 { font-size: 1.125rem; color: var(--oc-text); }
.form { display: grid; gap: .75rem; }
.title-input, .content-input {
  width: 100%;
  border: 1px solid var(--oc-border);
  background: var(--oc-surface);
  color: var(--oc-text);
  border-radius: .75rem;
  padding: .625rem .75rem;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  box-shadow: var(--oc-shadow-sm-inset);
}
.content-input { resize: vertical; min-height: 180px; }
.title-input:focus, .content-input:focus {
  border-color: var(--oc-primary);
  box-shadow: 0 0 0 3px var(--oc-primary-50);
  background: white;
}
.hint { font-size: .8rem; color: var(--oc-muted); }

.btn {
  appearance: none;
  border-radius: .5rem;
  padding: .5rem .75rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
}
.btn:disabled { opacity: .6; cursor: not-allowed; }
.btn.outline {
  border: 1px solid var(--oc-border);
  background: var(--oc-surface);
  color: var(--oc-text);
}
.btn.danger {
  border: 1px solid var(--oc-error);
  background: var(--oc-error);
  color: white;
  box-shadow: 0 6px 16px rgba(239, 68, 68, .25);
}
.card {
  background: var(--oc-surface);
  border-radius: 1rem;
  box-shadow: var(--oc-shadow);
  border: 1px solid var(--oc-border);
}
.empty {
  color: var(--oc-muted);
  text-align: center;
  padding: .75rem;
  border: 1px dashed var(--oc-border);
  border-radius: .75rem;
  background: linear-gradient(135deg, var(--oc-gradient-1), var(--oc-gradient-2));
}
.actions { display: flex; gap: .5rem; }
</style>
