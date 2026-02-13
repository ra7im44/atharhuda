import { Component, inject, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KhatmaService } from '../../../services/khatma.service';
import { GeminiService } from '../../../services/gemini.service';
import { forkJoin } from 'rxjs';

interface CoachMessage {
  id: number;
  role: 'user' | 'ai';
  loading?: boolean;
  error?: string;
  result?: {
    transcription: string;
    surah?: string;
    verses?: string;
    score: number;
    mistakes: { type: string; word: string; description: string }[];
    feedback: string;
  };
}

@Component({
  selector: 'app-juz-reader',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen relative overflow-hidden" dir="rtl">
      <!-- Ambient -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px] animate-drift"></div>
        <div class="absolute bottom-[-10%] left-[-8%] w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px] animate-drift" style="animation-delay:-5s"></div>
      </div>
      <div class="absolute inset-0 islamic-pattern-dense opacity-10 dark:opacity-[0.02] pointer-events-none"></div>

      <!-- ═══ MAIN LAYOUT: Quran + Coach Side ═══ -->
      <div class="relative flex" [class.gap-0]="!coachOpen()" [class.gap-4]="coachOpen()">

        <!-- ═══ QURAN CONTENT (Scrollable) ═══ -->
        <div class="flex-1 min-w-0 pb-20 transition-all duration-500" [class.lg:pr-0]="!coachOpen()">
          <div class="max-w-4xl mx-auto px-4 md:px-8 py-10" [class.max-w-4xl]="!coachOpen()" [class.max-w-3xl]="coachOpen()">

            <!-- Header -->
            <div class="flex items-center justify-between mb-8 animate-fade-down">
              <div class="flex items-center gap-4">
                @if (khatmaId) {
                  <a [routerLink]="['/khatmat', khatmaId]" class="w-10 h-10 rounded-xl bg-surface border border-brd flex items-center justify-center text-txt-muted hover:text-primary hover:border-primary/30 transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </a>
                } @else {
                  <a routerLink="/" class="w-10 h-10 rounded-xl bg-surface border border-brd flex items-center justify-center text-txt-muted hover:text-primary hover:border-primary/30 transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </a>
                }
                <div>
                  <h1 class="text-lg md:text-xl font-black text-txt">الجزء رقم {{juzNumber}}</h1>
                  <p class="text-[10px] text-txt-muted">{{totalAyahs()}} آية</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="showTranslation.set(!showTranslation())" class="h-9 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all" [ngClass]="showTranslation() ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface border-brd text-txt-muted hover:text-primary hover:border-primary/30'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/></svg>
                  ترجمة
                </button>
                <button (click)="decreaseFontSize()" class="w-9 h-9 rounded-xl bg-surface border border-brd text-txt-muted hover:text-primary hover:border-primary/30 flex items-center justify-center text-sm font-bold transition-all">أ-</button>
                <button (click)="increaseFontSize()" class="w-9 h-9 rounded-xl bg-surface border border-brd text-txt-muted hover:text-primary hover:border-primary/30 flex items-center justify-center text-sm font-bold transition-all">أ+</button>
              </div>
            </div>

            <!-- Loading -->
            @if (loading()) {
              <div class="text-center py-32 animate-scale-in">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-5">
                  <svg class="w-7 h-7 text-primary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                </div>
                <p class="text-sm text-txt-muted font-bold">جارٍ تحميل الآيات...</p>
              </div>
            }

            <!-- Error -->
            @if (error()) {
              <div class="text-center py-20 animate-scale-in">
                <div class="w-16 h-16 rounded-2xl bg-err/10 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-7 h-7 text-err" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                </div>
                <p class="text-sm text-err font-bold mb-4">{{error()}}</p>
                <button (click)="loadJuz()" class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all">إعادة المحاولة</button>
              </div>
            }

            <!-- Surahs -->
            @if (!loading() && !error()) {
              <div class="space-y-8">
                @for (surah of surahs(); track surah.number) {
                  <div class="bg-surface rounded-[2rem] border border-brd/70 overflow-hidden shadow-lg animate-fade-up" [style.animation-delay]="(surah.number * 30) + 'ms'">
                    <div class="surah-header text-center py-6 px-4">
                      <div class="inline-flex items-center gap-3 mb-3">
                        <div class="w-8 h-[1.5px] bg-accent/30 rounded-full"></div>
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/[0.08] to-accent/[0.08] flex items-center justify-center text-sm font-black text-primary">{{surah.number}}</div>
                        <div class="w-8 h-[1.5px] bg-accent/30 rounded-full"></div>
                      </div>
                      <h2 class="text-xl font-quran font-bold text-txt mb-1">سورة {{surah.name}}</h2>
                      <span class="text-[10px] text-txt-muted font-bold">{{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}} — {{surah.ayahs.length}} آية</span>
                    </div>
                    @if (surah.number !== 1 && surah.number !== 9) {
                      <div class="basmalah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                    }
                    <div class="p-6 md:p-8">
                      @if (!showTranslation()) {
                        <p class="quran-text" [style.font-size.rem]="fontSize()">
                          @for (ayah of surah.ayahs; track ayah.numberInSurah) {
                            <span class="hover:bg-primary/[0.04] rounded-lg px-1 py-0.5 transition-colors cursor-default">{{ayah.text}}</span>
                            <span class="ayah-number mx-1.5">{{ayah.numberInSurah}}</span>
                          }
                        </p>
                      } @else {
                        <div class="space-y-5">
                          @for (ayah of surah.ayahs; track ayah.numberInSurah) {
                            <div class="group rounded-2xl border border-brd/40 hover:border-primary/20 transition-colors overflow-hidden">
                              <div class="px-5 py-4 bg-surface-el/30">
                                <div class="flex items-start justify-between gap-3">
                                  <p class="quran-text flex-1" [style.font-size.rem]="fontSize()">{{ayah.text}}</p>
                                  <span class="ayah-number flex-shrink-0 mt-1">{{ayah.numberInSurah}}</span>
                                </div>
                              </div>
                              @if (ayah.translation) {
                                <div class="px-5 py-3 border-t border-brd/30 bg-primary/[0.02]">
                                  <p class="text-sm text-txt-muted leading-relaxed" dir="ltr" style="font-family: 'Inter', sans-serif;">{{ayah.translation}}</p>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Navigation -->
              <div class="mt-10 flex items-center justify-between">
                @if (juzNumber > 1) {
                  <a [routerLink]="['/quran/juz', juzNumber - 1]" [queryParams]="khatmaId ? {khatmaId: khatmaId} : {}" class="inline-flex items-center gap-2 px-5 py-3 bg-surface border border-brd rounded-xl text-sm font-bold text-txt-muted hover:text-primary hover:border-primary/30 transition-all">
                    الجزء السابق
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </a>
                } @else { <div></div> }
                @if (juzNumber < 30) {
                  <a [routerLink]="['/quran/juz', juzNumber + 1]" [queryParams]="khatmaId ? {khatmaId: khatmaId} : {}" class="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
                    <svg class="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    الجزء التالي
                  </a>
                } @else { <div></div> }
              </div>

              @if (khatmaId) {
                <div class="mt-8 text-center">
                  <button (click)="markComplete()" class="inline-flex items-center gap-2 px-8 py-4 bg-ok text-white font-bold rounded-2xl text-sm hover:shadow-xl hover:shadow-ok/25 transition-all hover:scale-[1.03] shadow-lg shadow-ok/15">
                    ✅ أكملت قراءة هذا الجزء
                  </button>
                </div>
              }
            }
          </div>
        </div>

        <!-- ═══ AI COACH SIDEBAR (Desktop: fixed right, Mobile: bottom sheet) ═══ -->

        <!-- Desktop Sidebar -->
        @if (coachOpen()) {
          <div class="hidden lg:flex flex-col w-[380px] flex-shrink-0 fixed top-[72px] left-0 bottom-0 z-40 animate-slide-in-left">
            <div class="flex flex-col h-full bg-surface/95 backdrop-blur-2xl border-r-2 border-info/20 shadow-[10px_0_60px_rgba(0,0,0,0.08)]">

              <!-- Panel Header -->
              <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-l from-info/[0.06] to-primary/[0.06] border-b border-brd/40 flex-shrink-0">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-info to-primary flex items-center justify-center shadow-lg shadow-info/20">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-black text-txt">المساعد الذكي</h3>
                    <p class="text-[9px] text-txt-muted">سجّل وسيصححك الذكاء الاصطناعي</p>
                  </div>
                </div>
                <button (click)="coachOpen.set(false)" class="w-8 h-8 rounded-lg bg-surface-el border border-brd flex items-center justify-center text-txt-muted hover:text-err hover:border-err/30 transition-all">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Chat Messages -->
              <div class="flex-1 overflow-y-auto p-4 space-y-4" #coachChat>
                @if (coachMessages().length === 0) {
                  <div class="text-center py-10">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-info/10 to-primary/10 flex items-center justify-center mx-auto mb-4 animate-float-slow">
                      <svg class="w-7 h-7 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                    </div>
                    <h4 class="text-sm font-bold text-txt mb-1">ابدأ القراءة بصوتك</h4>
                    <p class="text-xs text-txt-muted leading-relaxed max-w-[260px] mx-auto">اضغط على زر التسجيل واقرأ من الآيات — المساعد الذكي يصحح لك ويقدم نصائح</p>
                    <div class="mt-5 grid grid-cols-3 gap-3 max-w-[220px] mx-auto">
                      <div class="p-2 bg-surface-el rounded-xl border border-brd/50 text-center">
                        <div class="text-base mb-0.5">🎤</div>
                        <span class="text-[8px] text-txt-muted font-bold">سجّل</span>
                      </div>
                      <div class="p-2 bg-surface-el rounded-xl border border-brd/50 text-center">
                        <div class="text-base mb-0.5">🤖</div>
                        <span class="text-[8px] text-txt-muted font-bold">تصحيح</span>
                      </div>
                      <div class="p-2 bg-surface-el rounded-xl border border-brd/50 text-center">
                        <div class="text-base mb-0.5">💡</div>
                        <span class="text-[8px] text-txt-muted font-bold">نصائح</span>
                      </div>
                    </div>
                  </div>
                }

                <!-- Messages -->
                @for (msg of coachMessages(); track msg.id) {
                  @if (msg.role === 'user') {
                    <div class="flex justify-start animate-slide-in-right">
                      <div class="max-w-[90%] bg-gradient-to-r from-primary to-secondary text-white rounded-[1.25rem] rounded-tr-lg p-4 shadow-lg shadow-primary/15">
                        <div class="flex items-center gap-2 mb-1">
                          <div class="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg></div>
                          <span class="text-[9px] font-bold text-white/70">تسجيل صوتي</span>
                        </div>
                        <div class="flex items-center gap-2"><div class="flex gap-0.5">@for(b of [1,2,3,4,5,6,7,8]; track b) {<div class="w-1 bg-white/40 rounded-full" [style.height.px]="5 + (b % 3) * 5"></div>}</div><span class="text-[9px] text-white/50">تم الإرسال</span></div>
                      </div>
                    </div>
                  }

                  @if (msg.role === 'ai') {
                    <div class="flex justify-end animate-fade-up">
                      <div class="max-w-full">
                        @if (msg.loading) {
                          <div class="bg-surface-el rounded-[1.25rem] rounded-tl-lg p-4 border border-brd/70 shadow-md">
                            <div class="flex items-center gap-3">
                              <div class="w-7 h-7 rounded-lg bg-info/10 flex items-center justify-center"><svg class="w-3.5 h-3.5 text-info animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg></div>
                              <div>
                                <span class="text-xs font-bold text-txt">يستمع ويحلل...</span>
                                <div class="flex gap-1 mt-1">@for(d of [1,2,3]; track d) {<div class="w-1.5 h-1.5 rounded-full bg-info animate-bounce-slow" [style.animation-delay]="(d * 200) + 'ms'"></div>}</div>
                              </div>
                            </div>
                          </div>
                        } @else if (msg.error) {
                          <div class="bg-err/[0.06] border border-err/20 rounded-[1.25rem] rounded-tl-lg p-4">
                            <div class="flex items-center gap-2 text-err text-xs font-bold"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg> {{msg.error}}</div>
                          </div>
                        } @else if (msg.result) {
                          <div class="bg-surface-el rounded-[1.25rem] rounded-tl-lg border border-brd/70 overflow-hidden shadow-lg">
                            <div class="p-3 bg-gradient-to-l from-primary/[0.04] to-accent/[0.04] border-b border-brd/40">
                              <div class="flex items-center justify-between">
                                <div>
                                  <span class="text-[9px] text-txt-muted font-bold uppercase tracking-wider">التقييم</span>
                                  @if (msg.result.surah) {<p class="text-[11px] text-primary font-bold mt-0.5">{{msg.result.surah}} {{msg.result.verses ? '(' + msg.result.verses + ')' : ''}}</p>}
                                </div>
                                <div class="w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2"
                                     [ngClass]="{
                                       'bg-ok/[0.08] border-ok/20 text-ok': msg.result.score >= 80,
                                       'bg-warn/[0.08] border-warn/20 text-warn': msg.result.score >= 50 && msg.result.score < 80,
                                       'bg-err/[0.08] border-err/20 text-err': msg.result.score < 50
                                     }">
                                  <span class="text-base font-black leading-none">{{msg.result.score}}</span>
                                  <span class="text-[6px] font-bold mt-0.5">/ 100</span>
                                </div>
                              </div>
                            </div>
                            <div class="p-3 space-y-2.5">
                              <div><p class="text-[9px] text-txt-muted font-bold mb-1 uppercase tracking-wider">ما سمعناه</p><p class="text-sm font-quran leading-[2.2] text-txt bg-surface/80 rounded-lg p-2 border border-brd/40">{{msg.result.transcription}}</p></div>
                              @if (msg.result.mistakes.length > 0) {
                                <div>
                                  <p class="text-[9px] text-txt-muted font-bold mb-1 uppercase tracking-wider">ملاحظات ({{msg.result.mistakes.length}})</p>
                                  <div class="space-y-1.5">
                                    @for (m of msg.result.mistakes; track m.word) {
                                      <div class="flex items-start gap-2 p-2 bg-warn/[0.04] border border-warn/10 rounded-lg text-[10px]">
                                        <div class="w-4 h-4 rounded-md bg-warn/10 flex items-center justify-center flex-shrink-0 mt-0.5"><svg class="w-2.5 h-2.5 text-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg></div>
                                        <div><span class="font-bold text-warn">{{m.word}}</span><span class="text-txt-muted"> — {{m.description}}</span></div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              }
                              <div class="p-2.5 bg-gradient-to-l from-primary/[0.04] to-accent/[0.03] rounded-lg border border-primary/10">
                                <p class="text-[9px] text-primary font-bold mb-0.5 uppercase tracking-wider">💡 نصيحة</p>
                                <p class="text-[10px] text-txt leading-relaxed">{{msg.result.feedback}}</p>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                }
              </div>

              <!-- Recording Controls -->
              <div class="px-5 py-4 border-t border-brd/40 bg-surface-el/30 flex-shrink-0">
                <div class="flex items-center justify-center">
                  @if (!isRecording()) {
                    <button (click)="startRecording()" class="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-info to-primary text-white rounded-2xl shadow-xl shadow-info/20 hover:shadow-2xl hover:shadow-info/35 hover:scale-105 transition-all duration-300 w-full justify-center">
                      <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                      </div>
                      <span class="text-xs font-black">🎤 سجّل تلاوتك</span>
                    </button>
                  } @else {
                    <button (click)="stopRecording()" class="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-err to-err/80 text-white rounded-2xl shadow-xl shadow-err/20 animate-pulse-glow hover:scale-105 transition-all w-full justify-center">
                      <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"/></svg>
                      </div>
                      <div>
                        <span class="text-xs font-black block">⏹ إيقاف</span>
                        <div class="flex gap-0.5 mt-0.5">@for(b of [1,2,3,4,5,6,7,8]; track b) {<div class="w-1 bg-white/50 rounded-full animate-bounce-slow" [style.height.px]="3 + (b % 4) * 4" [style.animation-delay]="(b * 60) + 'ms'"></div>}</div>
                      </div>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Bottom Sheet -->
          <div class="lg:hidden fixed inset-x-0 bottom-0 z-50 animate-slide-up">
            <div class="max-w-lg mx-auto">
              <div class="bg-surface/95 backdrop-blur-2xl border-t-2 border-info/30 rounded-t-[2rem] shadow-[0_-10px_60px_rgba(0,0,0,0.15)] overflow-hidden">
                <div class="flex items-center justify-between px-5 py-3 bg-gradient-to-l from-info/[0.06] to-primary/[0.06] border-b border-brd/40">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-info to-primary flex items-center justify-center shadow-md shadow-info/20">
                      <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                    </div>
                    <span class="text-xs font-black text-txt">المساعد الذكي</span>
                  </div>
                  <button (click)="coachOpen.set(false)" class="w-7 h-7 rounded-lg bg-surface-el border border-brd flex items-center justify-center text-txt-muted hover:text-err transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="max-h-[45vh] overflow-y-auto p-4 space-y-3" #coachChatMobile>
                  @if (coachMessages().length === 0) {
                    <div class="text-center py-6">
                      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-info/10 to-primary/10 flex items-center justify-center mx-auto mb-3 animate-float-slow">
                        <svg class="w-6 h-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                      </div>
                      <p class="text-xs text-txt-muted leading-relaxed">اضغط على زر التسجيل واقرأ — المساعد يصحح لك</p>
                    </div>
                  }
                  @for (msg of coachMessages(); track msg.id) {
                    @if (msg.role === 'user') {
                      <div class="flex justify-start">
                        <div class="max-w-[85%] bg-gradient-to-r from-primary to-secondary text-white rounded-[1.25rem] rounded-tr-lg p-3 shadow-lg shadow-primary/15">
                          <div class="flex items-center gap-2"><div class="flex gap-0.5">@for(b of [1,2,3,4,5,6]; track b) {<div class="w-1 bg-white/40 rounded-full" [style.height.px]="5 + (b % 3) * 4"></div>}</div><span class="text-[8px] text-white/50">تسجيل صوتي</span></div>
                        </div>
                      </div>
                    }
                    @if (msg.role === 'ai') {
                      <div class="flex justify-end">
                        <div class="max-w-[95%]">
                          @if (msg.loading) {
                            <div class="bg-surface-el rounded-xl p-3 border border-brd/70"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-lg bg-info/10 flex items-center justify-center"><svg class="w-3 h-3 text-info animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg></div><span class="text-[11px] font-bold text-txt">يحلل...</span></div></div>
                          } @else if (msg.error) {
                            <div class="bg-err/[0.06] border border-err/20 rounded-xl p-3"><span class="text-err text-[11px] font-bold">{{msg.error}}</span></div>
                          } @else if (msg.result) {
                            <div class="bg-surface-el rounded-xl border border-brd/70 overflow-hidden">
                              <div class="p-3 flex items-center justify-between border-b border-brd/40">
                                <span class="text-[10px] text-primary font-bold">{{msg.result.surah || 'تقييم'}}</span>
                                <span class="text-base font-black" [ngClass]="{'text-ok': msg.result.score >= 80, 'text-warn': msg.result.score >= 50 && msg.result.score < 80, 'text-err': msg.result.score < 50}">{{msg.result.score}}/100</span>
                              </div>
                              <div class="p-3 space-y-2">
                                <p class="text-xs font-quran leading-[2] text-txt bg-surface/80 rounded-lg p-2 border border-brd/40">{{msg.result.transcription}}</p>
                                @if (msg.result.mistakes.length > 0) {
                                  @for (m of msg.result.mistakes; track m.word) {
                                    <div class="text-[10px] p-2 bg-warn/[0.04] rounded-lg border border-warn/10"><span class="font-bold text-warn">{{m.word}}</span> — <span class="text-txt-muted">{{m.description}}</span></div>
                                  }
                                }
                                <div class="p-2 bg-primary/[0.04] rounded-lg border border-primary/10"><p class="text-[10px] text-txt">💡 {{msg.result.feedback}}</p></div>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
                <div class="px-4 py-3 border-t border-brd/40 bg-surface-el/30">
                  @if (!isRecording()) {
                    <button (click)="startRecording()" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-info to-primary text-white rounded-xl shadow-lg hover:scale-[1.02] transition-all">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                      <span class="text-xs font-black">🎤 سجّل تلاوتك</span>
                    </button>
                  } @else {
                    <button (click)="stopRecording()" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-err to-err/80 text-white rounded-xl shadow-lg animate-pulse-glow transition-all">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"/></svg>
                      <span class="text-xs font-black">⏹ إيقاف التسجيل</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- ═══ FLOATING COACH BUTTON (when closed) ═══ -->
      @if (!coachOpen()) {
        <button (click)="coachOpen.set(true)" class="fixed bottom-24 md:bottom-8 left-6 z-40 group animate-fade-up">
          <div class="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-info to-primary text-white rounded-2xl shadow-2xl shadow-info/30 hover:shadow-info/50 hover:scale-105 transition-all duration-300">
            <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
            </div>
            <div class="text-right">
              <span class="text-xs font-black block">🤖 اقرأ بمساعدك الشخصي</span>
              <span class="text-[9px] text-white/70 font-medium">سجّل تلاوتك والذكاء الاصطناعي يصححك</span>
            </div>
          </div>
        </button>
      }

      <!-- Toast -->
      @if (toast()) {<div class="fixed bottom-24 md:bottom-8 right-6 z-[60] px-6 py-3 bg-ok text-white text-xs font-bold rounded-2xl shadow-xl animate-fade-up">{{toast()}}</div>}
    </div>
  `,
  styles: [`
    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    :host .animate-slide-in-left { animation: slideInLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  `],
})
export class JuzReaderComponent implements OnInit, OnDestroy {
  @ViewChild('coachChat') coachChat!: ElementRef;
  @ViewChild('coachChatMobile') coachChatMobile!: ElementRef;

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private khatmaService = inject(KhatmaService);
  private geminiService = inject(GeminiService);

  juzNumber = 1;
  khatmaId: string | null = null;

  loading = signal(true);
  error = signal<string | null>(null);
  surahs = signal<any[]>([]);
  fontSize = signal(1.75);
  toast = signal<string | null>(null);
  totalAyahs = signal(0);
  showTranslation = signal(false);

  coachOpen = signal(false);
  coachMessages = signal<CoachMessage[]>([]);
  isRecording = signal(false);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private msgId = 0;

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.juzNumber = +p['juz'] || 1;
      this.loadJuz();
    });
    this.route.queryParams.subscribe(q => {
      this.khatmaId = q['khatmaId'] || null;
    });
  }

  loadJuz() {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      juz: this.http.get<any>(`https://api.alquran.cloud/v1/juz/${this.juzNumber}/ar.alafasy`),
      en: this.http.get<any>(`https://api.alquran.cloud/v1/juz/${this.juzNumber}/en.sahih`),
      meta: this.http.get<any>('https://api.alquran.cloud/v1/meta'),
    }).subscribe({
      next: ({ juz, en, meta }) => {
        const ayahs = juz?.data?.ayahs || [];
        const enAyahs = en?.data?.ayahs || [];
        this.totalAyahs.set(ayahs.length);
        const surahMap = new Map<number, any>();
        const surahsMeta = meta?.data?.surahs?.references || [];

        const enMap = new Map<string, string>();
        for (const e of enAyahs) {
          enMap.set(`${e.surah.number}:${e.numberInSurah}`, e.text);
        }

        for (const a of ayahs) {
          const sNum = a.surah.number;
          if (!surahMap.has(sNum)) {
            surahMap.set(sNum, {
              number: sNum,
              name: a.surah.name.replace('سُورَةُ ', '').replace('سورة ', ''),
              revelationType: a.surah.revelationType,
              ayahs: [],
            });
          }
          let text = a.text;
          if (a.numberInSurah === 1 && sNum !== 1 && sNum !== 9) {
            text = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '');
          }
          const translation = enMap.get(`${sNum}:${a.numberInSurah}`) || '';
          surahMap.get(sNum).ayahs.push({ numberInSurah: a.numberInSurah, text, translation });
        }
        this.surahs.set(Array.from(surahMap.values()));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('تعذر تحميل الآيات. تحقق من اتصالك بالإنترنت.');
        this.loading.set(false);
      },
    });
  }

  increaseFontSize() { this.fontSize.update(s => Math.min(s + 0.25, 3.5)); }
  decreaseFontSize() { this.fontSize.update(s => Math.max(s - 0.25, 1)); }

  markComplete() {
    if (!this.khatmaId) return;
    this.khatmaService.updatePartStatus(this.khatmaId, this.juzNumber, 'completed');
    this.toast.set('✅ تم تسجيل إكمال الجزء — جزاك الله خيرًا');
    setTimeout(() => this.toast.set(null), 3000);
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.audioChunks.push(e.data); };
      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.analyzeAudio(blob);
      };
      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch {
      this.coachMessages.update(m => [...m, { id: ++this.msgId, role: 'ai', error: 'لم نتمكن من الوصول للميكروفون. تأكد من إعطاء الإذن.' }]);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }

  private async analyzeAudio(blob: Blob) {
    const userMsg: CoachMessage = { id: ++this.msgId, role: 'user' };
    const aiMsg: CoachMessage = { id: ++this.msgId, role: 'ai', loading: true };
    this.coachMessages.update(m => [...m, userMsg, aiMsg]);
    this.scrollCoach();

    try {
      const result = await this.geminiService.analyzeRecitation(blob);
      this.coachMessages.update(m => m.map(msg => msg.id === aiMsg.id ? { ...msg, loading: false, result } : msg));
    } catch {
      this.coachMessages.update(m => m.map(msg => msg.id === aiMsg.id ? { ...msg, loading: false, error: 'حدث خطأ أثناء التحليل. حاول مرة أخرى.' } : msg));
    }
    this.scrollCoach();
  }

  private scrollCoach() {
    setTimeout(() => {
      const el = this.coachChat?.nativeElement || this.coachChatMobile?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  ngOnDestroy() {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
    }
  }
}
