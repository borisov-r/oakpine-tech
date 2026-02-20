<script lang="ts">
  const features = [
    {
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.',
      icon: '🛡️',
    },
    {
      title: 'Fast & Scalable',
      description: 'Built for performance from day one. Scale effortlessly from startup to enterprise.',
      icon: '🚀',
    },
    {
      title: 'Modern Stack',
      description: 'Powered by cutting-edge technologies: Astro, Svelte, Three.js, and more.',
      icon: '💻',
    },
  ];
</script>

<section class="py-24 px-4 bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
      Why OakPine?
    </h2>
    <p class="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
      Everything you need to build, deploy, and scale modern applications.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each features as feature}
        <div class="bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-colors duration-300 border border-gray-700 hover:border-green-500">
          <div class="text-5xl mb-4">{feature.icon}</div>
          <h3 class="text-xl font-semibold text-white mb-3">{feature.title}</h3>
          <p class="text-gray-400 leading-relaxed">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
