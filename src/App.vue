<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
	<header>
		<div class="wrapper">
			<nav>
				<RouterLink to="/discovery">Discovery</RouterLink>&nbsp;
				<RouterLink to="/username">Username</RouterLink>&nbsp;
				<RouterLink to="/logout">Logout</RouterLink>
			</nav>
		</div>
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
