<script setup lang="ts">

</script>

<template>
	<Variant title="Base Button Variants">
		<BButton variant="primary">
			Primary Button
		</BButton>

		<BButton variant="secondary">
			Secondary Button
		</BButton>
	</Variant>
	<Variant title="Small Button Variants">
		<BButton
			variant="primary"
			small
		>
			Primary Button
		</BButton>
		<BButton
			variant="secondary"
			small
		>
			Secondary Button
		</BButton>
	</Variant>

	<Variant title="Icon Buttons">
		<BButton
			variant="primary"
			icon-name="material-symbols-play-arrow-rounded"
		/>

		<BButton
			variant="secondary"
			icon-name="material-symbols-play-arrow-rounded"
		/>
	</Variant>
	<Variant title="Small Icon Buttons">
		<BButton
			variant="primary"
			icon-name="material-symbols-play-arrow-rounded"
			small
		/>
		<BButton
			variant="secondary"
			icon-name="material-symbols-play-arrow-rounded"
			small
		/>
	</Variant>

	<SvgSprite />
</template>
