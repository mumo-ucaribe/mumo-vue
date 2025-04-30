import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";

const app = createApp(App);

registerPlugins(app);
app.use(VueSweetalert2);
app.mount("#app");
