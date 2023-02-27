<template>
    <v-row justify="space-around">
        <v-col cols="auto">
            <v-card-text>
                <h4 class="text-h10 mb-2">
                    Toggle topics to show:
                </h4>
                <v-chip-group v-model="modelValue" column multiple>
                    <v-chip item-value="value" v-for="item in techList" filter variant="outlined">
                        {{ item }}
                    </v-chip>
                </v-chip-group>
            </v-card-text>
        </v-col>
    </v-row>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
const emit = defineEmits(['handleUpdate'])

const props = defineProps<{
    initialValue: Array<any>;
    techList: Array<string>;
}>();

const modelComponent = ref(props.initialValue)

const modelValue = computed({
    get() {
        return modelComponent.value
    },
    set(val) {
        modelComponent.value = val
        emit('handleUpdate', val)
    }
})
</script>
