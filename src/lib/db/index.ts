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
  type CasinoRecord,
  type CasinoInsert,
  type OperatorRecord,
  type OperatorInsert,
  type CasinoLicenseRecord,
  type GeoAvailabilityRecord,
  type PaymentMethodRecord,
  type CasinoPaymentMethodRecord,
} from "./schema";
export { createDbProvider } from "./db-provider";
