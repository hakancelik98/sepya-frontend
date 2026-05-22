// src/lib/validators/index.ts

// ============================================
// TEMEL VALIDATION FONKSİYONLARI
// ============================================

// Email kontrolü
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Telefon kontrolü (Türkiye)
export function isValidPhone(phone: string): boolean {
    // 5551234567 veya 05551234567 formatı
    const cleaned = phone.replace(/\D/g, '');
    return /^(5\d{9}|05\d{9})$/.test(cleaned);
}

// Posta kodu kontrolü (5 haneli)
export function isValidPostalCode(code: string): boolean {
    return /^\d{5}$/.test(code);
}

// Kart numarası kontrolü (Luhn algoritması)
export function isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    // Luhn algoritması
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Kart markasını tespit et
export function getCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'troy' | 'unknown' {
    const cleaned = cardNumber.replace(/\D/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^9792/.test(cleaned)) return 'troy';

    return 'unknown';
}

// CVV kontrolü
export function isValidCVV(cvv: string, cardBrand: string): boolean {
    const expectedLength = cardBrand === 'amex' ? 4 : 3;
    return /^\d+$/.test(cvv) && cvv.length === expectedLength;
}

// Son kullanma tarihi kontrolü
export function isValidExpiry(month: string, year: string): boolean {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Son 2 hane
    const currentMonth = now.getMonth() + 1;

    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;

    return true;
}

// XSS koruması için input temizleme
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '')
        .trim();
}

// ============================================
// ADRES VALIDATION
// ============================================

export interface ValidationError {
    field: string;
    message: string;
}

export function validateAddress(address: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
    email: string;
}): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!address.firstName?.trim()) {
        errors.push({ field: 'firstName', message: 'Ad alanı zorunludur' });
    }

    if (!address.lastName?.trim()) {
        errors.push({ field: 'lastName', message: 'Soyad alanı zorunludur' });
    }

    if (!address.addressLine1?.trim()) {
        errors.push({ field: 'addressLine1', message: 'Adres alanı zorunludur' });
    } else if (address.addressLine1.length < 5) {
        errors.push({ field: 'addressLine1', message: 'Adres en az 5 karakter olmalıdır' });
    }

    if (!address.city?.trim()) {
        errors.push({ field: 'city', message: 'Şehir seçilmelidir' });
    }

    if (!address.district?.trim()) {
        errors.push({ field: 'district', message: 'İlçe seçilmelidir' });
    }

    if (!address.postalCode?.trim()) {
        errors.push({ field: 'postalCode', message: 'Posta kodu zorunludur' });
    } else if (!isValidPostalCode(address.postalCode)) {
        errors.push({ field: 'postalCode', message: 'Geçersiz posta kodu (5 haneli olmalı)' });
    }

    if (!address.phone?.trim()) {
        errors.push({ field: 'phone', message: 'Telefon numarası zorunludur' });
    } else if (!isValidPhone(address.phone)) {
        errors.push({ field: 'phone', message: 'Geçersiz telefon numarası' });
    }

    if (!address.email?.trim()) {
        errors.push({ field: 'email', message: 'E-posta adresi zorunludur' });
    } else if (!isValidEmail(address.email)) {
        errors.push({ field: 'email', message: 'Geçersiz e-posta adresi' });
    }

    return errors;
}

// ============================================
// KART VALIDATION
// ============================================

export function validateCard(card: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!card.cardNumber?.trim()) {
        errors.push({ field: 'cardNumber', message: 'Kart numarası zorunludur' });
    } else if (!isValidCardNumber(card.cardNumber)) {
        errors.push({ field: 'cardNumber', message: 'Geçersiz kart numarası' });
    }

    if (!card.cardholderName?.trim()) {
        errors.push({ field: 'cardholderName', message: 'Kart sahibi adı zorunludur' });
    } else if (card.cardholderName.length < 3) {
        errors.push({ field: 'cardholderName', message: 'Kart sahibi adı en az 3 karakter olmalı' });
    }

    if (!card.expiryMonth || !card.expiryYear) {
        errors.push({ field: 'expiry', message: 'Son kullanma tarihi zorunludur' });
    } else if (!isValidExpiry(card.expiryMonth, card.expiryYear)) {
        errors.push({ field: 'expiry', message: 'Geçersiz veya süresi dolmuş kart' });
    }

    if (!card.cvv?.trim()) {
        errors.push({ field: 'cvv', message: 'CVV kodu zorunludur' });
    } else {
        const cardBrand = getCardBrand(card.cardNumber);
        if (!isValidCVV(card.cvv, cardBrand)) {
            errors.push({ field: 'cvv', message: 'Geçersiz CVV kodu' });
        }
    }

    return errors;
}