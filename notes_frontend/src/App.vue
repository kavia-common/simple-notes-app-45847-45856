<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="dot" />
        <span class="title">Ocean Notes</span>
      </div>
      <div class="status">
        <span class="badge">Vue 3 + Vite</span>
      </div>
    </header>

    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--oc-bg);
  color: var(--oc-text);
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--oc-border);
}
.brand {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-weight: 700;
  color: var(--oc-primary);
}
.dot {
  width: 10px; height: 10px;
  background: var(--oc-primary);
  border-radius: 999px;
  box-shadow: 0 0 0 4px var(--oc-primary-50);
}
.title { letter-spacing: .2px; }
.status .badge {
  font-size: .75rem;
  color: var(--oc-muted);
  background: var(--oc-bg-soft);
  border: 1px solid var(--oc-border);
  padding: .25rem .5rem;
  border-radius: .5rem;
}
.content {
  max-width: 880px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
