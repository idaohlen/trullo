
import { createApp, h } from "vue";
import App from "./App.vue";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";
import router from "./router";
import { createPinia } from "pinia";
import "./style.css";
import ModalProvider from "@/components/ModalProvider.vue";

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

const app = createApp({
  render: () => h(ModalProvider, null, { default: () => h(App) })
});
app.use(router);
app.use(createPinia());
app.mount("#app");
