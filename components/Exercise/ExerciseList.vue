<script setup lang="ts">
import type { IExercise } from '~/types/exercise'

const { disableDelete = false, keyField = 'id' } = defineProps<{
	items: IExercise[]
	keyField?: string
	disableDelete?: boolean
}>()

const emits = defineEmits<{
	'selectExercise': [item: IExercise]
	'deleteExercise': [item: IExercise]
}>()

const { secondsIntoMinutes } = useUtils()

function onSelectExercise(item: IExercise) {
	emits('selectExercise', item)
}

function onDeleteExercise(item: IExercise) {
	emits('deleteExercise', item)
}
</script>

<template>
	<BGenericList
		:key-field="(keyField as keyof IExercise)"
		:items="items"
		:disable-delete="disableDelete"
		@select="onSelectExercise"
		@delete="onDeleteExercise"
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
