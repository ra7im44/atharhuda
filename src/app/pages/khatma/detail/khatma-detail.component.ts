import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Khatma, KhatmaPart, KhatmaService } from '../../../services/khatma.service';

@Component({
  selector: 'app-khatma-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-6xl mx-auto px-6 py-10" dir="rtl">
      @if (khatma(); as k) {
        <!-- Back -->
        <a routerLink="/khatmat" class="inline-flex items-center gap-2 text-xs font-bold text-txt-muted hover:text-primary transition-colors mb-8 group animate-fade-right">
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          العودة للختمات
        </a>

        <!-- Hero Card -->
        <div class="relative bg-surface rounded-[2.5rem] border border-brd/70 overflow-hidden mb-12 animate-hero shadow-2xl shadow-black/5">
          <!-- Background Decor -->
          <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none"></div>
          <div class="absolute -top-24 -left-24 w-64 h-64 bg-accent/[0.05] rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute top-0 right-0 w-40 h-40 islamic-pattern opacity-10 pointer-events-none"></div>

          <div class="h-1.5 bg-surface-el"><div class="h-full bg-gradient-to-l from-primary via-secondary to-accent transition-all duration-1000" [style.width.%]="k.progress"></div></div>

          <div class="relative p-8 md:p-10">
            <div class="flex flex-col md:flex-row gap-10">
              <!-- Right Info -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                   <h1 class="text-2xl md:text-4xl font-black text-txt leading-tight">{{k.title}}</h1>
                   @if (k.status === 'completed') {
                     <div class="px-4 py-1.5 bg-ok/10 text-ok rounded-full text-xs font-bold border border-ok/20 flex items-center gap-1.5">
                       <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       مكتملة
                     </div>
                   }
                </div>

                <div class="flex flex-wrap items-center gap-4 mb-6">
                  <!-- Created By -->
                  <div class="flex items-center gap-2 p-2 pr-2.5 pl-4 rounded-xl bg-surface-el border border-brd/50">
                    <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg></div>
                    <div>
                      <span class="block text-[9px] text-txt-muted font-bold">المنشئ</span>
                      <span class="text-xs font-bold text-txt">{{k.createdBy}}</span>
                    </div>
                  </div>

                  <!-- Deceased Info & Anniversary -->
                  @if (k.deceasedName) {
                    <div class="flex items-center gap-2 p-2 pr-2.5 pl-4 rounded-xl bg-gradient-to-br from-accent/[0.08] to-accent/[0.02] border border-accent/10">
                      <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-accent"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div>
                      <div>
                        <span class="block text-[9px] text-accent/80 font-bold">عن روح المرحوم</span>
                        <span class="text-xs font-bold text-txt">{{k.deceasedName}}</span>
                      </div>
                    </div>
                  }
                </div>
                
                @if (k.deceasedDeathDate) {
                  @let ann = getAnniversaryInfo(k.deceasedDeathDate);
                  <div class="mb-6 p-4 rounded-2xl bg-surface border border-brd/60 relative overflow-hidden group">
                     <div class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-transparent"></div>
                     <div class="flex items-center gap-4">
                       <div class="text-center px-4 py-1 border-l border-brd/50">
                         <div class="text-xs text-txt-muted font-bold">تاريخ الوفاة</div>
                         <div class="text-sm font-black text-txt mt-0.5">{{formatDate(k.deceasedDeathDate)}}</div>
                       </div>
                       
                       <div class="flex-1">
                         <div class="text-xs text-accent font-bold mb-0.5 flex items-center gap-1.5">
                           <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           الذكرى السنوية {{ann.years}}
                         </div>
                         <div class="text-[11px] text-txt-muted leading-tight">{{ann.message}}</div>
                       </div>
                     </div>
                  </div>
                }

                <p class="text-sm text-txt-secondary leading-relaxed max-w-lg mb-8 bg-surface-el/50 p-4 rounded-2xl border border-brd/30 italic">
                  "{{k.description}}"
                </p>

                <!-- Actions -->
                <div class="flex gap-3">
                  <button (click)="shareWhatsApp()" class="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl text-xs transition-all hover:bg-[#1ebc57] hover:scale-105 shadow-lg shadow-[#25d366]/20">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     دعوة واتساب
                  </button>
                  <button (click)="copyLink()" class="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-brd text-txt-muted hover:text-primary hover:border-primary/50 font-bold rounded-xl text-xs transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    نسخ الرابط
                  </button>
                </div>
              </div>

              <!-- Stats Circle -->
              <div class="flex flex-col items-center justify-center p-8 bg-surface-el/30 rounded-[2rem] border border-brd/50 min-w-[240px]">
                <div class="relative w-40 h-40 flex items-center justify-center mb-6">
                  <!-- Circular Progress SVG -->
                  <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" class="stroke-brd" stroke-width="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" stroke-width="8"
                            stroke-linecap="round" [attr.stroke-dasharray]="283"
                            [attr.stroke-dashoffset]="283 - (283 * k.progress) / 100" 
                            class="transition-all duration-1000 ease-out" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" class="stop-primary" stop-color="var(--primary)" />
                        <stop offset="100%" class="stop-accent" stop-color="var(--accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-black text-txt">{{k.progress}}%</span>
                    <span class="text-xs text-txt-muted font-bold">مكتمل</span>
                  </div>
                </div>
                
                <div class="flex w-full justify-between px-4">
                  <div class="text-center">
                     <div class="text-xl font-black text-primary">{{completedCount()}}</div>
                     <div class="text-[10px] text-txt-muted font-bold">تمت قراءته</div>
                  </div>
                  <div class="text-center">
                     <div class="text-xl font-black text-txt-muted">30</div>
                     <div class="text-[10px] text-txt-muted font-bold">المجموع</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Juz Cards Grid -->
        <h2 class="text-2xl font-black text-txt mb-8 flex items-center gap-3">
          <span class="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></span>
          أجزاء الختمة
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (part of k.parts; track part.juzNumber; let i = $index) {
            <div (click)="selectPart(part)" 
                 class="group relative bg-surface p-5 rounded-[1.75rem] border transition-all duration-300 cursor-pointer overflow-hidden
                        hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                 [ngClass]="{
                   'border-brd hover:border-primary/40': part.status === 'available',
                   'border-warn/30 bg-warn/[0.02]': part.status === 'reserved',
                   'border-ok/30 bg-ok/[0.02]': part.status === 'completed'
                 }">
              
              <!-- Status Indicator Strip -->
              <div class="absolute top-0 right-0 bottom-0 w-1.5 transition-colors duration-300"
                   [ngClass]="{
                     'bg-brd group-hover:bg-primary': part.status === 'available',
                     'bg-warn': part.status === 'reserved',
                     'bg-ok': part.status === 'completed'
                   }"></div>

              <div class="flex items-start gap-4 pr-3">
                <!-- Juz Number Box -->
                <div class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-black text-xl transition-all duration-300"
                     [ngClass]="{
                       'bg-surface-el border-brd text-txt group-hover:bg-primary group-hover:text-white group-hover:border-primary': part.status === 'available',
                       'bg-warn/10 border-warn/20 text-warn': part.status === 'reserved',
                       'bg-ok/10 border-ok/20 text-ok': part.status === 'completed'
                     }">
                  {{part.juzNumber}}
                  <span class="text-[8px] font-bold opacity-60 mt-[-2px]">جزء</span>
                </div>

                <div class="flex-1 min-w-0">
                   <div class="flex justify-between items-start mb-1">
                      <h3 class="font-bold text-txt text-base group-hover:text-primary transition-colors">
                        {{getJuzName(part.juzNumber)}}
                      </h3>
                      @if (part.status === 'completed') {
                        <svg class="w-5 h-5 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      }
                   </div>
                   
                   <!-- Surahs List -->
                   <p class="text-xs text-txt-muted line-clamp-1 mb-3 font-medium">
                     {{getJuzSurahs(part.juzNumber)}}
                   </p>

                   <!-- Status Text -->
                   <div class="flex items-center gap-2">
                     @switch (part.status) {
                        @case ('available') {
                          <span class="inline-flex items-center gap-1 text-[10px] font-bold text-txt-muted bg-surface-el px-2 py-1 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            متاح للقراءة
                          </span>
                        }
                        @case ('reserved') {
                          <div class="flex items-center gap-1.5">
                            <div class="w-5 h-5 rounded-full bg-warn/10 flex items-center justify-center text-[10px]">⏳</div>
                            <div class="text-[10px]">
                              <span class="text-txt-muted">حجزه</span>
                              <span class="font-bold text-warn mr-1">{{part.reservedBy}}</span>
                            </div>
                          </div>
                        }
                        @case ('completed') {
                          <div class="flex items-center gap-1.5">
                            <div class="w-5 h-5 rounded-full bg-ok/10 flex items-center justify-center text-[10px]">✅</div>
                            <div class="text-[10px]">
                              <span class="text-txt-muted">أتمه</span>
                              <span class="font-bold text-ok mr-1">{{part.completedBy}}</span>
                            </div>
                          </div>
                        }
                     }
                   </div>
                </div>
              </div>
            </div>
          }
        </div>

      } @else {
        <div class="text-center py-32 animate-scale-in">
             <!-- Empty state ... -->
             <p>Loading...</p>
        </div>
      }

      <!-- Modals... Same as before but with updated styling if needed -->
      @if (selectedPart()) {
         <!-- ... Part details modal ... -->
         <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="selectedPart.set(null)">
          <div class="animate-scale-in bg-surface rounded-[2rem] w-full max-w-sm p-8 shadow-2xl border border-brd/70 relative overflow-hidden" (click)="$event.stopPropagation()">
            
             <div class="text-center mb-6">
                <!-- Rich Header for Modal -->
                <div class="inline-flex flex-col items-center justify-center w-20 h-20 rounded-2xl mb-4 text-2xl font-black shadow-lg shadow-black/5" 
                     [ngClass]="{
                       'bg-gradient-to-br from-primary to-secondary text-white': selectedPart()!.status === 'available',
                       'bg-warn/10 text-warn border-2 border-warn/20': selectedPart()!.status === 'reserved',
                       'bg-ok/10 text-ok border-2 border-ok/20': selectedPart()!.status === 'completed'
                     }">
                     {{selectedPart()!.juzNumber}}
                     <span class="text-[9px] font-bold opacity-80 decoration-0">جزء</span>
                </div>
                
                <h3 class="text-xl font-black text-txt mb-1">{{getJuzName(selectedPart()!.juzNumber)}}</h3>
                <p class="text-xs text-txt-muted">{{getJuzSurahs(selectedPart()!.juzNumber)}}</p>
             </div>

             <!-- Actions based on status -->
             @switch (selectedPart()!.status) {
              @case ('available') {
                <div class="space-y-4">
                  <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسمك</label><input #nameInput class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus focus:ring-4 focus:ring-primary/10 p-3.5 text-sm outline-none transition-all" placeholder="اكتب اسمك لحجز الجزء"></div>
                  <div class="flex gap-3">
                    <button (click)="selectedPart.set(null)" class="flex-1 py-3.5 text-txt-muted bg-surface-el border border-brd rounded-xl font-bold text-xs hover:bg-bg transition-colors">إلغاء</button>
                    <button (click)="reserveAndRead(nameInput.value)" [disabled]="!nameInput.value.trim()" class="flex-[2] py-3.5 text-white bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-xs disabled:opacity-40 transition-all shadow-lg shadow-primary/15 hover:shadow-xl hover:scale-[1.02]">📖 احجز وابدأ القراءة</button>
                  </div>
                </div>
              }
              @case ('reserved') {
                <div class="space-y-3">
                  <div class="p-3 bg-warn/10 rounded-xl text-center mb-2">
                     <p class="text-xs text-warn/80 font-bold">محجوز باسم: <span class="text-warn">{{selectedPart()!.reservedBy}}</span></p>
                  </div>
                  <a [routerLink]="['/quran/juz', selectedPart()!.juzNumber]" [queryParams]="{khatmaId: khatma()?.id}" class="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-xs shadow-lg shadow-primary/15 hover:shadow-xl hover:scale-[1.02] transition-all">
                    📖 ابدأ القراءة
                  </a>
                  <button (click)="completePart()" class="w-full py-3.5 bg-ok text-white font-bold rounded-xl text-xs hover:shadow-lg hover:bg-ok/90 transition-all">✅ أكملت القراءة</button>
                  <button (click)="selectedPart.set(null)" class="w-full py-3 text-txt-muted text-xs hover:text-txt transition-colors">إغلاق</button>
                </div>
              }
              @case ('completed') {
                <div class="text-center space-y-3">
                  <div class="p-4 bg-ok/10 rounded-2xl border border-ok/20 mb-4">
                     <p class="text-sm font-bold text-ok flex items-center justify-center gap-2">
                       <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       تمت القراءة بواسطة {{selectedPart()!.completedBy}}
                     </p>
                     <p class="text-[10px] text-ok/70 mt-1">تقبل الله منا ومنكم</p>
                  </div>
                  <a [routerLink]="['/quran/juz', selectedPart()!.juzNumber]" class="inline-flex items-center gap-2 px-6 py-3 bg-primary/[0.06] text-primary font-bold rounded-xl text-xs hover:bg-primary hover:text-white transition-all w-full justify-center">👀 تصفح الآيات</a>
                  <button (click)="selectedPart.set(null)" class="block w-full py-3 text-txt-muted text-xs hover:text-txt transition-colors">إغلاق</button>
                </div>
              }
            }
          </div>
         </div>
      }

      @if (toast()) {<div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 text-white text-xs font-bold rounded-2xl shadow-xl animate-fade-up" [ngClass]="{'bg-ok': toast()!.type === 'success', 'bg-info': toast()!.type === 'info'}">{{toast()!.msg}}</div>}
    </section>
  `,
})
export class KhatmaDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private khatmaService = inject(KhatmaService);

  khatmaComputed = this.khatmaService.getKhatmaById('');
  khatma = signal<Khatma | undefined>(undefined);
  selectedPart = signal<KhatmaPart | null>(null);
  toast = signal<{ msg: string; type: 'success' | 'info' } | null>(null);
  private currentId = '';

  completedCount = computed(() => this.khatma()?.parts.filter(p => p.status === 'completed').length ?? 0);

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe(p => {
      this.currentId = p['id'];
      this.khatmaComputed = this.khatmaService.getKhatmaById(this.currentId);
      this.khatma.set(this.khatmaComputed());
    });
  }

  selectPart(p: KhatmaPart) { this.selectedPart.set(p); }

  reserveAndRead(name: string) {
    if (!name.trim() || !this.khatma() || !this.selectedPart()) return;
    const juzNumber = this.selectedPart()!.juzNumber;
    const khatmaId = this.khatma()!.id;
    this.khatmaService.updatePartStatus(khatmaId, juzNumber, 'reserved', name.trim());
    this.refreshKhatma();
    this.selectedPart.set(null);
    this.showToast('📖 تم حجز الجزء — بارك الله فيك', 'success');
    this.router.navigate(['/quran/juz', juzNumber], { queryParams: { khatmaId } });
  }

  completePart() {
    if (!this.khatma() || !this.selectedPart()) return;
    this.khatmaService.updatePartStatus(this.khatma()!.id, this.selectedPart()!.juzNumber, 'completed', this.selectedPart()!.reservedBy);
    this.refreshKhatma();
    this.selectedPart.set(null);
    this.showToast('✅ أكملت الجزء — جزاك الله خيرًا', 'success');
  }

  shareWhatsApp() {
    const k = this.khatma()!;
    let t = `📖 شارك معنا في ختمة "${k.title}"`;
    if (k.deceasedName) t += `\n🕊️ عن: ${k.deceasedName}`;
    t += `\n📊 التقدم: ${k.progress}%\n\nاحجز جزء:\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(`${location.origin}/#/khatmat/${this.khatma()!.id}`).then(() => this.showToast('✅ تم نسخ الرابط', 'success'));
  }



  getJuzName(juz: number) { return this.khatmaService.getJuzName(juz); }
  getJuzSurahs(juz: number) { return this.khatmaService.getJuzSurahs(juz).join('، '); }

  formatDate(date: Date | undefined) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  getAnniversaryInfo(date: Date | undefined): { years: number, message: string } {
    if (!date) return { years: 0, message: '' };
    const deathDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - deathDate.getTime());
    const yearsPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const nextAnniversary = new Date(deathDate);
    nextAnniversary.setFullYear(today.getFullYear());
    if (nextAnniversary < today) nextAnniversary.setFullYear(today.getFullYear() + 1);

    const daysToNext = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let message = '';
    if (daysToNext === 0) message = 'اليوم هو ذكرى الوفاة، دعواتكم له بالرحمة والمغفرة.';
    else if (daysToNext <= 30) message = `باقي ${daysToNext} يوم على الذكرى السنوية.`;
    else message = `مر ${yearsPassed} سنوات على الوفاة.`;

    return { years: yearsPassed + 1, message };
  }

  private refreshKhatma() {
    this.khatmaComputed = this.khatmaService.getKhatmaById(this.currentId);
    this.khatma.set(this.khatmaComputed());
  }

  private showToast(msg: string, type: 'success' | 'info') {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 2500);
  }
}
