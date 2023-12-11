<script>
if (process.client) {
	window.addEventListener('contextmenu', (event) => {
		if (event.pointerType === 'touch') {
			event.preventDefault()
		}
	})
}
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
