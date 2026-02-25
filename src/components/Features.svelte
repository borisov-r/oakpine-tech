<script lang="ts">
  const features = [
    {
      title: 'PCB Technologies',
      description: 'Advanced printed circuit board design and manufacturing solutions for complex multi-layer boards.',
      icon: '🔌',
    },
    {
      title: 'ASIC Design',
      description: 'Custom application-specific integrated circuit design from specification to tape-out.',
      icon: '🔬',
    },
    {
      title: 'Physical AI',
      description: 'Bringing artificial intelligence to the physical world through embedded systems and edge computing.',
      icon: '🤖',
    },
    {
      title: 'Industrial Automation',
      description: 'Smart automation solutions that streamline manufacturing and operational workflows.',
      icon: '⚙️',
    },
    {
      title: 'Systems Design',
      description: 'End-to-end hardware and software systems architecture for demanding real-world applications.',
      icon: '🏗️',
    },
    {
      title: 'Security & Reliability',
      description: 'Enterprise-grade security with 99.9% uptime guarantee. Your data and systems are always protected.',
      icon: '🛡️',
    },
  ];
</script>

<section class="py-24 px-4 bg-gray-800">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
      What We Do
    </h2>
    <p class="text-gray-300 text-center mb-16 max-w-2xl mx-auto">
      Cutting-edge technologies powering the next generation of hardware and software solutions.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each features as feature}
        <div class="bg-gray-700 rounded-2xl p-8 hover:bg-gray-600 transition-colors duration-300 border border-gray-600 hover:border-green-500">
          <div class="text-5xl mb-4">{feature.icon}</div>
          <h3 class="text-xl font-semibold text-white mb-3">{feature.title}</h3>
          <p class="text-gray-300 leading-relaxed">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
