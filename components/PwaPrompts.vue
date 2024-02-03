<script setup lang="ts">
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp()

onMounted(() => {
	if ($pwa?.offlineReady) {
		console.log('App is offline ready')
	}
	if (!$pwa?.isPWAInstalled) {
		console.log('App is not installed')
	}
})

async function onInstallApp() {
	if (!$pwa) {
		console.error('PWA is not available')
		return
	}
	$pwa.showInstallPrompt = true
	// await $pwa.install()
}

window.addEventListener('beforeinstallprompt', (e) => {
	console.log('beforeinstallprompt event fired')
})
</script>

<template>
	<Teleport to="body">
		<div
			v-if="$pwa"
			class="fixed inset-0 z-50 flex items-end p-4 before:fixed before:inset-0 before:z-[-1] before:bg-neutral-950/50 before:backdrop-blur-[4px] empty:hidden"
		>
			<div
				v-if="$pwa.isPWAInstalled && $pwa.needRefresh"
				class="b-box z-50 flex flex-col p-4"
			>
				<p class="mb-8 text-lg font-medium">
					Update available. Click to reload and get the newest version.
				</p>

				<BButton @click="$pwa.updateServiceWorker()">
					Reload
				</BButton>
			</div>
			<!-- <div
				v-if="!$pwa.isPWAInstalled"
				class="b-box z-50 flex flex-col p-4"
			>
				<p class="mb-8 text-lg font-medium">
					Install the app to your device for a better experience and offline support.
				</p>

				<BButton @click="onInstallApp">
					Install App
				</BButton>
			</div> -->
		</div>
	</Teleport>
</template>
