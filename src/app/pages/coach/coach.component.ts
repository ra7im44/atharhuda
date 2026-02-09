import { Component, inject, signal, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  loading?: boolean;
  error?: string;
  result?: {
    transcription: string;
    surah?: string;
    verses?: string;
    score: number;
    mistakes: { type: string; word: string; description: string }[];
    feedback: string;
  };
}

@Component({
  selector: 'app-coach',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-[calc(100vh-72px)] bg-bg relative overflow-hidden">

      <!-- BG -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute w-[600px] h-[600px] -top-40 -right-40 bg-primary/[0.04] rounded-full blur-3xl"></div>
        <div class="absolute w-[500px] h-[500px] -bottom-40 -left-40 bg-accent/[0.04] rounded-full blur-3xl"></div>
      </div>

      <!-- Header -->
      <header class="relative z-10 px-6 py-4 border-b border-brd bg-surface/80 backdrop-blur-xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </div>
          <div>
            <h1 class="text-lg font-black text-txt">المصحّح القرآني</h1>
            <p class="text-[10px] font-bold text-ok flex items-center gap-1"><span class="w-1.5 h-1.5 bg-ok rounded-full animate-pulse"></span> Gemini AI</p>
          </div>
        </div>
        <button (click)="messages.set([])" class="w-9 h-9 rounded-xl hover:bg-surface-el flex items-center justify-center text-txt-muted transition-colors" title="مسح">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </header>

      <!-- Chat -->
      <main #chatArea class="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 relative z-10">

        <!-- Empty State -->
        @if (messages().length === 0) {
          <div class="flex flex-col items-center justify-center h-full animate-fade-up text-center max-w-md mx-auto">
            <div class="relative mb-8">
              <div class="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/10">
                <svg class="w-14 h-14 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
              </div>
              <div class="absolute -inset-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-xl -z-10"></div>
            </div>

            <h2 class="text-2xl font-black text-txt mb-3">ابدأ التلاوة</h2>
            <p class="text-txt-muted leading-relaxed mb-8">اضغط على زر الميكروفون، اقرأ أي آية، ثم اضغط مرة أخرى لإيقاف التسجيل. سيقوم الذكاء الاصطناعي بتحليل تلاوتك فوراً.</p>

            <div class="grid grid-cols-3 gap-3 w-full text-center">
              <div class="bg-surface-el rounded-2xl p-4 border border-brd">
                <div class="text-2xl mb-2">🎤</div>
                <div class="text-[10px] font-bold text-txt-muted uppercase">سجّل</div>
              </div>
              <div class="bg-surface-el rounded-2xl p-4 border border-brd">
                <div class="text-2xl mb-2">🤖</div>
                <div class="text-[10px] font-bold text-txt-muted uppercase">تحليل AI</div>
              </div>
              <div class="bg-surface-el rounded-2xl p-4 border border-brd">
                <div class="text-2xl mb-2">✅</div>
                <div class="text-[10px] font-bold text-txt-muted uppercase">تصحيح</div>
              </div>
            </div>
          </div>
        }

        <!-- Messages -->
        @for (msg of messages(); track msg.id) {

          <!-- User bubble -->
          @if (msg.role === 'user') {
            <div class="flex justify-end animate-scale-in">
              <div class="bg-gradient-to-br from-primary to-accent text-white rounded-2xl rounded-br-md px-5 py-3 max-w-xs shadow-lg shadow-primary/20 flex items-center gap-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <div class="flex gap-0.5">
                      @for (i of [1,2,3,4,5]; track i) {
                        <div class="w-1 rounded-full bg-white/60" [style.height.px]="4 + (i % 3) * 6" [style.animation]="'wave 0.8s ease-in-out ' + (i * 0.1) + 's infinite alternate'"></div>
                      }
                    </div>
                    <span class="text-xs font-bold opacity-80">تسجيل صوتي</span>
                  </div>
                </div>
                <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              </div>
            </div>
          }

          <!-- AI bubble -->
          @if (msg.role === 'ai') {
            <div class="flex justify-start animate-scale-in">
              <div class="w-full max-w-lg">

                <!-- Loading -->
                @if (msg.loading) {
                  <div class="bg-surface border border-brd rounded-2xl rounded-bl-md p-5 shadow-sm">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <div class="text-sm font-bold text-txt">جاري التحليل...</div>
                        <div class="text-[10px] text-txt-muted">الذكاء الاصطناعي يستمع لتلاوتك</div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Error -->
                @if (msg.error) {
                  <div class="bg-err/5 border border-err/20 rounded-2xl rounded-bl-md p-5">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-xl bg-err/10 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-err" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                      </div>
                      <div>
                        <div class="text-sm font-bold text-err mb-1">حدث خطأ</div>
                        <div class="text-xs text-txt-muted">{{msg.error}}</div>
                      </div>
                    </div>
                  </div>
                }

                <!-- Result -->
                @if (msg.result) {
                  <div class="bg-surface border border-brd rounded-2xl rounded-bl-md overflow-hidden shadow-sm">

                    <!-- Score Header -->
                    <div class="p-4 flex items-center justify-between border-b border-brd bg-surface-el/50">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl flex items-center justify-center"
                          [class]="msg.result.score >= 85 ? 'bg-ok/10' : msg.result.score >= 60 ? 'bg-warn/10' : 'bg-err/10'">
                          <span class="text-sm font-black" [class]="msg.result.score >= 85 ? 'text-ok' : msg.result.score >= 60 ? 'text-warn' : 'text-err'">{{msg.result.score}}</span>
                        </div>
                        <div>
                          <div class="text-xs font-black" [class]="msg.result.score >= 85 ? 'text-ok' : msg.result.score >= 60 ? 'text-warn' : 'text-err'">
                            {{msg.result.score >= 85 ? 'ممتاز' : msg.result.score >= 60 ? 'جيد' : 'يحتاج تحسين'}}
                          </div>
                          @if (msg.result.surah) {
                            <div class="text-[10px] text-txt-muted">سورة {{msg.result.surah}} {{msg.result.verses ? '• آية ' + msg.result.verses : ''}}</div>
                          }
                        </div>
                      </div>
                      <!-- Score Bar -->
                      <div class="w-24 h-2 bg-surface rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-1000"
                          [class]="msg.result.score >= 85 ? 'bg-ok' : msg.result.score >= 60 ? 'bg-warn' : 'bg-err'"
                          [style.width.%]="msg.result.score"></div>
                      </div>
                    </div>

                    <!-- Transcription -->
                    <div class="p-5 border-b border-brd">
                      <div class="text-[10px] font-bold text-txt-muted uppercase tracking-wider mb-3">ما سمعه المصحّح</div>
                      <p class="text-xl font-quran text-txt leading-[2.2] text-center" style="direction:rtl">
                        {{msg.result.transcription}}
                      </p>
                    </div>

                    <!-- Mistakes -->
                    @if (msg.result.mistakes && msg.result.mistakes.length > 0) {
                      <div class="p-5 border-b border-brd">
                        <div class="text-[10px] font-bold text-err uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                          الأخطاء ({{msg.result.mistakes.length}})
                        </div>
                        <div class="space-y-2">
                          @for (m of msg.result.mistakes; track m.word) {
                            <div class="flex items-start gap-3 p-3 rounded-xl bg-err/[0.03] border border-err/10">
                              <div class="px-2 py-0.5 rounded-lg bg-err/10 text-err text-xs font-black whitespace-nowrap mt-0.5">
                                {{m.type === 'tajweed' ? 'تجويد' : m.type === 'pronunciation' ? 'نطق' : m.type === 'missing' ? 'ناقص' : 'زائد'}}
                              </div>
                              <div class="flex-1 min-w-0">
                                <span class="font-black text-err text-sm">{{m.word}}</span>
                                <p class="text-xs text-txt-muted mt-0.5 leading-relaxed">{{m.description}}</p>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <!-- Feedback -->
                    <div class="p-5 bg-surface-el/30">
                      <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>
                        </div>
                        <div>
                          <div class="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">نصيحة المصحّح</div>
                          <p class="text-sm text-txt leading-relaxed">{{msg.result.feedback}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }
        <div class="h-28"></div>
      </main>

      <!-- Bottom Bar -->
      <div class="absolute bottom-0 left-0 right-0 z-20 pb-6 pt-10 bg-gradient-to-t from-bg via-bg/90 to-transparent pointer-events-none">
        <div class="flex flex-col items-center gap-3 pointer-events-auto">

          @if (recording()) {
            <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-err/10 border border-err/20 text-err text-xs font-bold animate-pulse">
              <span class="w-2 h-2 rounded-full bg-err"></span>
              جاري التسجيل... اضغط لإيقاف
            </div>
          }

          <button (click)="toggleRecording()" [disabled]="processing()"
            class="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            [class]="recording() ? 'bg-err hover:bg-err/90 shadow-err/30 scale-110' : 'bg-gradient-to-br from-primary to-accent hover:shadow-primary/40 shadow-primary/20'">

            @if (processing()) {
              <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            } @else if (recording()) {
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            } @else {
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes wave {
      from { transform: scaleY(0.5); }
      to { transform: scaleY(1.5); }
    }
  `]
})
export class CoachComponent implements OnDestroy {
  @ViewChild('chatArea') chatArea!: ElementRef;

  private gemini = inject(GeminiService);
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private msgId = 0;

  messages = signal<ChatMessage[]>([]);
  recording = signal(false);
  processing = signal(false);

  ngOnDestroy() {
    this.stopStream();
  }

  async toggleRecording() {
    if (this.processing()) return;

    if (this.recording()) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new MediaRecorder(stream);
      this.chunks = [];

      this.recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.chunks.push(e.data);
      };

      this.recorder.onstop = () => this.processAudio();

      this.recorder.start();
      this.recording.set(true);
    } catch {
      this.pushMessage({ id: ++this.msgId, role: 'ai', error: 'يرجى السماح بالوصول للميكروفون من إعدادات المتصفح.' });
    }
  }

  private stopRecording() {
    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
      this.stopStream();
    }
    this.recording.set(false);
  }

  private stopStream() {
    this.recorder?.stream?.getTracks().forEach(t => t.stop());
  }

  private async processAudio() {
    const blob = new Blob(this.chunks, { type: 'audio/webm' });
    if (blob.size < 1000) {
      this.pushMessage({ id: ++this.msgId, role: 'ai', error: 'التسجيل قصير جداً. حاول مرة أخرى واقرأ آية كاملة.' });
      return;
    }

    // Add user message
    this.pushMessage({ id: ++this.msgId, role: 'user' });
    this.scroll();

    // Add loading
    const loadingId = ++this.msgId;
    this.pushMessage({ id: loadingId, role: 'ai', loading: true });
    this.scroll();
    this.processing.set(true);

    try {
      const result = await this.gemini.analyzeRecitation(blob);
      // Remove loading, add result
      this.messages.update(msgs => msgs.filter(m => m.id !== loadingId));
      this.pushMessage({ id: ++this.msgId, role: 'ai', result });
    } catch (err: any) {
      this.messages.update(msgs => msgs.filter(m => m.id !== loadingId));
      this.pushMessage({ id: ++this.msgId, role: 'ai', error: 'فشل التحليل. تأكد من اتصال الإنترنت وحاول مرة أخرى.\n' + (err?.message || '') });
    } finally {
      this.processing.set(false);
      this.scroll();
    }
  }

  private pushMessage(msg: ChatMessage) {
    this.messages.update(list => [...list, msg]);
  }

  private scroll() {
    setTimeout(() => {
      const el = this.chatArea?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  }
}
