<script setup lang="ts">
const { title = null, narrow = true } = defineProps<{ title?: string, narrow?: boolean }>()

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
const windowHeight = computed(() => window.innerHeight)
const targetHeight = computed(() => dropdownEl.value?.clientHeight)
const inialTargetHeight = ref(0)
const isInputFocused = ref(false)
const localDropdownCounter = ref(0)
const top = ref('auto')

const currentState = ref<'full' | 'auto' | 'close'>('auto')

watch(
	() => dropdownEl.value,
	(newVal) => {
		if (newVal && currentState.value === 'auto') {
			newVal.addEventListener('transitionend', () => {
				if (currentState.value === 'close') {
					modelValue.value = false
					emits('close')
				}
			})
		}
	},
)

watch(
	() => dropdownEl.value?.clientHeight,
	(newVal) => {
		if (typeof newVal === 'number' && newVal > 0 && !inialTargetHeight.value) {
			inialTargetHeight.value = newVal
		}
	},
)
const swipedToSnap = ref(false)
const SWIPE_UP_TO_SNAP_THRESHOLD = 50
const SWIPE_DOWN_TO_SNAP_THRESHOLD = 25

function setToFullState() {
	top.value = '12px'
	currentState.value = 'full'
}

function setToInitialState() {
	top.value = `${windowHeight.value - inialTargetHeight.value - 12}px` // -8 -> inset-2
	currentState.value = 'auto'
}

function setToCloseState() {
	top.value = `${windowHeight.value}px`
	currentState.value = 'close'
}

const { direction, isSwiping, lengthY } = useSwipe(dropdownEl, {
	threshold: 10,
	onSwipe() {
		if (isInputFocused.value) {
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

watch(() => modelValue.value, (isOpen) => {
	if (isOpen) {
		globalState.currentOpenItem = null
		globalState.dropdownCounter += 1
		document.body.style.setProperty('overflow', 'hidden')
	} else {
		globalState.dropdownCounter -= 1
		document.body.style.removeProperty('overflow')
	}

	localDropdownCounter.value = globalState.dropdownCounter * 100
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

function onBackdropClick() {
	modelValue.value = false
	emits('close')
}
</script>

<template>
	<Teleport to="body">
		<Transition
			appear
			name="fade"
		>
			<div
				v-if="modelValue"
				class="fixed inset-0 bg-neutral-950/50 backdrop-blur-[4px]"
				:style="{
					zIndex: 1010 + localDropdownCounter,
				}"
				@click="onBackdropClick"
			/>
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
				class="absolute b-box inset-4 z-[1020] rounded-3xl border-t border-transparent  pb-8 will-change-transform overflow-hidden"
				:class="{
					'[transition:top_0.2s,transform_0.33s,opacity_0.25s]': !isSwiping,
					'px-8': narrow,
					'px-4': !narrow,
				}"
				:style="{
					top,
					zIndex: 1020 + localDropdownCounter,
				}"
			>
				<div
					ref="swipeEl"
					class="flex flex-col items-center justify-center pb-8 pt-4"
				>
					<div
						class="h-1.5 w-12 rounded-full bg-neutral-200"
					/>
					<div
						v-if="title"
						class="text-neutral-200 mt-4"
					>
						{{ title }}
					</div>
				</div>

				<slot />
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.overlay.animated {
  transition: all 0.2s ease-out;
}
</style>
