<script setup lang="ts">
import type { ITimer } from '~/types/timer'

definePageMeta({
	layout: 'app',
})

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

const globalStateStore = useGlobalState()
function toggleQuickStartForm() {
	globalStateStore.showQuickStartForm = !globalStateStore.showQuickStartForm
}
</script>

<template>
	<article class="relative">
		<div
			class="b-box px-5 pt-6 pb-4 mb-6 transition-[height] duration-300 ease-in-out"
			:class="{
				'h-20 overflow-hidden': !globalStateStore.showQuickStartForm,
				'h-auto': globalStateStore.showQuickStartForm,
			}"
		>
			<div class="flex items-center justify-between mb-6">
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
		<div class="flex justify-end items-center mb-6">
			<BButton
				variant="secondary"
				small
				@click="openDropdown"
			>
				<BIcon
					name="material-symbols-add-rounded"
					class="-ml-2 mr-2"
				/>
				Create Interval
			</BButton>
		</div>
		<TimerList
			@select-timer="onSelectTimer"
		/>

		<BDrawer v-model="showDropdown">
			<TimerForm
				mode="form"
				:selected-timer="selectedTimer"
				@submit="onSubmit"
			/>
		</BDrawer>
	</article>
</template>
