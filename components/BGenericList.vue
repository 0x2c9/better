<script setup lang="ts" generic="T">
import { vOnLongPress } from '@vueuse/components'

const { disableDelete = false, keyField = 'id', sortable = false, items = [] } = defineProps<{
	items: T[]
	disableDelete?: boolean
	keyField?: keyof T
	sortable?: boolean
}>()

const emits = defineEmits<{
	select: [item: T]
	delete: [item: T]
}>()

function onSelect(item: T) {
	emits('select', item)
}

const showConfirmDeleteModal = ref(false)
const longPressedItem = ref<T>()

function onLongPress(event: PointerEvent) {
	if (disableDelete) {
		return
	}
	let eventTarget = event.target as HTMLElement

	while (!eventTarget.dataset.keyFieldData && eventTarget.parentElement) {
		eventTarget = eventTarget.parentElement
	}

	const keyFieldData = eventTarget.dataset.keyFieldData
	const selectedItem = items.find((item) => String(item[keyField as keyof T]) === keyFieldData)

	if (selectedItem) {
		showConfirmDeleteModal.value = true
		longPressedItem.value = selectedItem
	}
}

function onConfirmAndClose() {
	showConfirmDeleteModal.value = false
	if (longPressedItem.value) {
		emits('delete', longPressedItem.value)
	}
}

function onCancel() {
	showConfirmDeleteModal.value = false
}
</script>

<template>
	<div class="relative w-full">
		<TransitionGroup
			name="list"
			tag="ul"
			class="flex flex-col"
			:class="{
				'gap-y-4': sortable,
				'gap-y-3': !sortable,
			}"
		>
			<li
				v-for="item of items"
				:key="String(item[keyField as keyof T])"
				v-on-long-press.prevent="[onLongPress, { delay: 1000 }]"
				:data-key-field-data="item[keyField as keyof T]"
				class="relative flex w-full"
				@click="onSelect(item)"
			>
				<div
					class="relative z-10 flex flex-1 select-none items-center overflow-hidden rounded-lg border-none bg-white px-4 py-2 shadow-better transition-transform duration-300 ease-in-out"
				>
					<slot name="content" :item="item"></slot>
				</div>
			</li>
		</TransitionGroup>

		<LazyBDrawer v-model="showConfirmDeleteModal">
			<section class="flex flex-col">
				<h1 class="text-xl font-semibold">
					You are about to delete the selected item?
				</h1>
				<p class="mt-2 text-lg">
					This action cannot be undone.
				</p>
				<BButton
					class="mt-8"
					variant="danger"
					@click="onConfirmAndClose"
				>
					Confirm and close
				</BButton>
				<BButton
					class="mt-4"
					variant="secondary"
					@click="onCancel"
				>
					Cancel
				</BButton>
			</section>
		</LazyBDrawer>
	</div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.list-leave-to {
  opacity: 0;
	transform: scale(0.7);
}

.list-leave-active {
  position: absolute;
}
</style>
