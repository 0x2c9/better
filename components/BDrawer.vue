<script setup lang="ts">
const { fullscreen = false, locked = false } = defineProps<{
	fullscreen?: boolean
	locked?: boolean
}>()

const emits = defineEmits(['close'])

enum SwipeDirection {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right',
}

const modelValue = defineModel<boolean>()
const globalState = useGlobalState()

const dropdownEl = ref<HTMLElement | null>(null)
const swipeEl = ref<HTMLElement | null>(null)
const slotEl = ref<HTMLElement | null>(null)
const windowHeight = computed(() => window.innerHeight)
const targetHeight = ref(0)
const isInputFocused = ref(false)
const localDropdownCounter = ref(0)
const top = ref('auto')

const currentState = ref<'full' | 'auto' | 'close'>('auto')

const swipedToSnap = ref(false)
const SWIPE_UP_TO_SNAP_THRESHOLD = 50
const SWIPE_DOWN_TO_SNAP_THRESHOLD = 25

function setToFullState() {
	top.value = '12px'
	currentState.value = 'full'
}

function setToInitialState() {
	top.value = `${windowHeight.value - targetHeight.value - 12}px` // -8 -> inset-2
	currentState.value = 'auto'
}

function setToCloseState() {
	top.value = `${windowHeight.value}px`
	currentState.value = 'close'
}

const { direction, isSwiping, lengthY } = useSwipe(dropdownEl, {
	threshold: 10,
	onSwipe() {
		if (isInputFocused.value || fullscreen || locked) {
			return
		}
		if (windowHeight.value && targetHeight.value) {
			const swipedLength = Math.abs(lengthY.value)
			switch (direction.value) {
				case SwipeDirection.UP:

					if (swipedLength > SWIPE_UP_TO_SNAP_THRESHOLD) {
						swipedToSnap.value = true
					} else {
						swipedToSnap.value = false
					}
					if (top.value !== '0') {
						top.value = `${(swipedLength - (windowHeight.value - targetHeight.value)) * -1}px`
					}
					break
				case SwipeDirection.DOWN:
					if (swipedLength > SWIPE_DOWN_TO_SNAP_THRESHOLD) {
						swipedToSnap.value = true
					} else {
						swipedToSnap.value = false
					}
					if (currentState.value === 'full') {
						top.value = `${swipedLength}px`
					}

					if (currentState.value === 'auto') {
						const offset = windowHeight.value - targetHeight.value
						top.value = `${swipedLength + offset}px`
					}
					break
			}
		}
	},
	onSwipeEnd(_e: TouchEvent, direction) {
		if (isInputFocused.value) {
			return
		}

		switch (direction) {
			case SwipeDirection.UP:
				if (swipedToSnap.value) {
					setToFullState()
				} else {
					setToInitialState()
				}
				break
			case SwipeDirection.DOWN:
				if (currentState.value === 'full') {
					swipedToSnap.value ? setToInitialState() : setToFullState()
				} else if (currentState.value === 'auto') {
					swipedToSnap.value ? setToCloseState() : setToInitialState()
				}
				break
		}
	},
})

const mutationObserver = new MutationObserver((_mutations, _observer) => {
	if (_mutations.length === 1) {
		const mutation = _mutations[0]
		if (mutation.type === 'childList') {
			if (mutation.addedNodes.length === 1 && mutation.removedNodes.length === 1) {
				const addedNode = mutation.addedNodes[0]
				const removedNode = mutation.removedNodes[0]
				if (addedNode.nodeType === 3 && removedNode.nodeType === 3) {
					return
				}
			}
		}
	}
	const computedStyle = window.getComputedStyle(dropdownEl.value!)
	const dropdownElPaddingBottom = Number.parseInt(computedStyle.getPropertyValue('padding-bottom'))
	const swipeElHeight = swipeEl.value?.clientHeight ?? 0
	const slotElHeight = slotEl.value?.clientHeight ?? 0

	targetHeight.value = dropdownElPaddingBottom + swipeElHeight + slotElHeight

	if (currentState.value === 'auto') {
		setToInitialState()
	}

	if (currentState.value === 'full') {
		setToFullState()
	}
})

