"use client";
import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react"; // Added AlertCircle for error icon

const EditItemForm = ({
  item,
  formFields,
  onSubmit, // This prop will now be an async function that returns { success: boolean, error?: string }
  onCancel,
  dynamicSelectOptions = {},
}) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    const initialData = {};
    if (formFields) {
      formFields.forEach((field) => {
        let value = "";
        if (item && item[field.key] !== undefined) {
          value = item[field.key];
        } else if (field.defaultValue !== undefined) {
          value = field.defaultValue;
        }

        if (field.type === "select" || field.type === "select_dynamic") {
          const currentFieldValue = value;
          if (currentFieldValue === null || currentFieldValue === undefined) {
            value = "";
          } else {
            value = String(currentFieldValue);
          }
        }
        if (field.type === "date" && value) {
          try {
            value = new Date(value).toISOString().split("T")[0];
          } catch (e) {
            console.warn(`Invalid date value for field ${field.key}:`, value);
            value = "";
          }
        }
        initialData[field.key] = value;
      });
    }
    setFormData(initialData);
    setSubmissionError(null); // Clear errors when item or formFields change
  }, [item, formFields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (submissionError) {
      // Clear error when user starts typing again
      setSubmissionError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);
    setIsSubmitting(true);

    const processedFormData = { ...formData };
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
      if (
        field.type === "number" &&
        processedFormData[field.key] !== "" &&
        processedFormData[field.key] !== null &&
        !isNaN(Number(processedFormData[field.key]))
      ) {
        processedFormData[field.key] = Number(processedFormData[field.key]);
      }
    });

    try {
      const result = await onSubmit(processedFormData); // onSubmit is expected to be async and return status
      if (result && !result.success) {
        setSubmissionError(
          result.error ||
            "Submission failed. Please check your input and try again.",
        );
      }
      // On successful submission, TableContentManager will close the modal,
      // and EditItemForm will unmount or its item prop will change, triggering useEffect.
    } catch (e) {
      // This catch is a fallback if onSubmit itself throws an unhandled error
      // (though ideally, onSubmit should always return the structured result).
      setSubmissionError(
        e.message || "An unexpected error occurred during submission.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formFields || formFields.length === 0) {
    return (
      <p className="text-gray-600">Form fields not configured for this item.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      {submissionError && (
        <div
          role="alert"
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 flex items-start"
        >
          <AlertCircle size={20} className="mr-2 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">Submission Error:</p>
            <p>{submissionError}</p>
          </div>
        </div>
      )}
      {formFields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={`form-field-${field.key}`}
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {/* ... (input rendering logic remains the same as your last provided version) ... */}
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
                  disabled={isSubmitting || field.disabled}
                >
                  <option value="">
                    {field.placeholder || `Select ${field.label}...`}
                  </option>
                  {optionsList.map((opt) => (
                    <option
                      key={opt[field.optionValueKey || "id"]}
                      value={opt[field.optionValueKey || "id"]}
                    >
                      {" "}
                      {opt[field.optionLabelKey || "name"]}{" "}
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
              disabled={isSubmitting || field.disabled}
            >
              <option value="">
                {field.placeholder || `Select ${field.label}...`}
              </option>
              {field.options?.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {" "}
                  {opt.label}{" "}
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
              disabled={isSubmitting || field.disabled}
              placeholder={field.placeholder}
            />
          ) : field.type === "date" ? (
            <input
              type="date"
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              disabled={isSubmitting || field.disabled}
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
              disabled={isSubmitting || field.disabled}
              placeholder={field.placeholder}
            />
          ) : (
            <input
              type={field.type || "text"}
              id={`form-field-${field.key}`}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              required={field.required}
              readOnly={field.readOnly || field.disabled}
              disabled={isSubmitting || field.disabled}
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
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-70"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" /> Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditItemForm;
