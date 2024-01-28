<script setup lang="ts">
const emits = defineEmits<{
	stop: [void]
}>()

const buttonIsActive = ref(false)

function onTransitionEnd() {
	if (buttonIsActive.value) {
		emits('stop')
	}
}
</script>

<template>
	<BButton
		class="
      relative
      overflow-hidden
			before:pointer-events-none
      before:absolute
      before:inset-0
      before:z-0
      before:origin-left
      before:scale-x-0
      before:transform
      before:bg-neutral-600
      before:transition-transform
      before:ease-linear
      active:bg-neutral-800
    "
		:class="buttonIsActive ? 'before:scale-x-100 before:duration-500' : 'before:scale-x-0 before:duration-200'"
		@mousedown="buttonIsActive = true"
		@mouseup="buttonIsActive = false"
		@touchstart.passive="buttonIsActive = true"
		@touchend="buttonIsActive = false"
		@transitionend="onTransitionEnd"
	>
		<span class="relative z-20">Hold to Stop</span>
	</BButton>
</template>
