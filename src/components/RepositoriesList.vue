<template>
    <div class="wrapper">
        <div class="container">
            <span class="item" :style="repoImageUrl(item.fullName)" v-for="item in repositories"
                v-if="repositories.length > 0">
                <div class="top">
                    <span @click="addStarClick(item.id)" class="icon" v-if="!item.favorite">&star;</span>
                    <span @click="removeStarClick(item.id)" class="icon" v-else>&starf;</span>
                </div>

            </span>
            <span v-else>
                <v-col cols="12">
                    <v-sheet class="pa-2 ma-2">
                        <v-alert title="Nothing to show here." text="Sorry but you didnt select any favorites repos yet :("
                            type="info" variant="tonal"></v-alert>
                    </v-sheet>
                </v-col>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    repositories: Array<{ id: number, fullName: string, name: string, language: string, favorite: boolean }>;
}>();

const emit = defineEmits(['handleMyList', 'handleFilter']);

function repoImageUrl(repoFullName: string): string {
    const url = `https://opengraph.githubassets.com/1099abc/${repoFullName}`;
    return `background-image: url('${url}');
                background-repeat: no-repeat;
                background-size: 100% 100%, contain;`
}

function removeStarClick(id: number): void {
    const storageList = JSON.parse(localStorage.getItem('myBookMarks') ?? '[]');
    const index = storageList.findIndex((repo: any) => { return repo.id === id });
    // remove item
    const removed = storageList.splice(index, 1);
    localStorage.setItem('myBookMarks', JSON.stringify(storageList));
    emit('handleMyList');
    emit('handleFilter', { language: removed[0]?.language, sort: '' } ?? '')
}

function addStarClick(id: number): void {
    const repo = props.repositories.filter(repo => { return repo.id === id });
    const storageList = JSON.parse(localStorage.getItem('myBookMarks') ?? '[]');

    repo[0].favorite = true;
    storageList.push(repo[0])
    localStorage.setItem('myBookMarks', JSON.stringify(storageList));
    emit('handleMyList');
    emit('handleFilter', { language: repo[0]?.language, sort: '' })
}

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

    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 20em;
    border: 1px solid #000;
    margin-right: 1%;
}

.wrapper>.container>.item>.top {
    display: flex;
    justify-content: flex-end;
    color: yellow;
    padding: 0px 0px;
    font-size: 35px;
    margin-top: -5px;
}

.wrapper>.container>.item>.middle {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}


.container:hover> :not(:hover) {
    opacity: .6;
    transform: scale(0.9);
}
</style>
