import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { KhatmaService, Khatma, KhatmaPart } from '../../../services/khatma.service';

@Component({
  selector: 'app-khatma-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './khatma-detail.component.html',
  styleUrl: './khatma-detail.component.css'
})
export class KhatmaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private khatmaService = inject(KhatmaService);
  private datePipe = inject(DatePipe);

  khatmaId = signal<string | null>(null);
  khatma = computed(() => {
    const id = this.khatmaId();
    if (!id) return undefined;
    const kSignal = this.khatmaService.getKhatmaById(String(id));
    return kSignal();
  });
  
  completedCount = computed(() => this.khatma()?.parts.filter(p => p.status === 'completed').length || 0);

  selectedPart = signal<any>(null);
  toast = signal<{msg: string, type: 'success' | 'info'} | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.khatmaId.set(id);
    });
  }
  
  selectPart(part: any) { this.selectedPart.set(part); }

  reserveAndRead(name: string) {
    if (!name.trim() || !this.khatma()) return;
    this.khatmaService.updatePartStatus(this.khatma()!.id, this.selectedPart().juzNumber, 'reserved', name);
    this.showToast('تم حجز الجزء بنجاح', 'success');
    this.router.navigate(['/quran/juz', this.selectedPart().juzNumber], { queryParams: { khatmaId: this.khatma()!.id } });
    this.selectedPart.set(null);
  }

  completePart() {
    if (!this.khatma()) return;
    this.khatmaService.updatePartStatus(this.khatma()!.id, this.selectedPart().juzNumber, 'completed', this.selectedPart().reservedBy);
    this.showToast('بارك الله فيك! تم إتمام الجزء', 'success');
    this.selectedPart.set(null);
  }

  shareWhatsApp() {
    const k = this.khatma();
    if (!k) return;
    const text = `أدعوك للمشاركة في ختمة القرآن: ${k.title}\nعن روح: ${k.deceasedName || 'فاعل خير'}\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    this.showToast('تم نسخ الرابط الحافظة', 'info');
  }

  showToast(msg: string, type: 'success' | 'info') {
    this.toast.set({msg, type});
    setTimeout(() => this.toast.set(null), 3000);
  }

  getJuzName(juz: number) { return `الجزء ${juz}`; }
  getJuzSurahs(juz: number) { return `سور الجزء ${juz}`; } // Placeholder

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }
  
  getAnniversaryInfo(deathDate: Date) {
     const today = new Date();
     const d = new Date(deathDate);
     const years = today.getFullYear() - d.getFullYear();
     const nextAnniv = new Date(d);
     nextAnniv.setFullYear(today.getFullYear());
     if (nextAnniv < today) nextAnniv.setFullYear(today.getFullYear() + 1);
     
     const diffTime = Math.abs(nextAnniv.getTime() - today.getTime());
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

     return {
       years: years > 0 ? years : 1,
       daysUntil: diffDays,
       message: diffDays === 0 ? 'اليوم هو ذكرى الوفاة' : `باقي ${diffDays} يوم على الذكرى`
     };
  }
}
