// components/forms/searchable-select.tsx
"use client";

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
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    async function fetchOptions() {
      if (debouncedSearch.length < 1) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchRecords({
          endpoint,
          query: debouncedSearch,
          searchFields,
          labelKey,
          valueKey,
          limit,
        });
        setOptions(results);
      } catch (error) {
        console.error("Search failed:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOptions();
  }, [debouncedSearch, endpoint, searchFields, labelKey, valueKey, limit]);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={String(option.value)}
                      onSelect={() => {
                        onValueChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
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
