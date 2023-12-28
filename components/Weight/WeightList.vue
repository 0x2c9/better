<script setup lang="ts">
import type { IWeightEntrySorted } from '~/types/weight'

defineProps<{
	items: IWeightEntrySorted[]
}>()

const emits = defineEmits<{
	'select-weight': [IWeightEntrySorted]
	'delete-weight': [IWeightEntrySorted]
}>()
</script>

<template>
	<BGenericList
		key-field="id"
		:items="items"
		@select="emits('select-weight', $event)"
		@delete="emits('delete-weight', $event)"
	>
		<template #content="{ item }">
			<div class="min-h-10 flex items-center w-full">
				<div
					class="absolute inset-y-0 left-0 w-16 bg-gradient-to-r flex items-center pl-2 "
					:class="{
						'from-green/40 via-green/10': item.progress === 'increase',
						'from-red/40 via-red/10 ': item.progress === 'decrease',
						'from-blue/40 via-blue/10 ': item.progress === 'same' || item.progress === undefined,
					}"
				>
					<BIcon
						v-if="item.progress === 'increase'"
						name="material-symbols-trending-down-rounded"
						size="32"
						class="text-green opacity-80"
					/>
					<BIcon
						v-if="item.progress === 'decrease'"
						name="material-symbols-trending-up-rounded"
						size="32"
						class="text-red opacity-80"
					/>
					<BIcon
						v-if="item.progress === 'same' || item.progress === undefined"
						name="material-symbols-trending-flat-rounded"
						size="32"
						class="text-blue opacity-80"
					/>
				</div>

				<h2 class="ml-12 font-semibold text-xl">
					{{ item.weightDisplay }}
				</h2>
				<h3 class="ml-auto text-neutral-400 text-sm tabular-nums">
					{{ item.dateDisplay }}
				</h3>
			</div>
		</template>
	</BGenericList>
</template>
