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
		<div class="b-box px-5 pt-6 pb-4 mb-6">
			<TimerForm />
		</div>
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-lg font-semibold">
				Saved Timers
			</h1>
			<BButton
				variant="secondary"
				@click="openDropdown"
			>
				Create Interval
			</BButton>
		</div>
		<TimerList
			@select-timer="onSelectTimer"
		/>

		<BDrawer v-model="showDropdown">
			<TimerForm
				mode="form"
				:selected-timer="selectedTimer"
				@submit="onSubmit"
			/>
		</BDrawer>
	</article>
</template>
