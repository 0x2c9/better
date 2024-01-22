<script setup lang="ts">
defineProps<{
	label?: string
}>()

const emits = defineEmits<{
	'checked': [boolean]
}>()

const isChecked = defineModel<boolean>({ default: false })

function onLabelClick() {
	isChecked.value = !isChecked.value
	emits('checked', isChecked.value)
}
</script>

<template>
	<div
		class="absolute inset-y-0 right-0 flex items-center select-none"
		@click.stop="onLabelClick"
	>
		<div
			class="w-10 h-full shrink-0 text-neutral-900 relative transition-colors duration-200 bg-gradient-to-tr"
			:class="{
				'from-green to-green/5': isChecked,
				'from-neutral-600 to-neutral-600/5': !isChecked,
			}"
		>
			<Transition
				appear
				mode="out-in"
				enter-active-class="duration-100 ease-out"
				enter-from-class="transform scale-75"
				enter-to-class="opacity-100 scale-100"
				leave-active-class="duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="transform scale-75 opacity-0"
			>
				<BIcon
					v-if="isChecked"
					class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
					size="24"
					name="material-symbols-check-circle-rounded"
				/>
				<BIcon
					v-else
					class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neutral-500"
					size="24"
					name="material-symbols-check-circle-outline-rounded"
				/>
			</Transition>
		</div>
		<input
			v-model="isChecked"
			type="checkbox"
			hidden
		>
		<span v-if="!label"><slot /></span>
		<span v-else>{{ label }}</span>
	</div>
</template>
