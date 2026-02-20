<script lang="ts">
  import ProviderIcon from './ProviderIcon.svelte';

  const providers = [
    {
      name: 'Google',
      href: '/auth/google',
      bgClass: 'bg-white hover:bg-gray-100 text-gray-800',
      borderClass: 'border border-gray-300',
    },
    {
      name: 'GitHub',
      href: '/auth/github',
      bgClass: 'bg-gray-900 hover:bg-gray-700 text-white',
      borderClass: 'border border-gray-600',
    },
    {
      name: 'Microsoft',
      href: '/auth/microsoft',
      bgClass: 'bg-white hover:bg-gray-100 text-gray-800',
      borderClass: 'border border-gray-300',
    },
    {
      name: 'LinkedIn',
      href: '/auth/linkedin',
      bgClass: 'bg-[#0A66C2] hover:bg-[#004182] text-white',
      borderClass: 'border border-transparent',
    },
    {
      name: 'Twitter / X',
      href: '/auth/twitter',
      bgClass: 'bg-black hover:bg-gray-900 text-white',
      borderClass: 'border border-gray-700',
    },
    {
      name: 'Apple',
      href: '/auth/apple',
      bgClass: 'bg-black hover:bg-gray-900 text-white',
      borderClass: 'border border-gray-700',
    },
  ];
</script>

<section id="login" class="py-24 px-4 bg-gray-950">
  <div class="max-w-md mx-auto">
    <div class="bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-800">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-2xl font-bold text-white">O</span>
        </div>
        <h2 class="text-2xl font-bold text-white">Sign in to OakPine</h2>
        <p class="text-gray-400 mt-2 text-sm">Choose your preferred sign-in method</p>
      </div>

      <div class="space-y-3">
        {#each providers as provider}
          <a
            href={provider.href}
            class="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 {provider.bgClass} {provider.borderClass} focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <ProviderIcon name={provider.name} />
            <span class="flex-1 text-center">Continue with {provider.name}</span>
          </a>
        {/each}
      </div>

      <p class="text-gray-500 text-xs text-center mt-6">
        By signing in, you agree to our
        <a href="/terms" class="text-green-400 hover:underline">Terms of Service</a>
        and
        <a href="/privacy" class="text-green-400 hover:underline">Privacy Policy</a>.
      </p>
    </div>
  </div>
</section>
