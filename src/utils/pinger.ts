import http from 'http';
import 'dotenv/config';

const pingUrl = String(process.env.PING_URL);
const pingInterval = Number(process.env.PING_INTERVAL);

function pinger() {
  //   deepcode ignore HttpToHttps: Not required
  http.get(pingUrl);
  console.log('Pinged');
}

setInterval(pinger, pingInterval);

// Export the pinger function
export default pinger;
