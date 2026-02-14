import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';
import { CreateKhatmaModalComponent } from '../../components/create-khatma-modal/create-khatma-modal.component';
import { KhatmaCardComponent } from '../../components/khatma-card/khatma-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CreateKhatmaModalComponent, KhatmaCardComponent],
  template: `
    <section class="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-24 pb-20">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/[0.08] to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute top-[15%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.06] bg-accent animate-drift pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05] bg-primary animate-drift pointer-events-none" style="animation-delay:-5s"></div>
      <div class="absolute inset-0 islamic-pattern-dense opacity-[0.03] dark:opacity-[0.015] pointer-events-none mix-blend-overlay"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div class="lg:col-span-7 text-center lg:text-right order-2 lg:order-1 flex flex-col items-center lg:items-start">
            
            <div class="animate-fade-up inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-accent/20 bg-surface/50 backdrop-blur-md shadow-sm mb-8">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span class="text-accent text-[13px] font-bold tracking-wide">صدقة جارية للمتوفى</span>
            </div>

            <h1 class="animate-hero text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] font-black leading-[1.15] text-txt mb-6 tracking-tight">
              اختم القرآن
              <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient bg-[length:200%_auto]">
                لمن تحب
              </span>
            </h1>

            <p class="animate-fade-up delay-200 text-txt-secondary text-base md:text-lg leading-[2.2] max-w-xl mb-12 font-medium">
              أنشئ ختمة قرآنية جماعية وأهدِ ثوابها لروح من فقدت.
              <br class="hidden md:block"/>
              مساحة طاهرة تجمع عائلتك وأصدقاءك على تلاوة كتاب الله بكل يسر.
            </p>

            <div class="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button (click)="showCreateModal.set(true)" aria-label="إنشاء ختمة جديدة" class="group relative inline-flex items-center justify-center gap-4 px-9 py-4.5 rounded-full bg-txt text-surface font-bold text-base shadow-[0_8px_30px_rgb(var(--txt-rgb),0.2)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(var(--txt-rgb),0.3)] overflow-hidden">
                <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <span class="relative z-10">أنشئ ختمة جديدة</span>
                <svg class="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1 duration-500 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
              </button>

              <a routerLink="/duas" aria-label="أدعية للمتوفى" class="group inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-full bg-surface/80 border border-brd backdrop-blur-sm shadow-sm text-txt hover:text-primary hover:border-primary/30 font-bold text-base transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                <svg class="w-5 h-5 transition-transform group-hover:scale-110 duration-500 text-txt-muted group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>
                أدعية للمتوفى
              </a>
            </div>
          </div>

          <div class="lg:col-span-5 order-1 lg:order-2 flex justify-center animate-scale-in delay-200">
            <div class="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
              <div class="absolute inset-0 rounded-full border-[1px] border-primary/20 animate-spin-slow" style="animation-duration: 40s;"></div>
              <div class="absolute inset-8 rounded-full border-[1px] border-dashed border-accent/30 animate-spin-slow" style="animation-direction: reverse; animation-duration: 30s;"></div>
              
              <div class="absolute inset-16 rounded-full bg-surface/70 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(var(--primary-rgb),0.15)] flex flex-col items-center justify-center text-center p-6 transform transition-transform hover:scale-105 duration-700 group overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div class="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <svg class="w-8 h-8 text-primary group-hover:animate-float-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                </div>
                <span class="relative z-10 text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-txt to-txt-muted tracking-tighter drop-shadow-sm">30</span>
                <span class="relative z-10 text-primary text-sm font-bold mt-2 tracking-wide uppercase">جزءاً نورانياً</span>
              </div>

              <div class="absolute top-6 right-12 animate-float" style="animation-delay: -1s;">
                <div class="w-12 h-12 rounded-2xl bg-surface/90 backdrop-blur-xl shadow-xl border border-brd/50 flex items-center justify-center text-primary rotate-12">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                </div>
              </div>
              <div class="absolute bottom-12 left-6 animate-float" style="animation-delay: -3s;">
                <div class="w-10 h-10 rounded-[1rem] bg-surface/90 backdrop-blur-xl shadow-xl border border-brd/50 flex items-center justify-center text-accent -rotate-12">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="relative z-20 max-w-5xl mx-auto px-6 -mt-10 md:-mt-16 mb-24 animate-fade-up delay-500">
      <div class="bg-surface/80 backdrop-blur-3xl rounded-[2.5rem] border border-brd/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] p-8 md:p-10">
        <div class="grid grid-cols-3 gap-4 md:gap-8 text-center divide-x divide-x-reverse divide-brd/40">
          @for (stat of statsData(); track stat.label) {
            <div class="animate-count group flex flex-col items-center justify-center" [style.animation-delay]="stat.delay">
              <div class="text-3xl md:text-5xl font-black mb-2 transition-transform duration-500 group-hover:scale-110" [class]="stat.color">{{stat.value || '—'}}</div>
              <div class="text-[11px] md:text-sm text-txt-muted font-bold uppercase tracking-widest">{{stat.label}}</div>
            </div>
          }
        </div>
      </div>
    </div>

    <section class="animate-fade-up py-20 relative overflow-hidden flex justify-center border-y border-brd/30 bg-surface/30">
      <div class="relative max-w-4xl mx-auto px-6 text-center">
        <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-primary/[0.02] -z-10 rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
        
        <p class="relative z-10 text-2xl md:text-4xl font-quran leading-[2.2] md:leading-[2.4] text-txt mb-10 text-balance">
          « إذا مات ابن آدم انقطع عمله إلا من ثلاث:
          <span class="text-primary font-bold px-2 relative inline-block">
            <span class="relative z-10">صدقة جارية</span>
            <span class="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -rotate-2 z-0 rounded-full"></span>
          </span>،
          أو علم يُنتفع به، أو ولد صالح يدعو له »
        </p>
        
        <div class="relative z-10 inline-flex items-center justify-center gap-4 px-8 py-3 rounded-full bg-surface border border-brd shadow-sm">
          <div class="w-8 h-[1px] bg-brd"></div>
          <span class="text-txt-muted text-sm font-bold tracking-widest">رواه مسلم</span>
          <div class="w-8 h-[1px] bg-brd"></div>
        </div>
      </div>
    </section>

    <section class="py-32 relative">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-20 flex flex-col items-center">
          <span class="text-primary text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 bg-primary/5 rounded-full">الخطوات</span>
          <h2 class="text-3xl md:text-5xl font-black text-txt tracking-tight text-balance">طريق يسير <span class="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">للأجر</span></h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          <div class="hidden md:block absolute top-[4rem] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-brd to-transparent z-0"></div>

          @for (step of steps; track step.num; let i = $index) {
            <div class="relative z-10 group">
              <div class="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-surface/50 border border-transparent hover:border-brd hover:bg-surface hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 h-full">
                <div class="w-20 h-20 mb-8 rounded-full bg-surface border border-brd flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 relative">
                  <div class="absolute inset-0 rounded-full border border-primary/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></div>
                  <span class="text-3xl font-black text-txt-muted group-hover:text-white transition-colors duration-500">{{step.num}}</span>
                </div>
                
                <h3 class="text-xl font-bold text-txt mb-4">{{step.title}}</h3>
                <p class="text-base text-txt-secondary leading-relaxed font-medium max-w-[260px] mx-auto">{{step.desc}}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="py-24 relative overflow-hidden bg-surface/30 border-y border-brd/30">
      <div class="relative max-w-7xl mx-auto px-6">
        
        <div class="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div class="text-center md:text-right w-full md:w-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/10 text-red-500 text-[11px] font-bold mb-4 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              مباشر الآن
            </div>
            <h2 class="text-3xl md:text-4xl font-black text-txt mb-2">الختمات الجارية</h2>
            <p class="text-txt-secondary text-base">ساهم في قراءة الأجزاء وشاركهم الأجر</p>
          </div>
          
          <div class="w-full md:w-[450px] relative group">
            <div class="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
              <svg class="w-5 h-5 text-txt-muted group-focus-within:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.3-4.3"/></svg>
            </div>
            <input [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" type="text" placeholder="البحث باسم المتوفى أو الختمة..." class="w-full pr-14 pl-6 py-5 bg-surface border border-brd rounded-full text-txt text-base outline-none placeholder:text-txt-muted/70 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm hover:shadow-md"/>
          </div>
        </div>

        @if (filteredKhatmas().length > 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (k of filteredKhatmas(); track k.id) {
              <div class="transform transition-all duration-500 hover:-translate-y-2">
                <app-khatma-card [khatma]="k"></app-khatma-card>
              </div>
            }
          </div>
          <div class="mt-16 text-center">
            <a routerLink="/khatmat" class="inline-flex items-center justify-center gap-3 px-10 py-4.5 rounded-full border border-brd bg-surface hover:bg-surface-hover hover:border-primary/40 text-txt hover:text-primary transition-all shadow-sm group font-bold text-lg">
              عرض كل الختمات
              <svg class="w-5 h-5 rtl:rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            </a>
          </div>
        } @else if (hasNoKhatmas()) {
          <div class="text-center py-28 px-6 bg-surface/80 backdrop-blur-md rounded-[3rem] border border-dashed border-brd/80 max-w-3xl mx-auto shadow-sm">
            <div class="w-24 h-24 bg-surface border border-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg class="w-10 h-10 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
            </div>
            <h3 class="text-3xl font-bold text-txt mb-4">لا توجد ختمات جارية</h3>
            <p class="text-txt-secondary text-lg mb-10 max-w-md mx-auto leading-relaxed">كن أول من يفتح باباً للأجر والخير. أنشئ ختمة الآن وشاركها مع من تحب.</p>
            <button (click)="showCreateModal.set(true)" class="px-10 py-4.5 bg-txt text-surface font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform duration-300">إنشاء أول ختمة</button>
          </div>
        } @else {
          <div class="text-center py-24 bg-surface/50 rounded-[3rem] border border-brd">
            <p class="text-txt-muted text-xl">لم نعثر على نتائج مطابقة لبحثك عن <span class="text-txt font-bold">"{{searchQuery()}}"</span></p>
          </div>
        }
      </div>
    </section>

    <section class="py-32 overflow-hidden relative">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-3xl md:text-5xl font-black text-txt tracking-tight mb-4">أبواب أخرى <span class="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">للخير</span></h2>
          <p class="text-txt-secondary text-lg">أدوات إسلامية تعينك على الذكر وتلاوة القرآن.</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
          <a routerLink="/coach" class="group relative bg-surface p-10 md:p-12 rounded-[2.5rem] rounded-tl-[6rem] border border-brd shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(var(--info-rgb),0.15)] hover:border-info/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-8">
            <div class="absolute top-0 right-0 w-64 h-64 bg-info/[0.03] rounded-full blur-[60px] group-hover:bg-info/[0.08] transition-colors duration-700 pointer-events-none"></div>
            <div class="w-20 h-20 rounded-[1.5rem] bg-info/[0.05] border border-info/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-info group-hover:text-white transition-all duration-500 relative z-10 text-info">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
            </div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-txt group-hover:text-info transition-colors mb-3">المصحح الذكي</h3>
              <p class="text-base text-txt-secondary leading-relaxed font-medium">قيّم تلاوتك وصحح أخطاءك فورياً باستخدام أحدث تقنيات الذكاء الاصطناعي لتحسين التجويد.</p>
            </div>
          </a>

          <a routerLink="/duas" class="group relative bg-surface p-10 md:p-12 rounded-[2.5rem] rounded-br-[6rem] border border-brd shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(var(--accent-rgb),0.15)] hover:border-accent/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-8">
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-accent/[0.03] rounded-full blur-[60px] group-hover:bg-accent/[0.08] transition-colors duration-700 pointer-events-none"></div>
            <div class="w-20 h-20 rounded-[1.5rem] bg-accent/[0.05] border border-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 relative z-10 text-accent">
              <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-txt group-hover:text-accent transition-colors mb-3">أدعية مأثورة</h3>
              <p class="text-base text-txt-secondary leading-relaxed font-medium">مكتبة شاملة ومنتقاة من الأدعية النبوية والقرآنية للدعاء للمتوفى ولنفسك.</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 pb-32">
      <div class="max-w-5xl mx-auto">
        <div class="relative rounded-[4rem] overflow-hidden shadow-2xl">
          <div class="absolute inset-0 bg-txt"></div>
          
          <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div class="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div class="absolute inset-0 islamic-pattern-dense opacity-5 mix-blend-overlay pointer-events-none"></div>

          <div class="relative z-10 p-16 md:p-24 flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-[2rem] bg-surface/10 flex items-center justify-center mb-10 backdrop-blur-md border border-surface/20 shadow-inner">
              <svg class="w-12 h-12 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
            </div>
            
            <h2 class="text-4xl md:text-5xl lg:text-7xl font-black text-surface mb-8 leading-tight text-balance">
              اجعل لهم نصيباً من الأجر
            </h2>
            <p class="text-surface/70 mb-14 max-w-2xl mx-auto text-xl leading-relaxed font-light text-balance">
              ختمة واحدة قد تكون نوراً يضيء لهم في قبورهم، وصدقة جارية يمتد أثرها بإذن الله.
            </p>
            
            <button (click)="showCreateModal.set(true)" class="group relative inline-flex items-center gap-4 px-12 py-6 bg-surface text-txt font-black rounded-full hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all duration-500 hover:scale-105 text-lg overflow-hidden">
              <span class="relative z-10">ابدأ إنشاء الختمة الآن</span>
              <svg class="w-6 h-6 relative z-10 transition-transform group-hover:-translate-x-1 duration-500 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-brd/40 bg-surface/50 backdrop-blur-xl py-12 mt-auto text-center">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-2 mb-2">
           <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
           <span class="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
           <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
        </div>
        <p class="text-sm font-bold text-txt-muted tracking-widest uppercase">منصة ختمة © {{ currentYear }} — جميع الحقوق محفوظة</p>
      </div>
    </footer>

    @if (showCreateModal()) {
      <app-create-khatma-modal (close)="showCreateModal.set(false)" (created)="onKhatmaCreated($event)"></app-create-khatma-modal>
    }
  `,
})
export class HomeComponent {
  private khatmaService = inject(KhatmaService);
  private router = inject(Router);

