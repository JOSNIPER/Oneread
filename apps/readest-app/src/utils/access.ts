import type { UserPlan } from '@/types/quota';

// Stub: cloud auth removed
export const getAccessToken = (): string | null => null;
export const getUserID = (): string | null => null;
export const validateUserAndToken = () => ({ valid: false, userId: null });
export const getStoragePlanData = (_token?: unknown) => ({ usage: 0, quota: 0 });
export const getTranslationPlanData = (_token?: unknown) => ({ usage: 0, quota: 0 });
export const getDailyTranslationPlanData = (_token?: unknown) => ({ usage: 0, quota: 0 });
export const getUserProfilePlan = (_token?: unknown): UserPlan => 'free';
export const getSubscriptionPlan = (_token?: unknown): UserPlan => 'free';
export const getTranslationQuota = (_plan?: unknown): number => 0;
export const EMAIL_IN_PLANS: string[] = [];
export const isEmailInPlan = (_plan?: unknown): boolean => false;
export const STORAGE_QUOTA_GRACE_BYTES = 0;
