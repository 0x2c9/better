<script setup lang="ts">
import dayjs from 'dayjs'
import type { WalkEntry } from '~/types/walk'

const walkStore = useWalkStore()
const { secondsIntoMinutes } = useUtils()

const showWalkForm = ref(false)
const selectedWalkEntry = ref<WalkEntry | null>(null)

function onSelectWalkEntry(walkEntry: WalkEntry) {
	selectedWalkEntry.value = walkEntry
	showWalkForm.value = true
}

function openNewWalkEntryForm() {
	selectedWalkEntry.value = null
	showWalkForm.value = true
}

const showWalkList = ref(false)
function openWalkList() {
	selectedWalkEntry.value = null
	showWalkList.value = true
}

async function onDeleteWorkoutEntry(walkEntry: WalkEntry) {
	if (walkEntry) {
		await walkStore.deleteWalk(walkEntry.id!)
	}
}
</script>

<template>
	<MappedEntriesHeatMap
		title="Walks"
		icon="material-symbols-directions-walk-rounded"
		:mapped-entries="walkStore.mappedEntryWalks"
		type="add"
		@click="openWalkList"
		@action="openNewWalkEntryForm"
	/>
	<WalkForm
		v-model="showWalkForm"
		:selected-walk="selectedWalkEntry"
	/>
	<LazyBDrawer v-model="showWalkList" fullscreen>
		<BGenericList
			key-field="id"
			:items="walkStore.parsedWalkHistory"
			@select="onSelectWalkEntry"
			@delete="onDeleteWorkoutEntry"
		>
			<template #content="{ item }">
				<div class="flex w-full items-center">
					<div class="mr-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-light p-1">
						<BIcon name="material-symbols-directions-walk-rounded" size="20" />
					</div>
					<div>
						<h2 class="truncate font-semibold">
							{{ item.walk_distance }}km
						</h2>
						<h3 class="text-sm text-gray-medium">
							{{ secondsIntoMinutes(item.walk_duration) }}m
						</h3>
					</div>
					<p class="ml-auto shrink-0">
						{{ dayjs(item.walk_date).format('ddd DD.MM.YYYY') }}
					</p>
				</div>
			</template>
		</BGenericList>
	</LazyBDrawer>
</template>
