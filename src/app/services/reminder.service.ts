import { Injectable } from '@angular/core';

export type ReminderPermission = NotificationPermission | 'unsupported';

export interface ReminderSettings {
  personName: string;
  time: string;
  enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReminderService {
  readonly settingsStorageKey = 'tasabeeh-reminder-settings-v1';
  private readonly lastSentStorageKey = 'tasabeeh-reminder-last-sent-v1';
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    this.scheduleFromStorage();
  }

  getPermission(): ReminderPermission {
    return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
  }

  getSettings(): ReminderSettings {
    const raw = localStorage.getItem(this.settingsStorageKey);
    if (!raw) {
      return { personName: '', time: '20:00', enabled: false };
    }

    try {
      const parsed = JSON.parse(raw) as ReminderSettings;
      return {
        personName: (parsed.personName ?? '').trim(),
        time: parsed.time ?? '20:00',
        enabled: Boolean(parsed.enabled),
      };
    } catch {
      localStorage.removeItem(this.settingsStorageKey);
      return { personName: '', time: '20:00', enabled: false };
    }
  }

  async requestPermission(): Promise<ReminderPermission> {
    if (typeof Notification === 'undefined') return 'unsupported';
    return Notification.requestPermission();
  }

  saveSettings(settings: ReminderSettings) {
    localStorage.setItem(this.settingsStorageKey, JSON.stringify(settings));
    this.scheduleFromStorage();
  }

  disableReminder() {
    const current = this.getSettings();
    this.saveSettings({ ...current, enabled: false });
  }

  async showTestNotification(personName: string) {
    await this.showNotification(personName, true);
  }

  private scheduleFromStorage() {
    this.clearTimer();
    const settings = this.getSettings();

    if (!settings.enabled || !settings.personName || !this.isValidTime(settings.time)) {
      return;
    }

    const [hours, minutes] = settings.time.split(':').map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next.getTime() - now.getTime();
    this.timerId = setTimeout(async () => {
      await this.fireScheduledReminder();
      this.scheduleFromStorage();
    }, delay);
  }

  private async fireScheduledReminder() {
    const settings = this.getSettings();
    if (!settings.enabled) return;

    const todayKey = this.getTodayKey();
    if (localStorage.getItem(this.lastSentStorageKey) === todayKey) return;

    const sent = await this.showNotification(settings.personName, false);
    if (sent) {
      localStorage.setItem(this.lastSentStorageKey, todayKey);
    }
  }

  private async showNotification(personName: string, isTest: boolean): Promise<boolean> {
    if (this.getPermission() !== 'granted') return false;

    const title = isTest ? 'أثر هدى • إشعار تجريبي' : 'أثر هدى • تذكير يومي';
    const body = `حان وقت الذكر والدعاء لـ ${personName} ✨`;

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          tag: isTest ? 'tasabeeh-test-reminder' : 'tasabeeh-daily-reminder',
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/icon-192x192.png',
          data: { url: '/#/tasabeeh' }
        });
        return true;
      } catch {
        // Fallback below.
      }
    }

    new Notification(title, { body });
    return true;
  }

  private isValidTime(value: string): boolean {
    return /^\d{2}:\d{2}$/.test(value);
  }

  private clearTimer() {
    if (!this.timerId) return;
    clearTimeout(this.timerId);
    this.timerId = null;
  }

  private getTodayKey(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
