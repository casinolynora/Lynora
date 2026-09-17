import { cn } from "@/lib/utils/format";

type PublicComplaint = {
  id: string;
  subject: string;
  category: string;
  severity: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
};

type ComplaintSummaryProps = {
  complaints: PublicComplaint[];
  totalCount?: number;
  className?: string;
};

export function ComplaintSummary({ complaints, totalCount, className }: ComplaintSummaryProps) {
  const displayCount = totalCount ?? complaints.length;

  // Only show resolved/closed complaints publicly
  const publicComplaints = complaints.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  );

  return (
    <section className={cn("mb-8", className)} aria-labelledby="complaints-title">
      <h2
        id="complaints-title"
        className="text-xl font-bold mb-4 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        Complaints &amp; Trust
      </h2>

      <div className="card-static p-6">
        {/* Summary */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="text-muted">
            <span className="font-medium text-foreground">{displayCount}</span>{" "}
            {displayCount === 1 ? "complaint" : "complaints"} total
          </span>
          {publicComplaints.length > 0 && (
            <span className="text-muted">
              <span className="font-medium text-foreground">{publicComplaints.length}</span>{" "}
              resolved
            </span>
          )}
        </div>

        {/* Public Complaints List */}
        {publicComplaints.length > 0 ? (
          <div className="space-y-3">
            {publicComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="p-3 bg-surface rounded-lg border border-border-subtle"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {complaint.subject}
                    </div>
                    <div className="text-xs text-text-faint mt-1 capitalize">
                      {complaint.category.replace("_", " ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                        complaint.status === "resolved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      )}
                    >
                      {complaint.status.replace("_", " ")}
                    </span>
                    {complaint.resolvedAt && (
                      <div className="text-xs text-text-faint mt-1">
                        Resolved: {new Date(complaint.resolvedAt).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No public complaints on record for this casino.
          </p>
        )}

        {/* Disclosure */}
        <p className="text-xs text-text-faint mt-4 border-t border-border-subtle pt-3">
          Complaint information is provided for transparency. The existence of complaints does not
          automatically indicate a problem. All complaints are reviewed by our team.
        </p>
      </div>
    </section>
  );
}
