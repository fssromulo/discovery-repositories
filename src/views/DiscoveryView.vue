<template>
	<div class="username">
		<Title content="My Bookmarks"></Title>
		<RepositoriesList :repositories="markedList" />

		<hr />
		<h3>Aqui vai o "tooglle topics to show"</h3>
		<hr />

		<br />
		<h1 v-if="load">CArregando</h1>
		<Title content="Top vue" language="Vue" :should-show-filters="true" @handleFilter="handleFilter"></Title>
		<RepositoriesList :repositories="vueList" @handleMyList="handleMyList" @handleFilter="handleFilter" />

		<br />
		<br />
		<Title content="Top Javascript" language="Javascript" :should-show-filters="true" @handleFilter="handleFilter">
		</Title>
		<RepositoriesList :repositories="jsList" @handleMyList="handleMyList" @handleFilter="handleFilter" />

	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue';
import Title from "../components/Title.vue";
import RepositoriesList from "../components/RepositoriesList.vue";

export default defineComponent({
	components: {
		Title,
		RepositoriesList
	},
	setup() {

		const vueList: Ref<any[]> = ref([]);
		const jsList: Ref<any[]> = ref([]);
		const load: Ref<boolean> = ref(false);
		const markedList: Ref<any[]> = ref([]);

		const searchTechnology = async (language: string, sort: string = ''): Promise<any[]> => {
			let sortUrl = '';
			if (sort.length > 0 && sort !== 'none') {
				sortUrl = `&sort=${sort}`
			}

			const url = `https://api.github.com/search/repositories?q=language%3A${language}%20stars%3A%3E8000%20license%3Amit&per_page=15&page=1${sortUrl}`;
			load.value = true;
			const response = await fetch(url);
			const responseData = await response.json();
			if (!response.ok) {
				const error = new Error(responseData.message || "Failed to fetch!");
				throw error;
			}
			load.value = false;
			const favoriteList = JSON.parse(localStorage.getItem('myBookMarks') ?? '[]');
			return responseData.items.map((item: any) => {
				const isFavorite = favoriteList.findIndex((fav: any) => (fav.id === item.id));

				return {
					id: item.id,
					fullName: item.full_name,
					name: item.name,
					language: item.language.toLowerCase(),
					favorite: isFavorite >= 0,
				} as { id: number, fullName: string, name: string, language: string, favorite: boolean }
			});
		}

		onMounted(async () => {
			handleMyList();
			vueList.value = await searchTechnology('Vue');
			jsList.value = await searchTechnology('Javascript');
		});

		async function handleFilter(paramValue: any): Promise<void> {
			if (paramValue.language === 'vue') {
				vueList.value = await searchTechnology(paramValue.language, paramValue.sort.toLowerCase());
			}

			if (paramValue.language === 'javascript') {
				jsList.value = await searchTechnology(paramValue.language, paramValue.sort.toLowerCase());
			}
		}

		function handleMyList(): void {
			markedList.value = JSON.parse(localStorage.getItem('myBookMarks') ?? '[]');
		}

		return {
			vueList,
			jsList,
			load,
			markedList,
			handleFilter,
			handleMyList
		}
	},

});
</script>

<style scoped></style>
