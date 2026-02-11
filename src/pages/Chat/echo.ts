import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: "local",
  wsHost: "localhost",
  wsPort: 8080,
  forceTLS: false,
  disableStats: true,
});

(echo.connector as any).pusher.connection.bind_global(
  (eventName: any, data: any) => {
    console.log("GLOBAL EVENT:", eventName, data);
  },
);

(echo.connector as any).pusher.connection.bind("connected", () => {
  console.log("✅ WebSocket Connected");
});

(echo.connector as any).pusher.connection.bind("error", (err: any) => {
  console.log("❌ WS Error:", err);
});

export default echo;
