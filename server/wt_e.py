from aioquic.asyncio import QuicConnectionProtocol
from aioquic.h3.connection import H3Connection
from aioquic.h3.events import (
    HeadersReceived,
    WebTransportStreamDataReceived,
    DatagramReceived,
)
from aioquic.quic.events import ProtocolNegotiated
import logging
logger = logging.getLogger("tcp_reader")
import asyncio
import json


class WTProtocol(QuicConnectionProtocol):

    def __init__(self, new_message_event, cache, *args, **kwargs):
        logger.info("aasas")
        super().__init__(*args, **kwargs)
        self._http = H3Connection(self._quic, enable_webtransport=True)
        self._webtransport_sessions = {}
        
        self._new_message_event = new_message_event

        self.cache = cache
        self._logger = logging.getLogger(__name__)
        self._sender_task = None

    def quic_event_received(self, event):
        if isinstance(event, ProtocolNegotiated):
            self._logger.info(f"Protocol negotiated: {event.alpn_protocol}")
        
        for http_event in self._http.handle_event(event):
            self._handle_http_event(http_event)

    def _handle_http_event(self, event):
        if isinstance(event, HeadersReceived):
            self._handle_headers_received(event)
        # elif isinstance(event, WebTransportStreamDataReceived):
        #     self._handle_webtransport_data(event)
        elif isinstance(event, DatagramReceived):
            self._handle_datagram_data(event)
        
    def _handle_headers_received(self, event):
        headers = dict(event.headers)
        stream_id = event.stream_id
                
        method = headers.get(b':method', b'')
        protocol = headers.get(b':protocol', b'')
        path = headers.get(b':path', b'/')
        self._logger.info(f"headers :: {protocol} {method} {path}")
        if method == b'CONNECT' and protocol == b'webtransport':
            self._logger.info(f"WebTransport CONNECT request for path: {path}")
            
            response_headers = [
                (b':status', b'200'),
                (b'sec-webtransport-http3-draft', b'draft02'),
            ]
            
            self._http.send_headers(
                stream_id=stream_id,
                headers=response_headers,
                end_stream=False
            )
            
            self._webtransport_sessions[stream_id] = {
                'path': path,
                'established': True
            }
            
            self._logger.info(f"WebTransport session established on stream {stream_id}")
        else:
            self._http.send_headers(
                stream_id=stream_id,
                headers=[(b':status', b'400')],
                end_stream=True
            )

    def _handle_webtransport_data(self, event):
        stream_id = event.stream_id
        data = event.data        
        self._logger.info(f"WebTransport data received on stream {stream_id}: {data}")
        self._sender_task = asyncio.create_task(self._periodic_sender(stream_id))


    async def _periodic_sender(self, stream_id):
        while True:
            payload = await self._new_message_event.get()
            msg = json.dumps(payload) + "\n"
            self._quic.send_stream_data(stream_id, msg.encode(), end_stream=False)
            
    def _handle_datagram_data(self, event):
        stream_id = event.stream_id
        data = event.data        
        self._logger.info(f"_handle_datagram_data data received on stream {stream_id}: {data}")
        self._sender_task = asyncio.create_task(self._periodic_d_sender(stream_id))
            
    async def _periodic_d_sender(self, stream_id):
        while True:
            self._logger.info(f"_periodic_d_sender  data on {stream_id}")
            payload = await self._new_message_event.get()
            try:
                msg = json.dumps(payload) + "\n"
                self._logger.info(msg)
            
                self._quic.send_datagram_frame(msg)
            except Exception as e:
                self._logger.warning(f"www {e}")
            finally:
                self._logger.debug(f"Sent datagram: {payload}")

