import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { Repo } from '@automerge/automerge-repo'
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb'
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel'
import { BrowserWebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import LocalFirstAppView from "./LocalFirstAppView.tsx"

import { BrowserOAuthClient, OAuthSession } from '@atproto/oauth-client-browser'
import { ATProtoSessionContext } from './context/ATProtoSessionContext.tsx'
import AtProtoAppView from './AtProtoAppView.tsx'
import { CollectionManager } from './components/management/CollectionManager.tsx'

// === AT PROTO ====================================================================================
const client = new BrowserOAuthClient({
  clientMetadata: {
    "client_id": `${import.meta.env.VITE_APP_URL}/client-metadata.json`,
    "client_name": import.meta.env.VITE_APP_NAME,
    "client_uri": import.meta.env.VITE_APP_URL,
    "redirect_uris": [
      import.meta.env.VITE_APP_URL
    ],
    "scope": "atproto transition:generic",
    "grant_types": [
      "authorization_code",
      "refresh_token"
    ],
    "response_types": [
      "code"
    ],
    "token_endpoint_auth_method": "none",
    "application_type": "web",
    "dpop_bound_access_tokens": true
  },
  handleResolver: import.meta.env.VITE_ATPROTO_ENTRYWAY_URL
})

// Initialize the OAuth client
const result: undefined | { session: OAuthSession; state?: string | null } =
  await client.init()

// === AUTOMERGE ===================================================================================
const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new BrowserWebSocketClientAdapter(`wss://${import.meta.env.VITE_APP_SERVER_URL}`),
  ],
  storage: new IndexedDBStorageAdapter(import.meta.env.VITE_APP_NSID),
})

// === RENDER APP ==================================================================================
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ATProtoSessionContext.Provider value={{ session: result?.session || null, client }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LocalFirstAppView repo={repo} />} />
          <Route path="/collections" element={<CollectionManager repo={repo} />} />
          <Route path="/:did/*" element={<AtProtoAppView />} />
          <Route path="*" element={<Navigate to="/collections" replace />} />
        </Routes>
      </BrowserRouter>
    </ATProtoSessionContext.Provider>
  </StrictMode>,
)
