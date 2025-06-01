"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react"; // Ensure lucide-react is installed

const EditItemForm = ({
  item,
  formFields,
  onSubmit,
  onCancel,
  // itemKeyField, // Passed but not directly used in this component's form field logic
  dynamicSelectOptions = {}, // To populate select_dynamic fields
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
            // If it's an object (e.g. item.user = {id:1, name:'Test'}), and field.key is 'user', this won't work for select.
            // Assuming if field.key is 'userId', item.userId already holds the ID.
            initialData[field.key] = "";
          } else {
            initialData[field.key] = String(value); // Ensure it's a string for <select> value
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
      <p className="text-gray-600">Form fields not configured for this item.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      {" "}
      {/* Increased spacing and padding */}
      {formFields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={field.key}
            className="block text-sm font-medium text-gray-800 mb-1.5" /* Slightly bolder label */
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
                  id={field.key}
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
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
              rows={field.rows || 3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
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
              } // Format for date input
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              readOnly={field.readOnly || field.disabled} // readOnly can also be used
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