watch(
	() => dropdownEl.value,
	(newElement) => {
		if (!newElement) {
			return
		}

		if (!fullscreen) {
			mutationObserver.observe(newElement, {
				subtree: true,
				childList: true,
			})
		}

		if (typeof newElement.clientHeight === 'number' && newElement.clientHeight > 0) {
			targetHeight.value = newElement.clientHeight
		}

		if (currentState.value === 'auto' || fullscreen) {
			newElement.addEventListener('transitionend', () => {
				if (currentState.value === 'close') {
					modelValue.value = false
					emits('close')
				}
			})
			if (fullscreen) {
				setToFullState()
			} else {
				setToInitialState()
			}
		}
	},
)

watch(() => modelValue.value, (isOpen) => {
	if (isOpen) {
		globalState.currentOpenItem = null
		globalState.dropdownCounter += 1
		document.body.style.setProperty('overflow', 'hidden')
	} else {
		globalState.dropdownCounter -= 1
		document.body.style.removeProperty('overflow')
		mutationObserver.disconnect()
	}

	localDropdownCounter.value = globalState.dropdownCounter * 100
	if (fullscreen) {
		setToFullState()
		return
	}
	top.value = 'auto'
	currentState.value = 'auto'
})

const activeElement = useActiveElement()

watch(activeElement, (el) => {
	if (el?.tagName === 'INPUT' && !(el as HTMLInputElement)?.readOnly) {
		isInputFocused.value = true
	} else {
		isInputFocused.value = false
	}
})

function onBackdropClick(e: MouseEvent) {
	if (e.clientY + 10 > Number.parseInt(top.value) || fullscreen || locked) {
		return
	}

	closeDrawer()
}

function closeDrawer() {
	modelValue.value = false
	emits('close')
}

const slots = useSlots()
</script>

<template>
	<Teleport to="body">
		<Transition
			appear
			name="fade"
		>
			<div
				v-if="modelValue"
				class="fixed inset-0 bg-gray-light/10 backdrop-blur-[4px]"
				:style="{
					zIndex: 1010 + localDropdownCounter,
				}"
				@click="onBackdropClick"
			></div>
		</Transition>
		<Transition
			appear
			mode="out-in"
			enter-active-class="ease-out"
			enter-from-class="opacity-0 translate-y-4"
			enter-to-class="opacity-100"
			leave-active-class="ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0 translate-y-1"
		>
			<div
				v-if="modelValue"
				ref="dropdownEl"
				:data-drawer-index="localDropdownCounter"
				class="absolute inset-3 z-[1020] flex flex-col overflow-hidden rounded-2xl shadow-better will-change-transform"
				:class="{
					'[transition:top_0.2s,transform_0.33s,opacity_0.25s]': !isSwiping,
					'pb-8': !slots.footer,
					'bg-dirty-white': slots.footer || slots.header,
					'bg-white': !slots.footer && !slots.header,
				}"
				:style="{
					top,
					zIndex: 1020 + localDropdownCounter,
				}"
			>
				<div
					ref="swipeEl"
					class="bg-white pb-2 pt-4"
					:class=" {
						'px-4': fullscreen,
						'px-8': !fullscreen,
					}"
				>
					<template v-if="!fullscreen">
						<div class="flex flex-col items-center justify-center">
							<div class="h-1.5 w-12 rounded-full bg-gray-light"></div>
						</div>
					</template>
					<template v-else>
						<header v-if="slots.header">
							<slot name="header"></slot>
						</header>
						<div v-else class="relative flex min-h-6 items-center">
							<button
								class="absolute left-0"
								type="button"
								@click="closeDrawer"
							>
								<BIcon
									name="material-symbols-arrow-back-rounded"
									size="24"
								/>
							</button>
						</div>
					</template>
				</div>

				<div
					ref="slotEl"
					:class="{
						'flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 pt-2': fullscreen,
						'px-8': !fullscreen,
						'border-t border-t-gray-light': slots.header,
					}"
				>
					<slot name="default"></slot>
				</div>
				<footer class="z-50 border-t border-t-gray-light bg-white p-4 empty:hidden">
					<slot name="footer"></slot>
				</footer>
			</div>
		</Transition>
	</Teleport>
</template>
