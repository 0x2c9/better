<template>
	<article class="relative mx-auto mt-12 flex w-full max-w-7xl flex-col">
		<div class="mx-auto max-w-20">
			<AppBetterLogoIcon />
		</div>
		<div class="mx-auto w-full max-w-48">
			<AppBetterLogoText />
		</div>
		<h1 class="mt-8 text-center text-2xl font-semibold">
			Track your weight loss and fitness journey with ease.
		</h1>
		<p class="mt-4 text-center text-lg text-gray-medium">
			Create and start your workouts with an integrated Timer, track your weight and archive your fitness goals with <span class="font-semibold">Better</span>.
		</p>
		<BButton
			variant="primary"
			class="mt-auto font-bold"
			to="/signup"
		>
			Start my journey
		</BButton>
		<BButton
			variant="secondary"
			class="mb-12 mt-4"
			to="/login"
		>
			Sign in
		</BButton>
	</article>
</template>
