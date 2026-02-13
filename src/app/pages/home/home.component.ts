import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden">
      <!-- Ambient Blobs -->
      <div class="absolute top-[-15%] right-[-8%] w-[550px] h-[550px] rounded-full blur-[130px] opacity-[0.07] bg-primary animate-drift pointer-events-none"></div>
      <div class="absolute bottom-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full blur-[100px] opacity-[0.05] bg-accent animate-drift pointer-events-none" style="animation-delay:-7s"></div>
      <div class="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.04] bg-secondary animate-drift pointer-events-none" style="animation-delay:-3s"></div>
      <div class="absolute inset-0 islamic-pattern-dense opacity-25 dark:opacity-[0.04] pointer-events-none"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6 w-full py-12">
        <div class="grid lg:grid-cols-2 gap-16 items-center">

          <!-- Text Block -->
          <div class="text-center lg:text-right order-2 lg:order-1">
            <!-- Badge -->
            <div class="animate-fade-up inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-accent/15 bg-accent/[0.05] mb-8">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span class="text-accent text-xs font-bold tracking-wide">صدقة جارية للمتوفى</span>
            </div>

            <!-- Heading -->
            <h1 class="animate-hero text-[2.8rem] md:text-[3.6rem] lg:text-[4rem] font-black leading-[1.12] text-txt mb-7">
              اختم القرآن
              <br/>
              <span class="gradient-text">لمن تحب</span>
            </h1>

            <!-- Description -->
            <p class="animate-fade-up delay-200 text-txt-secondary text-[15px] md:text-base leading-[2] max-w-xl mx-auto lg:mx-0 lg:mr-0 mb-10">
              أنشئ ختمة قرآنية جماعية وأهدِ ثوابها لروح من فقدت.
              <br class="hidden md:block"/>
              ادعُ عائلتك وأصدقاءك للمشاركة في قراءة الأجزاء.
            </p>

            <!-- CTAs -->
            <div class="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
              <button (click)="openCreateModal()" aria-label="إنشاء ختمة جديدة" class="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] text-white font-bold text-[15px] shadow-xl shadow-primary/20 transition-all duration-500 hover:bg-right hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 overflow-hidden">
                <svg class="w-5 h-5 relative transition-transform group-hover:rotate-90 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span class="relative">أنشئ ختمة جديدة</span>
              </button>

              <a routerLink="/duas" aria-label="أدعية للمتوفى" class="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border-2 border-brd text-txt-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/[0.03] font-semibold text-sm transition-all duration-300">
                <svg class="w-4 h-4 transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>
                أدعية للمتوفى
              </a>
            </div>
          </div>

          <!-- Visual Orb -->
          <div class="order-1 lg:order-2 flex justify-center animate-scale-in delay-200">
            <div class="relative w-72 h-72 md:w-80 md:h-80">
              <!-- Outer decorative rings -->
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-primary/[0.06] animate-orbit"></div>
              <div class="absolute inset-4 rounded-full border border-accent/[0.05] animate-orbit-reverse"></div>

              <!-- Center Card -->
              <div class="absolute inset-10 rounded-[2rem] glass shadow-2xl flex flex-col items-center justify-center text-center p-5 animate-pulse-glow">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3">
                  <svg class="w-7 h-7 text-primary animate-float-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                </div>
                <span class="text-4xl font-black text-txt">30</span>
                <span class="text-primary text-[11px] font-bold mt-1">جزء في كل ختمة</span>
              </div>

              <!-- Floating Icons -->
              <div class="absolute top-2 right-6 animate-pop-in delay-500"><div class="w-12 h-12 rounded-2xl glass shadow-lg flex items-center justify-center animate-float" style="animation-delay:-2s"><svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg></div></div>
              <div class="absolute bottom-3 left-1 animate-pop-in delay-600"><div class="w-11 h-11 rounded-xl glass shadow-lg flex items-center justify-center animate-float" style="animation-delay:-4s"><svg class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg></div></div>
              <div class="absolute top-1/2 left-[-10px] animate-pop-in delay-700"><div class="w-10 h-10 rounded-xl glass shadow-lg flex items-center justify-center animate-float" style="animation-delay:-1s"><svg class="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div></div>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="animate-fade-up delay-500 mt-16 pt-10 border-t border-brd/40 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 text-center lg:text-right">
          @for (stat of statsData; track stat.label) {
            <div class="animate-count" [style.animation-delay]="stat.delay">
              <div class="text-2xl md:text-3xl font-black" [class]="stat.color">{{stat.value || '—'}}</div>
              <div class="text-[10px] text-txt-muted mt-1.5 font-bold uppercase tracking-wider">{{stat.label}}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══ HADITH ═══ -->
    <section class="animate-fade-up py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface to-surface/50"></div>
      <div class="absolute inset-0 islamic-pattern-dense opacity-20 dark:opacity-[0.03] pointer-events-none"></div>
      <div class="relative max-w-2xl mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="w-12 h-[1.5px] bg-accent/30 rounded-full"></div>
          <div class="w-8 h-8 rounded-lg bg-accent/[0.07] flex items-center justify-center">
            <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          </div>
          <div class="w-12 h-[1.5px] bg-accent/30 rounded-full"></div>
        </div>
        <p class="text-lg md:text-xl font-quran leading-[2.4] text-txt">
          « إذا مات ابن آدم انقطع عمله إلا من ثلاث:
          <span class="text-primary font-bold">صدقة جارية</span>،
          أو علم يُنتفع به، أو ولد صالح يدعو له »
        </p>
        <div class="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/[0.06] border border-accent/10">
          <svg class="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          <span class="text-accent text-[11px] font-bold">رواه مسلم</span>
        </div>
      </div>
    </section>

    <!-- ═══ HOW IT WORKS ═══ -->
    <section class="py-24">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.05] border border-primary/10 text-primary text-[11px] font-bold mb-4 uppercase tracking-wider">كيف تعمل المنصة</div>
          <h2 class="text-2xl md:text-4xl font-black text-txt">ثلاث خطوات <span class="gradient-text">بسيطة</span></h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          @for (step of steps; track step.num; let i = $index) {
            <div class="card-lift relative group">
              <!-- Connector Lines (hidden on mobile) -->
              @if (i < 2) {
                <div class="hidden md:block absolute top-12 left-0 translate-x-[-50%] w-full h-[2px] bg-gradient-to-l from-primary/10 via-accent/10 to-transparent z-0"></div>
              }

              <div class="relative bg-surface rounded-3xl p-8 border border-brd/70 text-center overflow-hidden z-10">
                <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/[0.02] rounded-full blur-2xl group-hover:bg-primary/[0.05] transition-colors duration-700"></div>

                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/[0.08] to-accent/[0.08] text-primary text-xl font-black flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-white group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:rotate-3 relative z-10">{{step.num}}</div>
                <h3 class="text-base font-bold text-txt mb-2 relative z-10">{{step.title}}</h3>
                <p class="text-[13px] text-txt-muted leading-relaxed relative z-10">{{step.desc}}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═══ LIVE KHATMAS ═══ -->
    <section class="py-24 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-surface/60 to-transparent"></div>
      <div class="relative max-w-5xl mx-auto px-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.05] border border-primary/10 text-primary text-[10px] font-bold mb-3 uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              مباشر
            </div>
            <h2 class="text-xl md:text-3xl font-black text-txt mb-1.5">ختمات جارية</h2>
            <p class="text-txt-muted text-sm">شارك في ختمة أو أنشئ واحدة جديدة</p>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-initial">
              <svg class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input [(ngModel)]="searchQuery" type="text" placeholder="ابحث باسم الختمة..." class="w-full sm:w-56 pr-11 pl-4 py-3 rounded-xl border border-input-brd bg-input-bg text-txt text-xs outline-none transition-all focus:border-focus focus:shadow-[0_0_0_3px_rgba(var(--focus-rgb),0.08)]"/>
            </div>
            <a routerLink="/khatmat" class="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-link hover:text-accent transition-colors whitespace-nowrap">عرض الكل <svg class="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>
          </div>
        </div>

        @if (filteredKhatmas.length > 0) {
          <div class="grid md:grid-cols-2 gap-6">
            @for (k of filteredKhatmas; track k.id) {
              <div class="card-lift group relative bg-surface rounded-[1.75rem] border border-brd/70 overflow-hidden">
                <!-- Progress Bar Top -->
                <div class="h-1 bg-surface-el"><div class="h-full bg-gradient-to-l from-primary via-secondary to-accent transition-all duration-1000" [style.width.%]="k.progress"></div></div>

                  <div class="p-6 md:p-7">
                    <div class="flex justify-between items-start mb-5">
                      <div class="flex-1 min-w-0">
                        @if (k.deceasedDeathDate) {
                           @let days = getDaysToAnniversary(k.deceasedDeathDate);
                           @if (days <= 30 && days >= 0) {
                             <div class="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[9px] font-bold text-accent mb-2 w-fit animate-pulse-glow">
                               {{days === 0 ? 'اليوم ذكرى الوفاة' : 'باقي ' + days + ' يوم على الذكرى'}}
                             </div>
                           }
                         }
                        <a [routerLink]="['/khatmat', k.id]" class="text-[15px] font-bold text-txt group-hover:text-primary transition-colors block truncate">{{k.title}}</a>
                        <div class="flex items-center gap-3 mt-2">
                          <span class="text-[10px] text-txt-muted flex items-center gap-1.5">
                            <div class="w-5 h-5 rounded-lg bg-primary/[0.06] flex items-center justify-center"><svg class="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg></div>
                            {{k.createdBy}}
                          </span>
                          @if (k.deceasedName) {
                            <span class="text-[10px] text-accent flex items-center gap-1.5">
                              <div class="w-5 h-5 rounded-lg bg-accent/[0.06] flex items-center justify-center"><svg class="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div>
                              {{k.deceasedName}}
                            </span>
                          }
                        </div>
                      </div>

                    </div>

                    <div class="flex items-center gap-1.5 text-[10px] text-txt-muted mb-5"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> {{getCompletedParts(k)}} / 30 جزء مكتمل</div>

                    <div class="flex items-center gap-2.5">
                      <a [routerLink]="['/khatmat', k.id]" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-[11px] transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> احجز جزء
                      </a>
                      <button (click)="shareKhatmaWhatsApp(k);$event.stopPropagation()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#25D366]/[0.08] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-md"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></button>
                      <button (click)="copyKhatmaLink(k);$event.stopPropagation()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-el border border-brd text-txt-muted hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-110"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg></button>
                    </div>
                  </div>
                </div>

            }
          </div>
        } @else if (hasNoKhatmas) {
          <div class="text-center py-20 bg-surface rounded-3xl border-2 border-dashed border-brd">
            <div class="w-20 h-20 bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] rounded-3xl flex items-center justify-center mx-auto mb-5"><svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></div>
            <h3 class="text-lg font-bold text-txt mb-2">لا توجد ختمات حالية</h3>
            <p class="text-txt-muted text-sm mb-6">ابدأ ختمة جديدة وشارك الأجر</p>
            <button (click)="openCreateModal()" class="px-7 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/20 transition-all">إنشاء أول ختمة</button>
          </div>
        } @else {
          <div class="text-center py-14"><p class="text-txt-muted text-sm">لا توجد نتائج لـ "{{searchQuery}}"</p></div>
        }
        <a routerLink="/khatmat" class="sm:hidden mt-6 block text-center text-xs font-bold text-link">عرض كل الختمات</a>
      </div>
    </section>

    <!-- ═══ TOOLS ═══ -->
    <section class="py-24">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/[0.05] border border-secondary/10 text-secondary text-[11px] font-bold mb-4 uppercase tracking-wider">أدوات ذكية</div>
          <h2 class="text-xl md:text-2xl font-black text-txt">المزيد من طرق الخير</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <a routerLink="/coach" aria-label="المصحح الذكي" class="card-lift group flex items-center gap-5 bg-surface rounded-[1.75rem] p-7 border border-brd/70 overflow-hidden relative">
            <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-l from-info to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-info/[0.03] rounded-full blur-2xl group-hover:bg-info/[0.06] transition-all duration-700"></div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-info/10 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-info group-hover:to-primary group-hover:shadow-xl group-hover:shadow-info/20 transition-all duration-500 group-hover:scale-110 relative z-10">
              <svg class="w-6 h-6 text-info group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
            </div>
            <div class="relative z-10"><h3 class="text-sm font-bold text-txt group-hover:text-primary transition-colors mb-1">المصحح الذكي</h3><p class="text-xs text-txt-muted leading-relaxed">تقييم فوري للتلاوة بالذكاء الاصطناعي</p></div>
          </a>

          <a routerLink="/duas" aria-label="أدعية للمتوفى" class="card-lift group flex items-center gap-5 bg-surface rounded-[1.75rem] p-7 border border-brd/70 overflow-hidden relative">
            <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-l from-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-accent/[0.03] rounded-full blur-2xl group-hover:bg-accent/[0.06] transition-all duration-700"></div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/10 to-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:from-accent group-hover:to-secondary group-hover:shadow-xl group-hover:shadow-accent/20 transition-all duration-500 group-hover:scale-110 relative z-10">
              <svg class="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="relative z-10"><h3 class="text-sm font-bold text-txt group-hover:text-accent transition-colors mb-1">أدعية للمتوفى</h3><p class="text-xs text-txt-muted leading-relaxed">أدعية مختارة من القرآن والسنة</p></div>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="py-16">
      <div class="max-w-2xl mx-auto px-6">
        <div class="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10">
          <div class="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-gradient"></div>
          <div class="absolute inset-0 islamic-pattern-dense opacity-[0.06] pointer-events-none"></div>
          <div class="absolute top-[-40%] right-[-15%] w-72 h-72 rounded-full bg-white/[0.04] blur-3xl"></div>
          <div class="absolute bottom-[-30%] left-[-10%] w-60 h-60 rounded-full bg-black/[0.06] blur-3xl"></div>

          <div class="relative z-10 p-10 md:p-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 animate-float-slow backdrop-blur-sm border border-white/10">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
            </div>
            <h2 class="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">اجعل لهم نصيباً<br/>من الأجر</h2>
            <p class="text-white/50 mb-10 max-w-sm mx-auto text-sm leading-relaxed">ختمة واحدة قد تكون نوراً في قبر من تحب</p>
            <button (click)="openCreateModal()" class="group inline-flex items-center gap-3 px-10 py-4 bg-white text-primary font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-[15px] shadow-xl">
              ابدأ الآن
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-[-6px] duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-brd/50 bg-surface/50 backdrop-blur-sm py-8 text-center">
      <p class="text-[10px] font-bold text-txt-muted">جميع الحقوق محفوظة © 2024</p>
    </footer>

    <!-- ═══ CREATE MODAL ═══ -->
    @if (showCreateModal) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center p-4" (click)="showCreateModal=false">
        <div class="animate-scale-in bg-surface rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-brd/70 relative overflow-hidden" (click)="$event.stopPropagation()">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/[0.04] rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-40 h-40 bg-accent/[0.04] rounded-full blur-3xl pointer-events-none"></div>

          <div class="text-center mb-8 relative z-10">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/20 rotate-3">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            </div>
            <h3 class="text-xl font-black text-txt">أنشئ ختمة جديدة</h3>
            <p class="text-[11px] text-txt-muted mt-1.5">شارك الأجر مع أحبابك</p>
          </div>

          <div class="space-y-4 relative z-10">
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسمك <span class="text-err">*</span></label><input [(ngModel)]="newKhatma.createdBy" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus focus:ring-4 focus:ring-primary/10 p-3.5 text-sm outline-none transition-all" placeholder="اكتب اسمك"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">عنوان الختمة <span class="text-err">*</span></label><input [(ngModel)]="newKhatma.title" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus focus:ring-4 focus:ring-primary/10 p-3.5 text-sm outline-none transition-all" placeholder="مثال: ختمة العائلة"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسم المتوفى <span class="text-txt-muted font-normal">(اختياري)</span></label><input [(ngModel)]="newKhatma.deceasedName" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus focus:ring-4 focus:ring-primary/10 p-3.5 text-sm outline-none transition-all" placeholder="رحمه/ا الله"></div>
            @if (newKhatma.deceasedName) {
              <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">تاريخ الوفاة <span class="text-txt-muted font-normal">(اختياري)</span></label><input type="date" [(ngModel)]="deceasedDeathDateStr" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus focus:ring-4 focus:ring-primary/10 p-3.5 text-sm outline-none transition-all"></div>
            }
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">وصف <span class="text-err">*</span></label><textarea [(ngModel)]="newKhatma.description" rows="2" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus focus:ring-4 focus:ring-primary/10 p-3.5 text-sm outline-none transition-all resize-none" placeholder="وصف مختصر..."></textarea></div>
          </div>

          <div class="mt-8 flex gap-3 relative z-10">
            <button (click)="showCreateModal=false" class="flex-1 py-3.5 text-txt-muted bg-surface-el border border-brd rounded-xl font-bold text-xs hover:bg-bg transition-colors">إلغاء</button>
            <button (click)="createKhatma()" [disabled]="!canCreate" class="flex-[2] py-3.5 text-white bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-xs disabled:opacity-40 transition-all shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]">إنشاء ✨</button>
          </div>
        </div>
      </div>
    }

    <!-- Toast -->
    @if (copiedToast) {<div class="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-ok text-white text-xs font-bold rounded-2xl shadow-xl animate-fade-up">✅ تم نسخ الرابط</div>}
  `,
})
export class HomeComponent {
  private khatmaService = inject(KhatmaService);
  private router = inject(Router);

  searchQuery = '';
  showCreateModal = false;
  copiedToast = false;
  newKhatma = { title: '', createdBy: '', deceasedName: '', description: '' };
  deceasedDeathDateStr = '';

  steps = [
    { num: '١', title: 'أنشئ الختمة', desc: 'اكتب اسمك واسم المتوفى وأنشئ ختمة من 30 جزء بنقرة واحدة' },
    { num: '٢', title: 'شارك الرابط', desc: 'ادعُ العائلة والأصدقاء عبر واتساب أو أي منصة تواصل' },
    { num: '٣', title: 'يصل الأجر', desc: 'كل جزء يُقرأ يصل ثوابه للمتوفى بإذن الله تعالى' },
  ];

  get statsData() {
    return [
      { value: this.totalKhatmas, label: 'ختمة جارية', color: 'text-primary', delay: '0ms' },
      { value: this.totalCompleted, label: 'جزء مكتمل', color: 'text-txt', delay: '100ms' },
      { value: this.totalParticipants, label: 'مشارك', color: 'text-accent', delay: '200ms' },
    ];
  }

  get hasNoKhatmas() { return this.khatmaService.khatmas().length === 0; }
  get totalKhatmas() { return this.khatmaService.khatmas().length; }
  get totalCompleted() { return this.khatmaService.khatmas().reduce((s, k) => s + k.parts.filter(p => p.status === 'completed').length, 0); }
  get totalParticipants() {
    const n = new Set<string>();
    this.khatmaService.khatmas().forEach(k => k.parts.forEach(p => { if (p.completedBy) n.add(p.completedBy); if (p.reservedBy) n.add(p.reservedBy); }));
    return n.size;
  }
  get filteredKhatmas() {
    const all = this.khatmaService.khatmas();
    if (!this.searchQuery.trim()) return all;
    const q = this.searchQuery.trim().toLowerCase();
    return all.filter(k => k.title.toLowerCase().includes(q) || (k.deceasedName && k.deceasedName.toLowerCase().includes(q)) || k.createdBy.toLowerCase().includes(q));
  }
  get canCreate() { return this.newKhatma.title.trim() && this.newKhatma.createdBy.trim() && this.newKhatma.description.trim(); }
  getCompletedParts(k: any) { return k.parts.filter((p: any) => p.status === 'completed').length; }

  openCreateModal() {
    this.newKhatma = { title: '', createdBy: '', deceasedName: '', description: '' };
    this.deceasedDeathDateStr = '';
    this.showCreateModal = true;
  }
  createKhatma() {
    if (!this.canCreate) return;
    const deathDate = this.deceasedDeathDateStr ? new Date(this.deceasedDeathDateStr) : undefined;
    const id = this.khatmaService.addKhatma(
      this.newKhatma.title,
      this.newKhatma.createdBy,
      this.newKhatma.deceasedName,
      this.newKhatma.description,
      deathDate
    );
    this.showCreateModal = false;
    this.router.navigate(['/khatmat', id]);
  }
  shareKhatmaWhatsApp(k: any) {
    let t = `📖 شارك معنا في ختمة "${k.title}"`;
    if (k.deceasedName) t += `\n🕊️ عن: ${k.deceasedName}`;
    t += `\n📊 التقدم: ${k.progress}%\n\nاحجز جزء:\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
  }
  copyKhatmaLink(k: any) {
    navigator.clipboard.writeText(`${location.origin}/#/khatmat/${k.id}`).then(() => { this.copiedToast = true; setTimeout(() => this.copiedToast = false, 2000); });
  }

  getDaysToAnniversary(date: Date): number {
    const deathDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextAnniversary = new Date(deathDate);
    nextAnniversary.setFullYear(today.getFullYear());
    nextAnniversary.setHours(0, 0, 0, 0);

    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextAnniversary.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

