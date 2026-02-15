import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KhatmaService } from '../../../services/khatma.service';

interface Verse {
  number: number;
  surahNumber: number;
  text: string;
  translationEn?: string;
  numberInSurah: number;
}

type SharePlatform = 'whatsapp' | 'telegram' | 'x';

interface ReciterOption {
  id: string;
  name: string;
}

interface QuranApiAyah {
  number: number;
  numberInSurah: number;
  text: string;
  surah?: {
    number: number;
  };
}

interface QuranApiResponse {
  code: number;
  status: string;
  data?: {
    ayahs?: QuranApiAyah[];
  };
}

@Component({
  selector: 'app-juz-reader',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './juz-reader.component.html',
  styleUrl: './juz-reader.component.css'
})
export class JuzReaderComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private khatmaService = inject(KhatmaService);
  private lastLoadKey: string | null = null;

  juzNumber = signal<number>(1);
  khatmaId = signal<string | null>(null);
  readerName = signal<string | null>(null);
  verses = signal<Verse[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);
  accessError = signal<string | null>(null);

  // Settings
  fontSize = signal(24);
  isDarkMode = signal(false);
  scrollProgress = signal(0);
  showTranslation = signal(false);

  // Audio & AI
  currentAudio: HTMLAudioElement | null = null;
  isPlaying = signal(false);
  currentPlayingVerse = signal<number | null>(null);
  currentPlayingWordIndex = signal<number | null>(null);
  private wordPlaybackActive = false;
  private wordPlaybackAbort = false;
  reciterId = signal<string>('ar.alafasy');
  readonly reciters: ReciterOption[] = [
    { id: 'ar.alafasy', name: 'العفاسي' },
    { id: 'ar.husary', name: 'الحصري' },
    { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط' },
    { id: 'ar.minshawi', name: 'المنشاوي' }
  ];
  showAiCoach = signal(false);
  aiRecording = signal(false);
  bookmarkedVerses = signal<number[]>([]);
  showToast = signal(false);
  toastMessage = signal('');
  private verseWordsCache = new Map<number, string[]>();
  private verseWordAudioCache = new Map<number, Array<{ text: string; audioUrl: string }>>();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const juz = Number(params.get('juz'));
      if (Number.isFinite(juz) && juz >= 1 && juz <= 30) {
        this.juzNumber.set(juz);
        this.processRouteContext();
      } else {
        this.loading.set(false);
      }
    });

    this.route.queryParams.subscribe(params => {
      const kId = params['khatmaId'];
      if (typeof kId === 'string' && kId.trim()) {
        this.khatmaId.set(kId);
      } else {
        this.khatmaId.set(null);
      }
      this.processRouteContext();
    });

    // Restore settings
    const savedSize = localStorage.getItem('quran-font-size');
    if (savedSize) this.fontSize.set(Number(savedSize));

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode.set(savedTheme === 'dark');

    const savedReciter = localStorage.getItem('quran-reciter');
    if (savedReciter && this.reciters.some(r => r.id === savedReciter)) {
      this.reciterId.set(savedReciter);
    }

    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks) as number[];
        if (Array.isArray(parsed)) {
          this.bookmarkedVerses.set(parsed.filter((v) => Number.isFinite(v)));
        }
      } catch {
        this.bookmarkedVerses.set([]);
      }
    }
  }

  private processRouteContext() {
    const juz = this.juzNumber();
    if (!(Number.isFinite(juz) && juz >= 1 && juz <= 30)) {
      this.accessError.set('رقم الجزء غير صالح.');
      this.loading.set(false);
      this.verses.set([]);
      return;
    }

    this.accessError.set(null);
    const currentKhatmaId = this.khatmaId();

    if (currentKhatmaId) {
      const khatma = this.khatmaService.getKhatmaById(currentKhatmaId)();
      if (!khatma) {
        this.accessError.set('الختمة غير موجودة.');
        this.loading.set(false);
        this.verses.set([]);
        this.lastLoadKey = null;
        return;
      }

      const part = khatma.parts.find(p => p.juzNumber === juz);
      if (!part) {
        this.accessError.set('الجزء غير موجود داخل هذه الختمة.');
        this.loading.set(false);
        this.verses.set([]);
        this.lastLoadKey = null;
        return;
      }

      if (part.status === 'available') {
        this.accessError.set('لازم تحجز الجزء من صفحة الختمة أولاً قبل القراءة.');
        this.loading.set(false);
        this.verses.set([]);
        this.lastLoadKey = null;
        return;
      }

      this.readerName.set(part.reservedBy || part.completedBy || null);
    } else {
      this.readerName.set(null);
    }

    const loadKey = `${juz}|${currentKhatmaId ?? ''}`;
    if (this.lastLoadKey === loadKey && (this.verses().length > 0 || this.loading())) {
      return;
    }

    this.lastLoadKey = loadKey;
    this.loadJuz(juz);
  }

  async loadJuz(juz: number) {
    this.loading.set(true);
    this.loadError.set(null);
    this.verses.set([]);
    this.verseWordsCache.clear();
    this.verseWordAudioCache.clear();

    try {
      const [arabicResponse, englishTranslationResponse] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/juz/${juz}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/juz/${juz}/en.asad`)
      ]);

      if (!arabicResponse.ok || !englishTranslationResponse.ok) {
        throw new Error(`HTTP ${arabicResponse.status}/${englishTranslationResponse.status}`);
      }

      const arabicPayload = (await arabicResponse.json()) as QuranApiResponse;
      const englishTranslationPayload = (await englishTranslationResponse.json()) as QuranApiResponse;

      const ayahs = arabicPayload.data?.ayahs ?? [];
      const englishTranslationAyahs = englishTranslationPayload.data?.ayahs ?? [];

      if (!ayahs.length) {
        throw new Error('No ayahs returned');
      }

      const englishTranslationByNumber = new Map<number, string>(
        englishTranslationAyahs.map((ayah) => [ayah.number, ayah.text])
      );

      const mappedVerses: Verse[] = ayahs.map((ayah) => ({
        number: ayah.number,
        surahNumber: ayah.surah?.number ?? 1,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translationEn: englishTranslationByNumber.get(ayah.number)
      }));

      this.verses.set(mappedVerses);
    } catch {
      this.loadError.set('تعذر تحميل آيات الجزء حالياً. تأكد من الاتصال بالإنترنت ثم حاول مرة أخرى.');
    } finally {
      this.loading.set(false);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    this.scrollProgress.set((scrolled / docHeight) * 100);
  }

  increaseFontSize() {
    this.fontSize.update(s => Math.min(s + 2, 48));
    localStorage.setItem('quran-font-size', String(this.fontSize()));
  }

  decreaseFontSize() {
    this.fontSize.update(s => Math.max(s - 2, 16));
    localStorage.setItem('quran-font-size', String(this.fontSize()));
  }

  toggleTheme() {
    this.isDarkMode.update(d => !d);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    if (this.isDarkMode()) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  toggleTranslation() {
    this.showTranslation.update(v => !v);
  }

  async playAudio(verse: Verse) {
    if (this.currentPlayingVerse() === verse.number && this.currentAudio && this.isPlaying()) {
      this.stopPlayback();
      return;
    }

    this.stopPlayback();

    const preferredReciter = this.reciterId();
    let audioUrl = await this.fetchAyahAudioUrl(verse.number, preferredReciter);
    let activeReciter = preferredReciter;

    if (!audioUrl && preferredReciter !== 'ar.alafasy') {
      audioUrl = await this.fetchAyahAudioUrl(verse.number, 'ar.alafasy');
      activeReciter = 'ar.alafasy';
      this.reciterId.set('ar.alafasy');
      localStorage.setItem('quran-reciter', 'ar.alafasy');
      this.triggerToast('القارئ المختار غير متاح لهذه الآية، تم التحويل للعفاسي');
    }

    if (!audioUrl) {
      this.triggerToast('تعذر تشغيل التلاوة حالياً');
      return;
    }

    this.currentAudio = new Audio(audioUrl);
    this.currentPlayingVerse.set(verse.number);
    this.isPlaying.set(true);

    this.currentAudio.onended = () => {
      this.isPlaying.set(false);
      this.currentAudio = null;
      this.currentPlayingVerse.set(null);
    };

    this.currentAudio.onerror = () => {
      this.isPlaying.set(false);
      this.currentAudio = null;
      this.currentPlayingVerse.set(null);
      this.triggerToast(activeReciter === preferredReciter ? 'تعذر تشغيل هذا القارئ الآن' : 'تعذر تشغيل التلاوة حالياً');
    };

    try {
      await this.currentAudio.play();
    } catch {
      this.isPlaying.set(false);
      this.currentAudio = null;
      this.currentPlayingVerse.set(null);
      this.triggerToast('تعذر تشغيل التلاوة حالياً');
    }
  }

  copyVerse(verse: Verse) {
    const translationLine = verse.translationEn ? `\n\nEnglish translation:\n${verse.translationEn}` : '';
    navigator.clipboard.writeText(`${verse.text} [${verse.numberInSurah}]${translationLine}`);
    this.triggerToast('تم نسخ الآية بنجاح');
  }

  getVerseWords(verse: Verse): string[] {
    const cached = this.verseWordsCache.get(verse.number);
    if (cached) return cached;

    const words = verse.text.split(/\s+/).filter(Boolean);
    this.verseWordsCache.set(verse.number, words);
    return words;
  }

  /** Click a word: starts continuous playback from that word onward. Click again to stop. */
  async pronounceWord(word: string, verse: Verse, wordIndex: number) {
    if (!word.trim()) return;

    // If already playing, stop
    if (this.wordPlaybackActive) {
      this.stopPlayback();
      return;
    }

    this.stopPlayback();

    const wordAudioUnits = await this.getWordAudioUnits(verse);
    if (!wordAudioUnits.length) {
      this.triggerToast('تعذر تشغيل نطق الكلمات');
      return;
    }

    // Find the correct audio unit by text matching (not raw index)
    const startIdx = this.findAudioStartIndex(word, wordIndex, wordAudioUnits);

    this.wordPlaybackActive = true;
    this.wordPlaybackAbort = false;
    this.currentPlayingVerse.set(verse.number);
    this.isPlaying.set(true);

    for (let i = startIdx; i < wordAudioUnits.length; i++) {
      if (this.wordPlaybackAbort) break;

      this.currentPlayingWordIndex.set(i);

      const unit = wordAudioUnits[i];
      if (!unit.audioUrl) continue;

      try {
        await this.playWordAudio(unit.audioUrl);
      } catch {
        // Skip failed words
      }

      if (this.wordPlaybackAbort) break;
    }

    this.wordPlaybackActive = false;
    this.isPlaying.set(false);
    this.currentPlayingVerse.set(null);
    this.currentPlayingWordIndex.set(null);
  }

  /** Match clicked word text against audio units to find the correct start index */
  private findAudioStartIndex(
    clickedWord: string,
    clickedDisplayIndex: number,
    units: Array<{ text: string; audioUrl: string }>
  ): number {
    if (!units.length) return 0;

    const normClicked = this.normalizeArabicWord(clickedWord);

    // Find all audio units that match the clicked word text
    const exactMatches: number[] = [];
    for (let i = 0; i < units.length; i++) {
      if (this.normalizeArabicWord(units[i].text) === normClicked) {
        exactMatches.push(i);
      }
    }

    // Pick the match closest to the display index
    if (exactMatches.length) {
      return exactMatches.reduce((best, curr) =>
        Math.abs(curr - clickedDisplayIndex) < Math.abs(best - clickedDisplayIndex) ? curr : best
      );
    }

    // Fallback: use display index clamped to valid range
    return Math.min(clickedDisplayIndex, units.length - 1);
  }

  private playWordAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.onended = () => {
        resolve();
      };
      this.currentAudio.onerror = () => {
        reject(new Error('Audio error'));
      };
      this.currentAudio.play().catch(reject);
    });
  }

  stopPlayback() {
    this.wordPlaybackAbort = true;
    this.wordPlaybackActive = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying.set(false);
    this.currentPlayingVerse.set(null);
    this.currentPlayingWordIndex.set(null);
  }

  shareVerse(verse: Verse, platform: SharePlatform) {
    const base = `${location.origin}/#/quran/juz/${this.juzNumber()}`;
    const text = `آية من الجزء ${this.juzNumber()}:\n${verse.text}\n\n${verse.translationEn ?? ''}\n\n${base}`;
    const encoded = encodeURIComponent(text);

    const urls: Record<SharePlatform, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(base)}&text=${encoded}`,
      x: `https://x.com/intent/tweet?text=${encoded}`
    };

    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  }

  toggleBookmark(verse: Verse) {
    const verseNumber = verse.number;
    this.bookmarkedVerses.update((items) => {
      const exists = items.includes(verseNumber);
      const updated = exists ? items.filter((n) => n !== verseNumber) : [...items, verseNumber];
      localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
      this.triggerToast(exists ? 'تم إزالة العلامة المرجعية' : 'تم حفظ علامة مرجعية');
      return updated;
    });
  }

  isBookmarked(verseNumber: number): boolean {
    return this.bookmarkedVerses().includes(verseNumber);
  }

  private triggerToast(message: string) {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2200);
  }

  private async getWordAudioUnits(verse: Verse): Promise<Array<{ text: string; audioUrl: string }>> {
    const cached = this.verseWordAudioCache.get(verse.number);
    if (cached) return cached;

    try {
      const verseKey = `${verse.surahNumber}:${verse.numberInSurah}`;
      const response = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,audio_url`);
      if (!response.ok) return [];

      const payload = await response.json() as {
        verse?: {
          words?: Array<{ char_type_name?: string; audio_url?: string | null; text_uthmani?: string }>;
        };
      };

      const units = (payload.verse?.words ?? [])
        .filter((w) => w.char_type_name === 'word' && !!w.audio_url)
        .map((w) => ({
          text: w.text_uthmani ?? '',
          audioUrl: `https://verses.quran.com/${w.audio_url as string}`
        }));

      this.verseWordAudioCache.set(verse.number, units);
      return units;
    } catch {
      return [];
    }
  }

  setReciter(reciterId: string) {
    if (!this.reciters.some(r => r.id === reciterId)) return;
    this.reciterId.set(reciterId);
    localStorage.setItem('quran-reciter', reciterId);

    this.stopPlayback();
  }

  private normalizeArabicWord(value: string): string {
    return value
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[^\u0621-\u063A\u0641-\u064A]/g, '')
      .trim();
  }

  private async fetchAyahAudioUrl(ayahNumber: number, reciterId: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/${reciterId}`);
      if (!response.ok) return null;

      const payload = await response.json() as { data?: { audio?: string } };
      return payload.data?.audio ?? null;
    } catch {
      return null;
    }
  }

  markAsCompleted() {
    const currentKhatmaId = this.khatmaId();
    const juz = this.juzNumber();

    if (!currentKhatmaId) {
      alert('تمت القراءة بنجاح. هذا الجزء غير مرتبط بختمة محددة.');
      return;
    }

    const khatma = this.khatmaService.getKhatmaById(currentKhatmaId)();
    const part = khatma?.parts.find(p => p.juzNumber === juz);
    if (!khatma || !part) {
      alert('تعذر تحديث حالة الجزء داخل الختمة.');
      return;
    }

    const completionName = this.readerName() || part.reservedBy || part.completedBy || 'قارئ';
    this.khatmaService.updatePartStatus(currentKhatmaId, juz, 'completed', completionName);
    alert('تم إتمام الجزء وتحديث الختمة، تقبل الله!');
    this.router.navigate(['/khatmat', currentKhatmaId]);
  }

  startAiRecording() { this.aiRecording.set(true); }
  stopAiRecording() { this.aiRecording.set(false); }

  getJuzName(juz: number): string {
    return this.khatmaService.getJuzName(juz);
  }

  getJuzSurahs(juz: number): string {
    const surahs = this.khatmaService.getJuzSurahs(juz);
    return surahs.length ? surahs.join('، ') : 'غير متاح';
  }

  ngOnDestroy() {
    this.stopPlayback();
  }
}
