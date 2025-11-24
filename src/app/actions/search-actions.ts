// app/actions/search-actions.ts
"use server";

import { fetchTableData } from "@/app/actions/table-data";

export async function searchRecords({
  endpoint,
  query,
  searchFields,
  labelKey = "name",
  valueKey = "id",
  limit = 20,
}: {
  endpoint: string;
  query: string;
  searchFields: string[];
  labelKey?: string;
  valueKey?: string;
  limit?: number;
}) {
  try {
    const result = await fetchTableData(endpoint, {
      searchQuery: query,
      searchFields,
      limit,
    });

    return result.data.map((item: any) => ({
      label: item[labelKey] || item.name || String(item[valueKey]),
      value: item[valueKey],
    }));
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}
