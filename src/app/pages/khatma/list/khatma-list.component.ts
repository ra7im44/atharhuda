
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { KhatmaService } from '../../../services/khatma.service';

@Component({
  selector: 'app-khatma-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen pb-20 relative overflow-hidden">
      <!-- Background Decor -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-drift"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-drift" style="animation-delay: -5s;"></div>
        <div class="absolute inset-0 dot-grid opacity-[0.2] dark:opacity-[0.05]"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 pt-10">

        <!-- HEADER SECTION -->
        <div class="flex flex-col md:flex-row items-end md:items-center justify-between gap-8 mb-16 animate-fade-up">
          <div class="relative">
            <h1 class="text-4xl md:text-6xl font-black text-txt mb-4 font-quran leading-tight">
              الختمات <span class="text-primary relative inline-block">
                القرآنية
                <svg class="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="3" fill="none"/></svg>
              </span>
            </h1>
            <p class="text-txt-muted text-lg max-w-md leading-relaxed">
              شارك في الخير، واختر ختمة لتساهم في إتمامها، أو ابدأ ختمة جديدة لمن تحب.
            </p>
          </div>

          <button (click)="openCreateModal()" class="group relative px-8 py-4 bg-primary text-primary-text rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-2xl overflow-hidden">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span class="relative flex items-center gap-3">
              <span class="text-2xl">+</span> إنشاء ختمة جديدة
            </span>
          </button>
        </div>

        <!-- SEARCH & FILTER -->
        <div class="sticky top-20 z-30 mb-12 animate-fade-up delay-100">
          <div class="bg-surface/80 backdrop-blur-xl border border-brd p-2 rounded-2xl shadow-lg flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div class="relative flex-1">
              <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
              <input [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="ابحث عن ختمة، اسم المتوفى، أو المنشئ..." class="w-full h-12 pr-12 pl-4 bg-transparent text-txt placeholder:text-txt-muted/70 outline-none rounded-xl focus:bg-surface-el transition-colors font-medium"/>
            </div>
            <div class="flex gap-1 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              @for (filter of filters(); track filter.id) {
                <button (click)="activeFilter.set(filter.id)"
                  [class]="activeFilter() === filter.id ? 'bg-txt text-bg shadow-md' : 'bg-surface-el text-txt-muted hover:text-txt hover:bg-surface-el/80'"
                  class="px-5 h-12 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2">
                  {{filter.label}}
                  @if (filter.count > 0) { <span class="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px]">{{filter.count}}</span> }
                </button>
              }
            </div>
          </div>
        </div>

        <!-- LIST -->
        @if (filteredKhatmas().length > 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger h-full">
            @for (k of filteredKhatmas(); track k.id) {
              <div class="group relative bg-surface-el rounded-[2rem] border border-brd p-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 flex flex-col">
                <!-- Progress Background -->
                <div class="absolute inset-0 rounded-[2rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                </div>

                <div class="relative bg-surface rounded-[1.5rem] p-6 flex-1 flex flex-col border border-brd/50 group-hover:border-transparent transition-colors">
                  <!-- Top Row -->
                  <div class="flex justify-end items-start mb-4">
                    @if (k.deceasedName) {
                      <div class="px-3 py-1.5 rounded-full bg-surface-el border border-brd text-[11px] font-bold text-txt-secondary flex items-center gap-1.5 shadow-sm">
                        <span class="w-1.5 h-1.5 rounded-full bg-warn animate-pulse"></span>
                        عن: {{k.deceasedName}}
                      </div>
                    }
                  </div>

                  <!-- Content -->
                  <h3 class="text-xl font-bold text-txt mb-2 font-quran leading-relaxed group-hover:text-primary transition-colors line-clamp-2">
                    <a [routerLink]="['/khatmat', k.id]" class="before:absolute before:inset-0">{{k.title}}</a>
                  </h3>
                  <p class="text-sm text-txt-muted mb-6 line-clamp-2">{{k.description}}</p>

                  <!-- Meta -->
                  <div class="mt-auto pt-6 border-t border-brd/50 flex items-center justify-between text-xs text-txt-muted">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-primary text-primary-text flex items-center justify-center font-bold text-[10px]">{{k.createdBy.charAt(0)}}</div>
                      <span>{{k.createdBy}}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {{getRelativeTime(k.createdAt)}}
                    </div>
                  </div>
                </div>

                <!-- Action Footer -->
                <div class="px-6 py-4 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-txt-muted font-bold uppercase tracking-wider mb-1">المتبقي</span>
                    <span class="text-lg font-black text-txt leading-none">{{getRemainingCount(k)}} <span class="text-[10px] font-medium text-txt-muted">جزء</span></span>
                  </div>
                  <button class="w-10 h-10 rounded-full bg-txt text-bg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-text transition-all duration-300 shadow-md">
                    <svg class="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-32 text-center animate-fade-up">
            <div class="w-24 h-24 bg-surface-el rounded-[2rem] flex items-center justify-center mb-6 shadow-xl border border-brd rotate-3">
              <svg class="w-10 h-10 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            </div>
            <h3 class="text-2xl font-black text-txt mb-2">لم يتم العثور على ختمات</h3>
            <p class="text-txt-muted max-w-xs mx-auto mb-8">جرب البحث بكلمات مختلفة أو قم بإنشاء ختمة جديدة</p>
            <button (click)="searchQuery.set(''); activeFilter.set('all')" class="text-link font-bold hover:underline">مسح البحث</button>
          </div>
        }

      </div>

      <!-- CREATE MODAL -->
      @if (showCreateModal) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300" (click)="showCreateModal=false">
          <div class="bg-surface rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl border border-brd relative overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
            <!-- Decor -->
            <div class="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="text-center mb-10 relative">
              <div class="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 rotate-3">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <h2 class="text-3xl font-black text-txt font-quran">ختمة جديدة</h2>
              <p class="text-txt-muted mt-2">ابدأ رحلة الأجر والثواب</p>
            </div>

            <div class="space-y-6">
              <div class="group">
                <label class="block text-xs font-bold text-txt-secondary mb-2 uppercase tracking-wide">عنوان الختمة <span class="text-err">*</span></label>
                <input [formControl]="createForm.controls.title" class="w-full h-14 px-5 rounded-2xl bg-surface-el border border-brd focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-txt placeholder:font-normal" placeholder="مثال: ختمة رمضان"/>
              </div>

              <div class="grid grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-txt-secondary mb-2 uppercase tracking-wide">المنشئ <span class="text-err">*</span></label>
                  <input [formControl]="createForm.controls.createdBy" class="w-full h-14 px-5 rounded-2xl bg-surface-el border border-brd focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-txt" placeholder="اسمك"/>
                </div>
                <div>
                  <label class="block text-xs font-bold text-txt-secondary mb-2 uppercase tracking-wide">عن (اختياري)</label>
                  <input [formControl]="createForm.controls.deceasedName" class="w-full h-14 px-5 rounded-2xl bg-surface-el border border-brd focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-txt" placeholder="المرحوم..."/>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-txt-secondary mb-2 uppercase tracking-wide">رسالة / دعاء <span class="text-err">*</span></label>
                <textarea [formControl]="createForm.controls.description" rows="3" class="w-full p-5 rounded-2xl bg-surface-el border border-brd focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-txt resize-none" placeholder="اللهم اجعلها نوراً له..."></textarea>
              </div>
            </div>

            <div class="mt-10 flex gap-4">
              <button (click)="showCreateModal=false" class="flex-1 h-14 rounded-2xl border border-brd text-txt font-bold hover:bg-surface-el transition-colors">إلغاء</button>
              <button (click)="createKhatma()" [disabled]="createForm.invalid" class="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100">
                إنشاء الختمة
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class KhatmaListComponent {
  private router = inject(Router);
  khatmaService = inject(KhatmaService);

  showCreateModal = false;
  searchQuery = signal('');
  activeFilter = signal<'all' | 'ongoing' | 'completed'>('all');

  createForm = new FormGroup({
    createdBy: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    deceasedName: new FormControl(''),
    description: new FormControl('', [Validators.required])
  });

  filters = computed(() => {
    const all = this.khatmaService.khatmas();
    return [
      { id: 'all' as const, label: 'الكل', count: all.length },
      { id: 'ongoing' as const, label: 'جارية', count: all.filter(k => k.progress < 100).length },
      { id: 'completed' as const, label: 'مكتملة', count: all.filter(k => k.progress === 100).length }
    ];
  });

  filteredKhatmas = computed(() => {
    let list = this.khatmaService.khatmas();
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();

    if (filter === 'ongoing') list = list.filter(k => k.progress < 100);
    if (filter === 'completed') list = list.filter(k => k.progress === 100);

    if (q) {
      list = list.filter(k =>
        k.title.toLowerCase().includes(q) ||
        k.createdBy.toLowerCase().includes(q) ||
        (k.deceasedName && k.deceasedName.toLowerCase().includes(q))
      );
    }
    return list;
  });

  getRemainingCount(khatma: any) { return khatma.parts.filter((p: any) => p.status === 'available').length; }

  getRelativeTime(date: Date) {
    // Simple relative time for demo
    return 'منذ يومين';
  }

  openCreateModal() { this.createForm.reset(); this.showCreateModal = true; }

  createKhatma() {
    if (this.createForm.valid) {
      const { title, createdBy, deceasedName, description } = this.createForm.value;
      const id = this.khatmaService.addKhatma(title!, createdBy!, deceasedName!, description!);
      this.showCreateModal = false;
      this.router.navigate(['/khatmat', id]);
    }
  }
}
