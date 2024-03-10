<script setup lang="ts">
import { dragAndDrop } from '@formkit/drag-and-drop/vue'
import type { ComponentPublicInstance } from 'vue'
import type { Exercise } from '~/types/exercise'

const { disableDelete = false, keyField = 'id', sortable = false } = defineProps<{
	keyField?: string
	disableDelete?: boolean
	sortable?: boolean
}>()

const emits = defineEmits<{
	selectExercise: [item: Exercise]
	deleteExercise: [item: Exercise]
}>()

const sortableItems = defineModel<Exercise[]>({ required: true, default: [] })

function onSelectExercise(item: Exercise) {
	emits('selectExercise', item)
}

function onDeleteExercise(item: Exercise) {
	emits('deleteExercise', item)
}

const parentRef = ref<ComponentPublicInstance | null>(null)

const ulEl = ref<HTMLElement | null>(null)
onMounted(() => {
	if (parentRef.value && sortableItems.value.length > 0 && sortable) {
		ulEl.value = parentRef.value.$el.querySelector('ul')
		dragAndDrop({
			parent: ulEl.value!,
			values: sortableItems,
		})
	}
})

watch(
	() => sortableItems.value?.length,
	(newItemsCount, oldItemsCount) => {
		if (newItemsCount === 1 && oldItemsCount === 0) {
			ulEl.value = parentRef.value!.$el.querySelector('ul')
			dragAndDrop({
				parent: ulEl.value!,
				values: sortableItems,
			})
		}
	},
)
</script>

<template>
	<BGenericList
		ref="parentRef"
		:key-field="(keyField as keyof Exercise)"
		:items="sortableItems"
		:sortable="sortable"
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
