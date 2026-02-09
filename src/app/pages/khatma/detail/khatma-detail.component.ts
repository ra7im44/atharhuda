
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
      <div class="max-w-6xl mx-auto px-6 py-10">

        <!-- Hero Card -->
        <div class="animate-hero bg-surface-el rounded-3xl border border-brd p-8 md:p-10 mb-10 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary to-accent"></div>
          <a href="/#/khatmat" class="inline-flex items-center gap-2 text-txt-muted hover:text-link text-sm mb-7 transition-colors group">
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12"/></svg>
            العودة للختمات
          </a>

          <h1 class="text-2xl md:text-3xl font-black text-txt mb-5">{{k.title}}</h1>

          <div class="flex flex-wrap items-center gap-4 mb-5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-text text-xs font-bold">{{k.createdBy.charAt(0)}}</div>
              <span class="text-txt-secondary text-sm">أنشأها: <strong class="text-txt">{{k.createdBy}}</strong></span>
            </div>
            @if (k.deceasedName) {
              <div class="flex items-center gap-1.5 px-3.5 py-1.5 bg-warn/[0.07] border border-warn/15 rounded-xl text-sm text-warn"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg> عن: <strong>{{k.deceasedName}}</strong></div>
            }
          </div>

          @if (k.description) {<p class="text-txt-muted max-w-2xl mb-7 text-sm leading-relaxed">{{k.description}}</p>}

          <!-- Stats Row -->
          <div class="flex flex-wrap items-center gap-8 mb-7">
            <div class="text-center"><div class="text-3xl font-black text-primary animate-count">{{k.progress}}%</div><div class="text-[11px] text-txt-muted mt-1">الإنجاز</div></div>
            <div class="w-px h-10 bg-brd"></div>
            <div class="text-center"><div class="text-3xl font-black text-txt animate-count delay-100">{{getCompletedCount(k)}}</div><div class="text-[11px] text-txt-muted mt-1">مكتمل</div></div>
            <div class="w-px h-10 bg-brd"></div>
            <div class="text-center"><div class="text-3xl font-black text-warn animate-count delay-200">{{getRemainingCount(k)}}</div><div class="text-[11px] text-txt-muted mt-1">متبقي</div></div>
          </div>

          <!-- Progress -->
          <div class="h-2.5 bg-brd rounded-full overflow-hidden mb-7"><div class="h-full bg-gradient-to-l from-primary to-accent rounded-full transition-all duration-1000" [style.width.%]="k.progress"></div></div>

          <!-- Share -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="text-xs text-txt-muted font-medium">شارك الختمة:</span>
            <button (click)="shareWhatsApp(k)" class="flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-md"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> واتساب</button>
            <button (click)="shareTelegram(k)" class="flex items-center gap-1.5 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-md"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> تيليجرام</button>
            <button (click)="copyLink(k)" class="flex items-center gap-1.5 px-4 py-2.5 bg-surface border border-brd text-txt-muted hover:text-link hover:border-primary/30 rounded-xl text-xs font-bold transition-all hover:scale-105"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> {{copied ? 'تم ✅' : 'نسخ الرابط'}}</button>
          </div>
        </div>

        <!-- Participants -->
        @if (participants().length > 0) {
          <div class="animate-fade-up delay-200 mb-10">
            <h2 class="text-base font-bold text-txt mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg> المشاركون ({{participants().length}})</h2>
            <div class="flex flex-wrap gap-2">
              @for (name of participants(); track name) {
                <span class="px-3.5 py-1.5 bg-surface-el border border-brd rounded-xl text-xs font-medium text-txt-secondary">{{name}}</span>
              }
            </div>
          </div>
        }

        <!-- Juz Grid -->
        <div class="animate-fade-up delay-300">
          <h2 class="text-base font-bold text-txt mb-5 flex items-center gap-2"><svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> الأجزاء</h2>
          <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            @for (part of k.parts; track part.juzNumber) {
              <button (click)="onPartClick(part, k)" class="group relative min-h-[90px] rounded-2xl border-2 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md"
                [class]="part.status === 'completed' ? 'bg-ok/10 border-ok/30 text-ok' : part.status === 'reserved' ? 'bg-warn/10 border-warn/30 text-warn' : 'bg-surface-el border-brd text-txt-muted hover:border-primary/40 hover:text-primary hover:bg-primary/[0.04]'">
                <span class="text-[10px] opacity-60 font-medium mb-1">الجزء {{part.juzNumber}}</span>
                <span class="text-sm font-black font-quran leading-tight">{{khatmaService.getJuzName(part.juzNumber)}}</span>
                <svg class="w-3.5 h-3.5 mt-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  @if (part.status === 'completed') {<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>}
                  @else if (part.status === 'reserved') {<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>}
                  @else {<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>}
                </svg>
              </button>
            }
          </div>
          <!-- Legend -->
          <div class="flex flex-wrap gap-5 mt-6 justify-center">
            <span class="flex items-center gap-1.5 text-[11px] text-txt-muted"><span class="w-3 h-3 rounded bg-ok/20 border border-ok/30"></span> مكتمل</span>
            <span class="flex items-center gap-1.5 text-[11px] text-txt-muted"><span class="w-3 h-3 rounded bg-warn/20 border border-warn/30"></span> محجوز</span>
            <span class="flex items-center gap-1.5 text-[11px] text-txt-muted"><span class="w-3 h-3 rounded bg-surface-el border border-brd"></span> متاح</span>
          </div>
        </div>
      </div>
    }

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4" (click)="showModal.set(false)">
        <div class="animate-scale-in bg-surface-el rounded-3xl w-full max-w-sm p-7 shadow-2xl border border-brd" (click)="$event.stopPropagation()">
          <h3 class="text-base font-bold text-txt mb-1">{{modalTitle()}}</h3>
          <p class="text-xs text-txt-muted mb-5">{{modalDesc()}}</p>
          <input [(ngModel)]="userName" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all mb-5" placeholder="أدخل اسمك"/>
          <div class="flex gap-3">
            <button (click)="showModal.set(false)" class="flex-1 py-3 text-txt-muted bg-surface border border-brd rounded-xl font-bold text-xs hover:bg-bg transition-colors">إلغاء</button>
            <button (click)="confirmAction()" [disabled]="!userName.trim()" class="flex-1 py-3 text-primary-text bg-primary hover:bg-primary-hover rounded-xl font-bold text-xs disabled:opacity-40 transition-all shadow-md shadow-primary/15">تأكيد</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class KhatmaDetailComponent {
  private route = inject(ActivatedRoute);
  khatmaService = inject(KhatmaService); // Changed to public/protected access implicitly for template

  khatma = this.khatmaService.getKhatmaById(this.route.snapshot.paramMap.get('id') || '');
  participants = this.khatmaService.getParticipants(this.route.snapshot.paramMap.get('id') || '');

  showModal = signal(false);
  modalTitle = signal('');
  modalDesc = signal('');
  userName = '';
  selectedPart: any = null;
  pendingAction: 'reserve' | 'complete' = 'reserve';
  copied = false;

  getCompletedCount(k: any) { return k.parts.filter((p: any) => p.status === 'completed').length; }
  getRemainingCount(k: any) { return k.parts.filter((p: any) => p.status === 'available').length; }

  onPartClick(part: any, k: any) {
    this.selectedPart = part;
    const juzName = this.khatmaService.getJuzName(part.juzNumber);
    if (part.status === 'available') {
      this.pendingAction = 'reserve';
      this.modalTitle.set(`حجز ${juzName}`);
      this.modalDesc.set(`أدخل اسمك لحجز ${juzName} (${part.juzNumber})`);
      this.showModal.set(true);
    } else if (part.status === 'reserved') {
      this.pendingAction = 'complete';
      this.modalTitle.set(`إتمام ${juzName}`);
      this.modalDesc.set('أدخل اسمك لتأكيد إتمام القراءة');
      this.showModal.set(true);
    }
  }

  confirmAction() {
    if (!this.userName.trim() || !this.selectedPart) return;
    const id = this.route.snapshot.paramMap.get('id') || '';
    const status = this.pendingAction === 'reserve' ? 'reserved' : 'completed';
    this.khatmaService.updatePartStatus(id, this.selectedPart.juzNumber, status, this.userName.trim());
    this.showModal.set(false);
    this.userName = '';
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
