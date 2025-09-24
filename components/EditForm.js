"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

const EditItemForm = ({
  item,
  formFields,
  onSubmit,
  onCancel,
  dynamicSelectOptions = {},
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    if (formFields) {
      formFields.forEach((field) => {
        initialData[field.key] = item
          ? item[field.key] !== undefined
            ? item[field.key]
            : field.defaultValue !== undefined
              ? field.defaultValue
              : ""
          : field.defaultValue !== undefined
            ? field.defaultValue
            : "";

        if (field.type === "select" || field.type === "select_dynamic") {
          const value = initialData[field.key];
          if (
            value === null ||
            value === undefined ||
            typeof value === "object"
          ) {
            initialData[field.key] = "";
          } else {
            initialData[field.key] = String(value);
          }
        }
      });
    }
    setFormData(initialData);
  }, [item, formFields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!formFields || formFields.length === 0) {
    return (
      <p className="text-slate-400">
        Form fields not configured for this item.
      </p>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <div
              key={field.key}
              className={field.fullWidth ? "md:col-span-2" : ""}
            >
              <label
                htmlFor={field.key}
                className="block text-sm font-medium text-slate-200 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {field.type === "select_dynamic" ? (
                (() => {
                  const optionsList =
                    dynamicSelectOptions[field.optionsSourceKey] || [];
                  return (
                    <select
                      id={field.key}
                      name={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-600/50 disabled:text-slate-400 transition-colors"
                      required={field.required}
                      disabled={field.disabled}
                    >
                      <option value="">
                        {field.placeholder || `Select ${field.label}...`}
                      </option>
                      {optionsList.map((opt) => (
                        <option
                          key={opt[field.optionValueKey]}
                          value={opt[field.optionValueKey]}
                        >
                          {opt[field.optionLabelKey]}
                        </option>
                      ))}
                    </select>
                  );
                })()
              ) : field.type === "select" ? (
                <select
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-600/50 disabled:text-slate-400 transition-colors"
                  required={field.required}
                  disabled={field.disabled}
                >
                  <option value="">
                    {field.placeholder || `Select ${field.label}...`}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={field.rows || 4}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-600/50 disabled:text-slate-400 transition-colors resize-vertical"
                  required={field.required}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                />
              ) : field.type === "date" ? (
                <input
                  type="date"
                  id={field.key}
                  name={field.key}
                  value={
                    formData[field.key]
                      ? String(formData[field.key]).split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-600/50 disabled:text-slate-400 transition-colors"
                  required={field.required}
                  disabled={field.disabled}
                />
              ) : field.type === "password" ? (
                <input
                  type="password"
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-600/50 disabled:text-slate-400 transition-colors"
                  required={field.required}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-600/50 disabled:text-slate-400 transition-colors"
                  required={field.required}
                  readOnly={field.readOnly || field.disabled}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                />
              )}

              {field.description && (
                <p className="mt-2 text-xs text-slate-400">
                  {field.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemForm;
