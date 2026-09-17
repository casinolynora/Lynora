/**
 * Database module barrel export.
 *
 * IMPORTANT: This module should only be imported on the server.
 * The db-provider.ts file imports better-sqlite3 which is a native
 * Node module that cannot be bundled for the client.
 */

export {
  casinos,
  operators,
  casinoLicenses,
  geoAvailability,
  paymentMethods,
  casinoPaymentMethods,
  playerReviews,
  complaints,
  moderationActions,
  sources,
  factProvenance,
  importBatches,
  importRecords,
  conflicts,
  type CasinoRecord,
  type CasinoInsert,
  type OperatorRecord,
  type OperatorInsert,
  type CasinoLicenseRecord,
  type GeoAvailabilityRecord,
  type PaymentMethodRecord,
  type CasinoPaymentMethodRecord,
  type PlayerReviewRecord,
  type PlayerReviewInsert,
  type ComplaintRecord,
  type ComplaintInsert,
  type ModerationActionRecord,
  type ModerationActionInsert,
  type SourceRecord,
  type SourceInsert,
  type FactProvenanceRecord,
  type FactProvenanceInsert,
  type ImportBatchRecord,
  type ImportBatchInsert,
  type ImportRecordRecord,
  type ImportRecordInsert,
  type ConflictRecord,
  type ConflictInsert,
} from "./schema";
export { createDbProvider } from "./db-provider";
