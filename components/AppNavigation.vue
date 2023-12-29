<script setup lang="ts">
interface IMenuItem {
	title: string
	link: string
	iconBase: keyof typeof ICONS
	iconActive: keyof typeof ICONS
}

const menuItems: IMenuItem[] = [
	{
		title: 'Home',
		link: '/home',
		iconBase: 'material-symbols-home-outline-rounded',
		iconActive: 'material-symbols-home-rounded',
	},
	{
		title: 'Timer',
		link: '/timer',
		iconBase: 'material-symbols-alarm-outline-rounded',
		iconActive: 'material-symbols-alarm-rounded',
	},
	{
		title: 'Weight',
		link: '/weight',
		iconBase: 'material-symbols-monitor-weight-outline',
		iconActive: 'material-symbols-monitor-weight',
	},
	{
		title: 'Exercise',
		link: '/exercise',
		iconBase: 'ion-fitness-outline',
		iconActive: 'ion-fitness',
	},
]

const route = useRoute()
const showNavigation = computed(() => {
	return !route.path.includes('/interval')
})
</script>

<template>
	<nav
		v-if="showNavigation"
		class="fixed inset-x-0 bottom-0 h-[72px] z-50 bg-neutral-950/85 border-t-2 border-neutral-700/50 backdrop-blur grid grid-cols-4 items-center justify-center px-4"
	>
		<NuxtLink
			v-for="item in menuItems"
			:key="item.link"
			v-slot="{ isExactActive }"
			:to="item.link"
			active-class="active"
			exact
			class="flex flex-col items-center justify-center relative"
		>
			<TransitionGroup
				name="list"
			>
				<BIcon
					:key="item.link"
					:name="isExactActive ? item.iconActive : item.iconBase"
					size="28"
				/>

				<span
					v-if="isExactActive"
					class="text-xs inline-block"
				>
					{{ item.title }}
				</span>
			</TransitionGroup>
		</NuxtLink>
	</nav>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from {
  opacity: 0;
}
.list-leave-to {
	transition-duration: 0ms;
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}
</style>
