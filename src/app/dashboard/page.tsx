"use client";

import { useEffect, useState } from "react";

type UserRecord = {
  _id: string;
  name: string;
  email: string;
  studentNumber?: string;
  organization?: string;
  createdAt?: string;
};

export default function DashboardPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [admins, setAdmins] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Redirect to login if no token present (prevents accessing dashboard when logged out)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // replace so this page isn't left in history
      window.location.replace("/");
    }
  }, []);

  function handleLogout() {
    // clear token and redirect to main login, replacing history so Back can't return here
    localStorage.removeItem("token");
    // optional: clear any other stored state
    try {
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    window.location.replace("/");
  }

  async function fetchAccounts() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const res = await fetch("/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to load accounts (${res.status})`);
      }

      const data = await res.json();
      setUsers(data.users || []);
      setAdmins(data.admins || []);
    } catch (error) {
      console.error(error);
      setError((error as Error).message || "Error fetching accounts");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg("");
    if (!currentPassword) {
      setSaveMsg("Enter current password to make changes");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/superadmin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveMsg(data?.message || "Failed to update");
      } else {
        setSaveMsg("Settings updated");
        setNewPassword("");
      }
    } catch (error) {
      console.error(error);
      setSaveMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings((s) => !s)}
            aria-label="Toggle settings"
            title={showSettings ? "Hide settings" : "Show settings"}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {/* gear icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11.3 1.046a1 1 0 00-2.6 0l-.2.6a1 1 0 01-.95.69l-.66.05a1 1 0 00-.9.66l-.27.73a1 1 0 01-.6.6l-.7.28a1 1 0 00-.66.9l-.05.66a1 1 0 01-.69.95l-.6.2a1 1 0 000 2.6l.6.2a1 1 0 01.69.95l.05.66c.06.36.34.66.7.72l.7.28c.25.1.43.3.6.6l.27.73c.12.33.43.56.8.57l.66.05c.36.03.68.26.84.6l.2.6a1 1 0 002.6 0l.2-.6c.16-.34.48-.57.84-.6l.66-.05c.37-.01.68-.24.8-.57l.27-.73c.17-.3.35-.5.6-.6l.7-.28c.36-.06.64-.36.7-.72l.05-.66c.03-.36.25-.68.6-.84l.6-.2a1 1 0 000-2.6l-.6-.2a1 1 0 01-.6-.84l-.05-.66a1 1 0 00-.66-.9l-.7-.28a1 1 0 01-.6-.6l-.27-.73a1 1 0 00-.9-.66l-.66-.05a1 1 0 01-.95-.69l-.2-.6zM10 13a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Accounts</h2>
        {loading ? (
          <p>Loading accounts...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-medium mb-2">Students ({users.length})</h3>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {users.map((u) => (
                  <li key={u._id} className="text-sm border-b pb-2">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-600">
                      {u.email} • {u.studentNumber || "-"} • {u.organization}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-medium mb-2">Admins ({admins.length})</h3>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {admins.map((a) => (
                  <li key={a._id} className="text-sm border-b pb-2">
                    <div className="font-medium">{a.email}</div>
                    <div className="text-xs text-gray-600">
                      Created:{" "}
                      {new Date(a.createdAt || "").toLocaleString() || "-"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {showSettings && (
        <section>
          <h2 className="text-lg font-semibold">Superadmin Settings</h2>
          <form
            onSubmit={handleSaveSettings}
            className="max-w-md space-y-3 mt-3"
          >
            <div>
              <label className="block text-sm">New Email</label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded border px-3 py-2"
                placeholder="new-superadmin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm">New Password</label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                className="w-full rounded border px-3 py-2"
                placeholder="leave blank to keep current"
              />
            </div>

            <div>
              <label className="block text-sm">
                Current Password (required)
              </label>
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            {saveMsg && <div className="text-sm text-red-600">{saveMsg}</div>}

            <div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
