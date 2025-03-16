
export type DeviceStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  phoneNumber?: string;
  lastActive?: string;
  qrCode?: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isGroup: boolean;
  avatar?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | 'audio';
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  message: string;
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdAt: string;
  scheduledFor?: string;
  completedAt?: string;
}

export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  totalContacts: number;
  totalMessages: number;
  messagesSent: number;
  messagesReceived: number;
  activeCampaigns: number;
}
