<template>
  <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="option in options"
          :key="getKeyFunc(option)"
          :value="getValueFunc(option)"
        >
          <slot name="option" :option="option">
            {{ getLabelFunc(option) }}
          </slot>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const props = defineProps<{
  modelValue: any;
  options: any[];
  placeholder?: string;
  triggerClass?: string;
  getLabel?: (option: any) => string;
  getValue?: (option: any) => any;
  getKey?: (option: any) => any;
}>();

const emit = defineEmits(["update:modelValue"]);

const getLabelFunc = props.getLabel || ((option: any) => {
  if (typeof option === 'string' || typeof option === 'number') return String(option);
  return option.label ?? option.value ?? String(option);
});

const getValueFunc = props.getValue || ((option: any) => {
  if (typeof option === 'string' || typeof option === 'number') return option;
  return option.value ?? option.label ?? option;
});

const getKeyFunc = props.getKey || ((option: any) => {
  if (typeof option === 'string' || typeof option === 'number') return option;
  return option.value ?? option.id ?? option.label ?? option;
});
</script>
