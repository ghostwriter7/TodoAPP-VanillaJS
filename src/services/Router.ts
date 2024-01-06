import { toTaskId } from "@helpers/date";

export default class Router {
    #firebase;

    constructor(firebase) {
        this.#firebase = firebase;
    }

    navigateTo(route, addToHistory = true) {
        if (addToHistory) {
            history.pushState({ route }, null, route);
        }

        let pageElement = null;

        const paramsMap = this.#getQueryParamsMap(route);
        if (this.#hasQueryParams(paramsMap)) {
            route = this.#getRouteWithoutQueryParams(route)
        }

        switch (route) {
            case '/auth':
                pageElement = document.createElement('auth-page');
                break;
            case '/':
            case '/tasks':
                pageElement = document.createElement('tasks-page');
                pageElement.date = paramsMap.date || toTaskId(new Date());
                break;
            case '/calendar':
                pageElement = document.createElement('calendar-page');
                break;
            default:
                pageElement = document.createElement('not-found-page');
        }

        const main = document.querySelector('main');
        main.childNodes[0].remove();
        main.appendChild(pageElement);
        scrollX = scrollY = 0;
    }

    #getQueryParamsMap(route) {
        const regex = /[?&]([^=#]+)=([^&#]*)/g;
        const paramsMap = {};
        let match;
        while (match = regex.exec(route)) {
            paramsMap[match[1]] = match[2];
        }
        return paramsMap;
    }

    #hasQueryParams(paramsMap) {
        return Object.keys(paramsMap).length !== 0;
        ;
    }

    #getRouteWithoutQueryParams(route) {
        return route.slice(0, route.indexOf('?'));
    }
}
