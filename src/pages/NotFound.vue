<template>
  <div class="h-screen flex flex-col justify-center items-center bg-teal-700 text-white p-8 text-center">
    <h1 class="text-4xl mb-2 font-bold">Page not found</h1>
    <p>Go back to the <router-link to="/" class="link">startpage</router-link>.</p>
  </div>
</template>

<style>
.link {
  text-decoration: underline;
  text-underline-offset: 5px;
&:hover {
  text-decoration: none;
}
}
</style>
