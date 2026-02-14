import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';

@Component({
  selector: 'app-create-khatma-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-khatma-modal.component.html',
  styleUrl: './create-khatma-modal.component.css'
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
