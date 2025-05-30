"use client";

import TableContentManager from "@/components/CrudTable/TableContentManager";

const BrokerKeyDashboardPage = () => {
  const brokerKeyColumns = [
    {
      key: "userId",
      label: "User ID",
      type: "number",
      sortable: true,
    },
    {
      key: "brokerId",
      label: "Broker ID",
      type: "number",
      sortable: true,
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      sortable: false,
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "text",
      sortable: false,
    },
    {
      key: "token",
      label: "Token",
      type: "text",
      sortable: false,
    },
    {
      key: "tokenDate",
      label: "Token Date",
      type: "date",
      sortable: true,
    },
  ];

  const brokerKeyFilters = [
    {
      key: "userId",
      label: "User ID",
      type: "number",
    },
    {
      key: "brokerId",
      label: "Broker ID",
      type: "number",
    },
  ];

  const brokerKeyFormFields = [
    {
      key: "userId",
      label: "User ID",
      type: "number",
      required: true,
      placeholder: "Enter user ID",
    },
    {
      key: "brokerId",
      label: "Broker ID",
      type: "number",
      required: true,
      placeholder: "Enter broker ID",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      required: true,
      placeholder: "Enter API Key",
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "text",
      required: true,
      placeholder: "Enter API Secret",
    },
    {
      key: "token",
      label: "Token",
      type: "text",
      required: true,
      placeholder: "Enter token",
    },
    {
      key: "tokenDate",
      label: "Token Date",
      type: "date",
      required: true,
      placeholder: "Select token date",
    },
  ];

  return (
    <TableContentManager
      apiEndpoint="/api/broker-key"
      columns={brokerKeyColumns}
      filters={brokerKeyFilters}
      formFields={brokerKeyFormFields}
      itemKeyField="id"
      pageTitle="Broker Key Management"
    />
  );
};

export default BrokerKeyDashboardPage;
