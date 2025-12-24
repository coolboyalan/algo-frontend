"use client";

import { fetchRecordById } from "@/app/actions/table-data";
import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { searchRecords } from "@/app/actions/search-actions";

type Option = {
  label: string;
  value: string | number;
};

interface SearchableSelectProps {
  value?: string | number;
  onValueChange: (value: string | number) => void;
  endpoint: string;
  searchFields: string[];
  labelKey?: string;
  valueKey?: string;
  limit?: number;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  widthClass?: string; // Allow easy style override
}

export function SearchableSelect({
  value,
  onValueChange,
  endpoint,
  searchFields,
  labelKey = "name",
  valueKey = "id",
  limit = 20,
  placeholder = "Select...",
  emptyText = "No results found.",
  disabled = false,
  widthClass = "w-full max-w-lg min-w-[240px]",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string>("");

  const debouncedSearch = useDebounce(searchQuery, 250);

  React.useEffect(() => {
    let ignore = false;

    async function fetchInitialOption() {
      if (!value || options.find((o) => o.value === value)) return;
      setIsLoading(true);
      try {
        // Direct lookup by id
        const record = await fetchRecordById<Record<string, unknown>>(endpoint, String(value));
        if (!ignore && record) {
          setOptions((old) => [
            {
              label: String(record[labelKey] ?? record[valueKey]),
              value: record[valueKey] as string | number,
            },
            ...old.filter((o) => o.value !== value),
          ]);
          setSelectedLabel(String(record[labelKey] ?? record[valueKey]));
        }
      } catch {
        // ignore errors
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    if (value && !options.find((o) => o.value === value)) {
      fetchInitialOption();
    }

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line
  }, [value, endpoint, labelKey, valueKey]);

  // eslint-disable-next-line

  // On search/change/open, fetch options as normal
  React.useEffect(() => {
    let ignore = false;
    async function fetchOptions(query: string) {
      setIsLoading(true);
      try {
        const results = await searchRecords({
          endpoint,
          query: query || "",
          searchFields,
          labelKey,
          valueKey,
          limit,
        });
        if (!ignore) setOptions(results);
      } catch {
        if (!ignore) setOptions([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    if (open) fetchOptions(debouncedSearch);
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line
  }, [
    debouncedSearch,
    open,
    endpoint,
    searchFields,
    labelKey,
    valueKey,
    limit,
  ]);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label || selectedLabel || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            widthClass,
            "justify-between px-3 py-2 text-left font-normal focus:ring-2 aria-expanded:ring-2",
          )}
          aria-expanded={open}
          disabled={disabled}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value ? displayLabel : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(widthClass, "p-0 z-[2000] mt-2")}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            autoFocus={open}
            className="h-10 px-3"
          />
          <CommandList className="max-h-56 overflow-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  <span className="text-muted-foreground">{emptyText}</span>
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={String(option.value)}
                      className={cn(
                        "flex items-center cursor-pointer px-3 py-2 rounded hover:bg-accent focus:bg-accent",
                        value === option.value && "bg-primary/10 font-semibold",
                      )}
                      onSelect={() => {
                        onValueChange(option.value);
                        setOpen(false);
                        setSearchQuery("");
                        setSelectedLabel(option.label);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
