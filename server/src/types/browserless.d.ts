declare module 'browserless' {
    interface BrowserContext { }
    interface Browser {
        createContext(): BrowserContext;
        close(): Promise<void>;
    }
    function createBrowser(): Browser;
    export default createBrowser;
} 