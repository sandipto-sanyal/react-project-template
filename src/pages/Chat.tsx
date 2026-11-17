import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, User } from "lucide-react";

// http(s) is mapped to ws(s) in case the env value is written as an http URL.
const WS_URL = (import.meta.env.VITE_WS_BASE_URL ?? "").replace(/^http/, "ws");

type Status = "connecting" | "open" | "closed";

type ChatMessage = {
  id: number;
  role: "user" | "bot";
  text: string;
};

// The Flask server only accepts JSON objects and replies with JSON.
// Show the most useful text field from a reply, or the raw data if it isn't JSON.
function displayText(data: unknown): string {
  if (typeof data !== "string") return String(data);
  try {
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === "object") {
      return String(parsed.server_message ?? parsed.message ?? data);
    }
    return data;
  } catch {
    return data;
  }
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const Icon = isUser ? User : Bot;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div
        className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
          isUser ? "rounded-br-sm bg-blue-600 text-white" : "rounded-bl-sm bg-gray-100 text-gray-900"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>(WS_URL ? "connecting" : "closed");
  const [text, setText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const nextId = useRef(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  function addMessage(role: ChatMessage["role"], body: string) {
    nextId.current += 1;
    const id = nextId.current;
    setMessages((prev) => [...prev, { id, role, text: body }]);
  }

  useEffect(() => {
    if (!WS_URL) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus("open");
    ws.onmessage = (event) => {
      nextId.current += 1;
      const id = nextId.current;
      const body = displayText(event.data);
      setMessages((prev) => [...prev, { id, role: "bot", text: body }]);
    };
    ws.onclose = () => setStatus("closed");
    ws.onerror = () => setStatus("closed");

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ws = wsRef.current;
    if (!text.trim() || ws?.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ message: text }));
    addMessage("user", text);
    setText("");
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Chat</h1>
      <p className="mb-4 text-sm text-gray-600">
        Status: <span className="font-semibold">{status}</span>
        {!WS_URL && " (VITE_WS_BASE_URL is not set)"}
      </p>

      <div
        ref={listRef}
        className="mb-3 flex h-96 flex-col gap-3 overflow-y-auto rounded-lg border bg-white p-3"
      >
        {messages.length === 0 && (
          <p className="my-auto text-center text-sm text-gray-400">No messages yet.</p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          disabled={status !== "open"}
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          disabled={status !== "open" || !text.trim()}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
