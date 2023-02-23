<template>
    <div class="title-wrapper">
        {{ title }}
        <select v-model="filter" v-if="shouldShowFilters">
            <option v-for="filterOpt in filtersOptions" :value="filterOpt.value">{{ filterOpt.label }}</option>
        </select> --> Filter Value: {{ filter }}

    </div>
</template>

<script lang="ts">

import { defineComponent, ref, type Ref } from 'vue';

enum EFiltersOption {
    NONE = 'NONE',
    STARTS = 'STARTS',
    FORKS = 'FORKS',
    HELPED_ISSUES = 'HELPED_ISSUES',
    UPDATED = 'UPDATED',
}

export default defineComponent({
    props: {
        title: { type: String, required: true, default: '' },
        shouldShowFilters: { type: Boolean, required: false, default: false },
    },

    setup() {
        const filter: Ref<string> = ref(EFiltersOption.NONE);

        const filtersOptions: Array<{ value: string, label: string }> = [
            { label: 'No filter apply', value: EFiltersOption.NONE },
            { label: 'Sort by stars', value: EFiltersOption.STARTS },
            { label: 'Sort by forks', value: EFiltersOption.FORKS },
            { label: 'Sort by help wanted issues', value: EFiltersOption.HELPED_ISSUES },
            { label: 'Sort by updated', value: EFiltersOption.UPDATED }
        ]

        return {
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
</style>
