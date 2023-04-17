import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        requiresAuth: false,
        title: "Home / Taxi",
      },
    },
    {
      path: "/specimen",
      name: "specimen",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/SpecimenView.vue"),
      meta: {
        requiresAuth: false,
        title: "Specimen / Taxi",
      },
    },
    {
      path: "/taxiFuvarjai",
      name: "taxiFuvarjai",
      component: () => import("../views/TaxiFuvarjaiView.vue"),
      meta: {
        requiresAuth: false,
        title: "Taxi fuvarjai / Taxi",
      },
    },
    {
      path: "/taxiKezeles",
      name: "taxiKezeles",
      component: () => import("../views/TaxiKezelesView.vue"),
      meta: {
        requiresAuth: true,
        title: "Taxi Kezelés / Taxi",
      },
    },
    {
      path: "/loanings",
      name: "loanings",
      component: () => import("../views/LoaningView.vue"),
      meta: {
        requiresAuth: false,
        title: "Loanings / Taxi",
      },
    },
    {
      path: "/students",
      name: "students",
      component: () => import("../views/StudentView.vue"),
      meta: {
        requiresAuth: false,
        title: "Students / Taxi",
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        requiresAuth: false,
        title: "Login / Taxi",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      component: () => import("../views/404View.vue"),
      meta: {
        requiresAuth: false,
        title: "404 / Taxi",
      },
    },
  ],
});

export default router;
