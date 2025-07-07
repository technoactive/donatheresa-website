/**
 * Email Template Manager Component
 * View and manage email templates
 */

'use client';

import { useState, useEffect } from 'react';
import { getEmailTemplates } from '@/app/dashboard/settings/email/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Eye, 
  Edit, 
  Copy, 
  Mail,
  Users,
  MessageSquare,
  Settings,
  AlertTriangle,
  Calendar,
  ExternalLink
} from 'lucide-react';
import type { EmailTemplate } from '@/lib/email/types';

interface TemplatePreviewProps {
  template: EmailTemplate | null;
  onClose: () => void;
}

function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  if (!template) return null;

  // Sample data for preview
  const sampleData = {
    customerName: 'John Smith',
    bookingDate: new Date().toLocaleDateString('en-GB'),
    bookingTime: '19:00',
    partySize: 4,
    bookingId: 'BK-12345',
    specialRequests: 'Window table preferred',
    restaurantName: 'Dona Theresa Restaurant',
    restaurantPhone: '+44 20 8421 5550',
    restaurantEmail: 'info@donateresa.com',
    restaurantAddress: '451 Uxbridge Road, Pinner, London HA5 1AA',
    brandColor: '#D97706',
    customFooter: 'Dona Theresa Restaurant | 451 Uxbridge Road, Pinner, London HA5 1AA',
    subject: 'General Inquiry',
    message: 'I would like to know more about your menu and opening hours.',
  };

  // Simple template rendering (replace variables)
  const renderTemplate = (content: string) => {
    let rendered = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });
    
    // Handle simple conditionals
    rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
      return sampleData[key as keyof typeof sampleData] ? content : '';
    });
    
    return rendered;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{template.name}</h2>
            <p className="text-sm text-muted-foreground">Template Preview</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Subject Line</h3>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {renderTemplate(template.subject)}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Email Content</h3>
              <div 
                className="border rounded p-4 bg-white max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ 
                  __html: renderTemplate(template.html_content) 
                }}
              />
            </div>
            
            {template.text_content && (
              <div>
                <h3 className="font-medium mb-2">Plain Text Version</h3>
                <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {renderTemplate(template.text_content)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const result = await getEmailTemplates();
      
      if (result.error) {
        setError(result.error);
      } else {
        setTemplates(result.data || []);
      }
    } catch (err) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'contact':
        return <MessageSquare className="h-4 w-4" />;
      case 'staff':
        return <Users className="h-4 w-4" />;
      case 'marketing':
        return <Mail className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking':
        return 'bg-blue-100 text-blue-800';
      case 'contact':
        return 'bg-green-100 text-green-800';
      case 'staff':
        return 'bg-purple-100 text-purple-800';
      case 'marketing':
        return 'bg-orange-100 text-orange-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">
            Manage your email templates and customize their content
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Template Categories */}
      {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getCategoryIcon(category)}
              {category} Templates
            </CardTitle>
            <CardDescription>
              {category === 'booking' && 'Templates for booking confirmations, reminders, and cancellations'}
              {category === 'contact' && 'Templates for contact form responses and auto-replies'}
              {category === 'staff' && 'Templates for staff notifications and alerts'}
              {category === 'marketing' && 'Templates for promotional emails and newsletters'}
              {category === 'system' && 'Templates for system notifications and alerts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryTemplates.map((template) => (
                <Card key={template.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={getCategoryColor(template.category)}
                          >
                            {template.category}
                          </Badge>
                          {template.is_default && (
                            <Badge variant="outline">Default</Badge>
                          )}
                          {!template.is_active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description || 'No description available'}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        <p><strong>Subject:</strong> {template.subject}</p>
                        {template.preview_text && (
                          <p><strong>Preview:</strong> {template.preview_text}</p>
                        )}
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Used {template.usage_count} times</span>
                        <span>v{template.version}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Copy className="h-3 w-3 mr-1" />
                          Clone
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Email Templates</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first email template
            </p>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Variables Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Template Variables Reference
          </CardTitle>
          <CardDescription>
            Available variables you can use in your email templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Customer Variables</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><code>customerName</code> - Customer's name</p>
                <p><code>customerEmail</code> - Customer's email</p>
                <p><code>customerPhone</code> - Customer's phone</p>
                <p><code>customerSegment</code> - VIP, regular, etc.</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Booking Variables</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><code>bookingId</code> - Booking reference</p>
                <p><code>bookingDate</code> - Reservation date</p>
                <p><code>bookingTime</code> - Reservation time</p>
                <p><code>partySize</code> - Number of guests</p>
                <p><code>specialRequests</code> - Special requests</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Restaurant Variables</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><code>restaurantName</code> - Restaurant name</p>
                <p><code>restaurantPhone</code> - Phone number</p>
                <p><code>restaurantEmail</code> - Email address</p>
                <p><code>restaurantAddress</code> - Full address</p>
                <p><code>brandColor</code> - Brand color</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h4 className="font-medium mb-2">Template Syntax</h4>
            <div className="space-y-2 text-sm">
              <p><code>{'{{variableName}}'}</code> - Insert variable value</p>
              <p><code>{'{{#if condition}}...{{/if}}'}</code> - Conditional content</p>
              <p className="text-muted-foreground">
                Example: <code>{'{{#if specialRequests}}Special requests: {{specialRequests}}{{/if}}'}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Preview Modal */}
      <TemplatePreview 
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
} 