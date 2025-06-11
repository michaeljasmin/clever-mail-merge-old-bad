"use client";

import { useEffect, useState } from "react";

interface Draft {
  id: string;
  subject: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      const res = await fetch("/api/gmail/drafts");
      const data = await res.json();
      setDrafts(data);
      setLoading(false);
    };

    fetchDrafts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Gmail Drafts</h1>
      {loading ? (
        <div>Loading drafts...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <div className="font-semibold">{draft.subject}</div>
              <div className="text-sm text-gray-500">ID: {draft.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
