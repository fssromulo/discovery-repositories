import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
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
		{
			path: "/auth",
			name: "auth",
			component: HomeView,
		},
	],
});

router.beforeEach((to, _, next) => {
	const hasToken = localStorage.getItem("token") ?? "";
	if (to.name !== "auth" && hasToken.length === 0) {
		console.log("teste ...");
		next("/auth");
	} else {
		next();
	}
});

export default router;