  searchQuery = signal('');
  showCreateModal = signal(false);
  currentYear = new Date().getFullYear();

  steps = [
    { num: '١', title: 'أنشئ الختمة', desc: 'أدخل اسم المتوفى وأنشئ ختمة مقسمة إلى 30 جزءاً بثوانٍ معدودة وبخطوة واحدة.' },
    { num: '٢', title: 'شارك الرابط', desc: 'انسخ رابط الختمة وأرسله لعائلتك وأصدقائك عبر الواتساب للمشاركة في التلاوة.' },
    { num: '٣', title: 'يصل الأجر', desc: 'يتشارك الجميع قراءة الأجزاء ليتموا الختمة ويهدوا ثوابها، ويبقى لك أجر الدلالة.' },
  ];

  statsData = computed(() => {
    const khatmas = this.khatmaService.khatmas();
    const totalKhatmas = khatmas.length;
    const totalCompleted = khatmas.reduce((s, k) => s + k.parts.filter(p => p.status === 'completed').length, 0);
    const participants = new Set<string>();
    
    khatmas.forEach(k => k.parts.forEach(p => { 
      if (p.completedBy) participants.add(p.completedBy); 
      if (p.reservedBy) participants.add(p.reservedBy); 
    }));
    
    const totalParticipants = participants.size;

    return [
      { value: totalKhatmas, label: 'ختمة جارية', color: 'text-primary', delay: '0ms' },
      { value: totalCompleted, label: 'جزء مقروء', color: 'text-txt', delay: '100ms' },
      { value: totalParticipants, label: 'مشارك بالأجر', color: 'text-accent', delay: '200ms' },
    ];
  });

  hasNoKhatmas = computed(() => this.khatmaService.khatmas().length === 0);

  filteredKhatmas = computed(() => {
    const all = this.khatmaService.khatmas();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return all;
    return all.filter(k => 
      k.title.toLowerCase().includes(query) || 
      (k.deceasedName && k.deceasedName.toLowerCase().includes(query)) || 
      k.createdBy.toLowerCase().includes(query)
    );
  });

  onKhatmaCreated(id: string) {
    this.router.navigate(['/khatmat', id]);
  }
}
