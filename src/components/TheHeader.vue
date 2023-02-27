<template>
    <header v-if="shouldHideHeader">
        <nav>
            <h1><router-link to="/discovery">App</router-link></h1>
            <ul>
                <li><router-link to="/discovery">Discovery</router-link></li>
                <li><router-link to="/username">Username</router-link></li>
                <li @click="logout">Logout</li>
            </ul>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    router.replace('/auth');
}

const shouldHideHeader = computed((): boolean => {
    const currentRouteName = route?.name as string ?? '';
    return !['auth', 'signupview'].includes(currentRouteName);
})

</script>

<style scoped>
header {
    width: 100%;
    height: 5rem;
    background-color: #3d008d;
    display: flex;
    justify-content: center;
    align-items: center;
}

header a {
    text-decoration: none;
    color: #f391e3;
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: 1px solid transparent;
}

a:active,
a:hover,
a.router-link-active {
    border: 1px solid #f391e3;
}

h1 {
    margin: 0;
}

h1 a {
    color: white;
    margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
    border-color: transparent;
}

header nav {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

ul>li {
    margin: 0 0.5rem;
    cursor: pointer;
}
</style>
