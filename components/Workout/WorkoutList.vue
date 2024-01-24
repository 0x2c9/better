<script setup lang="ts">
import type { IWorkoutResolved } from '~/types/workout'

defineProps<{
	workouts: IWorkoutResolved[]
}>()

const emits = defineEmits<{
	'selectWorkout': [item: IWorkoutResolved]
	'deleteWorkout': [item: IWorkoutResolved]
}>()

function selectWorkout(item: IWorkoutResolved) {
	emits('selectWorkout', item)
}

function deleteWorkout(item: IWorkoutResolved) {
	emits('deleteWorkout', item)
}

function startWorkout(workoutId: string) {
	console.log(workoutId)
	navigateTo(`/workout/${workoutId}`)
}
</script>

<template>
	<BGenericList
		:items="workouts"
		@select="selectWorkout"
		@delete="deleteWorkout"
	>
		<template #content="{ item }">
			<div class="flex-1">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-xl font-medium">
						{{ item.name }}
					</h2>
					<BButton
						type="button"
						icon-name="material-symbols-play-arrow-rounded"
						@click.stop="startWorkout(item.id!)"
					/>
				</div>
				<ul class="space-y-2">
					<ExerciseListItem
						v-for="(workoutExercise, index) of item.resolvedExercises"
						:key="`${workoutExercise.id}-${index}`"
						class="border border-neutral-600/40 rounded-md p-4"
						:item="workoutExercise"
					/>
				</ul>
			</div>
		</template>
	</BGenericList>
</template>
