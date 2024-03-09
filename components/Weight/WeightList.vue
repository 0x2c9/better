<script setup lang="ts">
import type { WeightEntry } from '~/types/weight'

defineProps<{
	items: WeightEntry[]
}>()

const emits = defineEmits<{
	'select-weight': [WeightEntry]
	'delete-weight': [WeightEntry]
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
			<div class="flex min-h-10 w-full items-center">
				<h2
					class="flex items-center gap-x-2 rounded-full border px-3 py-1 font-semibold"
					:class="{
						'border-green bg-green/10 text-green': item.progress === 'increase',
						'border-red bg-red/10 text-red': item.progress === 'decrease',
						'border-blue bg-blue/10 text-blue': item.progress === 'same' || item.progress === undefined,
					}"
				>
					<span>{{ item.weight_display }}</span>

					<BIcon
						v-if="item.progress === 'increase'"
						name="material-symbols-trending-down-rounded"
						size="24"
						class="text-green opacity-80"
					/>
					<BIcon
						v-if="item.progress === 'decrease'"
						name="material-symbols-trending-up-rounded"
						size="24"
						class="text-red opacity-80"
					/>
					<BIcon
						v-if="item.progress === 'same' || item.progress === undefined"
						name="material-symbols-trending-flat-rounded"
						size="24"
						class="text-blue opacity-80"
					/>
				</h2>
				<h3 class="ml-auto text-sm tabular-nums text-gray-medium">
					{{ item.date_display }}
				</h3>
			</div>
		</template>
	</BGenericList>
</template>
