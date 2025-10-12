import React, { useState } from 'react';
import { Tool, Notification } from '../types';
import { Image, Video, PenTool, Code, CircleDollarSign, KeyRound, PartyPopper, Check } from 'lucide-react';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onNavigate: (tool: Tool) => void;
}

const whatsNewData = [
    { title: "New Tool: Video Studio!", description: "Generate stunning, high-definition videos from simple text prompts." },
    { title: "Central Library Added", description: "All your projects from all tools are now available in one unified library." },
    { title: "Live Website Previews", description: "Developer Studio now features instant previews for generated code." }
];

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    const iconMap: { [key in Notification['type']]: React.ReactNode } = {
        image: <Image size={20} className="text-blue-500" />,
        video: <Video size={20} className="text-red-500" />,
        sketch: <PenTool size={20} className="text-yellow-500" />,
        code: <Code size={20} className="text-green-500" />,
        credits: <CircleDollarSign size={20} className="text-orange-500" />,
        api_key: <KeyRound size={20} className="text-purple-500" />,
        welcome: <PartyPopper size={20} className="text-pink-500" />,
    };
    return <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">{iconMap[type]}</div>;
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications, onMarkAllAsRead, onNavigate }) => {
    const [activeTab, setActiveTab] = useState('notifications');

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = (notification: Notification) => {
        if (notification.link) {
            onNavigate(notification.link);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-40 p-4 pt-20 flex justify-center md:justify-end" onClick={onClose}>
            <div
                className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down h-fit"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                        <button onClick={() => setActiveTab('notifications')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'notifications' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Notifications</button>
                        <button onClick={() => setActiveTab('whatsnew')} className={`w-1/2 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'whatsnew' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>What's New</button>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {activeTab === 'notifications' ? (
                        <>
                            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                                <h3 className="font-semibold text-sm">Your Alerts</h3>
                                {unreadCount > 0 && (
                                    <button onClick={onMarkAllAsRead} className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                                        <Check size={14} /> Mark all as read
                                    </button>
                                )}
                            </div>
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {notifications.map((n) => (
                                        <button key={n.id} onClick={() => handleNotificationClick(n)} className="w-full text-left p-4 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0 animate-pulse"></div>}
                                            <NotificationIcon type={n.type} />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm text-zinc-800 dark:text-gray-200">{n.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{n.description}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{n.time}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                                    <p>No new notifications.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-6 space-y-4">
                            {whatsNewData.map(item => (
                                <div key={item.title}>
                                    <h3 className="font-semibold text-zinc-800 dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;