<script setup lang="ts">
import type { ITimer } from '~/types/timer'

definePageMeta({
	layout: 'app',
	auth: true,
})

const timerStore = useTimerStore()
const selectedTimer = ref<ITimer | null>(null)
const showDropdown = ref(false)

function openDropdown() {
	selectedTimer.value = null
	showDropdown.value = true
}

function onSubmit() {
	showDropdown.value = false
}

function onSelectTimer(timer: ITimer) {
	selectedTimer.value = timer
	showDropdown.value = true
}

async function onDeleteTimer(timer: ITimer) {
	await timerStore.deleteTimer(timer.id!)
}

async function onStartTimer(item: ITimer) {
	const navigationTarget = `/interval-${item.sets}-${item.training_time}-${item.pause_time}`
	await navigateTo(navigationTarget)
}

const globalStateStore = useGlobalState()
function toggleQuickStartForm() {
	globalStateStore.showQuickStartForm = !globalStateStore.showQuickStartForm
}
</script>

<template>
	<article class="relative">
		<div
			class="b-box mb-6 px-5 pb-4 pt-6 transition-[height] duration-300 ease-in-out"
			:class="{
				'h-20 overflow-hidden': !globalStateStore.showQuickStartForm,
				'h-auto': globalStateStore.showQuickStartForm,
			}"
		>
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-xl font-semibold">
					Quick Start
				</h1>
				<button @click="toggleQuickStartForm">
					<BIcon
						:name=" globalStateStore.showQuickStartForm ? 'material-symbols-keyboard-arrow-up-rounded' : 'material-symbols-keyboard-arrow-down-rounded'"
						size="32"
					/>
				</button>
			</div>
			<TimerForm />
		</div>

		<BPageActionButton @click="openDropdown">
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-2 mr-2"
			/>
			Create Interval
		</BPageActionButton>

		<TimerList
			:items="timerStore.timers"
			@select-timer="onSelectTimer"
			@delete-timer="onDeleteTimer"
			@start-timer="onStartTimer"
		/>
		<ClientOnly>
			<LazyBDrawer v-model="showDropdown">
				<TimerForm
					mode="form"
					:selected-timer="selectedTimer"
					@submit="onSubmit"
				/>
			</LazyBDrawer>
		</ClientOnly>
	</article>
</template>
