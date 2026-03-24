<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    userName?: string;
    userEmail?: string;
  }

  const { userName = 'User', userEmail = 'user@example.com' }: Props = $props();

  let currentTime = $state('');
  let greeting = $state('Hello');

  const stats = [
    {
      label: 'Active Projects',
      value: '12',
      change: '+2 this month',
      positive: true,
      icon: '🗂️',
      color: 'from-green-400 to-emerald-600',
    },
    {
      label: 'Tasks Completed',
      value: '48',
      change: '+8 this week',
      positive: true,
      icon: '✅',
      color: 'from-blue-400 to-indigo-600',
    },
    {
      label: 'Team Members',
      value: '7',
      change: '+1 this month',
      positive: true,
      icon: '👥',
      color: 'from-purple-400 to-violet-600',
    },
    {
      label: 'Storage Used',
      value: '24 GB',
      change: '76 GB remaining',
      positive: false,
      icon: '💾',
      color: 'from-orange-400 to-red-500',
    },
  ];

  const recentActivity = [
    { action: 'Deployed PCB design v2.1', time: '2 hours ago', type: 'deploy', icon: '🚀' },
    { action: 'New team member added: Alex Kim', time: '5 hours ago', type: 'team', icon: '👤' },
    { action: 'ASIC simulation completed', time: 'Yesterday', type: 'task', icon: '✅' },
    { action: 'Updated industrial automation specs', time: 'Yesterday', type: 'update', icon: '📝' },
    { action: 'Security audit passed', time: '2 days ago', type: 'security', icon: '🛡️' },
  ];

  const quickActions = [
    { label: 'New Project', icon: '➕', href: '#', color: 'bg-green-500 hover:bg-green-400' },
    { label: 'Invite Member', icon: '📧', href: '#', color: 'bg-gray-700 hover:bg-gray-600' },
    { label: 'View Reports', icon: '📊', href: '#', color: 'bg-gray-700 hover:bg-gray-600' },
    { label: 'Settings', icon: '⚙️', href: '#', color: 'bg-gray-700 hover:bg-gray-600' },
  ];

  const navItems = [
    { label: 'Overview', icon: '🏠', href: '#', active: true },
    { label: 'Projects', icon: '🗂️', href: '#', active: false },
    { label: 'Tasks', icon: '✅', href: '#', active: false },
    { label: 'Team', icon: '👥', href: '#', active: false },
    { label: 'Analytics', icon: '📊', href: '#', active: false },
    { label: 'Settings', icon: '⚙️', href: '#', active: false },
  ];

  onMount(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) greeting = 'Good morning';
      else if (hour < 18) greeting = 'Good afternoon';
      else greeting = 'Good evening';

      currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  });

  let sidebarOpen = $state(false);
</script>

<div class="min-h-screen bg-gray-950 flex">
  <!-- Sidebar overlay for mobile -->
  {#if sidebarOpen}
    <button
      class="fixed inset-0 bg-black/60 z-20 lg:hidden w-full cursor-default"
      aria-label="Close sidebar"
      onclick={() => (sidebarOpen = false)}
    ></button>
  {/if}

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-30 flex flex-col transition-transform duration-300 {sidebarOpen
      ? 'translate-x-0'
      : '-translate-x-full'} lg:translate-x-0"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
      <a href="/" class="flex items-center gap-3">
        <div
          class="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
        >
          <span class="text-lg font-bold text-white">O</span>
        </div>
        <span class="text-white font-bold text-lg">OakPine</span>
      </a>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 {item.active
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'}"
        >
          <span class="text-base">{item.icon}</span>
          {item.label}
        </a>
      {/each}
    </nav>

    <!-- User section at bottom -->
    <div class="px-4 py-4 border-t border-gray-800">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800 mb-2">
        <div
          class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shrink-0"
        >
          <span class="text-sm font-bold text-white">{userName[0].toUpperCase()}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{userName}</p>
          <p class="text-xs text-gray-400 truncate">{userEmail}</p>
        </div>
      </div>
      <a
        href="/login"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
        Sign out
      </a>
    </div>
  </aside>

  <!-- Main content -->
  <div class="flex-1 flex flex-col lg:ml-64">
    <!-- Top bar -->
    <header class="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <button
            onclick={() => (sidebarOpen = !sidebarOpen)}
            class="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <div>
            <h1 class="text-white font-semibold text-lg">Dashboard</h1>
            <p class="text-gray-400 text-xs hidden sm:block">{currentTime}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Notification bell -->
          <button
            class="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <span
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full ring-2 ring-gray-900"
            ></span>
          </button>

          <!-- User avatar -->
          <div
            class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center"
          >
            <span class="text-sm font-bold text-white">{userName[0].toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 px-4 sm:px-6 py-8 overflow-auto">
      <!-- Welcome banner -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-1">
          {greeting}, <span class="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">{userName}</span>! 👋
        </h2>
        <p class="text-gray-400">Here's what's happening with your projects today.</p>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {#each stats as stat}
          <div
            class="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div class="flex items-start justify-between mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br {stat.color} rounded-xl flex items-center justify-center text-lg shadow-lg"
              >
                {stat.icon}
              </div>
              <span
                class="text-xs font-medium px-2 py-1 rounded-full {stat.positive
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-gray-800 text-gray-400'}"
              >
                {stat.change}
              </span>
            </div>
            <p class="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p class="text-sm text-gray-400">{stat.label}</p>
          </div>
        {/each}
      </div>

      <!-- Quick actions + Recent activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800">
          <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 class="font-semibold text-white">Recent Activity</h3>
            <button class="text-xs text-green-400 hover:text-green-300 transition-colors">View all</button>
          </div>
          <div class="divide-y divide-gray-800">
            {#each recentActivity as item}
              <div class="px-6 py-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors">
                <div
                  class="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-base shrink-0"
                >
                  {item.icon}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white truncate">{item.action}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800">
          <div class="px-6 py-4 border-b border-gray-800">
            <h3 class="font-semibold text-white">Quick Actions</h3>
          </div>
          <div class="p-4 grid grid-cols-2 gap-3">
            {#each quickActions as action}
              <a
                href={action.href}
                class="flex flex-col items-center gap-2 p-4 rounded-xl {action.color} text-white transition-colors duration-200 text-center"
              >
                <span class="text-2xl">{action.icon}</span>
                <span class="text-xs font-medium">{action.label}</span>
              </a>
            {/each}
          </div>

          <!-- Progress section -->
          <div class="px-6 py-4 border-t border-gray-800">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-400">Monthly Goal</span>
              <span class="text-sm font-medium text-white">75%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                style="width: 75%"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">9 of 12 projects on track</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
