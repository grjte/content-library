import { createContext, useContext } from "react"
import { BrowserOAuthClient, OAuthSession } from "@atproto/oauth-client-browser"

export type ATProtoSessionContextType = {
    session: OAuthSession | null;
    client: BrowserOAuthClient;
}

/** A [React context](https://react.dev/learn/passing-data-deeply-with-context) which provides access to an ATProto OAuth session and a BrowserOAuthClient. */
export const ATProtoSessionContext = createContext<ATProtoSessionContextType | null>(null)

/** A [React hook](https://reactjs.org/docs/hooks-intro.html) which returns the OAuth session from {@link SessionContext}. */
export function useOAuthSession(): OAuthSession | null {
    const context = useContext(ATProtoSessionContext)
    if (!context) throw new Error("No ATProtoSessionContext was found.")
    return context.session
}

export function useOAuthClient(): BrowserOAuthClient {
    const context = useContext(ATProtoSessionContext)
    if (!context?.client) throw new Error("No client was not found on ATProtoSessionContext.")
    return context.client
}