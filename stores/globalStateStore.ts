export const useGlobalState = defineStore(
	'Global State',
	() => {
		const currentOpenItem = ref<string | null>(null)
		const dropdownCounter = ref(0)
		const loaded = ref(false)

		return {
			dropdownCounter,
			currentOpenItem,
			loaded,
		}
	},
)
