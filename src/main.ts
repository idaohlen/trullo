import { createApp } from "vue";
import App from "./App.vue";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
import "./style.css";

const apolloClient = new ApolloClient({
  uri: "/graphql", // Vite proxy forwards to backend
  cache: new InMemoryCache(),
});

provideApolloClient(apolloClient);

createApp(App).mount("#app");
