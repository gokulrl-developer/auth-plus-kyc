export const KYCStatus={
  SUBMITTED:"submitted",
  ACCEPTED:"accepted"
}as const;

export type KYCStatusType = typeof KYCStatus[keyof typeof KYCStatus];
