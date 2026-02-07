export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'announcement' | 'event';
  date: Date;
  time?: string;
  createdBy: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface ArchivedAnnouncement {
  userId: string;
  announcementId: string;
  archivedAt: Date;
}