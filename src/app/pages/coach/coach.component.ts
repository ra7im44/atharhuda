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
    <div class="min-h-screen pb-20 relative overflow-hidden">
      <!-- Ambient -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-8%] w-[500px] h-[500px] bg-info/[0.04] rounded-full blur-[120px] animate-drift"></div>
        <div class="absolute bottom-[-10%] right-[-8%] w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px] animate-drift" style="animation-delay:-5s"></div>
      </div>
      <div class="absolute inset-0 islamic-pattern-dense opacity-15 dark:opacity-[0.02] pointer-events-none"></div>

      <div class="relative max-w-3xl mx-auto px-6 py-10">
        <!-- Header -->
        <div class="text-center mb-10 animate-fade-down">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-info/[0.06] border border-info/10 text-info text-[11px] font-bold mb-4 uppercase tracking-wider">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
            مدعوم بالذكاء الاصطناعي
          </div>
          <h1 class="text-2xl md:text-3xl font-black text-txt mb-2">المصحّح الذكي</h1>
          <p class="text-sm text-txt-muted">سجّل تلاوتك واحصل على تقييم فوري</p>
        </div>

        <!-- Chat Area -->
        <div class="space-y-5 mb-8" #chatContainer>
          @if (messages().length === 0) {
            <!-- Welcome State -->
            <div class="text-center py-16 animate-scale-in">
              <div class="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-info/10 to-primary/10 flex items-center justify-center mx-auto mb-6 animate-float-slow">
                <svg class="w-10 h-10 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
              </div>
              <h3 class="text-lg font-bold text-txt mb-2">ابدأ التلاوة</h3>
              <p class="text-sm text-txt-muted max-w-sm mx-auto leading-relaxed">اضغط على زر التسجيل وابدأ بقراءة ما تيسر من القرآن الكريم</p>
              <div class="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto">
                <div class="p-3 bg-surface rounded-xl border border-brd/50 text-center">
                  <div class="text-lg mb-1">🎤</div>
                  <span class="text-[9px] text-txt-muted font-bold">سجّل</span>
                </div>
                <div class="p-3 bg-surface rounded-xl border border-brd/50 text-center">
                  <div class="text-lg mb-1">🤖</div>
                  <span class="text-[9px] text-txt-muted font-bold">تحليل</span>
                </div>
                <div class="p-3 bg-surface rounded-xl border border-brd/50 text-center">
                  <div class="text-lg mb-1">📊</div>
                  <span class="text-[9px] text-txt-muted font-bold">تقييم</span>
                </div>
              </div>
            </div>
          }

          @for (msg of messages(); track msg.id) {
            @if (msg.role === 'user') {
              <!-- User Message -->
              <div class="flex justify-start animate-slide-in-right">
                <div class="max-w-[85%] bg-gradient-to-r from-primary to-secondary text-white rounded-[1.5rem] rounded-tr-lg p-5 shadow-lg shadow-primary/15">
                  <div class="flex items-center gap-2 mb-1.5">
                    <div class="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg></div>
                    <span class="text-[10px] font-bold text-white/70">تسجيل صوتي</span>
                  </div>
                  <div class="flex items-center gap-3"><div class="flex gap-0.5">@for(b of [1,2,3,4,5,6,7,8]; track b) {<div class="w-1 bg-white/40 rounded-full" [style.height.px]="6 + (b % 3) * 6"></div>}</div><span class="text-[10px] text-white/50">تم الإرسال</span></div>
                </div>
              </div>
            }

            @if (msg.role === 'ai') {
              <div class="flex justify-end animate-fade-up">
                <div class="max-w-[90%] md:max-w-[85%]">
                  @if (msg.loading) {
                    <div class="bg-surface rounded-[1.5rem] rounded-tl-lg p-6 border border-brd/70 shadow-md">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center"><svg class="w-4 h-4 text-info animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg></div>
                        <div>
                          <span class="text-xs font-bold text-txt">يتم التحليل...</span>
                          <div class="flex gap-1 mt-1">@for(d of [1,2,3]; track d) {<div class="w-1.5 h-1.5 rounded-full bg-info animate-bounce-slow" [style.animation-delay]="(d * 200) + 'ms'"></div>}</div>
                        </div>
                      </div>
                    </div>
                  } @else if (msg.error) {
                    <div class="bg-err/[0.06] border border-err/20 rounded-[1.5rem] rounded-tl-lg p-5">
                      <div class="flex items-center gap-2 text-err text-xs font-bold"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg> {{msg.error}}</div>
                    </div>
                  } @else if (msg.result) {
                    <div class="bg-surface rounded-[1.5rem] rounded-tl-lg border border-brd/70 overflow-hidden shadow-lg">
                      <!-- Score Header -->
                      <div class="p-5 bg-gradient-to-l from-primary/[0.04] to-accent/[0.04] border-b border-brd/40">
                        <div class="flex items-center justify-between">
                          <div>
                            <span class="text-[10px] text-txt-muted font-bold uppercase tracking-wider">التقييم</span>
                            @if (msg.result.surah) {<p class="text-xs text-primary font-bold mt-0.5">{{msg.result.surah}} {{msg.result.verses ? '(' + msg.result.verses + ')' : ''}}</p>}
                          </div>
                          <div class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 transition-colors"
                               [ngClass]="{
                                 'bg-ok/[0.08] border-ok/20 text-ok': msg.result.score >= 80,
                                 'bg-warn/[0.08] border-warn/20 text-warn': msg.result.score >= 50 && msg.result.score < 80,
                                 'bg-err/[0.08] border-err/20 text-err': msg.result.score < 50
                               }">
                            <span class="text-xl font-black leading-none">{{msg.result.score}}</span>
                            <span class="text-[7px] font-bold mt-0.5">/ 100</span>
                          </div>
                        </div>
                      </div>

                      <div class="p-5 space-y-4">
                        <!-- Transcription -->
                        <div><p class="text-[10px] text-txt-muted font-bold mb-1.5 uppercase tracking-wider">ما سمعناه</p><p class="text-base font-quran leading-[2.4] text-txt bg-surface-el/50 rounded-xl p-3 border border-brd/40">{{msg.result.transcription}}</p></div>

                        <!-- Mistakes -->
                        @if (msg.result.mistakes.length > 0) {
                          <div>
                            <p class="text-[10px] text-txt-muted font-bold mb-2 uppercase tracking-wider">ملاحظات ({{msg.result.mistakes.length}})</p>
                            <div class="space-y-2">
                              @for (m of msg.result.mistakes; track m.word) {
                                <div class="flex items-start gap-3 p-3 bg-warn/[0.04] border border-warn/10 rounded-xl text-xs">
                                  <div class="w-6 h-6 rounded-lg bg-warn/10 flex items-center justify-center flex-shrink-0 mt-0.5"><svg class="w-3 h-3 text-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg></div>
                                  <div><span class="font-bold text-warn">{{m.word}}</span><span class="text-txt-muted"> — {{m.description}}</span><span class="inline-block mr-2 px-2 py-0.5 rounded-md bg-warn/10 text-warn text-[9px] font-bold">{{m.type}}</span></div>
                                </div>
                              }
                            </div>
                          </div>
                        }

                        <!-- Feedback -->
                        <div class="p-4 bg-gradient-to-l from-primary/[0.04] to-accent/[0.03] rounded-xl border border-primary/10">
                          <p class="text-[10px] text-primary font-bold mb-1 uppercase tracking-wider">💡 نصيحة</p>
                          <p class="text-xs text-txt leading-relaxed">{{msg.result.feedback}}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>

        <!-- Recording Controls -->
        <div class="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40">
          <div class="bg-surface/90 backdrop-blur-2xl border border-brd/60 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
            @if (!isRecording()) {
              <button (click)="startRecording()" class="group w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 hover:scale-110 transition-all duration-300">
                <svg class="w-7 h-7 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
              </button>
              <span class="text-xs text-txt-muted font-bold">اضغط لبدء التسجيل</span>
            } @else {
              <button (click)="stopRecording()" class="w-16 h-16 rounded-2xl bg-gradient-to-br from-err to-err/80 text-white flex items-center justify-center shadow-xl shadow-err/25 animate-pulse-glow hover:scale-110 transition-all">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"/></svg>
              </button>
              <div class="flex items-center gap-3">
                <div class="flex gap-0.5">@for(b of [1,2,3,4,5,6,7,8,9,10]; track b) {<div class="w-1 bg-err rounded-full animate-bounce-slow" [style.height.px]="4 + (b % 4) * 5" [style.animation-delay]="(b * 80) + 'ms'"></div>}</div>
                <span class="text-xs font-bold text-err">جارٍ التسجيل...</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CoachComponent implements OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  private geminiService = inject(GeminiService);

  messages = signal<ChatMessage[]>([]);
  isRecording = signal(false);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private msgId = 0;

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.audioChunks.push(e.data); };
      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.analyzeAudio(blob);
      };
      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch {
      this.addAiMessage({ id: ++this.msgId, role: 'ai', error: 'لم نتمكن من الوصول للميكروفون. تأكد من إعطاء الإذن.' });
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }

  private async analyzeAudio(blob: Blob) {
    const userMsg: ChatMessage = { id: ++this.msgId, role: 'user' };
    const aiMsg: ChatMessage = { id: ++this.msgId, role: 'ai', loading: true };
    this.messages.update(m => [...m, userMsg, aiMsg]);
    this.scrollToBottom();

    try {
      const result = await this.geminiService.analyzeRecitation(blob);
      this.messages.update(m => m.map(msg => msg.id === aiMsg.id ? { ...msg, loading: false, result } : msg));
    } catch {
      this.messages.update(m => m.map(msg => msg.id === aiMsg.id ? { ...msg, loading: false, error: 'حدث خطأ أثناء التحليل. حاول مرة أخرى.' } : msg));
    }
    this.scrollToBottom();
  }

  private addAiMessage(msg: ChatMessage) {
    this.messages.update(m => [...m, msg]);
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => this.chatContainer?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  }

  ngOnDestroy() {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
    }
  }
}
