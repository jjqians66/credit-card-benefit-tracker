import { UserData } from '../types';

const STORAGE_KEY = 'cc_benefit_tracker_v1';

const DEFAULT_DATA: UserData = {
  myCardIds: [],
  usage: {},
};

export const loadUserData = (): UserData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load user data", error);
    return DEFAULT_DATA;
  }
};

export const saveUserData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save user data", error);
  }
};