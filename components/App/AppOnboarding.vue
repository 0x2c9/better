<script setup lang="ts">
import dayjs from 'dayjs'

const route = useRoute()
const weightStore = useWeightStore()

const showOnboarding = ref(false)
if (route.query.onboarding === 'true') {
	nextTick(() => {
		showOnboarding.value = true
	})
}

const initialWeight = ref(80)
async function submitInitialWeight() {
	if (initialWeight.value) {
		await weightStore.upsertWeight({
			weight: initialWeight.value,
			date: dayjs().format('YYYY-MM-DD'),
		})
		navigateTo('/exercises')
		showOnboarding.value = false
	}
}
</script>

<template>
	<LazyBDrawer
		v-if="showOnboarding"
		v-model="showOnboarding"
		:locked="true"
	>
		<h1 class=" text-center text-2xl font-bold">
			Welcome to Better
		</h1>
		<ul class="mb-8 mt-4 flex list-decimal flex-col gap-y-2 text-lg font-medium text-neutral-300">
			<li>Enter your current weight. (You can edit it later on too)</li>
			<li>Add a collection of exercises</li>
			<li>Create your first workout and get started!</li>
		</ul>
		<form
			class="mt-12 flex flex-col gap-y-8"
			@submit.prevent="submitInitialWeight"
		>
			<BStepper
				v-model="initialWeight"
				label="Current Weight"
				:display-value="initialWeight % 1 === 0 ? `${initialWeight}.0` : initialWeight"
			/>
			<BButton
				type="submit"
				variant="primary"
			>
				Start my journey
			</BButton>
		</form>
	</LazyBDrawer>
</template>
