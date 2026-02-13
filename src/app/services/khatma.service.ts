import { Injectable, signal, computed } from '@angular/core';

export interface KhatmaPart {
  juzNumber: number;
  status: 'available' | 'reserved' | 'completed';
  reservedBy?: string;
  completedBy?: string;
  updatedAt?: Date;
  readSurahs?: string[]; // السور المقروءة
}

export interface Khatma {
  id: string;
  title: string;
  createdBy: string;
  deceasedName?: string;
  deceasedDeathDate?: Date;
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

// السور في كل جزء
export const JUZ_SURAHS: { [key: number]: string[] } = {
  1: ["الفاتحة", "البقرة"],
  2: ["البقرة"],
  3: ["البقرة", "آل عمران"],
  4: ["آل عمران", "النساء"],
  5: ["النساء"],
  6: ["النساء", "المائدة"],
  7: ["المائدة", "الأنعام"],
  8: ["الأنعام", "الأعراف"],
  9: ["الأعراف", "الأنفال"],
  10: ["الأنفال", "التوبة"],
  11: ["التوبة", "يونس", "هود"],
  12: ["يوسف", "الرعد", "إبراهيم"],
  13: ["الحجر", "النحل"],
  14: ["النحل", "الإسراء"],
  15: ["الإسراء", "الكهف", "مريم"],
  16: ["الأنبياء", "الحج"],
  17: ["المؤمنون", "النور", "الفرقان"],
  18: ["الفرقان", "الشعراء", "النمل"],
  19: ["النمل", "القصص"],
  20: ["القصص", "العنكبوت", "الروم"],
  21: ["لقمان", "السجدة", "الأحزاب"],
  22: ["الأحزاب", "سبأ", "فاطر"],
  23: ["يس", "الصافات", "ص", "الزمر"],
  24: ["الزمر", "غافر", "فصلت"],
  25: ["فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية"],
  26: ["الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات"],
  27: ["الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد"],
  28: ["المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم"],
  29: ["الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات"],
  30: ["النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"]
};

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
        completedBy: i < 3 ? ['فاطمة', 'عمر', 'خالد'][i] : undefined,
        readSurahs: i < 3 ? JUZ_SURAHS[i + 1] : undefined
      }))
    },
    {
      id: 'k2',
      title: 'ختمة للمرحوم الوالد',
      createdBy: 'سارة عبدالله',
      deceasedName: 'عبدالله بن محمد',
      deceasedDeathDate: new Date('2023-05-15'),
      description: 'اللهم اغفر له وارحمه.',
      createdAt: new Date(),
      status: 'active',
      progress: 50,
      parts: Array.from({ length: 30 }, (_, i) => ({
        juzNumber: i + 1,
        status: i < 15 ? 'completed' as const : 'available' as const,
        completedBy: i < 15 ? ['أحمد', 'فاطمة', 'محمد', 'علي', 'نورة', 'خالد', 'ريم', 'عمر', 'سارة', 'يوسف', 'مريم', 'حسن', 'دانة', 'سلطان', 'هدى'][i] : undefined,
        readSurahs: i < 15 ? JUZ_SURAHS[i + 1] : undefined
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

  getJuzSurahs(juzNumber: number): string[] {
    return JUZ_SURAHS[juzNumber] || [];
  }

  addKhatma(title: string, createdBy: string, deceasedName: string, description: string, deceasedDeathDate?: Date): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newKhatma: Khatma = {
      id,
      title,
      createdBy,
      deceasedName,
      deceasedDeathDate,
      description,
      createdAt: new Date(),
      status: 'active',
      progress: 0,
      parts: Array.from({ length: 30 }, (_, i) => ({ juzNumber: i + 1, status: 'available' }))
    };
    this.khatmasSignal.update(list => [newKhatma, ...list]);
    return id;
  }

  updatePartStatus(khatmaId: string, juzNumber: number, status: 'available' | 'reserved' | 'completed', userName?: string, readSurahs?: string[]) {
    this.khatmasSignal.update(list => list.map(k => {
      if (k.id !== khatmaId) return k;

      const updatedParts = k.parts.map(p => {
        if (p.juzNumber !== juzNumber) return p;
        return {
          ...p,
          status,
          reservedBy: status === 'reserved' ? userName : undefined,
          completedBy: status === 'completed' ? (userName || p.reservedBy || 'مجهول') : undefined,
          readSurahs: status === 'completed' ? readSurahs : undefined,
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
