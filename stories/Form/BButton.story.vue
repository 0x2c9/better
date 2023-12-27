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
	<Variant title="Button with Icons">
		<BButton
			variant="primary"
		>
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-1 mr-2"
			/>
			Add new Item
		</BButton>
		<BButton
			variant="primary"
			small
		>
			<BIcon
				name="material-symbols-add-rounded"
				class="-ml-2 mr-2"
			/>
			Add new Item
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
