<template>
  <h1 class="text-white text-4xl font-bold mb-4 tracking-wider">Admin</h1>

  <Tabs default-value="users">
    <TabsList class="grid grid-cols-2 w-[400px]">
      <TabsTrigger value="users">
        Users
      </TabsTrigger>
      <TabsTrigger value="projects">
        Projects
      </TabsTrigger>
    </TabsList>
    <TabsContent value="users">
      <UsersListAdmin />
    </TabsContent>
    <TabsContent value="projects">
      <ProjectsListAdmin />
    </TabsContent>

  </Tabs>
</template>

<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import UsersListAdmin from '@/components/admin/UsersListAdmin.vue';
import ProjectsListAdmin from "@/components/admin/ProjectsListAdmin.vue";


</script>
