import { useState, useEffect } from 'react';
import { Plus, Send, BarChart3, Trash2, Edit } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { AdminNav } from '../../components/AdminNav';
import { adminAPI } from '../../utils/api';
import { toast } from 'sonner';

export function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', type: 'PROMOTIONAL', segment: 'ALL_CUSTOMERS' });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await adminAPI.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    try {
      await adminAPI.sendCampaign(campaignId);
      toast.success('Campaign sent successfully!');
      loadCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await adminAPI.deleteCampaign(campaignId);
      toast.success('Campaign deleted successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  const handleViewAnalytics = async (campaignId) => {
    try {
      const analytics = await adminAPI.getCampaignAnalytics(campaignId);
      toast.success(`Analytics: ${analytics.sentCount} sent, ${analytics.openRate}% opened`);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'PROMOTIONAL': return 'success';
      case 'ANNOUNCEMENT': return 'info';
      case 'LOYALTY': return 'warning';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'SENT': return 'success';
      case 'SCHEDULED': return 'warning';
      case 'DRAFT': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Campaign Management</h1>
              <p className="text-muted-foreground">Create and manage marketing campaigns</p>
            </div>
            <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} />
              Create Campaign
            </Button>
          </div>

          <Card>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                  <p className="text-[#6B7280]">Loading campaigns...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No campaigns found</p>
                  <Button onClick={() => setShowCreateModal(true)}>Create First Campaign</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Segment</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sent</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Open Rate</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-foreground">{campaign.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Created {formatDate(campaign.createdAt)}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getTypeBadgeVariant(campaign.type)}>
                              {campaign.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {campaign.segment.replace(/_/g, ' ')}
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getStatusBadgeVariant(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-white">
                            {campaign.sentCount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-white">
                            {campaign.openRate > 0 ? `${campaign.openRate}%` : '-'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => toast.info('Edit feature coming soon')}
                                className="p-2 text-muted-foreground hover:text-[#FF6B35] hover:bg-muted rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              {campaign.status === 'SENT' && (
                                <button
                                  onClick={() => handleViewAnalytics(campaign.id)}
                                  className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                  title="View Analytics"
                                >
                                  <BarChart3 size={18} />
                                </button>
                              )}
                              {campaign.status === 'DRAFT' && (
                                <button
                                  onClick={() => handleSendCampaign(campaign.id)}
                                  className="p-2 text-muted-foreground hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                  title="Send Campaign"
                                >
                                  <Send size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>

          {/* Create Campaign Modal - Placeholder */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
              <div className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-foreground mb-6">Create New Campaign</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Campaign Name</label>
                    <input
                      type="text"
                      placeholder="Enter campaign name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Type</label>
                    <select
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                      <option className="bg-card" value="PROMOTIONAL">Promotional</option>
                      <option className="bg-card" value="ANNOUNCEMENT">Announcement</option>
                      <option className="bg-card" value="LOYALTY">Loyalty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Target Segment</label>
                    <select
                      value={newCampaign.segment}
                      onChange={(e) => setNewCampaign({ ...newCampaign, segment: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                      <option className="bg-card" value="ALL_CUSTOMERS">All Customers</option>
                      <option className="bg-card" value="ACTIVE_CUSTOMERS">Active Customers</option>
                      <option className="bg-card" value="PREMIUM_CUSTOMERS">Premium Customers</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={async () => {
                    if (!newCampaign.name.trim()) { toast.error('Please enter a campaign name'); return; }
                    try {
                      await adminAPI.createCampaign(newCampaign);
                      toast.success('Campaign created as draft');
                      setNewCampaign({ name: '', type: 'PROMOTIONAL', segment: 'ALL_CUSTOMERS' });
                      setShowCreateModal(false);
                      loadCampaigns();
                    } catch (error) {
                      console.error('Error creating campaign:', error);
                      toast.error('Failed to create campaign');
                    }
                  }} className="flex-1">
                    Create Campaign
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}