import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { RouterOutlet, provideRouter, Routes, RouterLink, RouterLinkActive, withHashLocation } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'zone.js';

import { KhatmaService } from './app/services/khatma.service';
import { GeminiService } from './app/services/gemini.service';
import { ThemeService } from './app/services/theme.service';
import { ReminderService } from './app/services/reminder.service';

import { HomeComponent } from './app/pages/home/home.component';
import { KhatmaListComponent } from './app/pages/khatma/list/khatma-list.component';
import { KhatmaDetailComponent } from './app/pages/khatma/detail/khatma-detail.component';
import { CoachComponent } from './app/pages/coach/coach.component';
import { DuasComponent } from './app/pages/duas/duas.component';
import { TasabeehComponent } from './app/pages/tasabeeh/tasabeeh.component';
import { RamadanComponent } from './app/pages/ramadan/ramadan.component';
import { JuzReaderComponent } from './app/pages/quran/juz-reader/juz-reader.component';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col text-txt transition-colors duration-500">

      <!-- ═══ HEADER ═══ -->
      <header class="fixed top-0 left-0 right-0 z-50">
        <div class="absolute inset-0 bg-surface/60 backdrop-blur-2xl border-b border-brd/40 shadow-[0_1px_20px_rgba(0,0,0,0.04)]"></div>

        <div class="relative max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between">

          <!-- Logo -->
          <a routerLink="/" class="group flex items-center gap-3.5">
            <div class="relative w-10 h-10 md:w-11 md:h-11">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent opacity-90 shadow-lg shadow-primary/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105"></div>
              <div class="absolute inset-0 rounded-2xl flex items-center justify-center">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-sm transition-transform duration-500 group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
              </div>
            </div>
            <div class="leading-tight hidden sm:block">
              <p class="text-lg font-black tracking-tight">أثر هدى</p>
              <p class="text-[9px] text-txt-muted font-medium tracking-wider uppercase">athr huda</p>
            </div>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-1 p-1.5 rounded-2xl border border-brd/60 bg-surface-el/50 backdrop-blur-sm">
            <a routerLink="/" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" [routerLinkActiveOptions]="{exact:true}" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الرئيسية</a>
            <a routerLink="/khatmat" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الختمات</a>
            <a routerLink="/coach" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">المصحّح</a>
            <a routerLink="/duas" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الأدعية</a>
            <a routerLink="/tasabeeh" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الأذكار</a>
            <a routerLink="/ramadan" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">رمضانيات</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button (click)="themeService.toggleTheme()" class="w-10 h-10 rounded-xl border border-brd/60 bg-surface/80 backdrop-blur-sm text-txt-muted hover:text-accent hover:border-accent/30 hover:bg-accent/[0.04] transition-all duration-300" aria-label="تبديل المظهر">
              @if (themeService.isDarkMode()) {
                <svg class="h-[18px] w-[18px] mx-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              } @else {
                <svg class="h-[18px] w-[18px] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              }
            </button>
          </div>
        </div>
      </header>

      <!-- ═══ MAIN ═══ -->
      <main class="flex-1 pt-16 md:pt-[72px] pb-20 md:pb-0" dir="rtl">
        <router-outlet></router-outlet>
      </main>

      <!-- ═══ MOBILE BOTTOM NAV ═══ -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
        <div class="bg-surface/80 backdrop-blur-2xl border border-brd/50 rounded-2xl shadow-xl shadow-black/10 px-2 py-2 flex items-center justify-around">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
            <span class="text-[9px] font-bold">الرئيسية</span>
          </a>
          <a routerLink="/khatmat" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
            <span class="text-[9px] font-bold">الختمات</span>
          </a>
          <a routerLink="/coach" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
            <span class="text-[9px] font-bold">المصحّح</span>
          </a>
          <a routerLink="/duas" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>
            <span class="text-[9px] font-bold">الأدعية</span>
          </a>
          <a routerLink="/tasabeeh" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>
            <span class="text-[9px] font-bold">الأذكار</span>
          </a>
          <a routerLink="/ramadan" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
            <span class="text-[9px] font-bold">رمضانيات</span>
          </a>
        </div>
      </nav>

      <!-- ═══ FOOTER ═══ -->
      <footer class="relative mt-12 border-t border-brd/60 bg-surface/70 backdrop-blur-xl" dir="rtl">
        <div class="absolute inset-0 islamic-pattern-dense opacity-20 dark:opacity-[0.04] pointer-events-none"></div>
        <div class="relative max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/15">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
              </div>
              <div>
                <p class="text-sm font-black">أثر هدى</p>
                <p class="text-[11px] text-txt-muted uppercase tracking-wider">athr huda</p>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <span class="text-[11px] text-txt-muted font-medium">لا تنسوا الدعاء لأمواتنا، فهم في قلوبنا تاركين بصمة لاتُزال أبدًا</span>
              <span class="w-1 h-1 rounded-full bg-brd"></span>
              <p class="text-[11px] text-txt-muted font-medium">© {{currentYear}} جميع الحقوق محفوظة</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class App {
  themeService = inject(ThemeService);
  reminderService = inject(ReminderService);
  currentYear = new Date().getFullYear();

  constructor() {
    this.reminderService.initialize();
  }
}

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'khatmat', component: KhatmaListComponent },
  { path: 'khatmat/:id', component: KhatmaDetailComponent },
  { path: 'coach', component: CoachComponent },
  { path: 'duas', component: DuasComponent },
  { path: 'tasabeeh', component: TasabeehComponent },
  { path: 'ramadan', component: RamadanComponent },
  { path: 'quran/juz/:juz', component: JuzReaderComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    KhatmaService,
    GeminiService,
    ThemeService,
    ReminderService,
    provideHttpClient(),
  ]
});
