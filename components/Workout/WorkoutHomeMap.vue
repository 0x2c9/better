<script setup lang="ts">
import dayjs from 'dayjs'
import type { WorkoutEntry } from '~/types/workout'

const workoutStore = useWorkoutStore()
const { secondsIntoMinutes } = useUtils()

const showWorkoutAnalytics = ref(false)
const selectedWorkoutEntry = ref<WorkoutEntry>()
function onSelectWorkoutEntry(workoutEntry: WorkoutEntry) {
	selectedWorkoutEntry.value = workoutEntry
	showWorkoutAnalytics.value = true
}
function onWorkoutAction() {
	navigateTo('/workouts')
}

const showWorkoutList = ref(false)
function openWorkoutList() {
	showWorkoutList.value = true
}

async function onDeleteWorkoutEntry(workoutEntry: WorkoutEntry) {
	if (workoutEntry) {
		await workoutStore.deleteWorkoutEntry(workoutEntry.id!)
	}
}
</script>

<template>
	<MappedEntriesHeatMap
		title="Workouts"
		icon="material-symbols-exercise-outline"
		:mapped-entries="workoutStore.mappedEntryWorkouts"
		type="view"
		@click="openWorkoutList"
		@action="onWorkoutAction"
	/>
	<LazyBDrawer v-model="showWorkoutList" fullscreen>
		<BGenericList
			key-field="id"
			:items="workoutStore.workoutEntries"
			@select="onSelectWorkoutEntry"
			@delete="onDeleteWorkoutEntry"
		>
			<template #content="{ item }">
				<div class="flex w-full items-center">
					<div class="mr-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-light p-1">
						<BIcon name="material-symbols-exercise-outline" size="20" />
					</div>
					<div>
						<h2 class="truncate font-semibold">
							{{ item.workout_name }}
						</h2>
						<p v-if="item.workout_duration" class="text-sm">
							{{ secondsIntoMinutes(item.workout_duration) }}
						</p>
					</div>
					<p class="ml-auto shrink-0 text-sm">
						{{ dayjs(item.workout_date).format('ddd DD.MM.YYYY') }}
					</p>
				</div>
			</template>
		</BGenericList>
	</LazyBDrawer>

	<LazyBDrawer v-model="showWorkoutAnalytics" fullscreen>
		<WorkoutAnalytics :completed-workout="selectedWorkoutEntry!" />
	</LazyBDrawer>
</template>
