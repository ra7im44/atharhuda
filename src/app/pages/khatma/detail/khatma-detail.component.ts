
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../../services/khatma.service';

@Component({
  selector: 'app-khatma-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (khatma(); as k) {
      <div class="min-h-screen pb-20 relative overflow-hidden">
        <!-- Background -->
        <div class="fixed inset-0 pointer-events-none">
          <div class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-drift"></div>
          <div class="absolute bottom-[-20%] left-[-15%] w-[700px] h-[700px] bg-accent/5 rounded-full blur-3xl animate-drift" style="animation-delay:-7s;"></div>
          <div class="absolute inset-0 dot-grid opacity-[0.15] dark:opacity-[0.04]"></div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-10 relative z-10">

          <!-- HEADER -->
          <div class="mb-16 animate-fade-up">
            <a href="/#/khatmat" class="inline-flex items-center gap-2 text-txt-muted hover:text-link mb-8 transition-colors group">
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"/></svg>
              <span class="font-bold">العودة للختمات</span>
            </a>

            <div class="bg-surface/80 backdrop-blur-xl rounded-[3rem] border border-brd p-10 md:p-14 shadow-2xl relative overflow-hidden">
              <!-- Top Accent -->
              <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
              
              <!-- Stats Badge -->
              <div class="absolute top-8 left-8 flex items-center gap-3">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30 animate-pulse-glow">
                  {{k.progress}}%
                </div>
                @if (k.status === 'completed') {
                  <div class="px-4 py-2 rounded-full bg-ok/10 border border-ok/30 text-ok text-sm font-bold flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    مكتملة
                  </div>
                }
              </div>

              <div class="max-w-3xl">
                <h1 class="text-4xl md:text-6xl font-black text-txt mb-6 font-quran leading-tight">{{k.title}}</h1>

                <div class="flex flex-wrap items-center gap-4 mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary text-primary-text flex items-center justify-center font-bold text-sm shadow-md">{{k.createdBy.charAt(0)}}</div>
                    <div>
                      <div class="text-[10px] text-txt-muted font-bold uppercase tracking-wider">المنشئ</div>
                      <div class="text-sm font-bold text-txt">{{k.createdBy}}</div>
                    </div>
                  </div>
                  @if (k.deceasedName) {
                    <div class="h-8 w-px bg-brd"></div>
                    <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-warn/[0.07] border border-warn/15 text-warn">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
                      <span class="font-bold">{{k.deceasedName}}</span>
                    </div>
                  }
                </div>

                @if (k.description) {<p class="text-lg text-txt-muted leading-relaxed mb-8 max-w-2xl">{{k.description}}</p>}

                <!-- Progress Bar -->
                <div class="relative h-4 bg-surface-el rounded-full overflow-hidden mb-8 border border-brd/50">
                  <div class="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-1000 rounded-full" [style.width.%]="k.progress">
                    <div class="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-6">
                  @for (stat of getStats(k); track stat.label) {
                    <div class="text-center">
                      <div class="text-3xl md:text-4xl font-black mb-1" [class]="stat.color">{{stat.value}}</div>
                      <div class="text-xs text-txt-muted font-medium">{{stat.label}}</div>
                    </div>
                  }
                </div>
              </div>

              <!-- Share Buttons -->
              <div class="mt-10 flex flex-wrap items-center gap-3">
                <span class="text-xs text-txt-muted font-bold uppercase tracking-wide">شارك:</span>
                <button (click)="shareWhatsApp(k)" class="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  واتساب
                </button>
                <button (click)="shareTelegram(k)" class="px-5 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  تيليجرام
                </button>
                <button (click)="copyLink(k)" class="px-5 py-2.5 bg-surface-el border border-brd text-txt-muted hover:text-link hover:border-primary/30 rounded-xl text-sm font-bold transition-all hover:scale-105">
                  <svg class="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                  {{copied ? 'تم النسخ ✓' : 'نسخ الرابط'}}
                </button>
              </div>
            </div>
          </div>

          <!-- PARTICIPANTS -->
          @if (participants().length > 0) {
            <div class="mb-16 animate-fade-up delay-200">
              <h2 class="text-2xl font-black text-txt mb-6 flex items-center gap-3">
                <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
                المشاركون ({{participants().length}})
              </h2>
              <div class="flex flex-wrap gap-3">
                @for (name of participants(); track name) {
                  <div class="px-5 py-3 bg-surface-el border border-brd rounded-2xl text-sm font-medium text-txt hover:border-primary/30 hover:bg-primary/[0.03] transition-all">{{name}}</div>
                }
              </div>
            </div>
          }

          <!-- JUZ GRID -->
          <div class="animate-fade-up delay-300">
            <h2 class="text-2xl font-black text-txt mb-6 flex items-center gap-3">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
              الأجزاء ({{getCompletedCount(k)}} / 30)
            </h2>

            <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              @for (part of k.parts; track part.juzNumber) {
                <button (click)="onPartClick(part, k)" 
                  class="group relative rounded-3xl border-2 p-4 flex flex-col items-center justify-center min-h-[130px] text-center transition-all duration-500 hover:scale-[1.05] hover:shadow-xl overflow-hidden"
                  [class]="getPartClasses(part)">
                  
                  <!-- Background Gradient Overlay -->
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    [class]="part.status === 'completed' ? 'bg-gradient-to-br from-ok/10 to-ok/5' : part.status === 'reserved' ? 'bg-gradient-to-br from-warn/10 to-warn/5' : 'bg-gradient-to-br from-primary/10 to-primary/5'"></div>

                  <div class="relative z-10">
                    <div class="text-[10px] font-bold opacity-60 mb-2">الجزء {{part.juzNumber}}</div>
                    <div class="text-base font-black font-quran leading-tight mb-2 px-2">{{khatmaService.getJuzName(part.juzNumber)}}</div>
                    
                    <!-- Surahs Info -->
                    @if (part.status === 'completed' && part.readSurahs && part.readSurahs.length > 0) {
                      <div class="text-[9px] text-ok/80 mb-2 px-1 line-clamp-2">{{part.readSurahs.join(' • ')}}</div>
                    } @else {
                      <div class="text-[9px] opacity-50 mb-2 px-1 line-clamp-2">{{khatmaService.getJuzSurahs(part.juzNumber).join(' • ')}}</div>
                    }
                    
                    <!-- Icon -->
                    <div class="w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      [class]="part.status === 'completed' ? 'bg-ok/20' : part.status === 'reserved' ? 'bg-warn/20' : 'bg-primary/10'">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        @if (part.status === 'completed') {<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>}
                        @else if (part.status === 'reserved') {<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>}
                        @else {<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>}
                      </svg>
                    </div>

                    @if (part.completedBy) {
                      <div class="text-[10px] text-ok font-bold mt-2">{{part.completedBy}}</div>
                    }
                  </div>
                </button>
              }
            </div>

            <!-- Legend -->
            <div class="flex flex-wrap gap-6 mt-8 justify-center">
              <div class="flex items-center gap-2 text-sm"><div class="w-4 h-4 rounded-md bg-ok/20 border-2 border-ok/40"></div><span class="text-txt-muted font-medium">مكتمل</span></div>
              <div class="flex items-center gap-2 text-sm"><div class="w-4 h-4 rounded-md bg-warn/20 border-2 border-warn/40"></div><span class="text-txt-muted font-medium">محجوز</span></div>
              <div class="flex items-center gap-2 text-sm"><div class="w-4 h-4 rounded-md bg-surface-el border-2 border-brd"></div><span class="text-txt-muted font-medium">متاح</span></div>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- RESERVE/COMPLETE MODAL -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" (click)="showModal.set(false)">
        <div class="bg-surface rounded-[2rem] w-full max-w-lg p-8 shadow-2xl border border-brd relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div class="text-center mb-8 relative">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
            </div>
            <h3 class="text-xl font-bold text-txt mb-1">{{modalTitle()}}</h3>
            <p class="text-sm text-txt-muted">{{modalDesc()}}</p>
          </div>
          
          <div class="mb-6">
            <label class="block text-xs font-bold text-txt-secondary mb-2 uppercase tracking-wide">اسمك</label>
            <input [(ngModel)]="userName" class="w-full h-14 px-5 rounded-2xl bg-surface-el border border-brd focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-txt" placeholder="أدخل اسمك"/>
          </div>

          <!-- Surah Selection for Completion -->
          @if (pendingAction === 'complete' && availableSurahs().length > 0) {
            <div class="mb-6">
              <label class="block text-xs font-bold text-txt-secondary mb-3 uppercase tracking-wide">السور المقروءة</label>
              <div class="bg-surface-el rounded-2xl p-4 max-h-60 overflow-y-auto border border-brd">
                <div class="grid grid-cols-2 gap-2">
                  @for (surah of availableSurahs(); track surah) {
                    <label class="flex items-center gap-2 p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer">
                      <input type="checkbox" [value]="surah" [(ngModel)]="selectedSurahs[surah]" 
                        class="w-4 h-4 rounded border-2 border-brd text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"/>
                      <span class="text-sm text-txt font-medium">{{surah}}</span>
                    </label>
                  }
                </div>
                <div class="mt-3 pt-3 border-t border-brd">
                  <button (click)="selectAllSurahs()" class="text-xs text-link font-bold hover:underline mr-3">تحديد الكل</button>
                  <button (click)="clearAllSurahs()" class="text-xs text-txt-muted font-bold hover:underline">إلغاء الكل</button>
                </div>
              </div>
              <p class="text-xs text-txt-muted mt-2">حدد السور التي قرأتها من هذا الجزء</p>
            </div>
          }

          <div class="flex gap-3">
            <button (click)="showModal.set(false)" class="flex-1 h-12 rounded-xl border border-brd text-txt font-bold hover:bg-surface-el transition-colors">إلغاء</button>
            <button (click)="confirmAction()" [disabled]="!canConfirm()" class="flex-1 h-12 rounded-xl bg-primary text-primary-text font-bold disabled:opacity-40 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20">تأكيد</button>
          </div>
        </div>
      </div>
    }

    <!-- COMPLETION MESSAGE MODAL -->
    @if (showCompletionMessage()) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" (click)="showCompletionMessage.set(false)">
        <div class="bg-gradient-to-br from-ok to-ok/90 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Decorative Elements -->
          <div class="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div class="text-center text-white relative">
            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            
            <h2 class="text-3xl font-black mb-3 font-quran">جزاك الله خيراً</h2>
            <p class="text-xl mb-2 opacity-90">{{completedPersonName()}}</p>
            <p class="text-white/80 text-lg leading-relaxed mb-6">تقبل الله منك وجعله في ميزان حسناتك</p>
            
            <div class="bg-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm">
              <p class="text-sm font-quran leading-loose">
                « خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ »
              </p>
              <p class="text-xs mt-2 opacity-75">— رواه البخاري</p>
            </div>

            <button (click)="showCompletionMessage.set(false)" class="px-8 py-3 bg-white text-ok rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
              بارك الله فيك ✨
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class KhatmaDetailComponent {
  private route = inject(ActivatedRoute);
  khatmaService = inject(KhatmaService);

  khatma = this.khatmaService.getKhatmaById(this.route.snapshot.paramMap.get('id') || '');
  participants = this.khatmaService.getParticipants(this.route.snapshot.paramMap.get('id') || '');

  showModal = signal(false);
  showCompletionMessage = signal(false);
  completedPersonName = signal('');
  modalTitle = signal('');
  modalDesc = signal('');
  userName = '';
  selectedPart: any = null;
  pendingAction: 'reserve' | 'complete' = 'reserve';
  copied = false;

  // Surah selection state
  selectedSurahs: { [key: string]: boolean } = {};
  availableSurahs = signal<string[]>([]);

  getStats(k: any) {
    return [
      { value: `${k.progress}%`, label: 'الإنجاز', color: 'text-primary' },
      { value: this.getCompletedCount(k), label: 'مكتمل', color: 'text-ok' },
      { value: this.getRemainingCount(k), label: 'متبقي', color: 'text-warn' }
    ];
  }

  getCompletedCount(k: any) { return k.parts.filter((p: any) => p.status === 'completed').length; }
  getRemainingCount(k: any) { return k.parts.filter((p: any) => p.status === 'available').length; }

  getPartClasses(part: any) {
    if (part.status === 'completed') return 'bg-ok/10 border-ok/30 text-ok hover:bg-ok/15 hover:border-ok/40';
    if (part.status === 'reserved') return 'bg-warn/10 border-warn/30 text-warn hover:bg-warn/15 hover:border-warn/40';
    return 'bg-surface-el border-brd text-txt-muted hover:border-primary/40 hover:text-primary hover:bg-primary/[0.04]';
  }

  onPartClick(part: any, k: any) {
    this.selectedPart = part;
    const juzName = this.khatmaService.getJuzName(part.juzNumber);

    if (part.status === 'completed') {
      // Show completion message
      this.completedPersonName.set(part.completedBy || 'القارئ الكريم');
      this.showCompletionMessage.set(true);
      return;
    }

    if (part.status === 'available') {
      this.pendingAction = 'reserve';
      this.modalTitle.set(`حجز ${juzName}`);
      this.modalDesc.set(`أدخل اسمك لحجز ${juzName} (الجزء ${part.juzNumber})`);
      this.showModal.set(true);
    } else if (part.status === 'reserved') {
      this.pendingAction = 'complete';
      this.modalTitle.set(`إتمام ${juzName}`);
      this.modalDesc.set('حدد السور المقروءة وأدخل اسمك');

      // Load available surahs
      const surahs = this.khatmaService.getJuzSurahs(part.juzNumber);
      this.availableSurahs.set(surahs);
      this.selectedSurahs = {};
      surahs.forEach(s => this.selectedSurahs[s] = true); // Select all by default

      this.showModal.set(true);
    }
  }

  selectAllSurahs() {
    this.availableSurahs().forEach(s => this.selectedSurahs[s] = true);
  }

  clearAllSurahs() {
    this.availableSurahs().forEach(s => this.selectedSurahs[s] = false);
  }

  getSelectedSurahs(): string[] {
    return Object.keys(this.selectedSurahs).filter(k => this.selectedSurahs[k]);
  }

  canConfirm(): boolean {
    if (!this.userName.trim()) return false;
    if (this.pendingAction === 'complete') {
      return this.getSelectedSurahs().length > 0;
    }
    return true;
  }

  confirmAction() {
    if (!this.canConfirm() || !this.selectedPart) return;
    const id = this.route.snapshot.paramMap.get('id') || '';
    const status = this.pendingAction === 'reserve' ? 'reserved' : 'completed';
    const readSurahs = this.pendingAction === 'complete' ? this.getSelectedSurahs() : undefined;

    this.khatmaService.updatePartStatus(id, this.selectedPart.juzNumber, status, this.userName.trim(), readSurahs);

    const completedName = this.userName.trim();
    this.showModal.set(false);
    this.userName = '';
    this.selectedSurahs = {};
    this.availableSurahs.set([]);

    // If completing, show completion message
    if (status === 'completed') {
      setTimeout(() => {
        this.completedPersonName.set(completedName);
        this.showCompletionMessage.set(true);
      }, 300);
    }
  }

  shareWhatsApp(k: any) {
    let t = `📖 شارك في ختمة "${k.title}"`;
    if (k.deceasedName) t += `\n🕊️ عن: ${k.deceasedName}`;
    t += `\n📊 ${k.progress}%\n\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
  }
  shareTelegram(k: any) {
    const url = `${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('📖 ' + k.title)}`, '_blank');
  }
  copyLink(k: any) {
    navigator.clipboard.writeText(`${location.origin}/#/khatmat/${k.id}`).then(() => { this.copied = true; setTimeout(() => this.copied = false, 2000); });
  }
}
