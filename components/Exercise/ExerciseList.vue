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
			<ExerciseListItem
				:item="item"
			/>
		</template>
	</BGenericList>
</template>
