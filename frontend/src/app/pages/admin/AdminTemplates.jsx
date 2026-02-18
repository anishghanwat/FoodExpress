import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, MessageSquare, Bell } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { AdminNav } from '../../components/AdminNav';
import { adminAPI } from '../../utils/api';
import { toast } from 'sonner';

export function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await adminAPI.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await adminAPI.deleteTemplate(templateId);
      toast.success('Template deleted successfully');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'EMAIL': return <Mail size={20} />;
      case 'SMS': return <MessageSquare size={20} />;
      case 'PUSH': return <Bell size={20} />;
      default: return <Mail size={20} />;
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'EMAIL': return 'info';
      case 'SMS': return 'success';
      case 'PUSH': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminNav />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Message Templates</h1>
              <p className="text-white/60">Manage email, SMS, and push notification templates</p>
            </div>
            <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} />
              Create Template
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
              <p className="text-[#6B7280]">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <p className="text-white/60 mb-4">No templates found</p>
                <Button onClick={() => setShowCreateModal(true)}>Create First Template</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-[#FF6B35]">
                          {getTypeIcon(template.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{template.name}</h3>
                          <p className="text-xs text-white/40">{formatDate(template.createdAt)}</p>
                        </div>
                      </div>
                      <Badge variant={getTypeBadgeVariant(template.type)}>
                        {template.type}
                      </Badge>
                    </div>

                    {/* Subject (for emails) */}
                    {template.subject && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-white/60 mb-1">Subject:</p>
                        <p className="text-sm text-white">{template.subject}</p>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-white/60 mb-1">Content:</p>
                      <div className="bg-white/5 rounded-lg p-3 text-sm text-white/80 line-clamp-3">
                        {template.content}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => toast.info('Edit feature coming soon')}
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Create Template Modal - Placeholder */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">Create New Template</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Template Name</label>
                    <input
                      type="text"
                      placeholder="Enter template name"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent placeholder-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
                    <select className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent">
                      <option className="bg-[#1a1a1a]" value="EMAIL">Email</option>
                      <option className="bg-[#1a1a1a]" value="SMS">SMS</option>
                      <option className="bg-[#1a1a1a]" value="PUSH">Push Notification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Subject (for emails)</label>
                    <input
                      type="text"
                      placeholder="Enter email subject"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent placeholder-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Content</label>
                    <textarea
                      rows={6}
                      placeholder="Enter template content. Use {{variableName}} for dynamic values."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none placeholder-white/20"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      Available variables: {'{{orderId}}, {{customerName}}, {{trackingLink}}, {{promoCode}}'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => {
                    toast.success('Template created successfully');
                    setShowCreateModal(false);
                  }} className="flex-1">
                    Create Template
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