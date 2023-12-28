export const useGlobalState = defineStore(
	'Global State',
	() => {
		const currentOpenItem = ref<string | null>(null)
		const dropdownCounter = ref(0)
		const showQuickStartForm = useLocalStorage('showQuickStartForm', true)

		return {
			dropdownCounter,
			currentOpenItem,
			showQuickStartForm,
		}
	},
)
