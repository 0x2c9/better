<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

const { disableDelete = false, keyField = 'id' } = defineProps<{
	items: Exercise[]
	keyField?: string
	disableDelete?: boolean
}>()

const emits = defineEmits<{
	'selectExercise': [item: Exercise]
	'deleteExercise': [item: Exercise]
	'startExercise': [item: Exercise]
	'checkExercise': [item: Exercise, checked: boolean]
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

function onStartExercise(item: Exercise) {
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
			<div class="flex-1">
				<div class="flex items-center justify-between mb-1">
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
				class="mr-10"
				type="button"
				icon-name="material-symbols-play-arrow-rounded"
				@click.stop="onStartExercise(item)"
			/>

			<BCheckbox
				v-model="item.done"
				@checked="onCheck($event, item)"
			/>
		</template>
	</BGenericList>
</template>
