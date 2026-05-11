import prisma from "@/lib/prisma";
import { Mail, MailOpen } from "lucide-react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Messages</h1>
          <p className="mt-1 text-sm text-[#0a0a0a]/50">
            {unread > 0
              ? `${unread} unread message${unread > 1 ? "s" : ""}`
              : "All messages read"}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-[#f2f2f0] bg-white p-16 text-center shadow-sm">
          <Mail className="mx-auto h-12 w-12 text-[#0a0a0a]/20 mb-4" />
          <p className="text-[#0a0a0a]/40 text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
                msg.read
                  ? "border-[#f2f2f0]"
                  : "border-[#ff5c00]/20 bg-[#ff5c00]/[0.02]"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        msg.read
                          ? "bg-gray-100 text-gray-400"
                          : "bg-[#ff5c00]/10 text-[#ff5c00]"
                      }`}
                    >
                      {msg.read ? (
                        <MailOpen className="h-4 w-4" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a0a0a]">{msg.name}</p>
                      <p className="text-xs text-[#0a0a0a]/40">{msg.email}{msg.phone ? ` · ${msg.phone}` : ""}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[#0a0a0a]/40">{formatDate(msg.createdAt)}</p>
                    {!msg.read && (
                      <span className="inline-block mt-1 rounded-full bg-[#ff5c00] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-11">
                  <p className="text-sm font-medium text-[#0a0a0a] mb-1">
                    {msg.subject}
                  </p>
                  <p className="text-sm text-[#0a0a0a]/60 leading-relaxed whitespace-pre-line">
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
