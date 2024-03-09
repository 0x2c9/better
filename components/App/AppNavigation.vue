<script setup lang="ts">
type IMenuItem = {
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
		title: 'Weight',
		link: '/weight',
		iconBase: 'material-symbols-monitor-weight-outline',
		iconActive: 'material-symbols-monitor-weight',
	},
	{
		title: 'Workouts',
		link: '/workouts',
		iconBase: 'ion-fitness-outline',
		iconActive: 'ion-fitness',
	},
	{
		title: 'Exercises',
		link: '/exercises',
		iconBase: 'material-symbols-exercise-outline',
		iconActive: 'material-symbols-exercise',
	},
	{
		title: 'Settings',
		link: '/settings',
		iconBase: 'material-symbols-settings-outline-rounded',
		iconActive: 'material-symbols-settings-rounded',
	},
]
</script>

<template>
	<nav
		class="fixed inset-x-0 bottom-0 z-50 grid h-[64px] grid-cols-5 items-center justify-center border-t border-gray-light bg-white px-4 backdrop-blur"
	>
		<NuxtLink
			v-for="item in menuItems"
			:key="item.link"
			v-slot="{ isExactActive }"
			:to="item.link"
			active-class="active"
			exact
			class="relative flex flex-col items-center justify-center"
		>
			<TransitionGroup name="list">
				<BIcon
					:key="item.link"
					:name="isExactActive ? item.iconActive : item.iconBase"
					size="28"
				/>

				<span
					v-if="isExactActive"
					class="inline-block text-xs font-semibold"
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
