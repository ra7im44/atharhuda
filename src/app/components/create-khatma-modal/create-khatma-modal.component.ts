import { Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';

@Component({
  selector: 'app-create-khatma-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center p-4" (click)="close.emit()">
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
          <button (click)="close.emit()" class="flex-1 py-3.5 text-txt-muted bg-surface-el border border-brd rounded-xl font-bold text-xs hover:bg-bg transition-colors">إلغاء</button>
          <button (click)="create()" [disabled]="!canCreate" class="flex-[2] py-3.5 text-white bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-xs disabled:opacity-40 transition-all shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]">إنشاء ✨</button>
        </div>
      </div>
    </div>
  `
})
export class CreateKhatmaModalComponent {
  close = output<void>();
  created = output<string>();

  private khatmaService = inject(KhatmaService);

  newKhatma = { title: '', createdBy: '', deceasedName: '', description: '' };
  deceasedDeathDateStr = '';

  get canCreate() {
    return this.newKhatma.title.trim() && this.newKhatma.createdBy.trim() && this.newKhatma.description.trim();
  }

  create() {
    if (!this.canCreate) return;
    const deathDate = this.deceasedDeathDateStr ? new Date(this.deceasedDeathDateStr) : undefined;
    const id = this.khatmaService.addKhatma(
      this.newKhatma.title,
      this.newKhatma.createdBy,
      this.newKhatma.deceasedName,
      this.newKhatma.description,
      deathDate
    );
    this.created.emit(id);
    this.close.emit();
  }
}
