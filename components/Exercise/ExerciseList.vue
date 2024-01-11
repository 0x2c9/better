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
				<div class="flex items-center justify-between text-lg font-medium">
					<h2 class="">
						{{ item.name }}
					</h2>

					<div
						v-if="item.exercise_type === 'reps'"
						class="flex space-x-2 items-center"
					>
						<BIcon
							class="text-neutral-400"
							name="material-symbols-rotate-right-rounded"
						/>
						<span>{{ item.exercise_repetions }} Repetitions</span>
					</div>
					<div
						v-if="item.exercise_type === 'duration'"
						class="flex space-x-2 items-center"
					>
						<BIcon
							class="text-neutral-400"
							name="material-symbols-timer-outline-rounded"
						/> <span>{{ secondsIntoMinutes(item.exercise_duration) }}</span>
					</div>
				</div>
			</div>
		</template>
	</BGenericList>
</template>
