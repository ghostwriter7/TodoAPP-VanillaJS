### env()

`@media (display-mode: standalone) { 
    .toolbar {
    padding: env(safe-area-inset-top) 
             env(safe-area-inset-right) 
             env(safe-area-inset-bottom) 
             env(safe-area-inset-left) !important;
    }
}`


### Preview installed service workers

`chrome://serviceworker-internals`

### Cache strategies

1. Cache first
2. Network first
3. Stale while revalidating 

### Custom installation

1. `onbeforeinstallprompt`
2. store `event` and call `prompt` when needed
