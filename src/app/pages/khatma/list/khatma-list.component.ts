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
  templateUrl: './khatma-list.component.html',
  styleUrl: './khatma-list.component.css'
})
export class KhatmaListComponent {
  khatmaService = inject(KhatmaService);
  private router = inject(Router);
  isCreating = signal(false);
  searchQuery = signal('');

  createForm = new FormGroup({
    title: new FormControl('', Validators.required),
    createdBy: new FormControl('', Validators.required),
    deceasedName: new FormControl(''),
    deceasedDeathDate: new FormControl(''),
    description: new FormControl('', Validators.required),
  });

  filteredKhatmas = computed(() => {
    const all = this.khatmaService.khatmas();
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return all;
    return all.filter(k =>
      k.title.toLowerCase().includes(q) ||
      k.createdBy.toLowerCase().includes(q) ||
      (k.deceasedName?.toLowerCase().includes(q))
    );
  });

  onSubmit() {
    if (this.createForm.invalid) return;
    const v = this.createForm.value;
    const id = this.khatmaService.addKhatma(
      v.title!,
      v.createdBy!,
      v.deceasedName!,
      v.description!,
      v.deceasedDeathDate ? new Date(v.deceasedDeathDate) : undefined
    );
    this.isCreating.set(false);
    this.createForm.reset();
    this.router.navigate(['/khatmat', id]);
  }

  shareWhatsApp(k: any) {
    const text = `أدعوك للمشاركة في ختمة القرآن: ${k.title}\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  getDaysToAnniversary(date: Date): number {
    const deathDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const nextAnniversary = new Date(deathDate);
    nextAnniversary.setFullYear(today.getFullYear());
    nextAnniversary.setHours(0, 0, 0, 0); // Normalize anniversary to start of day

    // If the anniversary has already passed this year, set it for next year
    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(today.getFullYear() + 1);
    }

    // Calculate the difference in days
    const diffTime = nextAnniversary.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
