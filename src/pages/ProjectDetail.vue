<template>
  <div v-if="loading">Loading project...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="project">
    <h1 class="text-3xl font-bold mb-4 text-white">{{ project.title }}</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <!-- Project Info -->
      <Card class="lg:col-span-2 p-6 gap-2">
        <h2 class="text-xl font-semibold">Project Details</h2>
        <div class="space-y-4">
          <div v-if="project.description">
            <label class="text-sm font-medium text-gray-600">Description</label>
            <p class="mt-1">{{ project.description }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">Created</label>
            <p class="mt-1">{{ formatDate(project.createdAt) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600"
              >Last Updated</label
            >
            <p class="mt-1">{{ formatDate(project.updatedAt) }}</p>
          </div>
        </div>
      </Card>

      <!-- Members -->
      <Card class="p-6 gap-4">
        <h2 class="text-xl font-semibold">
          Members ({{ project.membersList.length }})
        </h2>
        <div class="grid gap-2">
          <div
            v-for="member in project.membersList"
            :key="member.id"
            class="flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
            >
              {{ member.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-medium">{{ member.name }}</p>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Tasks section could go here -->
    <Card class="mt-3 p-6 gap-3">
      <div class="flex justify-between gap-2">
        <h2 class="text-xl font-semibold">Project Tasks</h2>
        <Button @click="handleCreateTask">Add task</Button>
      </div>
      <p class="text-gray-600">
        <TaskCardList :data="projectTasks" />
      </p>
    </Card>
  </div>
  <div v-else>
    <p>Project not found</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import { useModal } from "@/composables/useModal";
import type { Project } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GET_PROJECT_TASKS } from "@/api/graphql";
import TaskCardList from "@/components/TaskCardList.vue";

const route = useRoute();

// Get the project ID from the URL parameter
const projectId = computed(() => route.params.id as string);

const { result: tasksData } = useQuery(
  GET_PROJECT_TASKS,
  () => ({
    projectId: projectId.value,
  }),
  () => ({
    enabled: !!projectId.value,
  })
);

const projectTasks = computed(() => tasksData.value?.projectTasks ?? []);

const { result, loading, error } = useQuery(
  gql`
    query GetProject($id: ID!) {
      project(id: $id) {
        id
        title
        description
        ownerId
        members
        membersList {
          id
          name
          email
        }
        createdAt
        updatedAt
      }
    }
  `,
  // Variables - this is reactive, so when projectId changes, the query reruns
  () => ({
    id: projectId.value,
  }),
  // Options - only run the query if we have a project ID
  () => ({
    enabled: !!projectId.value,
  })
);

const project = computed(() => result.value?.project as Project | null);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

const { openModal } = useModal();

function handleCreateTask() {
  openModal("CreateTask", projectId.value);
}
</script>
