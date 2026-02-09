import { Injectable, signal, computed } from '@angular/core';

export interface KhatmaPart {
  juzNumber: number;
  status: 'available' | 'reserved' | 'completed';
  reservedBy?: string;
  completedBy?: string;
  updatedAt?: Date;
}

export interface Khatma {
  id: string;
  title: string;
  createdBy: string;
  deceasedName?: string;
  description: string;
  createdAt: Date;
  status: 'active' | 'completed';
  progress: number;
  parts: KhatmaPart[];
}

export const JUZ_NAMES = [
  "الم", "سيقول", "تلك الرسل", "لن تنالوا", "والمحصنات", "لا يحب الله", "وإذا سمعوا", "ولو أننا", "قال الملأ", "واعلموا",
  "يعتذرون", "وما من دابة", "وما أبرئ", "ربما", "سبحان الذي", "قال ألم", "اقترب", "قد أفلح", "وقال الذين", "أمن خلق",
  "اتلُ ما أوحي", "ومن يقنت", "وما لي", "فمن أظلم", "إليه يُرد", "حم", "قال فما خطبكم", "قد سمع الله", "تبارك", "عمّ"
];

@Injectable({
  providedIn: 'root'
})
export class KhatmaService {
  private khatmasSignal = signal<Khatma[]>([
    {
      id: 'k1',
      title: 'ختمة شهر رمضان المبارك',
      createdBy: 'محمد أحمد',
      description: 'ختمة جماعية بنية التيسير والقبول.',
      createdAt: new Date(),
      status: 'active',
      progress: 10,
      parts: Array.from({ length: 30 }, (_, i) => ({
        juzNumber: i + 1,
        status: i < 3 ? 'completed' as const : (i === 3 ? 'reserved' as const : 'available' as const),
        reservedBy: i === 3 ? 'أحمد' : undefined,
        completedBy: i < 3 ? ['فاطمة', 'عمر', 'خالد'][i] : undefined
      }))
    },
    {
      id: 'k2',
      title: 'ختمة للمرحوم الوالد',
      createdBy: 'سارة عبدالله',
      deceasedName: 'عبدالله بن محمد',
      description: 'اللهم اغفر له وارحمه.',
      createdAt: new Date(),
      status: 'active',
      progress: 50,
      parts: Array.from({ length: 30 }, (_, i) => ({
        juzNumber: i + 1,
        status: i < 15 ? 'completed' as const : 'available' as const,
        completedBy: i < 15 ? ['أحمد', 'فاطمة', 'محمد', 'علي', 'نورة', 'خالد', 'ريم', 'عمر', 'سارة', 'يوسف', 'مريم', 'حسن', 'دانة', 'سلطان', 'هدى'][i] : undefined
      }))
    }
  ]);

  readonly khatmas = this.khatmasSignal.asReadonly();

  getKhatmaById(id: string) {
    return computed(() => this.khatmasSignal().find(k => k.id === id));
  }

  getJuzName(juzNumber: number): string {
    return JUZ_NAMES[juzNumber - 1] || `${juzNumber}`;
  }

  addKhatma(title: string, createdBy: string, deceasedName: string, description: string): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newKhatma: Khatma = {
      id,
      title,
      createdBy,
      deceasedName,
      description,
      createdAt: new Date(),
      status: 'active',
      progress: 0,
      parts: Array.from({ length: 30 }, (_, i) => ({ juzNumber: i + 1, status: 'available' }))
    };
    this.khatmasSignal.update(list => [newKhatma, ...list]);
    return id;
  }

  updatePartStatus(khatmaId: string, juzNumber: number, status: 'available' | 'reserved' | 'completed', userName?: string) {
    this.khatmasSignal.update(list => list.map(k => {
      if (k.id !== khatmaId) return k;

      const updatedParts = k.parts.map(p => {
        if (p.juzNumber !== juzNumber) return p;
        return {
          ...p,
          status,
          reservedBy: status === 'reserved' ? userName : undefined,
          completedBy: status === 'completed' ? (userName || p.reservedBy || 'مجهول') : undefined,
          updatedAt: new Date()
        };
      });

      const completedCount = updatedParts.filter(p => p.status === 'completed').length;
      const progress = Math.round((completedCount / 30) * 100);

      return { ...k, parts: updatedParts, progress };
    }));
  }

  getParticipants(khatmaId: string) {
    return computed(() => {
      const k = this.khatmasSignal().find(k => k.id === khatmaId);
      if (!k) return [];
      const names = new Set<string>();
      k.parts.forEach(p => {
        if (p.completedBy) names.add(p.completedBy);
        if (p.reservedBy) names.add(p.reservedBy);
      });
      return Array.from(names);
    });
  }
}
