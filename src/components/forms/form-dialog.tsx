'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AutoFormGenerator, FormFieldConfig } from './auto-form-generator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  defaultValues?: Record<string, any>;
  customForm?: React.ReactNode;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  submitLabel,
  isLoading,
  defaultValues,
  customForm,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl sm:text-2xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="pb-6">
            {customForm || (
              <AutoFormGenerator
                fields={fields}
                onSubmit={onSubmit}
                submitLabel={submitLabel}
                isLoading={isLoading}
                defaultValues={defaultValues}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
