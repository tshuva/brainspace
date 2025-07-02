import { useEffect } from 'react';

const useWebTransportLogger = (url: string) => {
  useEffect(() => {
    let transport = null;
    let reader = null;
    let writer = null;

    const connect = async () => {
      try {
        console.log('Connecting to WebTransport...');
        transport = new WebTransport(url);
        await transport.ready;
        console.log('Connected!');

        const stream = await transport.createBidirectionalStream();
        reader = transport.datagrams.readable.getReader();
        writer = stream.writable.getWriter();

        const registrationMessage = JSON.stringify({
          type: 'register',
          timestamp: new Date().toISOString()
        });

        await writer.write(new TextEncoder().encode(registrationMessage));
        console.log('Registration message sent.');

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log('Datagram stream closed.');
            break;
          }
          if (value) {
            console.log('Received bytes:', Array.from(value));
          }
        }
      } catch (err) {
        console.error('WebTransport error:', err);
      }
    };

    connect();

    return () => {
      reader?.cancel();
      writer?.close();
      transport?.close();
      console.log('WebTransport connection closed.');
    };
  }, [url]);
};

// Usage
export const WebTransportLogger = () => {
  useWebTransportLogger('https://172.27.6.84:4433');
  return null;
};

export default WebTransportLogger;
