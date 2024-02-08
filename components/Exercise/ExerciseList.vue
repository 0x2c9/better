<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

const { disableDelete = false, keyField = 'id' } = defineProps<{
	items: Exercise[]
	keyField?: string
	disableDelete?: boolean
}>()

const emits = defineEmits<{
	selectExercise: [item: Exercise]
	deleteExercise: [item: Exercise]
}>()

function onSelectExercise(item: Exercise) {
	emits('selectExercise', item)
}

function onDeleteExercise(item: Exercise) {
	emits('deleteExercise', item)
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
			<ExerciseListItem
				:item="item"
			/>
		</template>
	</BGenericList>
</template>
