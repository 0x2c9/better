<script setup lang="ts" generic="T">
const { item, id } = defineProps<{
	unstyled?: boolean
	id: string
	item: T
}>()

const emits = defineEmits<{
	select: [item: T]
	delete: [item: T]
}>()

enum SwipeDirection {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right',
}

const itemEl = ref<HTMLElement | null>(null)
const xValue = ref(0)

const globalState = useGlobalState()

watch(
	() => globalState.currentOpenItem,
	(newId) => {
		if (newId !== id || newId === null) {
			xValue.value = 0
		}
	},
)

const { direction } = useSwipe(itemEl, {
	threshold: 10,
	onSwipe() {
		switch (direction.value) {
			case SwipeDirection.LEFT:
				xValue.value = -100
				globalState.currentOpenItem = id
				break
			case SwipeDirection.RIGHT:
				xValue.value = 0
				globalState.currentOpenItem = null
				break
		}
	},
})

function onSelect() {
	emits('select', item)
}

function onDelete() {
	emits('delete', item)
}
</script>

<template>
	<li
		:key="id"
		class="relative w-full flex"
	>
		<div
			ref="itemEl"
			class="relative b-box flex-1 z-10 flex items-center overflow-hidden rounded-xl px-4 py-2 transition-transform duration-300 ease-in-out select-none"
			:style="{
				transform: `translateX(${xValue}px)`,
			}"
			@click="onSelect"
		>
			<slot
				name="content"
				:item="item"
			/>
			<template v-if="!unstyled">
				<slot name="icon" />
				<div class="flex flex-1 flex-col">
					<div class="flex items-center justify-between">
						<h1 class="text-lg font-semibold">
							<slot
								name="title"
								:item="item"
							/>
						</h1>
					</div>

					<div>
						<h3 class="text-xs text-neutral-500">
							<slot
								name="subtitle"
								:item="item"
							/>
						</h3>
					</div>
				</div>
			</template>
		</div>

		<div
			class="absolute right-0 top-1/2 flex w-[100px] -translate-y-1/2 items-center justify-center"
		>
			<Transition
				enter-active-class="transition duration-300 ease-out delay-75"
				enter-from-class="opacity-0 scale-[0.8]"
				enter-to-class="opacity-100"
				leave-active-class="transition duration-300 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0 scale-[0.8] "
				mode="out-in"
			>
				<JButton
					v-if="xValue === -100"
					icon-name="material-symbols-delete-outline-rounded"
					size="small"
					variant="error"
					@click="onDelete"
				/>
			</Transition>
		</div>
	</li>
</template>
