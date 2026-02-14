import { Component, inject, signal, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService, RecitationAnalysis } from '../../services/gemini.service';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  loading?: boolean;
  error?: string;
  result?: RecitationAnalysis;
}

@Component({
  selector: 'app-coach',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coach.component.html',
  styleUrl: './coach.component.css'
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
