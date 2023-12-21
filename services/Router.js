export default class Router {
    init() {
        document.querySelector('nav').querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.navigateTo(event.target.pathname);
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
                break;
            case '/calendar':
                pageElement = document.createElement('div');
                pageElement.innerText = 'Calendar';
                break;
            case '/settings':
                pageElement = document.createElement('div');
                pageElement.innerText = 'Settings';
                break;
            default:
                pageElement = document.createElement('div');
                pageElement.innerText = '404';
        }

        const main = document.querySelector('main');
        main.childNodes[0].remove();
        main.appendChild(pageElement);
    }

}
