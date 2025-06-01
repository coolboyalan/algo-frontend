import TableContentManager from "@/components/CrudTable/TableContentManager";

const BrokerDashboardPage = () => {
  const brokerColumns = [
    {
      key: "id",
      label: "ID",
      type: "number",
      sortable: true,
    },
    {
      key: "name",
      label: "Broker Name",
      type: "text",
      sortable: true,
    },
  ];

  const brokerFormFields = [
    {
      key: "id",
      label: "Broker ID",
      type: "number", // Or number, but text usually safer for IDs if they can have leading zeros or be non-numeric
      disabled: true, // Example: ID is system-generated and read-only when editing
      placeholder: "ID (auto-generated)",
    },
    {
      key: "name",
      label: "Broker Name",
      type: "text",
      required: true,
      placeholder: "Enter broker name",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/broker" // Your actual API endpoint for brokers
      columns={brokerColumns}
      formFields={brokerFormFields}
      itemKeyField="id" // The unique identifier field for a broker item
      pageTitle="Broker Management"
      canAddItem={true} // Allow adding new brokers
    />
  );
};

export default BrokerDashboardPage;
