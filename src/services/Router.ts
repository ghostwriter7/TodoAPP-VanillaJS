import { toTaskId } from "@helpers/date";
import { TasksPage } from "@pages/TasksPage.ts";

type ParamsMap = Record<string, string>

export class Router {

    navigateTo(route: string, addToHistory = true): void {
        if (addToHistory) {
            history.pushState({ route }, null, route);
        }

        let pageElement: HTMLElement;

        const paramsMap: ParamsMap = this.#getQueryParamsMap(route);
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
                (pageElement as TasksPage).date = paramsMap.date || toTaskId(new Date());
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

    #getQueryParamsMap(route: string): ParamsMap {
        const regex = /[?&]([^=#]+)=([^&#]*)/g;
        const paramsMap: ParamsMap = {};
        let match: RegExpExecArray;
        while (match = regex.exec(route)) {
            paramsMap[match[1]] = match[2];
        }
        return paramsMap;
    }

    #hasQueryParams(paramsMap: ParamsMap): boolean {
        return Object.keys(paramsMap).length !== 0;
    }

    #getRouteWithoutQueryParams(route: string): string {
        return route.slice(0, route.indexOf('?'));
    }
}
