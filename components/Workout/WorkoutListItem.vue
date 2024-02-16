<script setup lang="ts">
import gsap from 'gsap'
import type { Workout } from '~/types/workout'

defineProps<{
	item: Workout
}>()

function startWorkout(workoutId: string) {
	navigateTo(`/workout/${workoutId}`)
}

const showExerciseList = ref(false)

function toggleExerciseList() {
	showExerciseList.value = !showExerciseList.value
}

function beforeEnter(el: Element) {
	gsap.set(el, {
		height: 0,
	})
}

function onEnter(el: Element, done: () => void) {
	gsap.to(el, {
		height: 'auto',
		duration: 0.2,
		onComplete: done,
	})
}

function onLeave(el: Element, done: () => void) {
	gsap.to(el, {
		height: 0,
		duration: 0.2,
		onComplete: done,
	})
}
</script>

<template>
	<div class="flex-1">
		<div class="flex flex-col">
			<div class="flex items-center justify-between pb-4">
				<h2 class="text-xl font-bold">
					{{ item.workout_name }}
				</h2>
				<button class="text-neutral-500" @click.stop="toggleExerciseList">
					<BIcon size="28" :name="showExerciseList ? 'material-symbols-keyboard-arrow-up-rounded' : 'material-symbols-keyboard-arrow-down-rounded'" />
				</button>
			</div>

			<BButton
				type="button"
				small
				variant="primary"
				class="mr-auto"
				@click.stop="startWorkout(item.id!)"
			>
				Start Workout
			</BButton>

			<Transition
				name="accordion-item"
				@before-enter="beforeEnter"
				@enter="onEnter"
				@leave="onLeave"
			>
				<ul v-show="showExerciseList" class="mt-4 space-y-2 overflow-hidden">
					<ExerciseListItem
						v-for="(workoutExercise, index) of item.workout_exercises"
						:key="`${workoutExercise.id}-${index}`"
						class="rounded-md border border-neutral-600/40 p-4"
						:item="workoutExercise"
					/>
				</ul>
			</Transition>
		</div>
	</div>
</template>
