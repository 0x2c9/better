<script setup lang="ts">
import dayjs from 'dayjs'
import type { WalkEntry } from '~/types/walk'

const { selectedWalk } = defineProps<{
	selectedWalk: WalkEntry | null
}>()

const walkStore = useWalkStore()
const { secondsIntoMinutes } = useUtils()
const openWalkForm = defineModel<boolean>({ required: true, default: false })

const defaultWalk = {
	walk_distance: 1,
	walk_duration: 600,
	walk_date: dayjs().format('YYYY-MM-DD'),
}

const walk = ref<WalkEntry>(defaultWalk)

watch(
	() => selectedWalk,
	(selectedWalk) => {
		if (selectedWalk) {
			walk.value = { ...selectedWalk }
		}
	},
	{
		immediate: true,
	},
)

watch(
	() => openWalkForm.value,
	(openWalkForm) => {
		if (openWalkForm && !selectedWalk) {
			walk.value = { ...defaultWalk }
		}
	},
)

function onSubmit() {
	walkStore.upsertWalk(walk.value)
	openWalkForm.value = false
}
</script>

<template>
	<BDrawer
		v-model="openWalkForm"
	>
		<form class="flex flex-col space-y-4" @submit.prevent="onSubmit">
			<BDatepickerInput
				v-model="walk.walk_date"
				:disabled="!!selectedWalk"
				:highlighted-dates="new Set<string>(Object.keys(walkStore.mappedEntryWalks))"
			/>
			<BStepper
				v-model="walk.walk_distance"
				label="Distance"
				:steps="0.1"
				:min="0.1"
				:display-value="`${walk.walk_distance} km`"
			/>

			<BStepper
				v-model="walk.walk_duration"
				label="Duration"
				:min="1"
				:steps="10"
				:display-value="secondsIntoMinutes(walk.walk_duration)"
			/>

			<BButton
				type="submit"
				class="!mt-12 w-full"
			>
				{{ selectedWalk ? 'Update your walk' : 'Add new walk' }}
			</BButton>
		</form>
	</BDrawer>
</template>
