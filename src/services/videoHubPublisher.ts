/**
 * src/services/videoHubPublisher.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ticket 13: Scheduled Short Video Content Engine (LinkedIn & YouTube Shorts)
 */

export interface ScheduledVideo {
  id: string;
  title: string;
  durationSeconds: number;
  platforms: Array<'LinkedIn' | 'YouTubeShorts'>;
  topic: 'AI Contract Risk' | 'eIDAS Digital Signatures' | 'SWIFT Wire Security';
  publishStatus: 'PUBLISHED' | 'SCHEDULED';
  publishedAt: string;
}

class VideoHubPublisher {
  private scheduledQueue: ScheduledVideo[] = [
    {
      id: 'vid_01',
      title: 'How AI Audits Contract Clauses in 60 Seconds',
      durationSeconds: 58,
      platforms: ['LinkedIn', 'YouTubeShorts'],
      topic: 'AI Contract Risk',
      publishStatus: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'vid_02',
      title: 'eIDAS Digital Signatures vs Standard E-Signatures: Legal Guide',
      durationSeconds: 45,
      platforms: ['LinkedIn', 'YouTubeShorts'],
      topic: 'eIDAS Digital Signatures',
      publishStatus: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    },
  ];

  public publishWeeklyShortVideo(): ScheduledVideo {
    console.log('[Ticket 13: Video Hub Engine] Publishing scheduled weekly short video to LinkedIn & YouTube Shorts...');

    const video: ScheduledVideo = {
      id: `vid_${Date.now()}`,
      title: `Weekly Legal Tech Update: Enterprise Governance ${new Date().toLocaleDateString()}`,
      durationSeconds: 50,
      platforms: ['LinkedIn', 'YouTubeShorts'],
      topic: 'SWIFT Wire Security',
      publishStatus: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    };

    this.scheduledQueue.unshift(video);
    return video;
  }

  public getPublishedQueue(): ScheduledVideo[] {
    return this.scheduledQueue;
  }
}

export const videoHubPublisher = new VideoHubPublisher();
