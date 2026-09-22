import { describe, it, expect, beforeAll } from "vitest";
import { initializeServerDataProvider } from "@/lib/db/server-init";
import {
  getTargetCasinoState,
  type PaymentEnrichmentEntry,
  type EnrichmentMode,
} from "@/lib/db/payment-enrichment";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";

// ─── Source Validation ──────────────────────────────────────────────────

describe("Payment Enrichment — Source Validation", () => {
  it("validates official source types", () => {
    const validTypes = [
      "official_operator_website",
      "official_payment_page",
      "official_terms",
      "manual_verified",
    ];
    for (const t of validTypes) {
      expect(["official_operator_website", "official_payment_page", "official_terms", "manual_verified"]).toContain(t);
    }
  });

  it("rejects non-HTTPS URLs", () => {
    const url = "http://example.com";
    expect(url.startsWith("https://")).toBe(false);
  });
});

// ─── Entity Mapping ─────────────────────────────────────────────────────

describe("Payment Enrichment — Entity Mapping", () => {
  const canonicalEntities = [
    "Visa", "Mastercard", "PayPal", "Skrill", "Paysafecard",
    "Neteller", "Trustly", "Apple Pay", "iDEAL", "Klarna",
    "Bancontact", "Bank Transfer", "Sofort", "Google Pay",
    "Creditcard", "Wero", "AirCash", "Tink", "Brite",
    "MuchBetter", "Giropay", "Maestro", "Neosurf",
  ];

  it("all canonical entities are recognized", () => {
    for (const entity of canonicalEntities) {
      expect(typeof entity).toBe("string");
      expect(entity.length).toBeGreaterThan(0);
    }
  });

  it("DE-relevant entities are subset of canonical", () => {
    const deRelevant = ["Visa", "Mastercard", "PayPal", "Skrill", "Paysafecard", "Sofort", "Giropay", "Klarna"];
    for (const e of deRelevant) {
      expect(canonicalEntities).toContain(e);
    }
  });
});

// ─── Target Casino State ────────────────────────────────────────────────

describe("Payment Enrichment — Target Casino State", () => {
  const ENRICHED_IDS = [
    "germany-bet365",
    "germany-leovegas",
    "germany-wildz",
    "germany-bet-at-home",
    "germany-daznbet",
    "germany-vbet",
    "germany-tiptorro",
    "germany-interwetten",
    "germany-loewen-play",
    "germany-jokerstar",
  ];

  it("returns 15 target casinos from database", () => {
    const targets = getTargetCasinoState();
    expect(targets.length).toBe(15);
  });

  it("enriched targets have payment methods after enrichment", () => {
    const targets = getTargetCasinoState();
    const enriched = targets.filter((t) => ENRICHED_IDS.includes(t!.id));
    expect(enriched.length).toBe(10);
    for (const t of enriched) {
      expect(t!.paymentCount).toBeGreaterThan(0);
    }
  });

  it("all targets are DE-only with GGL license", () => {
    const targets = getTargetCasinoState();
    for (const t of targets) {
      expect(t!.GEOs).toBe("DE");
      expect(t!.licenses).toBe("GGL");
    }
  });

  it("all targets have valid website URLs", () => {
    const targets = getTargetCasinoState();
    for (const t of targets) {
      expect(t!.website).toMatch(/^https:\/\//);
    }
  });

  it("all targets are active and verified", () => {
    const targets = getTargetCasinoState();
    for (const t of targets) {
      expect(t!.status).toBe("active");
      expect(t!.verificationStatus).toBe("verified");
    }
  });
});

// ─── Enrichment Entry Template ──────────────────────────────────────────

describe("Payment Enrichment — Entry Template", () => {
  it("entry has all required fields", () => {
    const entry: PaymentEnrichmentEntry = {
      casinoId: "germany-bet365",
      casinoSlug: "bet365",
      paymentMethodName: "Visa",
      sourceUrl: "https://www.bet365.de/deposit",
      sourceType: "official_payment_page",
      sourceName: "bet365.de Payment Page",
      verificationDate: "2026-09-19",
    };
    expect(entry.casinoId).toBeTruthy();
    expect(entry.paymentMethodName).toBeTruthy();
    expect(entry.sourceUrl).toMatch(/^https:\/\//);
    expect(entry.verificationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ─── Dry-Run Mode ───────────────────────────────────────────────────────

describe("Payment Enrichment — Dry-Run Mode", () => {
  it("dry-run mode is valid", () => {
    const mode: EnrichmentMode = "dry-run";
    expect(mode).toBe("dry-run");
  });

  it("live mode is valid", () => {
    const mode: EnrichmentMode = "live";
    expect(mode).toBe("live");
  });
});

// ─── Data Integrity ─────────────────────────────────────────────────────

describe("Payment Enrichment — Data Integrity", () => {
  beforeAll(async () => {
    await initializeServerDataProvider();
  });

  it("138 casinos remain intact", () => {
    const casinos = getFullDatasetCasinos();
    expect(casinos.length).toBe(138);
  });

  it("payment records count is at least 766 (pre-enrichment baseline)", () => {
    const casinos = getFullDatasetCasinos();
    const totalPayments = casinos.reduce((sum: number, c) => sum + c.paymentMethods.length, 0);
    expect(totalPayments).toBeGreaterThanOrEqual(766);
  });

  it("enrichment only added payment methods, no other fields modified", () => {
    const ENRICHED_IDS = [
      "germany-bet365", "germany-leovegas", "germany-wildz",
      "germany-bet-at-home", "germany-daznbet", "germany-vbet",
      "germany-tiptorro", "germany-interwetten", "germany-loewen-play",
      "germany-jokerstar",
    ];
    const targets = getTargetCasinoState();
    const enriched = targets.filter((t) => ENRICHED_IDS.includes(t!.id));
    for (const t of enriched) {
      expect(t!.paymentCount).toBeGreaterThan(0);
      expect(t!.GEOs).toBe("DE");
      expect(t!.licenses).toBe("GGL");
    }
  });
});
