<script setup lang="ts">
import type { ITimer } from '~/types/timer'

definePageMeta({
	layout: 'app',
})

const selectedTimer = ref<ITimer | null>(null)
const showDropdown = ref(false)

function openDropdown() {
	selectedTimer.value = null
	showDropdown.value = true
}

function onSubmit() {
	showDropdown.value = false
}

function onSelectTimer(timer: ITimer) {
	selectedTimer.value = timer
	showDropdown.value = true
}
</script>

<template>
	<article class="relative">
		<JButton
			class="fixed z-40 bottom-12 left-1/2 -translate-x-1/2"
			variant="primary"
			size="small"
			@click="openDropdown"
		>
			Create Interval
		</JButton>

		<div class="better-layer p-8 rounded-3xl mb-4">
			<TimerForm mode="timer" />
		</div>

		<TimerList
			@select-timer="onSelectTimer"
		/>

		<LazyJDropdown v-model="showDropdown">
			<TimerForm
				:selected-timer="selectedTimer"
				@submit="onSubmit"
			/>
		</LazyJDropdown>
	</article>
</template>
