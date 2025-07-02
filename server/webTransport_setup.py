
import logging
from typing import Dict, Optional

from aioquic.asyncio import serve
from aioquic.quic.configuration import QuicConfiguration
from aioquic.tls import SessionTicket

from pathlib import Path
import logging
logger = logging.getLogger("tcp_reader")
from wt_e import WTProtocol


class SessionTicketStore:
    """
    Simple in-memory store for session tickets.
    """

    def __init__(self) -> None:
        logger.info("here in init")
        self.tickets: Dict[bytes, SessionTicket] = {}

    def add(self, ticket: SessionTicket) -> None:
        logger.info("here")
        self.tickets[ticket.ticket] = ticket

    def pop(self, label: bytes) -> Optional[SessionTicket]:
        return self.tickets.pop(label, None)
      
      
async def start_webtransport_server(logger, cache, new_message_event):
    """Start the WebTransport/QUIC server"""    
    cert_file = Path("../172.27.6.84.pem")
    key_file = Path("../172.27.6.84-key.pem")
    configuration = QuicConfiguration(alpn_protocols=["h3", "webtransport"], is_client=False, max_datagram_frame_size=65536)      
    configuration.load_cert_chain(cert_file, key_file)
    logger.info("Starting WebTransport server on localhost:4433")
    session_ticket_store = SessionTicketStore()
    
    await serve (host='::', port=4433, configuration=configuration, create_protocol=lambda *args, **kwargs:WTProtocol(new_message_event, cache, *args, **kwargs), session_ticket_fetcher=session_ticket_store.pop, session_ticket_handler=session_ticket_store.add,)
  
