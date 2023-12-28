<script setup lang="ts" generic="T">
const { unstyled = false } = defineProps<{
	items: T[]
	unstyled?: boolean
	keyField: keyof T
}>()

const emits = defineEmits<{
	select: [item: T]
	delete: [item: T]
}>()

function onSelect(item: T) {
	emits('select', item)
}

function onDelete(item: T) {
	emits('delete', item)
}
</script>

<template>
	<div class="relative w-full">
		<TransitionGroup
			name="list"
			tag="ul"
			class="space-y-4"
		>
			<BGenericListItem
				v-for="item of items"
				:id="String(item[keyField as keyof T])"
				:key="String(item[keyField as keyof T])"
				:item="item"
				:unstyled="unstyled"
				@select="onSelect(item)"
				@delete="onDelete(item)"
			>
				<template #content>
					<slot
						name="content"
						:item="item"
					/>
				</template>
			</BGenericListItem>
		</TransitionGroup>
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
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
	transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}
</style>
