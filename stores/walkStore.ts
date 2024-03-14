import type { WalkEntry } from '@/types/walk'

export const useWalkStore = defineStore(
	'Walk Store',
	() => {
		const DB_TABLE_NAME = 'walks'
		const supaClient = useSupabase()
		const authStore = useAuthStore()

		const walks = ref<WalkEntry[]>([])

		const parsedWalkHistory = computed(() => {
			return [...walks.value].sort((a, b) => {
				return new Date(b.walk_date).getTime() - new Date(a.walk_date).getTime()
			})
		})

		const mappedEntryWalks = computed(() => {
			const dates = {} as Record<string, WalkEntry[]>
			for (const entry of walks.value) {
				if (!dates[entry.walk_date]) {
					dates[entry.walk_date] = [entry]
				} else {
					dates[entry.walk_date].push(entry)
				}
			}
			return dates
		})

		async function upsertWalk(formData: WalkEntry) {
			try {
				const walk = {
					...formData,
					user_id: authStore.userId!,
				}

				const { data, error } = await supaClient.from(DB_TABLE_NAME).upsert(walk).select().single()

				if (error) {
					throw new Error(error.message)
				}

				const walkIndex = walks.value.findIndex((walk) => walk.id === data?.id)

				if (walkIndex === -1) {
					walks.value.unshift(data as WalkEntry)
				} else {
					walks.value[walkIndex] = data as WalkEntry
				}
			} catch (error) {
				console.log(error)
			}
		}

		async function getWalks() {
			const { data, error } = await supaClient.from(DB_TABLE_NAME).select().order('walk_date', { ascending: false })

			if (error) {
				throw new Error(error.message)
			}

			walks.value = data as WalkEntry[]
		}

		async function deleteWalk(walkId: string) {
			walks.value = walks.value.filter((walk) => walk.id !== walkId)

			const { error } = await supaClient.from(DB_TABLE_NAME).delete().match({ id: walkId })

			if (error) {
				throw new Error(error.message)
			}
		}

		return {
			walks,
			mappedEntryWalks,
			parsedWalkHistory,
			upsertWalk,
			getWalks,
			deleteWalk,
		}
	},
)
