
import { createApp } from "vue";
import App from "./App.vue";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
import router from "./router";
import { createPinia } from "pinia";
import "./style.css";


const httpLink = createHttpLink({
  uri: "/graphql", // Vite proxy forwards to backend
  // Credentials are sent automatically with cookies
  credentials: "include",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

provideApolloClient(apolloClient);

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
