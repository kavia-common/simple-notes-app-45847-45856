<script setup lang="ts">
import NotesList from '@/components/NotesList.vue'
import NoteEditor from '@/components/NoteEditor.vue'
import { onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'

const store = useNotesStore()
onMounted(() => {
  store.refresh()
})
</script>

<template>
  <main class="container">
    <NotesList />
    <NoteEditor />
  </main>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-block: 0.5rem 2rem;
}
@media (min-width: 640px) {
  .container {
    gap: 1.25rem;
  }
}
</style>
