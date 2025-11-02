<template>
  <section class="py-12">
    <div class="max-w-5xl mx-auto">
  <h1 class="text-3xl font-bold text-center mb-8">Key features of The Curious Forge</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :icon="feature.icon"
          :title="feature.title"
          :desc="feature.desc"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { icon: '🧪', title: 'Hands-on experiments', desc: 'Learn by doing with easy-to-find materials' },
  { icon: '📚', title: 'Blueprint library', desc: 'A diverse collection of project blueprints' },
  { icon: '🔍', title: 'Search & filters', desc: 'Search and filter projects by category / difficulty / tags' },
  { icon: '👤', title: 'User profiles', desc: 'Manage your projects and data' },
  { icon: '💡', title: 'Submit ideas', desc: 'Share new project ideas with the team' },
  { icon: '🔔', title: 'Notifications', desc: 'Receive news and project updates' },
  { icon: '✉️', title: 'Contact the team', desc: 'Get support or report issues' },
  { icon: '📤', title: 'Share projects', desc: 'Share projects with friends or on social media' },
  { icon: '🖨️', title: 'Printable projects', desc: 'Print project details for hands-on use' },
  { icon: '📄', title: 'Detailed project pages', desc: 'Full details including materials, steps, purpose, etc.' },
  { icon: '🏷️', title: 'Categories & tags', desc: 'Organize projects with categories and tags for easy discovery' },
  { icon: '⏱️', title: 'Difficulty & time', desc: 'Choose projects by difficulty and estimated time' },
  { icon: '👥', title: 'Recommended participants', desc: 'Suggested number of collaborators per project' },
]
</script>
