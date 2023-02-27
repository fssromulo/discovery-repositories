<template>
	<TheHeader />
	<v-container class="bg-surface-variant">
		<v-col cols="12">
			<RouterView />
		</v-col>
	</v-container>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
</script>
