"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { DataTableViewOptions } from "../segments/data-table-view-options";
import { Badge } from "../../../ui/badge";
import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="shadow rounded-[25px] w-[500px] h-[50px] border border-yelow-400 p-3"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="review"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex  gap-2 ml-4 justify-center items-center">
              <p className="text-sm text-white">Select Platform:</p>
              <Badge
                variant="outline"
                className="px-3 flex gap-3 border border-white justify-between items-center py-2 w-[fit-content] h-[40px] rounded-[25px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  height="25"
                  stroke-linejoin="round"
                  stroke-miterlimit="1.414"
                  viewBox="-.092 .015 2732.125 2671.996"
                  width="25"
                >
                  <path
                    d="m2732.032 513.03c0-283.141-229.978-513.015-513.118-513.015h-1705.89c-283.138 0-513.116 229.874-513.116 513.015v1645.965c0 283.066 229.978 513.016 513.118 513.016h1705.889c283.14 0 513.118-229.95 513.118-513.016z"
                    fill="#0c3b7c"
                  />
                  <path
                    d="m.001 1659.991h1364.531v1012.019h-1364.53z"
                    fill="#0c3b7c"
                  />
                  <g fill-rule="nonzero">
                    <path
                      d="m1241.6 1768.638-220.052-.22v-263.12c0-56.22 21.808-85.48 69.917-92.165h150.136c107.068 0 176.328 67.507 176.328 176.766 0 112.219-67.507 178.63-176.328 178.739zm-220.052-709.694v-69.26c0-60.602 25.643-89.424 81.862-93.15h112.657c96.547 0 154.41 57.753 154.41 154.52 0 73.643-39.671 159.67-150.903 159.67h-198.026zm501.037 262.574-39.78-22.356 34.74-29.699c40.437-34.74 108.163-112.876 108.163-247.67 0-206.464-160.109-339.614-407.888-339.614h-282.738v-.11h-32.219c-73.424 2.74-132.273 62.466-133.04 136.329v1171.499h453.586c275.396 0 453.148-149.917 453.148-382.135 0-125.04-57.424-231.889-153.972-286.244"
                      fill="#fff"
                    />
                    <path
                      d="m1794.688 1828.066c0-89.492 72.178-161.894 161.107-161.894 89.154 0 161.669 72.402 161.669 161.894 0 89.379-72.515 161.894-161.67 161.894-88.928 0-161.106-72.515-161.106-161.894"
                      fill="#00bafc"
                    />
                  </g>
                </svg>
                <p className="text-lg font-normal">
                  Booking{" "}
                  <span className="text-gray-400 text-sm font-normal">
                    (20 Reviews)
                  </span>
                </p>
              </Badge>
              <Button
                variant="outline"
                style={{
                  border: "1px solid red",
                }}
                className="h-8 px-3 border-1 border-red-500"
              >
                Generate Bulk Reviews
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Google</DropdownMenuItem>
            <DropdownMenuItem>Yelp</DropdownMenuItem>
            <DropdownMenuItem>Booking</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
