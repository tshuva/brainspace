
import asyncio
import logging
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from aiocache import Cache

import uvicorn
from pathlib import Path

from tcp_reader import tcp_reader
from webTransport_setup import start_webtransport_server
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tcp_reader")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*", "http://localhost", "http://localhost:5173", ], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
cache = Cache(Cache.MEMORY)

new_message_event = asyncio.Queue()


@app.on_event("startup")
async def startup_event():
	logger.info("Starting FastAPI with HTTPS and WebTransport support")
	asyncio.create_task(tcp_reader(cache, new_message_event, logger))
	asyncio.create_task(start_webtransport_server(logger, cache, new_message_event))

              
if __name__ == "__main__":
	cert_file = Path("../localhost.crt")
	key_file = Path("localhost.key")
	logger.info("Starting FastAPI with HTTPS and WebTransport support")
	uvicorn.run("main:app", host="localhost", port=8000, ssl_keyfile=str(key_file), ssl_certfile=str(cert_file), reload=True, log_level="info")    
