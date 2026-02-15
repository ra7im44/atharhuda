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
  completedAt?: Date;
}

export interface KhatmaCompletionRecord {
  id: string;
  khatmaId: string;
  title: string;
  createdBy: string;
  deceasedName?: string;
  completedAt: Date;
  participants: string[];
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
  private readonly STORAGE_KEYS = {
    khatmas: 'khatma-list-v1',
    completionLog: 'khatma-completion-log-v1'
  } as const;

  private readonly initialKhatmas: Khatma[] = [
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
  ];

  private khatmasSignal = signal<Khatma[]>(this.initialKhatmas);
  private completionLogSignal = signal<KhatmaCompletionRecord[]>([]);

  readonly khatmas = this.khatmasSignal.asReadonly();
  readonly completionLog = computed(() => {
    return [...this.completionLogSignal()].sort((a, b) => {
      return b.completedAt.getTime() - a.completedAt.getTime();
    });
  });

  constructor() {
    this.loadFromStorage();
    this.syncCompletionLogWithCurrentState();
    this.saveToStorage();
  }

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
    this.saveToStorage();
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
      const isNowCompleted = completedCount === 30;
      const completedAt = isNowCompleted ? (k.completedAt || new Date()) : undefined;
      const participants = this.collectParticipantsFromParts(updatedParts);

      if (isNowCompleted) {
        const completionDate = completedAt ?? new Date();
        this.addCompletionRecordIfMissing({
          id: this.buildCompletionRecordId(k.id, completionDate),
          khatmaId: k.id,
          title: k.title,
          createdBy: k.createdBy,
          deceasedName: k.deceasedName,
          completedAt: completionDate,
          participants
        });
      }

      return {
        ...k,
        parts: updatedParts,
        progress,
        status: isNowCompleted ? 'completed' : 'active',
        completedAt
      };
    }));
    this.saveToStorage();
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

  private collectParticipantsFromParts(parts: KhatmaPart[]): string[] {
    const names = new Set<string>();
    parts.forEach(p => {
      if (p.completedBy) names.add(p.completedBy);
      if (p.reservedBy) names.add(p.reservedBy);
    });
    return Array.from(names);
  }

  private buildCompletionRecordId(khatmaId: string, completedAt: Date): string {
    return `${khatmaId}-${completedAt.getTime()}`;
  }

  private addCompletionRecordIfMissing(record: KhatmaCompletionRecord) {
    this.completionLogSignal.update(records => {
      if (records.some(r => r.id === record.id)) return records;
      return [record, ...records];
    });
  }

  private syncCompletionLogWithCurrentState() {
    const currentCompleted = this.khatmasSignal()
      .filter(k => k.parts.every(p => p.status === 'completed'))
      .map(k => {
        const completedAt = k.completedAt || new Date();
        return {
          id: this.buildCompletionRecordId(k.id, completedAt),
          khatmaId: k.id,
          title: k.title,
          createdBy: k.createdBy,
          deceasedName: k.deceasedName,
          completedAt,
          participants: this.collectParticipantsFromParts(k.parts)
        } as KhatmaCompletionRecord;
      });

    if (!currentCompleted.length) return;

    this.completionLogSignal.update(existing => {
      const map = new Map(existing.map(item => [item.id, item]));
      currentCompleted.forEach(item => map.set(item.id, item));
      return Array.from(map.values()).sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    });

    this.khatmasSignal.update(list => list.map(k => {
      const completedCount = k.parts.filter(p => p.status === 'completed').length;
      const isCompleted = completedCount === 30;
      return {
        ...k,
        progress: Math.round((completedCount / 30) * 100),
        status: isCompleted ? 'completed' : 'active',
        completedAt: isCompleted ? (k.completedAt || new Date()) : undefined
      };
    }));
  }

  private loadFromStorage() {
    try {
      const rawKhatmas = localStorage.getItem(this.STORAGE_KEYS.khatmas);
      const rawLog = localStorage.getItem(this.STORAGE_KEYS.completionLog);

      if (rawKhatmas) {
        const parsed = JSON.parse(rawKhatmas) as any[];
        if (Array.isArray(parsed) && parsed.length) {
          this.khatmasSignal.set(parsed.map(item => this.hydrateKhatma(item)));
        }
      }

      if (rawLog) {
        const parsedLog = JSON.parse(rawLog) as any[];
        if (Array.isArray(parsedLog)) {
          this.completionLogSignal.set(parsedLog.map(item => this.hydrateCompletionRecord(item)));
        }
      }
    } catch {
      this.khatmasSignal.set(this.initialKhatmas);
      this.completionLogSignal.set([]);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.khatmas, JSON.stringify(this.khatmasSignal()));
      localStorage.setItem(this.STORAGE_KEYS.completionLog, JSON.stringify(this.completionLogSignal()));
    } catch {
      // Ignore write failures to keep app usable in restricted environments.
    }
  }

  private hydrateKhatma(item: any): Khatma {
    return {
      ...item,
      createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
      deceasedDeathDate: item?.deceasedDeathDate ? new Date(item.deceasedDeathDate) : undefined,
      completedAt: item?.completedAt ? new Date(item.completedAt) : undefined,
      parts: Array.isArray(item?.parts) ? item.parts.map((part: any) => ({
        ...part,
        updatedAt: part?.updatedAt ? new Date(part.updatedAt) : undefined
      })) : []
    };
  }

  private hydrateCompletionRecord(item: any): KhatmaCompletionRecord {
    return {
      id: item?.id || Math.random().toString(36).substring(2, 11),
      khatmaId: item?.khatmaId || '',
      title: item?.title || 'ختمة',
      createdBy: item?.createdBy || 'غير معروف',
      deceasedName: item?.deceasedName || undefined,
      completedAt: item?.completedAt ? new Date(item.completedAt) : new Date(),
      participants: Array.isArray(item?.participants) ? item.participants : []
    };
  }
}
