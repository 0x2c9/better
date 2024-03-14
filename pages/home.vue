<script setup lang="ts">
definePageMeta({
	layout: 'app',
	auth: true,
})
</script>

<template>
	<article class="relative flex flex-1 flex-col">
		<section class="flex flex-1 flex-col space-y-4">
			<WorkoutHomeMap />
			<WalkHomeMap />
			<WeightHomeMap />
		</section>
	</article>
</template>
