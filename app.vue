<script setup lang="ts">
window.addEventListener('contextmenu', (event) => {
	if ((event as PointerEvent).pointerType === 'touch') {
		event.preventDefault()
	}
})
</script>

<template>
	<NuxtPwaManifest />
	<SvgSprite />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
