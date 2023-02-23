<template>
    <div class="wrapper">
        <div class="container">
            <span class="item" v-for="item in repositories">
                <div class="top">
                    <span class="icon" v-if="item % 2 === 0">&star;</span>
                    <span class="icon" v-else>&starf;</span>
                </div>
                <div class="middle">
                    <h3 class="middle-text"> Repositório {{ item }} </h3>
                </div>

            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    repositories: number[];
}>();
</script>

<style scoped>
.container {
    height: 200px;
    display: -webkit-inline-box;
    flex-direction: row;
    align-items: center;
    overflow-y: hidden;
    padding: 5px 0px;
    scroll-behavior: smooth;
    width: 100%;
}

.item {
    transition: .20s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 20em;
    height: 100%;
    border: 1px solid #000;
    margin-right: 1%;
}


.wrapper>.container>.item>.top {
    display: flex;
    justify-content: flex-end;
    color: yellow;
    padding: 0px 10px;
    font-size: 35px;
}

.wrapper>.container>.item>.middle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.container:hover> :not(:hover) {
    opacity: .6;
    transform: scale(0.9);
}
</style>
