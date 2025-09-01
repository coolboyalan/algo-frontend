"use client";
import { useState, useEffect } from "react";
import { Save, AlertCircle, Loader2 } from "lucide-react";

export default function EditItemForm({
  item,
  formFields,
  onSubmit,
  onCancel,
  dynamicSelectOptions = {},
}) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialData = {};
    formFields?.forEach((field) => {
      let value = item?.[field.key] ?? field.defaultValue ?? "";

      if (field.type === "select" || field.type === "select_dynamic") {
        value = value == null ? "" : String(value);
      }
      if (field.type === "date" && value) {
        try {
          value = new Date(value).toISOString().split("T")[0];
        } catch {
          value = "";
        }
      }
      initialData[field.key] = value;
    });
    setFormData(initialData);
    setError(null);
  }, [item, formFields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const processedData = { ...formData };
    formFields?.forEach((field) => {
      if (
        field.type === "select" &&
        ["true", "false"].includes(processedData[field.key])
      ) {
        if (field.options?.some((opt) => typeof opt.value === "boolean")) {
          processedData[field.key] = processedData[field.key] === "true";
        }
      }
      if (
        field.type === "number" &&
        processedData[field.key] &&
        !isNaN(processedData[field.key])
      ) {
        processedData[field.key] = Number(processedData[field.key]);
      }
    });

    try {
      const result = await onSubmit(processedData);
      if (result && !result.success) {
        setError(result.error || "Submission failed. Please check your input.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formFields?.length) {
    return <p className="text-slate-400">No form fields configured.</p>;
  }

  const renderField = (field) => {
    const baseProps = {
      id: `field-${field.key}`,
      value: formData[field.key] || "",
      onChange: (e) => handleChange(field.key, e.target.value),
      disabled: isSubmitting || field.disabled,
      className:
        "w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors",
    };

    switch (field.type) {
      case "select_dynamic":
        const options = dynamicSelectOptions[field.optionsSourceKey] || [];
        return (
          <select {...baseProps}>
            <option value="">
              {field.placeholder || `Select ${field.label}...`}
            </option>
            {options.map((opt) => (
              <option
                key={opt[field.optionValueKey || "id"]}
                value={opt[field.optionValueKey || "id"]}
              >
                {opt[field.optionLabelKey || "name"]}
              </option>
            ))}
          </select>
        );

      case "select":
        return (
          <select {...baseProps}>
            <option value="">
              {field.placeholder || `Select ${field.label}...`}
            </option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            {...baseProps}
            rows={field.rows || 3}
            placeholder={field.placeholder}
          />
        );

      default:
        return (
          <input
            {...baseProps}
            type={field.type || "text"}
            placeholder={field.placeholder}
            readOnly={field.readOnly}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
          <AlertCircle
            size={20}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {formFields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={`field-${field.key}`}
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-400">*</span>}
          </label>
          {renderField(field)}
          {field.helpText && (
            <p className="mt-1.5 text-xs text-slate-400">{field.helpText}</p>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-xl transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
