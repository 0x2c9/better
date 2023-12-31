import dayjs from 'dayjs'
import type { IWeightEntry, IWeightEntryFormData, IWeightEntrySorted } from '~/types/weight'

export const useWeightStore = defineStore(
	'Weight Store',
	() => {
		const DB_TABLE_NAME = 'weight_entries'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const weightHistory = ref<IWeightEntry[]>([])

		const parsedWeightHistory = computed<IWeightEntrySorted[]>(() => {
			const history = [...weightHistory.value] as IWeightEntrySorted[]

			const parsedHistory = history.map((entry, index: number) => {
				if (index === 0) {
					entry.progress = 'same'
					return entry
				}

				const lastEntry = weightHistory.value[index - 1] as IWeightEntrySorted

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

		const latestEntry = computed(() => {
			if (parsedWeightHistory.value.length === 0) {
				return null
			}

			return parsedWeightHistory.value[0]
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

		async function upsertWeight(formData: IWeightEntryFormData, selectedWeigth: IWeightEntrySorted | null) {
			const user_id = authStore.userId!

			const payload = {
				...formData,
				user_id,
				user_date_id: `${user_id}-${formData.date}`,
				date_display: dayjs(formData.date).format('ddd, DD.MM.YYYY'),
				weight_display: `${formData.weight.toFixed(1)} kg`,
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

			const entryIndex = weightHistory.value.findIndex((entry) => entry.user_date_id === selectedWeigth?.user_date_id)
			console.log(entryIndex)
			if (entryIndex === -1) {
				weightHistory.value.unshift(data)
			} else {
				weightHistory.value[entryIndex] = data
			}
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
			parsedWeightHistory,
			fetchWeightHistory,
			upsertWeight,
			deleteWeight,
		}
	},
)
