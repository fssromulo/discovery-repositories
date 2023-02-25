<template>
    <div class="title-wrapper">
        <span class="title-content">{{ content }}</span> &nbsp;
        <select v-model="filter" v-if="shouldShowFilters" @change="handleFilter()">
            <option v-for="filterOpt in filtersOptions" :value="filterOpt.value">{{ filterOpt.label }}</option>
        </select>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';

enum EFiltersOption {
    NONE = 'NONE',
    STARS = 'STARS',
    FORKS = 'FORKS',
    HELPED_ISSUES = 'HELP-WANTED-ISSUES',
    UPDATED = 'UPDATED',
}

export default defineComponent({
    props: {
        content: { type: String, required: true, default: '' },
        shouldShowFilters: { type: Boolean, required: false, default: false },
        language: { type: String, required: false, default: 'Javascript' },
    },

    setup(props, context) {
        const filter: Ref<string> = ref(EFiltersOption.NONE);

        const filtersOptions: Array<{ value: string, label: string }> = [
            { label: 'No filter apply', value: EFiltersOption.NONE },
            { label: 'Sort by stars', value: EFiltersOption.STARS },
            { label: 'Sort by forks', value: EFiltersOption.FORKS },
            { label: 'Sort by help wanted issues', value: EFiltersOption.HELPED_ISSUES },
            { label: 'Sort by updated', value: EFiltersOption.UPDATED }
        ]

        function handleFilter() {
            const filterRepos = { language: props.language, sort: filter.value };
            context.emit('handleFilter', filterRepos)
        }

        return {
            handleFilter,
            filter,
            filtersOptions
        }
    },

});
</script>

<style scoped>
.title-wrapper {
    margin: 1% 0% 1% 0%;
}

.title-content {
    font-size: 30px;
    font-weight: 900;
}
</style>
