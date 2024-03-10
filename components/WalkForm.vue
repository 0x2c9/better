<script setup lang="ts">
import dayjs from 'dayjs'
import type { Walk } from '~/types/walk'

const { walkDate = dayjs().format('YYYY-MM-DD'), selectedWalk } = defineProps<{
	selectedWalk?: Walk
	walkDate?: string
}>()

const walkStore = useWalkStore()
const { secondsIntoMinutes } = useUtils()
const openWalkForm = defineModel<boolean>({ required: true, default: false })

const walk = ref<Walk>({
	walk_distance: 0.5,
	walk_duration: 60,
	walk_date: walkDate,
})

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
			<BDatepickerInput v-model="walk.walk_date" :disabled="!!selectedWalk" />
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
				:min="60"
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
