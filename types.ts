export enum Tool {
  DASHBOARD = 'DASHBOARD',
  CHAT_WITH_AI = 'CHAT_WITH_AI',
  GENERATE = 'GENERATE',
  DEV_DRAFT = 'DEV_DRAFT',
  SKETCH_STUDIO = 'SKETCH_STUDIO',
  LIBRARY = 'LIBRARY',
  // Fix: Add VIDEO_STUDIO to the Tool enum to support the video generator.
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  CANVAS_STUDIO = 'CANVAS_STUDIO',
}

export interface Notification {
  id: number;
  type: 'image' | 'video' | 'sketch' | 'code' | 'credits' | 'api_key' | 'welcome';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: Tool;
}