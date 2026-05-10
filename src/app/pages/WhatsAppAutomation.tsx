import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Phone, 
  Settings, 
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppAutomation() {
  const [status, setStatus] = useState<{ isConfigured: boolean; provider: string; ownerNumber: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [testNumber, setTestNumber] = useState('');
  const [testMessage, setTestMessage] = useState('Hello! This is a test message from Pavithra Travels automation.');

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getWhatsAppStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch WhatsApp status:', error);
      toast.error('Failed to connect to WhatsApp service');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testNumber) {
      toast.error('Please enter a recipient number');
      return;
    }

    try {
      setIsSending(true);
      const res = await apiClient.sendTestWhatsApp(testNumber, testMessage);
      if (res.success) {
        toast.success('Test message sent successfully!');
      } else {
        toast.error(res.error || 'Failed to send test message');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to trigger test message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0B132B] p-8 rounded-[2.5rem] shadow-2xl text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF8C00]/20">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">WhatsApp Automation</h1>
              <p className="text-white/60">Manage your real-time booking alerts powered by Meta WhatsApp</p>
            </div>
          </div>
          <button 
            onClick={fetchStatus}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Status
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#0B132B]/5">
              <h2 className="text-xl font-bold text-[#0B132B] mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#FF8C00]" />
                Service Health
              </h2>
              
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl flex items-center gap-4 ${status?.isConfigured ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                  {status?.isConfigured ? (
                    <ShieldCheck className="h-10 w-10 text-green-500" />
                  ) : (
                    <ShieldAlert className="h-10 w-10 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#0B132B]/60 uppercase tracking-wider">Status</p>
                    <p className={`text-lg font-bold ${status?.isConfigured ? 'text-green-600' : 'text-red-600'}`}>
                      {status?.isConfigured ? 'Live & Connected' : 'Configuration Missing'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#0B132B]/50 font-medium">Provider</span>
                    <span className="text-[#0B132B] font-bold">{status?.provider || 'Meta WhatsApp'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#0B132B]/50 font-medium">Owner Number</span>
                    <span className="text-[#0B132B] font-bold">{status?.ownerNumber || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#0B132B]/50 font-medium">Auto-Alerts</span>
                    <span className="flex items-center gap-1.5 text-green-600 font-bold">
                      <Bell className="h-3 w-3" /> Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF8C00] to-[#F28C00] p-8 rounded-[2.5rem] text-white shadow-xl shadow-[#FF8C00]/20">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Tip
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Ensure your Meta WhatsApp Cloud API permanent token is active and your Phone Number ID is correctly configured in the backend environment.
              </p>
            </div>
          </div>

          {/* Controls Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#0B132B]/5">
              <h2 className="text-2xl font-bold text-[#0B132B] mb-2 flex items-center gap-3">
                <Send className="h-6 w-6 text-[#FF8C00]" />
                Send Test Message
              </h2>
              <p className="text-[#0B132B]/50 mb-8">Verify your Meta WhatsApp Cloud API integration by sending a manual alert.</p>

              <form onSubmit={handleSendTest} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#0B132B] ml-1">Recipient Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0B132B]/20" />
                      <input
                        type="tel"
                        value={testNumber}
                        onChange={(e) => setTestNumber(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-[#FF8C00]/30 rounded-2xl text-[#0B132B] focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0B132B] ml-1">Message Content</label>
                  <textarea
                    rows={4}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Type your test message here..."
                    className="w-full p-4 bg-gray-50 border border-transparent focus:border-[#FF8C00]/30 rounded-2xl text-[#0B132B] focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/10 transition-all resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSending || !status?.isConfigured}
                    className="w-full md:w-auto px-10 py-5 bg-[#0B132B] hover:bg-[#1C2541] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                  >
                    {isSending ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    Send Verification Message
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#0B132B]/5">
              <h3 className="text-lg font-bold text-[#0B132B] mb-6">Integration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <CheckCircle2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B132B]">Real-time Alerts</h4>
                    <p className="text-sm text-[#0B132B]/50">Triggers immediately upon booking confirmation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B132B]">Message Templates</h4>
                    <p className="text-sm text-[#0B132B]/50">Use approved Meta templates for customer-initiated conversations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
