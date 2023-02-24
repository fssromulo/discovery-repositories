<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
	<header>
		<nav>
			<RouterLink to="/discovery">Discovery</RouterLink>&nbsp;
			<RouterLink to="/username">Username</RouterLink>&nbsp;
			<RouterLink to="/auth">Logout</RouterLink>
		</nav>
	</header>

	<br />
	<br />
	<RouterView />
</template>

<style >
* {
	scroll-behavior: smooth;
}
</style>
