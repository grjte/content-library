declare module 'html-get' {
    interface HTMLGetOptions {
        getBrowserless?: () => any;
    }
    interface HTMLGetResult {
        html: string;
        url: string;
    }
    function getHTML(url: string, options?: HTMLGetOptions): Promise<HTMLGetResult>;
    export default getHTML;
} 