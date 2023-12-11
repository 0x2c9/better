import type { ITimer } from '@/types/timer'

export const useTimerStore = defineStore(
	'Time Store',
	() => {
		const DB_TABLE_NAME = 'interval_timers'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const timers = ref<ITimer[]>([])

		const amountOfTimers = computed(() => timers.value.length)

		async function upsertTimer(formData: ITimer) {
			try {
				const timer = {
					...formData,
					user_id: authStore.userId!,
				}

				const { data, error } = await supaClient.from(DB_TABLE_NAME).upsert(timer).select().single()

				if (error) {
					throw new Error(error.message)
				}

				const timerIndex = timers.value.findIndex((timer) => timer.id === data?.id)

				if (timerIndex === -1) {
					timers.value.unshift(data as ITimer)
				} else {
					timers.value[timerIndex] = data as ITimer
				}
			} catch (error) {
				console.log(error)
			}
		}

		async function getTimers() {
			const { data, error } = await supaClient.from(DB_TABLE_NAME).select()

			if (error) {
				throw new Error(error.message)
			}

			timers.value = data as ITimer[]
		}

		async function deleteTimer(timerId: string) {
			timers.value = timers.value.filter((timer) => timer.id !== timerId)

			const { error } = await supaClient.from(DB_TABLE_NAME).delete().match({ id: timerId })

			if (error) {
				throw new Error(error.message)
			}
		}

		return {
			timers,
			amountOfTimers,
			upsertTimer,
			getTimers,
			deleteTimer,
		}
	},
)
