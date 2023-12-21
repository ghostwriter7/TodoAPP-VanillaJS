import Router from "./services/Router.js";


window.app = {
    router: new Router(),
}

window.addEventListener('DOMContentLoaded', (event) => {
    window.app.router.init();
})
