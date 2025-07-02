from typing import  Optional, AsyncIterator, Callable, Awaitable

import asyncio

from datetime import datetime

TCP_HOST = "localhost"
TCP_PORT = 9000


async def stream_lines(reader: asyncio.StreamReader) -> AsyncIterator[bytes]:
    """Convert stream to async iterator"""
    async for line in reader:
        yield line


async def for_each_line(reader: asyncio.StreamReader, handler: Callable[[bytes], Awaitable[None]], logger, new_message_event) -> None:
    """Apply handler to each line, publish read event # should i use pulling? """
    async for line in stream_lines(reader):
        if not line:
            break
        msg = line.decode().strip()
        logger.info(f"line {msg}")
        await handler(msg)
        await  new_message_event.put(msg)       


async def tcp_reader(cache, new_message_event, logger):
    reader, _ = await asyncio.open_connection(TCP_HOST, TCP_PORT)
    logger.info(f"Connected to TCP server at {TCP_HOST}:{TCP_PORT}")
    await for_each_line(reader, lambda data:cache.set(datetime.utcnow().isoformat(), data), logger, new_message_event)  # should i find a faster time init?


