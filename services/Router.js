export default class Router {
    init() {
        document.querySelector('nav').querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.navigateTo(event.target.href);
            });
        });
    }

    navigateTo(route, addToHistory = true) {
        if (addToHistory) {
            history.pushState({ route }, null, route);
        }

        let pageElement = null;

        switch (route) {
            case '/':
                pageElement = document.createElement('div');
                pageElement.innerText = 'Home page';
            case '/calendar':
                pageElement = document.createElement('div');
                pageElement.innerText = 'Calendar';
            case '/settings':
                pageElement = document.createElement('div');
                pageElement.innerText = 'Settings';
            default:
                pageElement = document.createElement('div');
                pageElement.innerText = '404';
        }

        document.querySelector('main').appendChild(pageElement);
    }

}
