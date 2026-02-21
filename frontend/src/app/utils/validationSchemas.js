import { z } from 'zod';
import { VALIDATION } from './constants';

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`),
});

// Register Schema
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name must contain only characters and spaces'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .regex(/@gmail\.com$/, 'Only @gmail.com emails are supported')
        .regex(/[a-zA-Z]/, 'Email must contain at least one letter'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(VALIDATION.PHONE_REGEX, 'Phone number must be 10 digits'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    role: z
        .enum(['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_AGENT'], {
            required_error: 'Please select a role',
        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required')
        .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Address Schema
export const addressSchema = z.object({
    label: z
        .string()
        .min(1, 'Label is required')
        .max(20, 'Label must be less than 20 characters'),
    addressLine1: z
        .string()
        .min(1, 'Address line 1 is required')
        .max(100, 'Address must be less than 100 characters'),
    addressLine2: z
        .string()
        .max(100, 'Address must be less than 100 characters')
        .optional(),
    city: z
        .string()
        .min(1, 'City is required')
        .max(50, 'City must be less than 50 characters'),
    state: z
        .string()
        .min(1, 'State is required')
        .max(50, 'State must be less than 50 characters'),
    pinCode: z
        .string()
        .min(1, 'PIN code is required')
        .regex(VALIDATION.PIN_CODE_REGEX, 'PIN code must be 6 digits'),
    landmark: z
        .string()
        .max(100, 'Landmark must be less than 100 characters')
        .optional(),
});
