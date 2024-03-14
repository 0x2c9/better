<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import type { Walk } from '~/types/walk'

dayjs.extend(weekOfYear)
dayjs.locale('de') // use locale

definePageMeta({
	layout: 'app',
	auth: true,
})

const weightStore = useWeightStore()

function onWeightAction() {
	navigateTo('/weight')
}
</script>

<template>
	<article class="relative flex flex-1 flex-col">
		<section class="flex flex-1 flex-col space-y-4">
			<WorkoutHomeMap />
			<WalkHomeMap />
			<MappedEntriesHeatMap
				title="Weight"
				icon="material-symbols-monitor-weight-outline"
				:mapped-entries="weightStore.mappedEntryDates"
				type="view"
				@action="onWeightAction"
			/>
		</section>
	</article>
</template>
