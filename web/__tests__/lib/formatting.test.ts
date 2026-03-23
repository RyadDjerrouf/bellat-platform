/**
 * Tests for Algerian market formatting rules.
 * DZD: no decimals, formatted with toLocaleString('fr-DZ')
 * Phone: must match +213XXXXXXXXX
 * Order ID: BLT-YYYYMMDD-NNNNN format
 */

// ── DZD currency formatting ────────────────────────────────────────────────────

function formatDZD(amount: number): string {
  return amount.toLocaleString('fr-DZ') + ' DZD';
}

describe('DZD currency formatting', () => {
  it('formats whole numbers without decimals', () => {
    expect(formatDZD(1500)).toMatch(/1.500|1 500|1500/); // locale may vary across environments
    expect(formatDZD(1500)).toContain('DZD');
  });

  it('formats zero correctly', () => {
    expect(formatDZD(0)).toContain('0');
    expect(formatDZD(0)).toContain('DZD');
  });

  it('handles large amounts', () => {
    const result = formatDZD(50000);
    expect(result).toContain('DZD');
    expect(result).toContain('50');
  });
});

// ── Algerian phone validation ──────────────────────────────────────────────────

const ALGERIAN_PHONE_REGEX = /^\+213\d{9}$/;

describe('Algerian phone number validation (+213XXXXXXXXX)', () => {
  it('accepts valid Algerian mobile number', () => {
    expect(ALGERIAN_PHONE_REGEX.test('+213600000001')).toBe(true);
    expect(ALGERIAN_PHONE_REGEX.test('+213770000001')).toBe(true);
    expect(ALGERIAN_PHONE_REGEX.test('+213550000001')).toBe(true);
  });

  it('rejects local format without country code', () => {
    expect(ALGERIAN_PHONE_REGEX.test('0600000001')).toBe(false);
    expect(ALGERIAN_PHONE_REGEX.test('600000001')).toBe(false);
  });

  it('rejects too short numbers', () => {
    expect(ALGERIAN_PHONE_REGEX.test('+21360000001')).toBe(false); // 8 digits after +213
  });

  it('rejects too long numbers', () => {
    expect(ALGERIAN_PHONE_REGEX.test('+2136000000012')).toBe(false); // 10 digits after +213
  });

  it('rejects non-Algerian country codes', () => {
    expect(ALGERIAN_PHONE_REGEX.test('+33600000001')).toBe(false);
    expect(ALGERIAN_PHONE_REGEX.test('+1600000001')).toBe(false);
  });
});

// ── Order ID format ────────────────────────────────────────────────────────────

const ORDER_ID_REGEX = /^BLT-\d{8}-\d{5}$/;

describe('Order ID format (BLT-YYYYMMDD-NNNNN)', () => {
  it('accepts valid order IDs', () => {
    expect(ORDER_ID_REGEX.test('BLT-20260321-00001')).toBe(true);
    expect(ORDER_ID_REGEX.test('BLT-20260101-99999')).toBe(true);
  });

  it('rejects IDs with wrong prefix', () => {
    expect(ORDER_ID_REGEX.test('ORD-20260321-00001')).toBe(false);
  });

  it('rejects IDs with wrong date length', () => {
    expect(ORDER_ID_REGEX.test('BLT-2026321-00001')).toBe(false); // 7-digit date
  });

  it('rejects IDs with wrong sequence length', () => {
    expect(ORDER_ID_REGEX.test('BLT-20260321-001')).toBe(false); // 3-digit seq
  });
});

// ── Delivery fee logic ────────────────────────────────────────────────────────

function formatDeliveryFee(fee: number): string {
  return fee === 0 ? 'Gratuite' : `${fee} DZD`;
}

describe('Delivery fee display', () => {
  it('shows "Gratuite" for 0 DZD', () => {
    expect(formatDeliveryFee(0)).toBe('Gratuite');
  });

  it('shows amount with DZD for non-zero fees', () => {
    expect(formatDeliveryFee(500)).toBe('500 DZD');
    expect(formatDeliveryFee(250)).toBe('250 DZD');
  });
});
