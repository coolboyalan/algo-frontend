export default EditItemForm = ({
  item,
  formFields,
  onSubmit,
  onCancel,
  itemKeyField,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Initialize form data if item is provided (for editing)
    // Or set defaults if specified in formFields (for creating)
    const initialData = {};
    formFields.forEach((field) => {
      initialData[field.key] = item
        ? item[field.key]
        : field.defaultValue !== undefined
          ? field.defaultValue
          : "";
    });
    setFormData(initialData);
  }, [item, formFields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the current form data for submission
  };

  if (!formFields || formFields.length === 0) {
    return (
      <p className="text-gray-600">Form fields not configured for this item.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={field.key}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              id={field.key}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required={field.required}
            >
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required={field.required}
            />
          ) : (
            <input
              type={field.type || "text"}
              id={field.key}
              name={field.key}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required={field.required}
              readOnly={field.readOnly}
              placeholder={field.placeholder}
            />
          )}
          {field.description && (
            <p className="mt-1 text-xs text-gray-500">{field.description}</p>
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
        >
          <Save size={16} className="mr-2" /> Save Changes
        </button>
      </div>
    </form>
  );
};
