


import { Elysia, t } from 'elysia'
import { Database } from "bun:sqlite";
import { EventEmitter } from 'events';
import { cors } from '@elysiajs/cors'



// all of these do the same thing


const db = new Database(":memory:");
db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, value TEXT)");
const messageBus = new EventEmitter();

Bun.connect({
  hostname: "datagen",
  port: 9000,
  socket: {
    data(socket, data) {
      {
        try {
          const msg = data.toString().trim()
          db.run("INSERT INTO messages (time, value) VALUES (?, ?)", [Date.now(), msg]);
          messageBus.emit('message', msg);

        }
        catch (e) {
          console.log("e", e);

        }

      }
    }, // message received from client
    open(socket) { }, // socket opened
    close(socket, error) { }, // socket closed
    drain(socket) { }, // socket ready for more data
    error(socket, error) { }, // error handler
  },
});

/** get all msgs 
 * const stmt = db.query("SELECT * FROM messages ORDER BY time DESC LIMIT ?");
          const rows = stmt.all(100); // get last 100 messages
          rows.forEach(row => {
            row.value = JSON.parse(row.value); // convert from string to number[]
          });
          console.log(rows);
 */


const app = new Elysia().use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))
  .ws('/stream', {
    message(ws, message) {
      console.log('Received from client:', message)
    },
    open(ws) {
      messageBus.on('message', (data) =>
        ws.send(JSON.stringify(data))
      )

    }
  }).get('/messages', ({ query }) => {
    console.log(query);

    const fromTime = query.from ? new Date(query.from).getTime() : 0;
    const toTime = query.to ? new Date(query.to).getTime() : Date.now();

    const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE time BETWEEN ? AND ?
    ORDER BY time ASC
  `);
    const results = stmt.all(fromTime, toTime);
    console.log({ results })
    return results;
  },
    {
      query: t.Object({
        from: t.Optional(t.String()),
        to: t.Optional(t.String())
      })
    }
  )
  .get('/message/:id', ({ params }) => {
    const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE id = ?
  `);
    const result = stmt.get(params.id);
    return result || { error: 'Message not found' };
  }, {
    params: t.Object({
      id: t.Integer({ minimum: 1 })
    })
  }
  )
  .listen(8000)