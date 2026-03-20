<script setup lang="ts">
definePageMeta({
  layout: false
})

const { isLoaded, isSignedIn } = useAuth()

const modeCards = [
  {
    title: 'Deep Research',
    label: 'Focused analysis',
    description: 'Converge on defensible recommendations by comparing methodology quality and following evidence chains.',
    icon: 'lucide:scan-search'
  },
  {
    title: 'Wide Research',
    label: 'Landscape mapping',
    description: 'Survey papers, labs, and solution families quickly to map the state of the art.',
    icon: 'lucide:network'
  }
]

const workflow = [
  {
    step: '01',
    title: 'Pose the question',
    description: 'Bring in a product decision, architecture bet, or complex research target.'
  },
  {
    step: '02',
    title: 'Select your mode',
    description: 'Use wide mode for broad coverage or deep mode for evidence-led synthesis.'
  },
  {
    step: '03',
    title: 'Decide with confidence',
    description: 'Turn research into implementation priorities and clear technical bets.'
  }
]

const signals = [
  'Agentic Paper Search',
  'Evidence-Led Synthesis',
  'Tradeoff Evaluation',
  'Architecture Mapping'
]
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content selection:bg-primary/20">
    <!-- Clean Header -->
    <header class="fixed top-0 z-50 w-full bg-base-100/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <Logo class="h-6 w-auto text-primary transition-transform group-hover:scale-110" />
          <span class="text-lg font-bold tracking-tight">Forge</span>
        </NuxtLink>

        <nav class="flex items-center gap-6">
          <NuxtLink 
            to="/dashboard" 
            class="text-sm font-medium text-base-content/60 hover:text-base-content transition-colors"
          >
            Workspace
          </NuxtLink>
          <div class="flex items-center gap-3">
            <SignInButton
              v-if="isLoaded && !isSignedIn"
              mode="modal"
              force-redirect-url="/dashboard"
              fallback-redirect-url="/dashboard"
            >
              <button class="text-sm font-medium hover:text-primary transition-colors">
                Sign in
              </button>
            </SignInButton>
            <NuxtLink 
              to="/dashboard" 
              class="btn btn-neutral btn-sm rounded-full px-5 h-9 min-h-9 text-[13px] font-semibold"
            >
              Get Started
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <main class="pt-32">
      <!-- Hero Section -->
      <section class="relative px-6 pb-24 text-center lg:pb-32">
        <div class="mx-auto max-w-4xl space-y-10">
          <div class="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-[13px] font-semibold text-primary">
            <Icon name="lucide:sparkles" class="h-3.5 w-3.5" />
            <span>Built for engineering and product teams</span>
          </div>

          <h1 class="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl leading-[1.05]">
            Research that turns <br class="hidden sm:block" />
            <span class="text-base-content/40">into decisions.</span>
          </h1>

          <p class="mx-auto max-w-2xl text-lg leading-relaxed text-base-content/60 sm:text-xl">
            Forge maps the technical landscape, synthesizes evidence, and evaluates tradeoffs so you can make the strongest bets.
          </p>

          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <NuxtLink 
              to="/dashboard" 
              class="btn btn-neutral btn-lg rounded-2xl px-8 h-14 min-h-14 text-base font-bold shadow-xl shadow-neutral/10"
            >
              Open Workspace
            </NuxtLink>
            <SignInButton
              v-if="isLoaded && !isSignedIn"
              mode="modal"
              force-redirect-url="/dashboard"
              fallback-redirect-url="/dashboard"
            >
              <button class="btn btn-ghost btn-lg rounded-2xl px-8 h-14 min-h-14 text-base font-semibold border border-base-300/50 hover:bg-base-200">
                <Icon name="simple-icons:google" class="h-4 w-4 mr-2" />
                Continue with Google
              </button>
            </SignInButton>
          </div>

          <div class="pt-8 flex flex-wrap justify-center gap-3">
            <span
              v-for="signal in signals"
              :key="signal"
              class="text-[11px] font-bold uppercase tracking-widest text-base-content/30"
            >
              {{ signal }}
            </span>
          </div>
        </div>
      </section>

      <!-- Minimal Visual -->
      <section class="px-6 pb-32">
        <div class="mx-auto max-w-5xl rounded-[2.5rem] bg-base-200/40 p-4 ring-1 ring-base-300/20">
          <div class="rounded-[2rem] bg-base-100 p-8 shadow-2xl shadow-neutral/5 overflow-hidden border border-base-300/30">
            <div class="flex items-center gap-2 mb-8 text-[11px] font-bold uppercase tracking-widest text-base-content/30">
              <Icon name="lucide:terminal" class="h-4 w-4" />
              <span>Evidence Trail Synthesis</span>
            </div>
            
            <div class="space-y-6">
              <div class="flex gap-4 items-start">
                <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon name="lucide:search" class="h-4 w-4" />
                </div>
                <div class="space-y-2 pt-1">
                  <div class="h-2 w-48 bg-base-200 rounded-full animate-pulse"></div>
                  <div class="h-2 w-32 bg-base-200/60 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div class="pl-12 space-y-4 border-l-2 border-base-200">
                <div class="p-4 rounded-2xl bg-base-200/30 border border-base-300/20">
                  <p class="text-sm font-semibold mb-2">Finding: Browser Agent Architectures</p>
                  <p class="text-[13px] text-base-content/60 leading-relaxed">
                    Converging on hierarchical planning with state-space models. Benchmarks show 22% reduction in planning latency compared to flat LLM agents.
                  </p>
                </div>
                <div class="flex gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold">VERIFIED</span>
                  <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">3 PAPERS MAPPED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Grid -->
      <section class="px-6 pb-32">
        <div class="mx-auto max-w-6xl">
          <div class="grid gap-12 lg:grid-cols-2">
            <div
              v-for="card in modeCards"
              :key="card.title"
              class="group space-y-4"
            >
              <div class="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                <Icon :name="card.icon" class="h-6 w-6" />
              </div>
              <h2 class="text-3xl font-bold tracking-tight">{{ card.title }}</h2>
              <p class="text-lg leading-relaxed text-base-content/60">{{ card.description }}</p>
              <div class="pt-2">
                <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{{ card.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Workflow -->
      <section class="px-6 pb-48">
        <div class="mx-auto max-w-6xl">
          <div class="mb-16 border-t border-base-300/40 pt-16">
            <h2 class="text-4xl font-bold tracking-tight">From signal to direction.</h2>
            <p class="mt-4 text-xl text-base-content/60">A streamlined research workflow built for speed.</p>
          </div>

          <div class="grid gap-12 lg:grid-cols-3">
            <div
              v-for="item in workflow"
              :key="item.step"
              class="space-y-4"
            >
              <span class="text-3xl font-black text-base-content/10">{{ item.step }}</span>
              <h3 class="text-xl font-bold">{{ item.title }}</h3>
              <p class="text-base leading-relaxed text-base-content/60">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="px-6 pb-32 text-center">
        <div class="mx-auto max-w-3xl py-24 rounded-[3rem] bg-neutral text-neutral-content shadow-2xl">
          <h2 class="text-4xl font-bold tracking-tight mb-8">Ready to resolve your next decision?</h2>
          <NuxtLink 
            to="/dashboard" 
            class="btn btn-primary btn-lg rounded-2xl px-12 h-14 min-h-14 text-base font-bold"
          >
            Start Researching
          </NuxtLink>
        </div>
      </section>
    </main>

    <footer class="px-6 pb-12 border-t border-base-300/40 pt-12">
      <div class="mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <Logo class="h-5 w-auto opacity-40" />
          <span class="text-sm font-bold opacity-40">Forge</span>
        </div>
        <p class="text-[13px] text-base-content/40 font-medium">
          &copy; 2026 Forge Research Agent. Built for engineering precision.
        </p>
      </div>
    </footer>
  </div>
</template>
