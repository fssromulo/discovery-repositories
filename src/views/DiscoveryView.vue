<template>
	<div class="username">
		<Title content="My Bookmarks"></Title>
		<RepositoriesList :repositories="markedList" />

		<br />
		<hr />
		<TopicsFilter @handleUpdate="updateSelectTopics" :tech-list="techList" :initial-value="selectedTopics" />
		<hr />
		<br />

		<div v-for="item in listOfTechnologies">
			<Title :content="`Top ${item.language}`" :language="item.language" :should-show-filters="true"
				@handleFilter="handleFilter">
			</Title>
			<RepositoriesList :repositories="item.list" @handleMyList="handleMyList" @handleFilter="handleFilter" />
			<br />
		</div>
	</div>
</template>

<script lang="ts">
import TopicsFilter from "@/components/TopicsFilter/TopicsFilter.vue";
import { defineComponent, onMounted, ref, type Ref } from 'vue';
import RepositoriesList from "../components/RepositoriesList.vue";
import Title from "../components/Title.vue";


export default defineComponent({
	components: {
		Title,
		RepositoriesList,
		TopicsFilter
	},
	setup() {

		const vueList: Ref<any[]> = ref([]);
		const jsList: Ref<any[]> = ref([]);
		const load: Ref<boolean> = ref(false);
		const markedList: Ref<any[]> = ref([]);
		const selectedTopics: Ref<any[]> = ref([1, 2]);

		const techList = [
			'Vue',
			'TypeScript',
			'Javascript',
			'Go',
			'Css',
			'Node'
		]

		const listOfTechnologies: Ref<any[]> = ref([]);

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
			const favoriteList = getOnlyFavoriteReposForTheCurrentUser();
			const loggedUser = JSON.parse(localStorage.getItem("userData") ?? '');
			load.value = false;
			return responseData.items.map((item: any) => {
				const isFavorite = favoriteList.findIndex((fav: any) => (fav.id === item.id));

				return {
					id: item.id,
					fullName: item.full_name,
					name: item.name,
					language: item.language.toLowerCase(),
					favorite: isFavorite >= 0,
					idUser: loggedUser.idUser as string
				} as { id: number, fullName: string, name: string, language: string, favorite: boolean }
			});
		}

		onMounted(async () => {
			handleMyList();
			listOfTechnologies.value = await loadReposBasedOnSelectedTopics();
		});

		async function handleFilter(paramValue: any): Promise<void> {
			const index = listOfTechnologies.value.findIndex(el => el.language.toLocaleLowerCase() === paramValue.language.toLocaleLowerCase());
			listOfTechnologies.value[index].list = await searchTechnology(paramValue.language, paramValue.sort.toLowerCase());
		}

		function getOnlyFavoriteReposForTheCurrentUser(): any[] {
			const allItens = JSON.parse(localStorage.getItem('myBookMarks') ?? '[]');

			const loggedUser = JSON.parse(localStorage.getItem("userData") ?? '');
			return allItens.filter((itens: any) => (itens?.idUser === loggedUser.idUser));
		}

		function handleMyList(): void {
			markedList.value = getOnlyFavoriteReposForTheCurrentUser();
		}

		async function loadReposBasedOnSelectedTopics(): Promise<any[]> {
			// @ts-ignore
			const arr: [{
				language: string,
				list: any[]
			}] = [];
			for (const key of selectedTopics.value) {
				const selected = techList[key];
				const list = await searchTechnology(selected);
				arr.push({ language: selected, list })
			}
			return arr;
		}

		async function updateSelectTopics(param: any): Promise<void> {
			selectedTopics.value = param;
			listOfTechnologies.value = await loadReposBasedOnSelectedTopics();
		}

		return {
			vueList,
			jsList,
			load,
			markedList,
			selectedTopics,
			handleFilter,
			handleMyList,
			techList,
			listOfTechnologies,
			updateSelectTopics
		}
	},

});
</script>

<style scoped></style>
