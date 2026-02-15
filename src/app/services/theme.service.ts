import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDarkMode = signal<boolean>(false);

    constructor() {
        // Load initial state from local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode.set(savedTheme === 'dark');
        } else {
            // Default to light mode unless the user explicitly changed it before.
            this.isDarkMode.set(false);
        }

        // Apply theme whenever signal changes
        effect(() => {
            const isDark = this.isDarkMode();
            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.classList.toggle('dark', isDark);
            }
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    toggleTheme() {
        this.isDarkMode.update(dark => !dark);
    }
}
