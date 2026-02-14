import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Khatma } from '../../services/khatma.service';

@Component({
  selector: 'app-khatma-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './khatma-card.component.html',
  styleUrl: './khatma-card.component.css'
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
