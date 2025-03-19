'use strict'
import fs from "fs"
import express, { Request, Response } from "express"
import { WebSocketServer } from "ws"
import { Repo } from "@automerge/automerge-repo"
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket"
import { NodeFSStorageAdapter } from "@automerge/automerge-repo-storage-nodefs"
import os from "os"
import searchRouter from './routes/search.js'
import getRouter from './routes/get.js'

const cors = (req: Request, res: Response, next: Function) => {
  const allowedOrigin = process.env.APP_CLIENT_URL || '*'

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

export class Server {
  /** @type WebSocketServer */
  #socket

  /** @type ReturnType<import("express").Express["listen"]> */
  #server

  /** @type {((value: any) => void)[]} */
  #readyResolvers: ((value: any) => void)[] = []

  #isReady = false

  /** @type Repo */
  #repo

  constructor() {
    const dir =
      process.env.DATA_DIR !== undefined ? process.env.DATA_DIR : ".data"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    var hostname = os.hostname()

    this.#socket = new WebSocketServer({ noServer: true })

    const PORT =
      process.env.PORT !== undefined ? parseInt(process.env.PORT) : 3030

    // === Initialize the express app =========================================================
    const app = express()

    // === Add the middlewares =================================================================
    // Serve static files from the 'public' folder.
    app.use(express.static('public'));
    app.use(cors);
    app.use(express.json());

    // === Add the routes ======================================================================
    // Mount the content API router under /api
    app.use('/api', searchRouter);
    app.use('/api', getRouter);

    // Serve the client app for any non-API route
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'public' });
    });

    // === Initialize the repo =================================================================
    const config = {
      network: [new NodeWSServerAdapter(this.#socket as any)],
      storage: new NodeFSStorageAdapter(dir),
      peerId: `storage-server-${hostname}`,
      sharePolicy: async () => false,
    }
    /** @ts-ignore @type {(import("@automerge/automerge-repo").PeerId)}  */
    this.#repo = new Repo(config)

    // === Start the server ======================================================================  
    this.#server = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
      this.#isReady = true
      this.#readyResolvers.forEach((resolve) => resolve(true))
    })

    // === Handle WebSocket connections =========================================================
    this.#server.on("upgrade", (request, socket, head) => {
      this.#socket.handleUpgrade(request, socket, head, (socket) => {
        console.log("WebSocket connection established")
        this.#socket.emit("connection", socket, request)
      })
    })
  }

  async ready() {
    if (this.#isReady) {
      return true
    }

    return new Promise((resolve) => {
      this.#readyResolvers.push(resolve)
    })
  }

  close() {
    this.#socket.close()
    this.#server.close()
  }
}
