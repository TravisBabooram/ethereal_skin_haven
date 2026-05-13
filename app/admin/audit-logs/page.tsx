"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: string;
  createdAt: string;
  admin: { name: string; email: string };
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: "#4caf50",
  UPDATE: "#C9A96E",
  DELETE: "#e05555",
  LOGIN: "#64b5f6",
  LOGOUT: "#9A8878",
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 30;

  const fetchLogs = (p: number) => {
    setLoading(true);
    fetch(`/api/admin/audit-logs?page=${p}&limit=${limit}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.logs)) { setLogs(d.logs); setTotal(d.total ?? 0); }
        else if (Array.isArray(d)) setLogs(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(page); }, [page]);

  const totalPages = Math.ceil(total / limit);

  const parseChanges = (changes?: string) => {
    if (!changes) return null;
    try { return JSON.stringify(JSON.parse(changes), null, 2); }
    catch { return changes; }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Security</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: "0 0 6px" }}>Audit Logs</h1>
        <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>All admin actions are recorded here for security and compliance.</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading logs…</span>
        </div>
      ) : logs.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "60px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No audit logs yet.</p>
        </div>
      ) : (
        <>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Timestamp", "Admin", "Action", "Resource", "ID", "Changes"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.18em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <p style={{ margin: "0 0 2px", color: "var(--text)", fontSize: 12 }}>
                        {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: "var(--text-subtle)" }}>
                        {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ margin: "0 0 2px", color: "var(--text)", fontSize: 12 }}>{log.admin?.name}</p>
                      <p style={{ margin: 0, fontSize: 10, color: "var(--text-subtle)" }}>{log.admin?.email}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: ACTION_COLORS[log.action] ?? "var(--text-muted)" }}>{log.action}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", textTransform: "capitalize" }}>{log.resource}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-subtle)", fontSize: 11, fontFamily: "monospace", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.resourceId}</td>
                    <td style={{ padding: "12px 16px", maxWidth: 200 }}>
                      {log.changes ? (
                        <code style={{ fontSize: 10, color: "var(--text-subtle)", background: "var(--bg-elevated)", padding: "2px 6px", borderRadius: 2, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {parseChanges(log.changes)}
                        </code>
                      ) : <span style={{ color: "var(--text-subtle)", fontSize: 11 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: "7px", background: "none", border: "1px solid var(--border)", borderRadius: 4, cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "var(--text-subtle)" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                <ChevronLeft size={15} />
              </button>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: "7px", background: "none", border: "1px solid var(--border)", borderRadius: 4, cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "var(--text-subtle)" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
