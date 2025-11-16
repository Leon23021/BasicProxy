import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// In-memory storage for bot status
let botStatus = {
  botOnline: false,
  guilds: 0,
  timestamp: null
};

// Root endpoint for UptimeRobot ping
app.get('/', (c) => 'ok');

// Endpoint to get bot status
app.get('/bot', (c) => {
  return c.json(botStatus);
});

// Endpoint to update bot status (Pterodactyl bot will POST here)
app.post('/update', async (c) => {
  try {
    const data = await c.req.json();
    botStatus = {
      botOnline: data.botOnline ?? false,
      guilds: data.guilds ?? 0,
      timestamp: new Date().toISOString()
    };
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
serve({ fetch: app.fetch, port: PORT });
console.log(`🌐 Status server running on port ${PORT}`);
