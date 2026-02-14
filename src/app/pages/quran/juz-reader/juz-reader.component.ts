import { Component, inject, computed, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Verse {
  number: number;
  text: string;
  translation?: string;
  tafsir?: string;
  audio?: string;
  numberInSurah: number;
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

  juzNumber = signal<number>(1);
  khatmaId = signal<number | null>(null);
  verses = signal<Verse[]>([]);
  loading = signal(true);
  
  // Settings
  fontSize = signal(24);
  showTafsir = signal(false);
  isDarkMode = signal(false);
  scrollProgress = signal(0);
  
  // Audio & AI
  currentAudio: HTMLAudioElement | null = null;
  isPlaying = signal(false);
  showAiCoach = signal(false);
  aiRecording = signal(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const juz = Number(params.get('juzNumber'));
      if (juz) {
        this.juzNumber.set(juz);
        this.loadJuz(juz);
      }
    });

    this.route.queryParams.subscribe(params => {
      const kId = params['khatmaId'];
      if (kId) this.khatmaId.set(Number(kId));
    });

    // Restore settings
    const savedSize = localStorage.getItem('quran-font-size');
    if (savedSize) this.fontSize.set(Number(savedSize));
    
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode.set(savedTheme === 'dark');
  }

  async loadJuz(juz: number) {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
       const mockVerses: Verse[] = Array.from({length: 20}, (_, i) => ({
         number: i + 1,
         numberInSurah: i + 1,
         text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. الرَّحْمَٰنِ الرَّحِيمِ. مَالِكِ يَوْمِ الدِّينِ...',
         translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful...',
         tafsir: 'تفسير ميسر للآية...',
         audio: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
       }));
       this.verses.set(mockVerses);
       this.loading.set(false);
    }, 1000);
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
  
  toggleTafsir() { this.showTafsir.update(v => !v); }

  playAudio(verse: Verse) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.isPlaying.set(false);
    }
    
    if (verse.audio) {
      this.currentAudio = new Audio(verse.audio);
      this.currentAudio.play();
      this.isPlaying.set(true);
      this.currentAudio.onended = () => {
         this.isPlaying.set(false);
         this.currentAudio = null;
      };
    }
  }

  copyVerse(verse: Verse) {
    navigator.clipboard.writeText(`${verse.text} [${verse.numberInSurah}]`);
    // Show toast
  }

  markAsCompleted() {
    // Logic to mark as completed via service
    alert('تم إتمام الجزء، تقبل الله!');
  }

  startAiRecording() { this.aiRecording.set(true); /* Implement real binding */ }
  stopAiRecording() { this.aiRecording.set(false); /* Implement real binding */ }

  ngOnDestroy() {
    if (this.currentAudio) this.currentAudio.pause();
  }
}
