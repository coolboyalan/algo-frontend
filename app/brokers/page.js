"use client";

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

  const brokerFilters = [
    {
      key: "name",
      label: "Broker Name",
      type: "text",
    },
  ];

  const brokerFormFields = [
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
      apiEndpoint="/api/broker"
      columns={brokerColumns}
      filters={brokerFilters}
      formFields={brokerFormFields}
      itemKeyField="id"
      pageTitle="Broker Management"
    />
  );
};

export default BrokerDashboardPage;
