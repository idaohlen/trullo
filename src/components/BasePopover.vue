<template>
  <Popover :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <PopoverTrigger as-child>
      <Button type="button" variant="outline" :class="triggerClass">
        <div class="truncate">{{ displayText }}</div>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="contentClass">
      <Command>
        <div>
          <CommandInput
            :model-value="searchValue"
            @update:model-value="$emit('update:searchValue', $event)"
            :placeholder="searchPlaceholder"
            class="flex-1"
          />
        </div>
        <CommandList>
          <CommandEmpty>{{ emptyMessage }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in filteredOptions"
              :key="getKeyFunc(option)"
              :value="getValueFunc(option)"
              @select="handleSelect(option)"
              class="px-3 py-2"
              :class="{ 'bg-accent': getValueFunc(option) === selectedValue }"
            >
              <slot
                name="option"
                :option="option"
                :isSelected="getValueFunc(option) === selectedValue"
              >
                {{ getLabelFunc(option) }}
              </slot>
              <Check
                v-if="getValueFunc(option) === selectedValue"
                class="ml-auto h-4 w-4"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "./ui/button";

const props = defineProps<{
  isOpen: boolean;
  options: any[];
  selectedValue: any;
  searchValue: string;
  displayText: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerClass?: string;
  contentClass?: string;
  getLabel?: (option: any) => string;
  getValue?: (option: any) => any;
  getKey?: (option: any) => any;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "update:searchValue": [value: string];
  select: [option: any];
}>();

const getLabelFunc =
  props.getLabel ||
  ((option: any) => {
    if (typeof option === "string" || typeof option === "number")
      return String(option);
    return option.label ?? option.name ?? option.email ?? String(option);
  });

const getValueFunc =
  props.getValue ||
  ((option: any) => {
    if (typeof option === "string" || typeof option === "number") return option;
    return option.value ?? option.id ?? option;
  });

const getKeyFunc =
  props.getKey ||
  ((option: any) => {
    if (typeof option === "string" || typeof option === "number") return option;
    return option.id ?? option.value ?? option;
  });

const filteredOptions = computed(() => {
  if (!props.searchValue) return props.options;
  return props.options.filter((option) =>
    getLabelFunc(option).toLowerCase().includes(props.searchValue.toLowerCase())
  );
});

function handleSelect(option: any) {
  emit("select", option);
  emit("update:isOpen", false);
}
</script>
