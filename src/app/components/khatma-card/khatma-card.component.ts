import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Khatma } from '../../services/khatma.service';

@Component({
  selector: 'app-khatma-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card-lift group relative bg-surface rounded-[1.75rem] border border-brd/70 overflow-hidden">
      <!-- Progress Bar Top -->
      <div class="h-1 bg-surface-el"><div class="h-full bg-gradient-to-l from-primary via-secondary to-accent transition-all duration-1000" [style.width.%]="khatma().progress"></div></div>

      <div class="p-6 md:p-7">
        <div class="flex justify-between items-start mb-5">
          <div class="flex-1 min-w-0">
            @if (khatma().deceasedDeathDate) {
               @let days = getDaysToAnniversary(khatma().deceasedDeathDate!);
               @if (days <= 30 && days >= 0) {
                 <div class="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[9px] font-bold text-accent mb-2 w-fit animate-pulse-glow">
                   {{days === 0 ? 'اليوم ذكرى الوفاة' : 'باقي ' + days + ' يوم على الذكرى'}}
                 </div>
               }
             }
            <a [routerLink]="['/khatmat', khatma().id]" class="text-[15px] font-bold text-txt group-hover:text-primary transition-colors block truncate">{{khatma().title}}</a>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-[10px] text-txt-muted flex items-center gap-1.5">
                <div class="w-5 h-5 rounded-lg bg-primary/[0.06] flex items-center justify-center"><svg class="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg></div>
                {{khatma().createdBy}}
              </span>
              @if (khatma().deceasedName) {
                <span class="text-[10px] text-accent flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-lg bg-accent/[0.06] flex items-center justify-center"><svg class="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div>
                  {{khatma().deceasedName}}
                </span>
              }
            </div>
          </div>

        </div>

        <div class="flex items-center gap-1.5 text-[10px] text-txt-muted mb-5"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> {{completedParts}} / 30 جزء مكتمل</div>

        <div class="flex items-center gap-2.5">
          <a [routerLink]="['/khatmat', khatma().id]" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-[11px] transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> احجز جزء
          </a>
          <button (click)="shareKhatmaWhatsApp(khatma());$event.stopPropagation()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#25D366]/[0.08] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-md"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></button>
          <button (click)="copyKhatmaLink(khatma());$event.stopPropagation()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-el border border-brd text-txt-muted hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-110"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg></button>
        </div>
      </div>

      <!-- Toast -->
      @if (copiedToast) {<div class="absolute bottom-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-ok text-white text-[10px] font-bold rounded-xl shadow-xl animate-fade-up">✅ تم النسخ</div>}
    </div>
  `
})
export class KhatmaCardComponent {
  khatma = input.required<Khatma>();
  copiedToast = false;

  get completedParts() {
    return this.khatma().parts.filter(p => p.status === 'completed').length;
  }

  shareKhatmaWhatsApp(k: Khatma) {
    let t = `📖 شارك معنا في ختمة "${k.title}"`;
    if (k.deceasedName) t += `\n🕊️ عن: ${k.deceasedName}`;
    t += `\n📊 التقدم: ${k.progress}%\n\nاحجز جزء:\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
  }

  copyKhatmaLink(k: Khatma) {
    navigator.clipboard.writeText(`${location.origin}/#/khatmat/${k.id}`).then(() => {
      this.copiedToast = true;
      setTimeout(() => this.copiedToast = false, 2000);
    });
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
