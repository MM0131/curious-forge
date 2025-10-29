<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
    <div class="max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-slate-700">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ isSignUp ? $t('auth.signUp') : $t('auth.signIn') }}</h1>
        <p class="text-slate-400">{{ isSignUp ? $t('auth.createAccount') : $t('auth.welcomeBack') }}</p>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-sm">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Display Name (Sign Up only) -->
        <div v-if="isSignUp">
          <label for="displayName" class="block text-sm font-medium text-slate-300 mb-2">
            {{ $t('auth.displayName') }}
          </label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="$t('auth.displayNamePlaceholder')"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
            {{ $t('auth.email') }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="$t('auth.emailPlaceholder')"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
            {{ $t('auth.password') }}
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="$t('auth.passwordPlaceholder')"
            :minlength="isSignUp ? 6 : undefined"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">{{ $t('auth.loading') }}</span>
          <span v-else>{{ isSignUp ? $t('auth.signUp') : $t('auth.signIn') }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-slate-800/50 text-slate-400">{{ $t('auth.orContinueWith') }}</span>
        </div>
      </div>

      <!-- OAuth Buttons -->
      <div class="space-y-3">
        <button
          @click="handleOAuthSignIn('google')"
          type="button"
          class="w-full py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{{ $t('auth.continueWithGoogle') }}</span>
        </button>

        <button
          @click="handleOAuthSignIn('github')"
          type="button"
          class="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>{{ $t('auth.continueWithGitHub') }}</span>
        </button>
      </div>

      <!-- Toggle Sign Up/Sign In -->
      <div class="mt-6 text-center">
        <p class="text-slate-400">
          {{ isSignUp ? $t('auth.alreadyHaveAccount') : $t('auth.dontHaveAccount') }}
          <button
            @click="toggleMode"
            type="button"
            class="text-purple-400 hover:text-purple-300 font-semibold ml-1"
          >
            {{ isSignUp ? $t('auth.signIn') : $t('auth.signUp') }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn, signUp, signInWithOAuth } = useAuth()
const router = useRouter()
const route = useRoute()

const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const displayName = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isSignUp.value) {
      await signUp(email.value, password.value, displayName.value)
      successMessage.value = 'Account created! Please check your email to verify.'
      // Clear form
      email.value = ''
      password.value = ''
      displayName.value = ''
    } else {
      await signIn(email.value, password.value)
      // Redirect to original page or home
      const redirect = route.query.redirect as string || '/'
      router.push(redirect)
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleOAuthSignIn = async (provider: 'google' | 'github') => {
  try {
    await signInWithOAuth(provider)
  } catch (error: any) {
    errorMessage.value = error.message || 'OAuth sign in failed'
  }
}
</script>
