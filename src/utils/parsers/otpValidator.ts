export function isValidRideOtp(otp: string): boolean { return /^\d{4,6}$/.test(otp.trim()); }
