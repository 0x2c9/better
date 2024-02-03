<script setup lang="ts">
window.addEventListener('contextmenu', (event) => {
	if ((event as PointerEvent).pointerType === 'touch') {
		event.preventDefault()
	}
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<SvgSprite />
	<NuxtPwaManifest />
</template>
