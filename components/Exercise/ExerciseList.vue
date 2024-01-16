<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

defineProps<{
	items: IExercise[]
}>()

const emits = defineEmits<{
	'select-exercise': [IExercise]
	'delete-exercise': [IExercise]
	'start-exercise': [IExercise]
}>()

const { secondsIntoMinutes } = useUtils()
</script>

<template>
	<BGenericList
		key-field="id"
		:items="items"
		@select="emits('select-exercise', $event)"
		@delete="emits('delete-exercise', $event)"
	>
		<template #content="{ item }">
			<div class="flex-1">
				<div class="flex items-center justify-between mb-2">
					<h2 class="text-lg font-medium">
						{{ item.exercise_name }}
					</h2>
					<span v-if="item.exercise_duration_type === 'sets'">{{ secondsIntoMinutes(item.exercise_set_duration) }}</span>
				</div>
				<div class="flex pb-2 text-neutral-400">
					<div class="flex flex-col space-y-1 justify-between">
						<div
							v-if="item.exercise_type === 'reps'"
							class="flex space-x-2 items-center"
						>
							<BIcon name="material-symbols-rotate-right-rounded" /> <span>{{ item.exercise_repetions }} Repetions</span>
						</div>
						<div
							v-if="item.exercise_duration_type === 'sets'"
							class="flex space-x-2 items-center"
						>
							<BIcon name="material-symbols-rotate-right-rounded" /> <span>{{ item.exercise_sets }} Sets</span>
						</div>
						<div
							v-if="item.exercise_type === 'time'"
							class="flex space-x-2 items-center"
						>
							<BIcon name="material-symbols-timer-outline-rounded" /> <span>{{ secondsIntoMinutes(item.exercise_training_time) }}</span>
						</div>
						<div
							v-if="item.exercise_duration_type === 'sets'"
							class="flex space-x-2 items-center"
						>
							<BIcon name="material-symbols-motion-photos-paused-outline-rounded" /> <span>{{ secondsIntoMinutes(item.exercise_pause_time) }}</span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</BGenericList>
</template>
