<script setup lang="ts">
import type { ITimer } from '~/types/timer'

defineProps<{
	items: ITimer[]
}>()

const emits = defineEmits<{
	'select-timer': [ITimer]
	'delete-timer': [ITimer]
	'start-timer': [ITimer]
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<BGenericList
		key-field="id"
		:items="items"
		@select="emits('select-timer', $event)"
		@delete="emits('delete-timer', $event)"
	>
		<template #content="{ item }">
			<div class="flex-1">
				<div class="mb-2 flex items-center justify-between">
					<h2 class="text-lg font-medium">
						{{ item.name }}
					</h2>
					<span>{{ secondsIntoMinutes(item.duration) }}</span>
				</div>
				<div class="flex pb-2">
					<div class="flex flex-col justify-between space-y-1">
						<div class="flex items-center space-x-2">
							<BIcon name="material-symbols-rotate-right-rounded" /> <span>{{ item.sets }} Sets</span>
						</div>
						<div class="flex items-center space-x-2">
							<BIcon name="material-symbols-timer-outline-rounded" /> <span>{{ secondsIntoMinutes(item.training_time) }}</span>
						</div>
						<div class="flex items-center space-x-2">
							<BIcon name="material-symbols-motion-photos-paused-outline-rounded" /> <span>{{ secondsIntoMinutes(item.pause_time) }}</span>
						</div>
					</div>
					<div class="ml-auto mt-auto">
						<BButton
							type="button"
							icon-name="material-symbols-play-arrow-rounded"
							@click.stop="emits('start-timer', item)"
						/>
					</div>
				</div>
			</div>
		</template>
	</BGenericList>
</template>
