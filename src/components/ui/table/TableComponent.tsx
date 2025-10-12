import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { Button } from "@/components/ui/shadcn/Button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";

interface DataTableProps<T> {
  columns: string[];
  data: T[];
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
  }[];
  renderRow: (item: T) => React.ReactNode;
}

export function TableComponent<T>({
  columns,
  data,
  actions,
  renderRow,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead key={index}>{col}</TableHead>
          ))}
          {actions && <TableHead className="w-[70px]">Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={index}>
              {renderRow(item)}
              {actions && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, i) => (
                        <DropdownMenuItem
                          key={i}
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon && (
                            <span className="mr-2">{action.icon}</span>
                          )}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No se encontraron resultados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
