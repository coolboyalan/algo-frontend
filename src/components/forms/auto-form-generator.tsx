"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { SearchableSelect } from "./searchable-select";

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "searchable-select"
    | "checkbox"
    | "date"
    | "datetime-local"
    | "hidden";
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string | number | boolean }[];
  validation?: z.ZodType<any>;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;

  // Min/Max for text and number fields
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;

  // For searchable-select
  searchEndpoint?: string;
  searchFields?: string[];
  searchResultLabelKey?: string;
  searchResultValueKey?: string;
  searchLimit?: number;

  // Conditional Visibility
  showWhen?:
    | {
        // Option 1: Watch specific field
        field: string;
        condition: (value: any) => boolean;
      }
    | {
        condition: (formValues: Record<string, any>) => boolean;
      };
  // Dynamic min/max based on other field
  dynamicMin?: {
    field: string;
    calculate: (value: any) => number;
  };
  dynamicMax?: {
    field: string;
    calculate: (value: any) => number;
  };

  // Transform display value vs submit value
  transform?: {
    toDisplay: (value: any, formValues: Record<string, any>) => any;
    toSubmit: (displayValue: any, formValues: Record<string, any>) => any;
  };

  // Display prefix/suffix
  prefix?: string;
  suffix?: string;
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
  submitLabel = "Submit",
  isLoading = false,
  defaultValues = {},
}: AutoFormGeneratorProps) {
  const generateSchema = () => {
    const schemaFields: Record<string, z.ZodType<any>> = {};

    fields.forEach((field) => {
      if (field.hidden || field.type === "hidden") return;

      let fieldSchema: z.ZodType<any>;

      if (field.validation) {
        fieldSchema = field.validation;
      } else {
        switch (field.type) {
          case "email":
            fieldSchema = z.string().email("Invalid email address");

            if (field.minLength !== undefined) {
              fieldSchema = (fieldSchema as z.ZodString).min(
                field.minLength,
                `${field.label} must be at least ${field.minLength} characters`,
              );
            }
            if (field.maxLength !== undefined) {
              fieldSchema = (fieldSchema as z.ZodString).max(
                field.maxLength,
                `${field.label} must be at most ${field.maxLength} characters`,
              );
            }
            break;

          case "number":
            fieldSchema = z.coerce.number({
              invalid_type_error: "Must be a number",
            });

            if (field.min !== undefined) {
              fieldSchema = (fieldSchema as z.ZodNumber).min(
                field.min,
                `${field.label} must be at least ${field.min}`,
              );
            }
            if (field.max !== undefined) {
              fieldSchema = (fieldSchema as z.ZodNumber).max(
                field.max,
                `${field.label} must be at most ${field.max}`,
              );
            }
            break;

          case "checkbox":
            fieldSchema = z.boolean();
            break;

          case "select":
            if (field.options?.every((opt) => typeof opt.value === "boolean")) {
              fieldSchema = z.boolean();
            } else if (
              field.options?.every((opt) => typeof opt.value === "number")
            ) {
              fieldSchema = z.coerce.number();
            } else {
              fieldSchema = z.string();
            }
            break;

          case "date":
          case "datetime-local":
            fieldSchema = z.string();
            break;

          case "searchable-select":
            fieldSchema = z.union([z.string(), z.number()]);
            break;

          default:
            fieldSchema = z.string();

            if (field.minLength !== undefined) {
              fieldSchema = (fieldSchema as z.ZodString).min(
                field.minLength,
                `${field.label} must be at least ${field.minLength} characters`,
              );
            }
            if (field.maxLength !== undefined) {
              fieldSchema = (fieldSchema as z.ZodString).max(
                field.maxLength,
                `${field.label} must be at most ${field.maxLength} characters`,
              );
            }
        }

        if (field.required) {
          if (field.type === "checkbox") {
            fieldSchema = (fieldSchema as z.ZodBoolean).refine(
              (val) => val === true,
              {
                message: `${field.label} is required`,
              },
            );
          } else if (field.type === "searchable-select") {
            fieldSchema = fieldSchema.refine(
              (val) => val !== undefined && val !== "",
              {
                message: `${field.label} is required`,
              },
            );
          } else if (
            field.type === "select" &&
            field.options?.every((opt) => typeof opt.value === "boolean")
          ) {
            // Boolean select
          } else if (
            field.type === "select" &&
            field.options?.every((opt) => typeof opt.value === "number")
          ) {
            // Number select
          } else if (field.type !== "number") {
            fieldSchema = (fieldSchema as z.ZodString).min(
              1,
              `${field.label} is required`,
            );
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
      ...fields.reduce(
        (acc, field) => {
          acc[field.name] =
            field.defaultValue ?? (field.type === "checkbox" ? false : "");
          return acc;
        },
        {} as Record<string, any>,
      ),
      ...defaultValues,
    },
  });

  const onSubmitHandler = async (data: any) => {
    // Transform values before submitting
    const transformedData = { ...data };

    fields.forEach((field) => {
      if (field.transform && transformedData[field.name] !== undefined) {
        transformedData[field.name] = field.transform.toSubmit(
          transformedData[field.name],
          transformedData,
        );
      }
    });

    await onSubmit(transformedData);
    reset();
  };

  // Check if field should be visible based on condition
  const isFieldVisible = (field: FormFieldConfig): boolean => {
    if (field.hidden) return false;

    if (field.showWhen) {
      // ✅ Check if it's field-specific or general condition
      if ("field" in field.showWhen) {
        // Option 1: Watch specific field
        const watchedValue = watch(field.showWhen.field);
        return field.showWhen.condition(watchedValue);
      } else {
        // Option 2: Custom condition with all values
        const allValues = watch();
        return field.showWhen.condition(allValues);
      }
    }

    return true;
  };

  // Calculate dynamic min/max
  const getDynamicMin = (field: FormFieldConfig): number | undefined => {
    if (!field.dynamicMin) return field.min;

    const watchedValue = watch(field.dynamicMin.field);
    return field.dynamicMin.calculate(watchedValue);
  };

  const getDynamicMax = (field: FormFieldConfig): number | undefined => {
    if (!field.dynamicMax) return field.max;

    const watchedValue = watch(field.dynamicMax.field);
    return field.dynamicMax.calculate(watchedValue);
  };

  const renderField = (field: FormFieldConfig) => {
    if (!isFieldVisible(field)) return null;

    const error = errors[field.name];
    const rawValue = watch(field.name);

    // Get display value (transform if needed)
    const displayValue = field.transform
      ? field.transform.toDisplay(rawValue, watch())
      : rawValue;

    // Get dynamic min/max
    const minValue = getDynamicMin(field);
    const maxValue = getDynamicMax(field);

    switch (field.type) {
      case "searchable-select":
        if (!field.searchEndpoint || !field.searchFields) {
          console.error(
            `searchEndpoint and searchFields required for field: ${field.name}`,
          );
          return null;
        }

        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            <SearchableSelect
              value={displayValue}
              onValueChange={(val) => {
                const rawValue = field.transform
                  ? field.transform.toSubmit(val, watch())
                  : val;
                setValue(field.name, rawValue);
              }}
              endpoint={field.searchEndpoint}
              searchFields={field.searchFields}
              labelKey={field.searchResultLabelKey || "name"}
              valueKey={field.searchResultValueKey || "id"}
              limit={field.searchLimit || 20}
              placeholder={field.placeholder || `Search ${field.label}...`}
              disabled={field.disabled || isLoading}
            />
            {error && (
              <p className="text-sm text-destructive">
                {error.message as string}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              disabled={field.disabled || isLoading}
              value={displayValue || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                const rawValue = field.transform
                  ? field.transform.toSubmit(inputValue, watch())
                  : inputValue;
                setValue(field.name, rawValue);
              }}
              className={error ? "border-destructive" : ""}
              rows={4}
              maxLength={field.maxLength}
            />
            {field.maxLength && (
              <p className="text-xs text-muted-foreground text-right">
                {String(displayValue || "").length}/{field.maxLength}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive">
                {error.message as string}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            <Select
              value={String(displayValue ?? "")}
              onValueChange={(val) => {
                const selectedOption = field.options?.find(
                  (opt) => String(opt.value) === val,
                );
                const rawValue = field.transform
                  ? field.transform.toSubmit(
                      selectedOption?.value ?? val,
                      watch(),
                    )
                  : (selectedOption?.value ?? val);
                setValue(field.name, rawValue);
              }}
              disabled={field.disabled || isLoading}
            >
              <SelectTrigger className={error ? "border-destructive" : ""}>
                <SelectValue
                  placeholder={field.placeholder || `Select ${field.label}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-destructive">
                {error.message as string}
              </p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.name}
                checked={!!displayValue}
                onCheckedChange={(checked) => {
                  const rawValue = field.transform
                    ? field.transform.toSubmit(checked, watch())
                    : checked;
                  setValue(field.name, rawValue);
                }}
                disabled={field.disabled || isLoading}
              />
              <Label
                htmlFor={field.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground ml-6">
                {field.description}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive ml-6">
                {error.message as string}
              </p>
            )}
          </div>
        );

      case "hidden":
        return (
          <input key={field.name} type="hidden" {...register(field.name)} />
        );

      case "number":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            <div className="relative">
              {field.prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {field.prefix}
                </span>
              )}
              <Input
                id={field.name}
                type="number"
                placeholder={field.placeholder}
                disabled={field.disabled || isLoading}
                value={displayValue ?? ""}
                onChange={(e) => {
                  const inputValue =
                    e.target.value === "" ? "" : Number(e.target.value);

                  const rawValue = field.transform
                    ? field.transform.toSubmit(inputValue, watch())
                    : inputValue;

                  setValue(field.name, rawValue);
                }}
                className={`${error ? "border-destructive" : ""} ${field.prefix ? "pl-8" : ""} ${field.suffix ? "pr-12" : ""}`}
                min={minValue}
                max={maxValue}
                step="any"
              />
              {field.suffix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {field.suffix}
                </span>
              )}
            </div>
            {(minValue !== undefined || maxValue !== undefined) && (
              <p className="text-xs text-muted-foreground">
                Range: {minValue ?? 0} - {maxValue ?? "∞"}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive">
                {error.message as string}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            )}
            <div className="relative">
              {field.prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {field.prefix}
                </span>
              )}
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                disabled={field.disabled || isLoading}
                value={displayValue || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const rawValue = field.transform
                    ? field.transform.toSubmit(inputValue, watch())
                    : inputValue;
                  setValue(field.name, rawValue);
                }}
                className={`${error ? "border-destructive" : ""} ${field.prefix ? "pl-8" : ""} ${field.suffix ? "pr-12" : ""}`}
                minLength={field.minLength}
                maxLength={field.maxLength}
              />
              {field.suffix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {field.suffix}
                </span>
              )}
            </div>
            {field.maxLength && (
              <p className="text-xs text-muted-foreground text-right">
                {String(displayValue || "").length}/{field.maxLength}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive">
                {error.message as string}
              </p>
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
