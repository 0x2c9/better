<script setup lang="ts">
import type { ITimer } from '@/types/timer'

const { selectedTimer, mode = 'timer' } = defineProps<{
	selectedTimer?: ITimer | null
	mode?: 'form' | 'timer'
}>()

const emits = defineEmits<{
	submit: [void]
}>()

const timerStore = useTimerStore()

const { secondsIntoMinutes } = useUtils()

const name = ref('')
const sets = ref(2)
const trainingTime = ref(30)
const restTime = ref(10)

const computedTimerDefaultName = computed(() => {
	return `Timer #${timerStore.amountOfTimers + 1}`
})

watch(
	() => selectedTimer,
	(newTimer) => {
		if (newTimer) {
			name.value = newTimer.name
			sets.value = newTimer.sets
			trainingTime.value = newTimer.training_time
			restTime.value = newTimer.pause_time
		}
	},
	{
		immediate: true,
	},
)
const router = useRouter()

const activeElement = useActiveElement()
function onEnter() {
	activeElement.value?.blur()
}

async function onSubmit() {
	if (mode === 'timer') {
		const navigationTarget = `/interval-${sets.value}-${trainingTime.value}-${restTime.value}`
		router.push(navigationTarget)

		return
	}
	emits('submit')

	const timerDuration = sets.value * (trainingTime.value + restTime.value)
	const payload: ITimer = {
		name: name.value ? name.value.trim() : computedTimerDefaultName.value,
		sets: sets.value,
		training_time: trainingTime.value,
		pause_time: restTime.value,
		duration: timerDuration,
	}

	if (selectedTimer?.id) {
		payload.id = selectedTimer.id
	}

	await timerStore.upsertTimer(payload)
}
</script>

<template>
	<form
		class="flex flex-col items-center space-y-4"
		@submit.prevent="onEnter"
	>
		<BInput
			v-if="mode === 'form'"
			v-model="name"
			label="Timer name"
			:placeholder="selectedTimer?.name || computedTimerDefaultName"
		/>
		<BStepper
			v-model="sets"
			label="Sets"
			:steps="1"
			:min="1"
			:display-value="sets"
		/>

		<BStepper
			v-model="trainingTime"
			label="Training Time"
			:steps="1"
			:min="5"
			:display-value="secondsIntoMinutes(trainingTime)"
		/>

		<BStepper
			v-model="restTime"
			label="Rest Time"
			:min="0"
			:steps="1"
			:display-value="secondsIntoMinutes(restTime)"
		/>

		<BButton
			type="button"
			variant="primary"
			class="!mt-10 w-full"
			@click="onSubmit"
		>
			{{ mode === 'form' ? 'Save' : 'Start' }}
		</BButton>
	</form>
</template>
