<template>
	<div class="username">
		<h1>DiscoveryView</h1>
		<Title title="My Bookmarks"></Title>
		<RepositoriesList :repositories="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" />

		<hr />
		<h3>Aqui vai o "tooglle topics to show"</h3>
		<hr />

		<Title title="Top vue" :should-show-filters="true"></Title>
		<RepositoriesList :repositories="[11, 22, 33, 45, 55, 66, 77, 88, 95, 99]" />

	</div>
</template>

<script setup lang="ts">
import Title from "../components/Title.vue";
import RepositoriesList from "../components/RepositoriesList.vue";
</script>

<style scoped></style>
