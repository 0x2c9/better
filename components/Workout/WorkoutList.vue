<script setup lang="ts">
import type { Workout } from '~/types/workout'

defineProps<{
	workouts: Workout[]
}>()

const emits = defineEmits<{
	selectWorkout: [item: Workout]
	deleteWorkout: [item: Workout]
}>()

function selectWorkout(item: Workout) {
	emits('selectWorkout', item)
}

function deleteWorkout(item: Workout) {
	emits('deleteWorkout', item)
}

function startWorkout(workoutId: string) {
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
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-xl font-medium">
						{{ item.workout_name }}
					</h2>
					<BButton
						type="button"
						icon-name="material-symbols-play-arrow-rounded"
						@click.stop="startWorkout(item.id!)"
					/>
				</div>
				<ul class="space-y-2">
					<ExerciseListItem
						v-for="(workoutExercise, index) of item.workout_exercises"
						:key="`${workoutExercise.id}-${index}`"
						class="rounded-md border border-neutral-600/40 p-4"
						:item="workoutExercise"
					/>
				</ul>
			</div>
		</template>
	</BGenericList>
</template>
