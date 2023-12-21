import Router from "./services/Router.js";


window.app = {
    router: new Router(),
}

addEventListener('popstate', (event) => {
    event.preventDefault();
    app.router.navigateTo(event.state.route, false);
});

addEventListener('DOMContentLoaded', (event) => {
    app.router.init();
});
