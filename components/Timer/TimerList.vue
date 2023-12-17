<script setup lang="ts">
import type { ITimer } from '~/types/timer'

const emits = defineEmits<{
	'select-timer': [ITimer]
}>()

const timerStore = useTimerStore()
const { secondsIntoMinutes } = useUtils()

async function onDeleteTimer(timer: ITimer) {
	await timerStore.deleteTimer(timer.id!)
}

async function onStartTimer(item: ITimer) {
	const navigationTarget = `/interval-${item.sets}-${item.training_time}-${item.pause_time}`
	await navigateTo(navigationTarget)
}
</script>

<template>
	<JGenericList
		key-field="id"
		:items="timerStore.timers"
		:unstyled="true"
		@select="emits('select-timer', $event)"
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
</template>
