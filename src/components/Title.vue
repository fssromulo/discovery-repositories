<template>
    <div class="title-wrapper">
        {{ title }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<style scoped>
.title-wrapper {
    margin: 1% 0% 1% 0%;
}
</style>
