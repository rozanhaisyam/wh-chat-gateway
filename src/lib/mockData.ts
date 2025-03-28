
import { Device, Contact, Message, Campaign, DashboardStats } from '@/types';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Primary Phone',
    status: 'connected',
    phoneNumber: '+1234567890',
    lastActive: '2023-06-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Support Device',
    status: 'disconnected',
    phoneNumber: '+1987654321',
    lastActive: '2023-06-10T15:45:00Z',
  },
  {
    id: '3',
    name: 'Marketing Phone',
    status: 'pending',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example',
  },
  {
    id: '4',
    name: 'Sales Device',
    status: 'error',
    phoneNumber: '+1122334455',
    lastActive: '2023-06-12T11:20:00Z',
  },
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    phoneNumber: '+1234567890',
    lastMessage: 'Hey, how are you?',
    lastMessageTime: '2023-06-15T10:30:00Z',
    isGroup: false,
    avatar: 'https://i.pravatar.cc/150?img=1',
    tags: ['customer', 'premium'],
  },
  {
    id: '2',
    name: 'Marketing Team',
    phoneNumber: '+1987654321',
    lastMessage: 'Meeting at 2pm tomorrow',
    lastMessageTime: '2023-06-15T09:15:00Z',
    isGroup: true,
    avatar: 'https://i.pravatar.cc/150?img=2',
    tags: ['team', 'internal'],
  },
  {
    id: '3',
    name: 'Alice Smith',
    phoneNumber: '+1122334455',
    lastMessage: 'Please send the invoice',
    lastMessageTime: '2023-06-14T16:45:00Z',
    isGroup: false,
    avatar: 'https://i.pravatar.cc/150?img=3',
    tags: ['customer', 'new'],
  },
  {
    id: '4',
    name: 'Support Group',
    phoneNumber: '+1555666777',
    lastMessage: 'New ticket #1234',
    lastMessageTime: '2023-06-15T11:00:00Z',
    isGroup: true,
    avatar: 'https://i.pravatar.cc/150?img=4',
    tags: ['team', 'support'],
  },
  {
    id: '5',
    name: 'Bob Johnson',
    phoneNumber: '+1999888777',
    lastMessage: 'Thanks for your help',
    lastMessageTime: '2023-06-13T14:20:00Z',
    isGroup: false,
    avatar: 'https://i.pravatar.cc/150?img=5',
    tags: ['customer'],
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey, how are you?',
    timestamp: '2023-06-15T10:30:00Z',
    sender: '+1234567890',
    recipient: '+1987654321',
    status: 'read',
  },
  {
    id: '2',
    content: 'I\'m good, thanks! How about you?',
    timestamp: '2023-06-15T10:32:00Z',
    sender: '+1987654321',
    recipient: '+1234567890',
    status: 'delivered',
  },
  {
    id: '3',
    content: 'Check out this new product',
    timestamp: '2023-06-15T09:15:00Z',
    sender: '+1122334455',
    recipient: '+1234567890',
    status: 'sent',
    mediaUrl: 'https://via.placeholder.com/300',
    mediaType: 'image',
  },
  {
    id: '4',
    content: 'Meeting at 2pm tomorrow',
    timestamp: '2023-06-15T09:15:00Z',
    sender: '+1555666777',
    recipient: '+1987654321',
    status: 'failed',
  },
  {
    id: '5',
    content: 'Please send the invoice',
    timestamp: '2023-06-14T16:45:00Z',
    sender: '+1234567890',
    recipient: '+1122334455',
    status: 'read',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale Promotion',
    status: 'completed',
    message: 'Get 30% off on all products this summer! Shop now: https://example.com/summer-sale',
    recipientCount: 1000,
    sentCount: 1000,
    deliveredCount: 950,
    readCount: 800,
    failedCount: 50,
    createdAt: '2023-06-01T08:00:00Z',
    completedAt: '2023-06-01T09:30:00Z',
  },
  {
    id: '2',
    name: 'Customer Feedback Survey',
    status: 'running',
    message: 'We value your opinion! Please take a moment to fill out our survey: https://example.com/survey',
    recipientCount: 500,
    sentCount: 300,
    deliveredCount: 290,
    readCount: 150,
    failedCount: 10,
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'New Product Launch',
    status: 'scheduled',
    message: 'Exciting news! Our new product is launching next week. Be the first to know: https://example.com/new-product',
    recipientCount: 2000,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    createdAt: '2023-06-15T14:30:00Z',
    scheduledFor: '2023-06-20T09:00:00Z',
  },
  {
    id: '4',
    name: 'Holiday Greetings',
    status: 'draft',
    message: 'Happy holidays from our team to yours! Enjoy this special discount code: HOLIDAY2023',
    recipientCount: 1500,
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
    createdAt: '2023-06-14T11:45:00Z',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalDevices: 4,
  activeDevices: 1,
  totalContacts: 324,
  totalMessages: 3500,
  messagesSent: 2100,
  messagesReceived: 1400,
  activeCampaigns: 2,
};
