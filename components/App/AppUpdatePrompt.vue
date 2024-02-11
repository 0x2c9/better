<script setup lang="ts">
const { $pwa } = useNuxtApp()

onMounted(() => {
	if ($pwa?.offlineReady) {
		console.log('App is offline ready')
	}
	if (!$pwa?.isPWAInstalled) {
		console.log('App is not installed')
	}
})

const loading = ref(false)

async function updateServiceWorker() {
	loading.value = true
	await $pwa?.updateServiceWorker(false)
	loading.value = false
}
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="$pwa?.isPWAInstalled && $pwa.needRefresh"
				class="fixed inset-0 z-50 flex items-end p-4 before:fixed before:inset-0 before:z-[-1] before:bg-neutral-950/50 before:backdrop-blur-[4px] empty:hidden"
			>
				<div class="b-box relative z-50 flex w-full items-center rounded-lg p-4">
					<BIcon
						class="star-icon absolute left-[6px] top-[44px]"
						name="mdi-star-four-points"
						size="14"
					/>
					<BIcon
						class="star-icon absolute left-[55px] top-[44px]"
						name="mdi-star-four-points"
						size="14"
					/>
					<BIcon
						class="star-icon absolute left-[107px] top-[1px]"
						name="mdi-star-four-points"
						size="14"
					/>
					<BIcon
						class="star-icon absolute left-[200px] top-[8px]"
						name="mdi-star-four-points"
						size="20"
					/>
					<p class="shining relative text-lg font-medium">
						New version available
					</p>

					<BButton
						small
						class="ml-auto"
						@click="updateServiceWorker"
					>
						<BIcon
							v-if="loading"
							name="eos-icons-three-dots-loading"
							size="16"
						/>
						<span v-else>Refresh</span>
					</BButton>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.shining {
	color: #fff;
	display: inline-block;
	position: relative;
	-webkit-mask-image: linear-gradient(-75deg, rgba(0, 0, 0, .6) 30%, #000 50%, rgba(0, 0, 0, .6) 70%);
	-webkit-mask-size: 200%;
	animation: shine 2s linear infinite;
}

@keyframes shine {
	from {
		-webkit-mask-position: 150%;
	}

	to {
		-webkit-mask-position: -50%;
	}
}

.star-icon {
	animation: star 2s infinite ease-in-out alternate;
	color: rgba(255, 255, 255, 0.5);
}
.star-icon:nth-child(1) {
    animation-delay: 0s;
}

.star-icon:nth-child(2) {
    animation-delay: 0.4s;
}

.star-icon:nth-child(3) {
    animation-delay: 0.2s;
}

.star-icon:nth-child(4) {
    animation-delay: 0.6s;
}

@keyframes star {
	0% {
		transform: scale(1);
		opacity: 1
	}

	50% {
		transform: scale(0);
		opacity: 0.5
	}

	100% {
		transform: scale(1);
		opacity: 1
	}
}
</style>
