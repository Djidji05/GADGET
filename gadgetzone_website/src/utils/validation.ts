/**
 * Validation utility functions
 */

/**
 * Email validation regex
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Haitian phone number regex (simplified)
 */
export const phoneRegex = /^(\+509)?(\d{8}|(\d{2}\s\d{4}\s\d{4}))$/

/**
 * Strong password regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return emailRegex.test(email.trim())
}

/**
 * Validate Haitian phone number
 */
export function isValidPhone(phone: string): boolean {
  return phoneRegex.test(phone.trim())
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return strongPasswordRegex.test(password)
}

/**
 * Check password strength level
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak'

  let score = 0

  // Length bonus
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[@$!%*?&]/.test(password)) score += 1

  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  return isRequired(value) && value.trim().length >= min
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return !isRequired(value) || value.trim().length <= max
}

/**
 * Validate numeric value
 */
export function isNumeric(value: string): boolean {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value))
}

/**
 * Validate positive number
 */
export function isPositive(value: string | number): boolean {
  const num = typeof value === 'string' ? Number(value) : value
  return !isNaN(num) && num > 0
}

/**
 * Validate range
 */
export function isInRange(value: string | number, min: number, max: number): boolean {
  const num = typeof value === 'string' ? Number(value) : value
  return !isNaN(num) && num >= min && num <= max
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate Haitian postal code (simplified)
 */
export function isValidPostalCode(code: string): boolean {
  // Haitian postal codes are typically 4 digits (HT####)
  const postalRegex = /^HT\d{4}$/
  return postalRegex.test(code.trim())
}

/**
 * Validate credit card number (basic Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  if (!/^\d+$/.test(cleaned)) return false

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    const char = cleaned[i]
    if (!char) continue // Skip if character is undefined

    let digit = parseInt(char, 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Validate expiry date (MM/YY)
 */
export function isValidExpiryDate(expiry: string): boolean {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!regex.test(expiry)) return false

  const [monthStr, yearStr] = expiry.split('/')
  const month = Number(monthStr)
  const year = Number(yearStr)

  // Validate that both month and year are valid numbers
  if (isNaN(month) || isNaN(year)) return false

  const currentYear = new Date().getFullYear() % 100
  const currentMonth = new Date().getMonth() + 1

  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false

  return true
}

/**
 * Validate CVV (3 or 4 digits)
 */
export function isValidCvv(cvv: string): boolean {
  const cleaned = cvv.replace(/\s/g, '')
  return /^\d{3,4}$/.test(cleaned)
}

/**
 * Form validation helper
 */
export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean
  message: string
}

export interface ValidationRules {
  [field: string]: ValidationRule<unknown>[]
}

export interface ValidationResult {
  isValid: boolean
  errors: { [field: string]: string[] }
}

/**
 * Validate form data against rules
 */
export function validateForm(
  data: Record<string, unknown>,
  rules: ValidationRules,
): ValidationResult {
  const errors: { [field: string]: string[] } = {}
  let isValid = true

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    const fieldErrors: string[] = []

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        fieldErrors.push(rule.message)
        isValid = false
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return { isValid, errors }
}

/**
 * Common validation rules
 */
export const commonRules = {
  required: (message = 'Ce champ est requis'): ValidationRule<unknown> => ({
    validate: isRequired,
    message,
  }),

  email: (message = 'Email invalide'): ValidationRule<string> => ({
    validate: (value) => !isRequired(value) || isValidEmail(value),
    message,
  }),

  phone: (message = 'Numéro de téléphone invalide'): ValidationRule<string> => ({
    validate: (value) => !isRequired(value) || isValidPhone(value),
    message,
  }),

  password: (message = 'Mot de passe trop faible'): ValidationRule<string> => ({
    validate: isValidPassword,
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => !isRequired(value) || minLength(value, min),
    message: message || `Minimum ${min} caractères requis`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => !isRequired(value) || maxLength(value, max),
    message: message || `Maximum ${max} caractères autorisés`,
  }),

  numeric: (message = 'Valeur numérique requise'): ValidationRule<string> => ({
    validate: (value) => !isRequired(value) || isNumeric(value),
    message,
  }),

  positive: (message = 'Valeur positive requise'): ValidationRule<string | number> => ({
    validate: (value) => !isRequired(value) || isPositive(value),
    message,
  }),

  range: (min: number, max: number, message?: string): ValidationRule<string | number> => ({
    validate: (value) => !isRequired(value) || isInRange(value, min, max),
    message: message || `Valeur doit être entre ${min} et ${max}`,
  }),
}
