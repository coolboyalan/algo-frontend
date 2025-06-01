"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react"; // Ensure lucide-react is installed

const EditItemForm = ({
  item,
  formFields,
  onSubmit,
  onCancel,
  // itemKeyField, // Passed by TableContentManager, not directly used here for field logic
  dynamicSelectOptions = {}, // e.g., { users: [{id:1, name:'Alice'}], categories: [...] }
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    if (formFields) {
      formFields.forEach((field) => {
        // Initialize from item if available, else from field.defaultValue, else empty string
        let value = ""; // Default to empty string
        if (item && item[field.key] !== undefined) {
          value = item[field.key];
        } else if (field.defaultValue !== undefined) {
          value = field.defaultValue;
        }

        // Ensure select values are strings or empty strings if null/undefined for controlled component
        if (field.type === "select" || field.type === "select_dynamic") {
          if (value === null || value === undefined) {
            value = "";
          } else {
            value = String(value);
          }
        }
        // For date inputs, format the value correctly if it's a date string/object
        if (field.type === "date" && value) {
          try {
            // Assuming value might be a full ISO string, get YYYY-MM-DD part
            value = new Date(value).toISOString().split("T")[0];
          } catch (e) {
            console.warn(`Invalid date value for field ${field.key}:`, value);
            value = ""; // Fallback to empty if date is invalid
          }
        }
        initialData[field.key] = value;
      });
    }
    setFormData(initialData);
  }, [item, formFields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedFormData = { ...formData };
    // Convert boolean string "true"/"false" from selects back to boolean
    formFields.forEach((field) => {
      if (
        field.type === "select" &&
        (processedFormData[field.key] === "true" ||
          processedFormData[field.key] === "false")
      ) {
        if (
          field.options &&
          field.options.some((opt) => typeof opt.value === "boolean")
        ) {
          processedFormData[field.key] =
            processedFormData[field.key] === "true";
        }
      }
    });
    onSubmit(processedFormData);
  };

  if (!formFields || formFields.length === 0) {
    return (
      <p className="text-gray-600">Form fields not configured for this item.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      {formFields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={`form-field-${field.key}`}
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "select_dynamic" ? (
            (() => {
              const optionsList =
                dynamicSelectOptions[field.optionsSourceKey] || [];
              return (
                <select
                  id={`form-field-${field.key}`}
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  required={field.required}
                  disabled={field.disabled}
                >
                  <option value="">
                    {field.placeholder || `Select ${field.label}...`}
                  </option>
                  {optionsList.map((opt) => (
                    <option
                      key={opt[field.optionValueKey || "id"]}
                      value={opt[field.optionValueKey || "id"]}
                    >
                      {opt[field.optionLabelKey || "name"]}
                    </option>
                  ))}
                </select>
              );
            })()
          ) : field.type === "select" ? (
            <select
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              disabled={field.disabled}
            >
              <option value="">
                {field.placeholder || `Select ${field.label}...`}
              </option>
              {field.options?.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {" "}
                  {/* Ensure value is string */}
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              rows={field.rows || 3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              disabled={field.disabled}
              placeholder={field.placeholder}
            />
          ) : field.type === "date" ? (
            <input
              type="date"
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""} // Already formatted to YYYY-MM-DD in useEffect
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              disabled={field.disabled}
            />
          ) : field.type === "password" ? (
            <input
              type="password"
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              disabled={field.disabled}
              placeholder={field.placeholder}
            />
          ) : (
            // Default to text or specified type (number, email, etc.)
            <input
              type={field.type || "text"}
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              readOnly={field.readOnly || field.disabled}
              disabled={field.disabled}
              placeholder={field.placeholder}
            />
          )}
          {field.description && (
            <p className="mt-1.5 text-xs text-gray-500">{field.description}</p>
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Save size={16} className="mr-2" /> Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditItemForm;
