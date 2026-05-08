/**
 * Global type definitions for HTFasil
 */

// Re-export all service types
export * from '../services/api'
export * from '../services/products'
export * from '../services/auth'
export * from '../services/cart'
export * from '../services/orders'
export * from '../services/promotions'
export * from '../services/payment'

// Additional global types

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: SelectOption[]
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export interface Breadcrumb {
  label: string
  to?: string
}

export interface NavigationItem {
  label: string
  to?: string
  icon?: string
  children?: NavigationItem[]
  badge?: string | number
}

export interface SearchResult {
  id: string | number
  type: 'product' | 'category' | 'brand' | 'article'
  title: string
  description?: string
  url: string
  image?: string
  score?: number
}

export interface FileUpload {
  file: File
  preview?: string
  progress?: number
  error?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }[]
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  orders: boolean
  promotions: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'fr' | 'en'
  currency: 'HTG' | 'USD'
  notifications: NotificationSettings
}

export interface SeoMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

export interface AnalyticsEvent {
  event: string
  category?: string
  action?: string
  label?: string
  value?: number
  properties?: Record<string, unknown>
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: unknown
}

export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface FormState<T = Record<string, unknown>> {
  data: T
  errors: Record<keyof T, string>
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  isValid: boolean
}

export type Theme = 'light' | 'dark' | 'auto'
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type Variant = 'solid' | 'outline' | 'ghost' | 'link'

// Component prop types
export interface BaseComponentProps {
  className?: string
  id?: string
  style?: string | Record<string, unknown>
}

export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: Variant
  size?: Size
  color?: Color
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

export interface InputProps extends BaseComponentProps {
  type?: string
  value?: string | number
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: Size
  icon?: string
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  title?: string
  size?: Size
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
}

export interface ToastProps {
  id: string
  message: string
  title?: string
  type?: Color
  duration?: number
  autoClose?: boolean
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// Event handler types
export type EventHandler<T = Event> = (event: T) => void
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// Store types
export interface StoreState {
  isLoading: boolean
  error: string | null
}

export interface PaginationState extends StoreState {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Route types
export interface RouteMeta {
  title?: string
  description?: string
  requiresAuth?: boolean
  guestOnly?: boolean
  roles?: string[]
  layout?: string
}

// API types
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface ApiResponseHeaders {
  [key: string]: string
}

export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
  withCredentials: boolean
}

// Form types
export interface FormField {
  name: string
  type: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: SelectOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: unknown) => boolean | string
  }
}

export interface FormConfig {
  fields: FormField[]
  submitText?: string
  resetText?: string
  layout?: 'vertical' | 'horizontal' | 'grid'
}

// Export types from services
export type { Product, Category } from '../services/products'
export type { Banner, Promotion } from '../services/promotions'
export type { CartItem, Cart } from '../services/cart'
export type { Order, OrderItem, CreateOrderData } from '../services/orders'

// Define missing types locally
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'admin' | 'customer'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: number
  userId: number
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

export interface PaymentMethod {
  id: string
  type: 'natcash' | 'moncashwise' | 'visa' | 'zelle'
  name: string
  description: string
  icon: string
  isActive: boolean
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  paymentMethodId: string
  createdAt: string
  updatedAt: string
}
