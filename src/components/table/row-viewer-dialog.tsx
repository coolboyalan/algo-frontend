'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Hash, Mail, Phone, User, DollarSign } from 'lucide-react';

export interface RowViewerFieldConfig {
  label?: string;
  icon?: React.ReactNode;
  format?: (value: any) => React.ReactNode;
  hidden?: boolean;
}

interface RowViewerDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string;
  subtitle?: string;
  fieldConfig?: Record<string, RowViewerFieldConfig>;
  customContent?: (data: T) => React.ReactNode;
}

export function RowViewerDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  data,
  title = 'Details',
  subtitle,
  fieldConfig = {},
  customContent,
}: RowViewerDialogProps<T>) {
  if (!data) return null;

  const formatFieldName = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();

  const getFieldIcon = (key: string): React.ReactNode => {
    if (fieldConfig[key]?.icon) return fieldConfig[key].icon;
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('email')) return <Mail className="h-4 w-4" />;
    if (lowerKey.includes('phone')) return <Phone className="h-4 w-4" />;
    if (lowerKey.includes('name')) return <User className="h-4 w-4" />;
    if (lowerKey.includes('date')) return <Calendar className="h-4 w-4" />;
    if (lowerKey.includes('time') || lowerKey.includes('at')) return <Clock className="h-4 w-4" />;
    if (lowerKey.includes('id') || lowerKey.includes('number')) return <Hash className="h-4 w-4" />;
    if (lowerKey.includes('amount') || lowerKey.includes('price')) return <DollarSign className="h-4 w-4" />;
    return null;
  };

  const formatValue = (key: string, value: any): React.ReactNode => {
    if (fieldConfig[key]?.format) return fieldConfig[key].format!(value);
    if (value === null || value === undefined)
      return <span className="text-muted-foreground italic">Not set</span>;
    if (typeof value === 'boolean')
      return value ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>;
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        }
      } catch {}
    }
    if (key.toLowerCase().includes('status') || key.toLowerCase().includes('state')) {
      const statusColors: Record<string, string> = {
        confirmed: 'default',
        completed: 'default',
        active: 'default',
        success: 'default',
        paid: 'default',
        pending: 'secondary',
        processing: 'secondary',
        cancelled: 'destructive',
        failed: 'destructive',
        rejected: 'destructive',
      };
      const variant = statusColors[String(value).toLowerCase()] || 'outline';
      return <Badge variant={variant as any}>{String(value)}</Badge>;
    }
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <Badge key={idx} variant="outline">
              {String(item)}
            </Badge>
          ))}
        </div>
      );
    }
    if (typeof value === 'object')
      return <code className="text-xs bg-muted p-1 rounded break-all">{JSON.stringify(value)}</code>;
    return String(value);
  };

  const fields = Object.keys(data).filter((key) => !fieldConfig[key]?.hidden);
  const primaryId =
    fields.find((key) => key.toLowerCase().includes('id') || key.toLowerCase().includes('number')) ||
    fields[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 pb-3 space-y-2">
          <DialogTitle className="text-xl sm:text-2xl flex flex-col sm:flex-row sm:items-center gap-2">
            <span>{title}</span>
            {primaryId && <Badge variant="outline" className="font-mono w-fit">{data[primaryId]}</Badge>}
          </DialogTitle>
          {subtitle && <DialogDescription className="text-sm">{subtitle}</DialogDescription>}
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[calc(90vh-120px)] px-4 sm:px-6">
          {customContent ? (
            <div className="py-4">{customContent(data)}</div>
          ) : (
            <div className="space-y-4 sm:space-y-6 py-4">
              {fields.map((key) => {
                const config = fieldConfig[key] || {};
                const label = config.label || formatFieldName(key);
                const icon = getFieldIcon(key);
                const value = formatValue(key, data[key]);
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <div className="text-sm sm:text-base pl-0 sm:pl-6 break-words">{value}</div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
