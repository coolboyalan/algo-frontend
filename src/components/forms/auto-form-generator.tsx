'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'datetime-local' | 'hidden';
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  validation?: z.ZodType<any>;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
}

interface AutoFormGeneratorProps {
  fields: FormFieldConfig[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  defaultValues?: Record<string, any>;
}

export function AutoFormGenerator({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
  defaultValues = {},
}: AutoFormGeneratorProps) {
  const generateSchema = () => {
    const schemaFields: Record<string, z.ZodType<any>> = {};

    fields.forEach((field) => {
      if (field.hidden || field.type === 'hidden') return;

      let fieldSchema: z.ZodType<any>;

      if (field.validation) {
        fieldSchema = field.validation;
      } else {
        switch (field.type) {
          case 'email':
            fieldSchema = z.string().email('Invalid email address');
            break;
          case 'number':
            fieldSchema = z.coerce.number({ invalid_type_error: 'Must be a number' });
            break;
          case 'checkbox':
            fieldSchema = z.boolean();
            break;
          case 'date':
          case 'datetime-local':
            fieldSchema = z.string();
            break;
          default:
            fieldSchema = z.string();
        }

        if (field.required) {
          if (field.type === 'checkbox') {
            fieldSchema = (fieldSchema as z.ZodBoolean).refine((val) => val === true, {
              message: `${field.label} is required`,
            });
          } else {
            fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
          }
        } else {
          fieldSchema = fieldSchema.optional();
        }
      }

      schemaFields[field.name] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const schema = generateSchema();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
        return acc;
      }, {} as Record<string, any>),
      ...defaultValues,
    },
  });

  const onSubmitHandler = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  const renderField = (field: FormFieldConfig) => {
    if (field.hidden) return null;

    const error = errors[field.name];
    const value = watch(field.name);

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              disabled={field.disabled || isLoading}
              {...register(field.name)}
              className={error ? 'border-destructive' : ''}
              rows={4}
            />
            {error && (
              <p className="text-sm text-destructive">{error.message as string}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Select
              value={value || ''}
              onValueChange={(val) => setValue(field.name, val)}
              disabled={field.disabled || isLoading}
            >
              <SelectTrigger className={error ? 'border-destructive' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-destructive">{error.message as string}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={!!value}
                onCheckedChange={(checked) => setValue(field.name, checked)}
                disabled={field.disabled || isLoading}
              />
              <Label
                htmlFor={field.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
            )}
            {error && (
              <p className="text-sm text-destructive ml-6">{error.message as string}</p>
            )}
          </div>
        );

      case 'hidden':
        return <input key={field.name} type="hidden" {...register(field.name)} />;

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              disabled={field.disabled || isLoading}
              {...register(field.name)}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">{error.message as string}</p>
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => renderField(field))}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
