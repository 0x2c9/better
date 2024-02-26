<script setup lang="ts">
import type { Exercise, TimeExercise } from '~/types/exercise'

const { disableDelete = false, keyField = 'id' } = defineProps<{
	items: Exercise[]
	keyField?: string
	disableDelete?: boolean
}>()

const emits = defineEmits<{
	selectExercise: [item: Exercise]
	deleteExercise: [item: Exercise]
	startExercise: [item: TimeExercise]
	checkExercise: [item: Exercise, checked: boolean]
}>()

function onSelectExercise(item: Exercise) {
	emits('selectExercise', item)
}

function onDeleteExercise(item: Exercise) {
	emits('deleteExercise', item)
}

function onCheck(checked: boolean, item: Exercise) {
	emits('checkExercise', item, checked)
}

function onStartExercise(item: TimeExercise) {
	emits('startExercise', item)
}
</script>

<template>
	<BGenericList
		:key-field="(keyField as keyof Exercise)"
		:items="items"
		:disable-delete="disableDelete"
		@select="onSelectExercise"
		@delete="onDeleteExercise"
	>
		<template #content="{ item }">
			<div class="flex-1 pl-11">
				<BCheckbox
					v-model="item.done"
					@checked="onCheck($event, item)"
				/>
				<div class="mb-1 flex items-center justify-between">
					<h2 class="text-lg font-medium">
						{{ item.exercise_name }}
					</h2>
				</div>

				<ExerciseListItemRepType
					v-if="item.exercise_type === 'reps'"
					:item="item"
				/>
				<ExerciseListItemTimeType
					v-if="item.exercise_type === 'time' && item.exercise_sets === 1"
					:item="item"
				/>

				<ExerciseListItemSetType
					v-if="item.exercise_type === 'time' && item.exercise_sets > 1"
					class="mt-4"
					column-mode
					:item="item"
				/>
			</div>
			<BButton
				v-if="item.exercise_type === 'time'"
				type="button"
				icon-name="material-symbols-play-arrow-rounded"
				@click.stop="onStartExercise(item)"
			/>
		</template>
	</BGenericList>
</template>
