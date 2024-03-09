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
	setTimeout(() => {
		loading.value = false
	}, 3000)
}
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="$pwa?.isPWAInstalled && $pwa.needRefresh"
				class="fixed inset-0 z-50 flex items-end p-4 before:fixed before:inset-0 before:z-[-1] before:bg-gray-dark/50 before:backdrop-blur-[4px] empty:hidden"
			>
				<div class="relative z-50 flex w-full items-center rounded-lg bg-white p-4 text-black">
					<BIcon
						class="star-icon absolute left-[6px] top-[44px] text-gray-dark"
						name="mdi-star-four-points"
						size="14"
					/>
					<BIcon
						class="star-icon absolute left-[55px] top-[44px] text-gray-dark"
						name="mdi-star-four-points"
						size="14"
					/>
					<BIcon
						class="star-icon absolute left-[107px] top-[1px] text-gray-dark"
						name="mdi-star-four-points"
						size="14"
					/>
					<BIcon
						class="star-icon absolute left-[200px] top-[8px] text-gray-dark"
						name="mdi-star-four-points"
						size="20"
					/>
					<p class="shining relative text-lg font-medium">
						New version available
					</p>

					<BButton
						small
						class="relative ml-auto"
						@click="updateServiceWorker"
					>
						<div v-if="loading" class="absolute inset-0 flex items-center justify-center">
							<div class="loader">
								<span class="inner1"></span>
								<span class="inner2"></span>
								<span class="inner3"></span>
							</div>
						</div>
						<span :class="{ 'opacity-0': loading }">Refresh</span>
					</BButton>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.shining {
	display: inline-block;
	position: relative;
	mask-image: linear-gradient(-75deg, rgba(0, 0, 0, .6) 30%, #000 50%, rgba(0, 0, 0, .6) 70%);
	mask-size: 200%;
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
	animation: star 2.5s infinite ease-in-out alternate;
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
.loader {
  display: block;
  width: 5em;
  margin: 10% auto;
}

@keyframes rotate {
  0% {
    -webkit-transform: translateY(0%);
  }
  30% {
    -webkit-transform: translateY(-0.25em);
  }
  50% {
    -webkit-transform: translateY(0%);
  }
  70% {
    -webkit-transform: translateY(0.25em);
  }
}
.loader {
  display: block;
}
.loader .inner1, .loader .inner2, .loader .inner3 {
  display: inline-block;
  margin: 0.125em;
  width: 0.5em;
  height: 0.5em;
  border: 1px solid lightgray;
  border-radius: 1em;
  background-color: lightgray;
  transform-origin: 50%;
  animation-duration: 0.75s;
  animation-name: rotate;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.loader .inner2 {
  animation-delay: 0.1875s;
}
.loader .inner3 {
  animation-delay: 0.375s;
}
</style>
