<template>
    <div class="title-wrapper">
        <v-row>
            <v-col cols="4">
                <span class="title-content">{{ content }}</span> &nbsp;

            </v-col>
            <v-col cols="8">
                <v-select chips v-model="filter" v-if="shouldShowFilters" @update:modelValue="handleFilter()"
                    :items="filtersOptions" item-title="label" item-value="value" density="compact"></v-select>
            </v-col>
        </v-row>
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
            const filterRepos = { language: props.language.toLocaleLowerCase(), sort: filter.value.toLocaleLowerCase() };
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
    font-size: 25px;
    font-weight: 900;
}
</style>
