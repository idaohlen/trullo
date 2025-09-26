<template>
  <div class="flex gap-4 justify-between mb-2">
    <h2 class="text-white text-3xl font-bold mb-2">My Projects</h2>
    <Button @click="handleCreateProject">Create new project</Button>
  </div>
  
  <Card class="p-2 mb-12">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <template v-else>
      <div v-if="myProjects.length == 0">You do not have any projects.</div>
      <div v-else class="grid sm:grid-cols-2 gap-2">
        <RouterLink 
          v-for="project in myProjects" 
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="block"
        >
          <Card class="group p-4 hover:bg-gray-50 transition-colors cursor-pointer gap-2">
            <div class="font-bold mb-2 group-hover:underline underline-offset-4">{{ project.title }}</div>
            <div class="flex justify-between items-center">
              <Badge variant="secondary">{{ project.membersList.length }} members</Badge>
              <span class="text-sm text-gray-500">View details →</span>
            </div>
          </Card>
        </RouterLink>
      </div>
    </template>
  </Card>

  <div class="flex gap-4 justify-between mb-2">
     <h2 class="text-white text-3xl font-bold mb-2">My Tasks</h2>
    <Button @click="handleCreateTask">Add task</Button>
  </div>
  <Card class="p-2">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else class="grid grid-cols-2 gap-2">
      <TaskCardList :data="tasks"/>
    </div>
  </Card>

</template>
<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import type { Task, Project } from "@/types";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModal } from "@/composables/useModal";
import TaskCardList from "@/components/TaskCardList.vue";
import { Badge } from "@/components/ui/badge";

const { openModal } = useModal();

type DashboardQueryResult = {
  tasks: Task[];
  myProjects: Project[];
};

const { result, loading, error } = useQuery<DashboardQueryResult>(gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      # assignedTo
      assignee {
        id
        name
        # email
      }
      # createdAt
      # updatedAt
      finishedAt
    }
    myProjects {
      id 
      title 
      description 
      membersList {
        id
        name
        email
      }
    }
  }
`);

const myProjects = computed(() => result.value?.myProjects ?? []);
const tasks = computed(() => result.value?.tasks ?? []);

function handleCreateTask() {
  openModal("CreateTask");
}

function handleCreateProject() {
  openModal("CreateProject");
}
</script>
