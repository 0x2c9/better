<script setup lang="ts">
if (import.meta.client) {
	window.addEventListener('contextmenu', (event) => {
		if ((event as PointerEvent).pointerType === 'touch') {
			event.preventDefault()
		}
	})
}
</script>

<template>
	<NuxtPwaManifest />
	<SvgSprite />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
