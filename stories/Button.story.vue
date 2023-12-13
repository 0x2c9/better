<script setup lang="ts">

</script>

<template>
	<Variant title="Default Buttons">
		<JButton>Primary Button</JButton>
		<JButton variant="secondary">
			Secondary Button
		</JButton>
		<JButton variant="error">
			Error Button
		</JButton>
	</Variant>
	<Variant title="Small Buttons">
		<JButton size="small">
			Primary Button
		</JButton>
		<JButton
			variant="secondary"
			size="small"
		>
			Secondary Button
		</JButton>
		<JButton
			variant="error"
			size="small"
		>
			Error Button
		</JButton>
	</Variant>
	<Variant title="Icon Buttons">
		<JButton icon-name="timer-start" />
		<JButton
			icon-name="timer-start"
			variant="secondary"
		/>
		<JButton
			icon-name="timer-start"
			variant="error"
		/>
	</Variant>
	<Variant title="Icon Buttons Small">
		<JButton
			icon-name="timer-start"
			size="small"
		/>
		<JButton
			icon-name="timer-start"
			variant="secondary"
			size="small"
		/>
		<JButton
			icon-name="timer-start"
			variant="error"
			size="small"
		/>
	</Variant>
</template>
