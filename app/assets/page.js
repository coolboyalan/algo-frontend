import TableContentManager from "@/components/CrudTable/TableContentManager";

const AssetPage = () => {
  const assetColumns = [
    {
      key: "id",
      label: "ID",
      type: "number",
      sortable: true,
    },
    {
      key: "name",
      label: "Asset Name",
      type: "text",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created at",
      type: "date",
      sortable: true,
    },
  ];

  const assetFormFields = [
    {
      key: "id",
      label: "Asset ID",
      type: "number", // Or number, but text usually safer for IDs if they can have leading zeros or be non-numeric
      disabled: true, // Example: ID is system-generated and read-only when editing
      placeholder: "ID (auto-generated)",
    },
    {
      key: "name",
      label: "Asset Name",
      type: "text",
      required: true,
      placeholder: "Enter asset name",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/asset" // Your actual API endpoint for assets
      columns={assetColumns}
      formFields={assetFormFields}
      itemKeyField="id" // The unique identifier field for a asset item
      pageTitle="Asset Management"
      canAddItem={true} // Allow adding new assets
    />
  );
};

export default AssetPage;
