<script setup lang="ts">
import type { ITimer } from '~/types/timer'

definePageMeta({
	layout: 'app',
})

const timerStore = useTimerStore()
const { secondsIntoMinutes } = useUtils()

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

async function onDeleteTimer(timer: ITimer) {
	await timerStore.deleteTimer(timer.id!)
}

async function onStartTimer(item: ITimer) {
	const navigationTarget = `/interval-${item.sets}-${item.training_time}-${item.pause_time}`
	await navigateTo(navigationTarget)
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

		<JGenericList
			key-field="id"
			:items="timerStore.timers"
			:unstyled="true"
			@select="onSelectTimer"
			@delete="onDeleteTimer"
		>
			<template #content="{ item }">
				<div class="flex-1">
					<div class="flex items-center justify-between mb-2">
						<h2 class="text-lg font-medium">
							{{ item.name }}
						</h2>
						<span>{{ secondsIntoMinutes(item.duration) }}</span>
					</div>
					<div class="flex pb-2">
						<div class="flex flex-col space-y-1 justify-between">
							<div class="flex space-x-2 items-center">
								<JIcon name="timer-set" /> <span>{{ item.sets }} Sets</span>
							</div>
							<div class="flex space-x-2 items-center">
								<JIcon name="timer-training-time" /> <span>{{ secondsIntoMinutes(item.training_time) }}</span>
							</div>
							<div class="flex space-x-2 items-center">
								<JIcon name="timer-pause-time" /> <span>{{ secondsIntoMinutes(item.pause_time) }}</span>
							</div>
						</div>
						<div class="mt-auto ml-auto">
							<JButton
								type="button"

								icon-name="timer-start"
								@click.stop="onStartTimer(item)"
							/>
						</div>
					</div>
				</div>
			</template>
		</JGenericList>

		<LazyJDropdown v-model="showDropdown">
			<TimerForm
				:selected-timer="selectedTimer"
				@submit="onSubmit"
			/>
		</LazyJDropdown>
	</article>
</template>
