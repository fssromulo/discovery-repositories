import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/username",
			name: "UsernameView",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/UsernameView.vue"),
		},
		{
			path: "/discovery",
			name: "DiscoveryView",
			component: () => import("../views/DiscoveryView.vue"),
		},
		{
			path: "/signup",
			name: "SignupView",
			component: () => import("../views/SignupView.vue"),
		},
	],
});

export default router;
