import { cn, formatDate } from "@/lib/utils/format";
import type { Casino } from "@/lib/types";

type TrustSectionProps = {
  casino: Pick<Casino, "licenses" | "owner" | "lastVerifiedAt" | "verificationStatus" | "dataSources">;
  className?: string;
};

export function TrustSection({ casino, className }: TrustSectionProps) {
  return (
    <section className={cn("mb-8", className)} aria-labelledby="trust-section-title">
      <h2
        id="trust-section-title"
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
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        Trust &amp; Licensing
      </h2>

      <div className="card-static p-6">
        {/* Licenses */}
        {casino.licenses.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Licenses
            </h3>
            <div className="space-y-3">
              {casino.licenses.map((license, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-3 bg-surface rounded-lg border border-border-subtle"
                >
                  <div>
                    <div className="font-medium text-foreground">{license.issuer}</div>
                    <div className="text-sm text-muted">Jurisdiction: {license.jurisdiction}</div>
                    {license.licenseNumber && (
                      <div className="text-xs text-text-faint mt-1">
                        License #: {license.licenseNumber}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {license.status && (
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                          license.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : license.status === "suspended"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        )}
                      >
                        {license.status}
                      </span>
                    )}
                    {license.verifiedAt && (
                      <div className="text-xs text-text-faint mt-1">
                        Verified: {formatDate(license.verifiedAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-muted">
              License information is not currently available. This data has not been verified.
            </p>
          </div>
        )}

        {/* Operator */}
        {casino.owner && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Operator
            </h3>
            <p className="text-sm text-muted">{casino.owner}</p>
          </div>
        )}

        {/* Verification Status */}
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>
            <span className="font-medium text-foreground">Status:</span>{" "}
            <span className="capitalize">{casino.verificationStatus.replace("_", " ")}</span>
          </span>
          <span>
            <span className="font-medium text-foreground">Last Verified:</span>{" "}
            {formatDate(casino.lastVerifiedAt)}
          </span>
          {casino.dataSources.length > 0 && (
            <span>
              <span className="font-medium text-foreground">Sources:</span>{" "}
              {casino.dataSources.length}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
