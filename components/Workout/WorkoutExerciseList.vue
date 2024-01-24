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
	'startExercise': [item: IExercise]
	'checkExercise': [item: IExercise, checked: boolean]
}>()

function onSelectExercise(item: IExercise) {
	emits('selectExercise', item)
}

function onDeleteExercise(item: IExercise) {
	emits('deleteExercise', item)
}

function onCheck(checked: boolean, item: IExercise) {
	emits('checkExercise', item, checked)
}

function onStartExercise(item: IExercise) {
	emits('startExercise', item)
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
					v-if="item.exercise_type === 'time' && item.exercise_duration_type === 'single'"
					:item="item"
				/>

				<ExerciseListItemSetType
					v-if="item.exercise_duration_type === 'sets'"
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
