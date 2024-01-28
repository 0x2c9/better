import dayjs from 'dayjs'
import type { WeightEntry } from '~/types/weight'

export const useWeightStore = defineStore(
	'Weight Store',
	() => {
		const DB_TABLE_NAME = 'weight_entries'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const weightHistory = ref<WeightEntry[]>([])

		const parsedWeightHistory = computed<WeightEntry[]>(() => {
			const history = [...weightHistory.value] as WeightEntry[]

			const parsedHistory = history.map((entry, index: number) => {
				if (index === 0) {
					entry.progress = 'same'
					return entry
				}

				const lastEntry = weightHistory.value[index - 1] as WeightEntry

				if (entry.weight > lastEntry.weight) {
					lastEntry.progress = 'increase'
				} else if (entry.weight < lastEntry.weight) {
					lastEntry.progress = 'decrease'
				} else {
					lastEntry.progress = 'same'
				}

				return entry
			})

			return parsedHistory
		})

		const entryDates = computed(() => {
			const dates = {} as Record<string, boolean>

			for (const entry of weightHistory.value) {
				dates[entry.date] = true
			}

			return dates
		})

		const latestEntry = computed(() => {
			if (parsedWeightHistory.value.length === 0) {
				return null
			}

			return parsedWeightHistory.value[0]
		})

		const firstEntry = computed(() => {
			if (parsedWeightHistory.value.length === 0) {
				return null
			}

			return parsedWeightHistory.value[parsedWeightHistory.value.length - 1]
		})

		async function fetchWeightHistory() {
			const { data, error } = await supaClient.from(DB_TABLE_NAME).select('*').order('date', { ascending: false })

			if (error) {
				console.error(error)
				return
			}

			if (!data) {
				console.error('No data returned from fetch')
				return
			}

			weightHistory.value = data
		}

		async function upsertWeight(weightEntry: WeightEntry) {
			const user_id = authStore.userId!

			const payload: WeightEntry = {
				weight: weightEntry.weight,
				date: weightEntry.date,
				user_id,
				user_date_id: `${user_id}-${weightEntry.date}`,
				date_display: dayjs(weightEntry.date).format('ddd, DD.MM.YYYY'),
				weight_display: `${weightEntry.weight.toFixed(1)} kg`,
			}

			const { data, error } = await supaClient.from(DB_TABLE_NAME).upsert(payload, {
				onConflict: 'user_date_id',
			})
				.select()
				.single()

			if (error) {
				console.error(error)
				return
			}

			if (!data) {
				console.error('No data returned from upsert')
				return
			}

			const entryIndex = weightHistory.value.findIndex((entry) => entry.user_date_id === data?.user_date_id)

			if (entryIndex > -1) {
				weightHistory.value[entryIndex] = data
				return
			}

			const insertIndex = weightHistory.value.findIndex((entry) => dayjs(entry.date).isBefore(dayjs(data.date)))

			if (insertIndex === -1) {
				weightHistory.value.push(data)
				return
			}

			weightHistory.value.splice(insertIndex, 0, data)
		}

		async function deleteWeight(entryId: string) {
			const { error } = await supaClient.from(DB_TABLE_NAME).delete().match({ id: entryId })
			if (error) {
				throw new Error(error.message)
			}

			weightHistory.value = weightHistory.value.filter((entry) => entry.id !== entryId)
		}

		return {
			weightHistory,
			latestEntry,
			firstEntry,
			parsedWeightHistory,
			entryDates,
			fetchWeightHistory,
			upsertWeight,
			deleteWeight,
		}
	},
)
