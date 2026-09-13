"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { VALID_GEOS_FOR_LISTING, SubmitListingRequestSchema } from "@/lib/b2b/validation";
import { PRICING_TIERS } from "@/lib/b2b/pricing";

const GEO_LABELS: Record<string, string> = {
  IE: "Ireland",
  DE: "Germany",
  NL: "Netherlands",
  BE: "Belgium",
  FR: "France",
  IT: "Italy",
  AT: "Austria",
  CH: "Switzerland",
};

type FormErrors = Record<string, string>;

const INPUT_CLASS =
  "w-full rounded-[var(--radius-md)] border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400";
const LABEL_CLASS = "block text-sm font-medium text-foreground mb-1.5";
const ERROR_CLASS = "text-sm text-red-600 mt-1";

export function ListingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    brandName: "",
    officialWebsite: "",
    operatorName: "",
    contactName: "",
    businessEmail: "",
    targetGeos: [] as string[],
    requestedPlan: "free",
    message: "",
    affiliateManagerContact: "",
    affiliateProgramUrl: "",
    licenseInfo: "",
    yearLaunched: "",
    supportedLanguages: "",
    paymentMethods: "",
    productCategories: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function toggleGeo(geo: string) {
    setForm((prev) => {
      const geos = prev.targetGeos.includes(geo)
        ? prev.targetGeos.filter((g) => g !== geo)
        : [...prev.targetGeos, geo];
      return { ...prev, targetGeos: geos };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.targetGeos;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccess(false);

    const payload = {
      brandName: form.brandName,
      officialWebsite: form.officialWebsite,
      operatorName: form.operatorName,
      contactName: form.contactName,
      businessEmail: form.businessEmail,
      targetGeos: form.targetGeos,
      requestedPlan: form.requestedPlan,
      message: form.message || undefined,
      affiliateManagerContact: form.affiliateManagerContact || undefined,
      affiliateProgramUrl: form.affiliateProgramUrl || undefined,
      licenseInfo: form.licenseInfo || undefined,
      yearLaunched: form.yearLaunched ? Number(form.yearLaunched) : undefined,
      supportedLanguages: form.supportedLanguages
        ? form.supportedLanguages.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      paymentMethods: form.paymentMethods
        ? form.paymentMethods.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      productCategories: form.productCategories
        ? form.productCategories.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
    };

    const result = SubmitListingRequestSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/b2b/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Submission failed. Please try again.");
      }
      setSuccess(true);
      setForm({
        brandName: "",
        officialWebsite: "",
        operatorName: "",
        contactName: "",
        businessEmail: "",
        targetGeos: [],
        requestedPlan: "free",
        message: "",
        affiliateManagerContact: "",
        affiliateProgramUrl: "",
        licenseInfo: "",
        yearLaunched: "",
        supportedLanguages: "",
        paymentMethods: "",
        productCategories: "",
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      {success && (
        <div className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Your submission has been received. Our team will review it and get back
          to you shortly.
        </div>
      )}

      {serverError && (
        <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {serverError}
        </div>
      )}

      {/* Brand Information */}
      <section>
        <h2 className="text-lg font-bold mb-4">Brand Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="brandName" className={LABEL_CLASS}>
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              id="brandName"
              type="text"
              required
              className={INPUT_CLASS}
              placeholder="e.g. SpinCity Casino"
              value={form.brandName}
              onChange={(e) => set("brandName", e.target.value)}
            />
            {errors.brandName && <p className={ERROR_CLASS}>{errors.brandName}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="officialWebsite" className={LABEL_CLASS}>
              Official Website <span className="text-red-500">*</span>
            </label>
            <input
              id="officialWebsite"
              type="url"
              required
              className={INPUT_CLASS}
              placeholder="https://example.com"
              value={form.officialWebsite}
              onChange={(e) => set("officialWebsite", e.target.value)}
            />
            {errors.officialWebsite && <p className={ERROR_CLASS}>{errors.officialWebsite}</p>}
          </div>
          <div>
            <label htmlFor="operatorName" className={LABEL_CLASS}>
              Operator / Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="operatorName"
              type="text"
              required
              className={INPUT_CLASS}
              placeholder="Company Ltd."
              value={form.operatorName}
              onChange={(e) => set("operatorName", e.target.value)}
            />
            {errors.operatorName && <p className={ERROR_CLASS}>{errors.operatorName}</p>}
          </div>
          <div>
            <label htmlFor="yearLaunched" className={LABEL_CLASS}>
              Year Launched
            </label>
            <input
              id="yearLaunched"
              type="number"
              min={2000}
              max={2030}
              className={INPUT_CLASS}
              placeholder="2024"
              value={form.yearLaunched}
              onChange={(e) => set("yearLaunched", e.target.value)}
            />
            {errors.yearLaunched && <p className={ERROR_CLASS}>{errors.yearLaunched}</p>}
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section>
        <h2 className="text-lg font-bold mb-4">Contact Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactName" className={LABEL_CLASS}>
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              id="contactName"
              type="text"
              required
              className={INPUT_CLASS}
              placeholder="Jane Doe"
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
            />
            {errors.contactName && <p className={ERROR_CLASS}>{errors.contactName}</p>}
          </div>
          <div>
            <label htmlFor="businessEmail" className={LABEL_CLASS}>
              Business Email <span className="text-red-500">*</span>
            </label>
            <input
              id="businessEmail"
              type="email"
              required
              className={INPUT_CLASS}
              placeholder="partners@company.com"
              value={form.businessEmail}
              onChange={(e) => set("businessEmail", e.target.value)}
            />
            {errors.businessEmail && <p className={ERROR_CLASS}>{errors.businessEmail}</p>}
          </div>
        </div>
      </section>

      {/* Target GEOs */}
      <section>
        <h2 className="text-lg font-bold mb-4">Target GEOs</h2>
        <p className="text-sm text-muted mb-3">
          Select at least one country where your casino operates.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VALID_GEOS_FOR_LISTING.map((geo) => (
            <label
              key={geo}
              className={`flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                form.targetGeos.includes(geo)
                  ? "border-brand-400 bg-brand-50 text-brand-800"
                  : "border-border bg-white text-foreground hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.targetGeos.includes(geo)}
                onChange={() => toggleGeo(geo)}
              />
              <span className="font-medium">{geo}</span>
              <span className="text-muted text-xs">{GEO_LABELS[geo]}</span>
            </label>
          ))}
        </div>
        {errors.targetGeos && <p className={ERROR_CLASS}>{errors.targetGeos}</p>}
      </section>

      {/* Listing Plan */}
      <section>
        <h2 className="text-lg font-bold mb-4">Requested Plan</h2>
        <label htmlFor="requestedPlan" className={LABEL_CLASS}>
          Choose a plan
        </label>
        <select
          id="requestedPlan"
          className={INPUT_CLASS}
          value={form.requestedPlan}
          onChange={(e) => set("requestedPlan", e.target.value)}
        >
          {PRICING_TIERS.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {tier.name} {tier.monthlyPrice !== null ? `(€${tier.monthlyPrice}/mo)` : "(Custom)"}
            </option>
          ))}
        </select>
        {errors.requestedPlan && <p className={ERROR_CLASS}>{errors.requestedPlan}</p>}
      </section>

      {/* Additional Details */}
      <section>
        <h2 className="text-lg font-bold mb-4">Additional Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="message" className={LABEL_CLASS}>
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className={`${INPUT_CLASS} resize-y`}
              placeholder="Anything else you'd like us to know..."
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
            />
            {errors.message && <p className={ERROR_CLASS}>{errors.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="licenseInfo" className={LABEL_CLASS}>
              License Information
            </label>
            <textarea
              id="licenseInfo"
              rows={3}
              className={`${INPUT_CLASS} resize-y`}
              placeholder="e.g. MGA/B2C/123/2014, UKGC 000-012345-N-123456"
              value={form.licenseInfo}
              onChange={(e) => set("licenseInfo", e.target.value)}
            />
            {errors.licenseInfo && <p className={ERROR_CLASS}>{errors.licenseInfo}</p>}
          </div>
          <div>
            <label htmlFor="supportedLanguages" className={LABEL_CLASS}>
              Supported Languages
            </label>
            <input
              id="supportedLanguages"
              type="text"
              className={INPUT_CLASS}
              placeholder="English, German, French"
              value={form.supportedLanguages}
              onChange={(e) => set("supportedLanguages", e.target.value)}
            />
            <p className="text-xs text-muted mt-1">Comma-separated</p>
            {errors.supportedLanguages && (
              <p className={ERROR_CLASS}>{errors.supportedLanguages}</p>
            )}
          </div>
          <div>
            <label htmlFor="paymentMethods" className={LABEL_CLASS}>
              Payment Methods
            </label>
            <input
              id="paymentMethods"
              type="text"
              className={INPUT_CLASS}
              placeholder="Visa, Mastercard, PayPal"
              value={form.paymentMethods}
              onChange={(e) => set("paymentMethods", e.target.value)}
            />
            <p className="text-xs text-muted mt-1">Comma-separated</p>
            {errors.paymentMethods && (
              <p className={ERROR_CLASS}>{errors.paymentMethods}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="productCategories" className={LABEL_CLASS}>
              Product Categories
            </label>
            <input
              id="productCategories"
              type="text"
              className={INPUT_CLASS}
              placeholder="Slots, Live Casino, Sports Betting"
              value={form.productCategories}
              onChange={(e) => set("productCategories", e.target.value)}
            />
            <p className="text-xs text-muted mt-1">Comma-separated</p>
            {errors.productCategories && (
              <p className={ERROR_CLASS}>{errors.productCategories}</p>
            )}
          </div>
        </div>
      </section>

      {/* Affiliate Information */}
      <section>
        <h2 className="text-lg font-bold mb-4">Affiliate Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="affiliateManagerContact" className={LABEL_CLASS}>
              Affiliate Manager Contact
            </label>
            <input
              id="affiliateManagerContact"
              type="text"
              className={INPUT_CLASS}
              placeholder="Name or email"
              value={form.affiliateManagerContact}
              onChange={(e) => set("affiliateManagerContact", e.target.value)}
            />
            {errors.affiliateManagerContact && (
              <p className={ERROR_CLASS}>{errors.affiliateManagerContact}</p>
            )}
          </div>
          <div>
            <label htmlFor="affiliateProgramUrl" className={LABEL_CLASS}>
              Affiliate Program URL
            </label>
            <input
              id="affiliateProgramUrl"
              type="url"
              className={INPUT_CLASS}
              placeholder="https://partners.example.com"
              value={form.affiliateProgramUrl}
              onChange={(e) => set("affiliateProgramUrl", e.target.value)}
            />
            {errors.affiliateProgramUrl && (
              <p className={ERROR_CLASS}>{errors.affiliateProgramUrl}</p>
            )}
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Listing"}
        </Button>
        {submitting && (
          <span className="text-sm text-muted">Processing your submission...</span>
        )}
      </div>
    </form>
  );
}
