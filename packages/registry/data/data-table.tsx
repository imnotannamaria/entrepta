"use client";

import {
  ArrowClockwiseIcon,
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  FunnelSimpleXIcon,
  TrayIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import {
  type ColumnHelper,
  type ColumnVisibilityState,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortingState,
  columnVisibilityFeature,
  createColumnHelper,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";
import { EmptyState } from "../feedback/empty-state";
import { Skeleton } from "../feedback/skeleton";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";
import { Checkbox } from "../primitives/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

/** What the DataTable registers with TanStack Table v9: sorting, selection, column visibility. */
const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

type DataTableFeatures = typeof dataTableFeatures;

/** A column helper typed for the DataTable: `const col = dataTableColumns<Entry>()`. */
function dataTableColumns<T extends object>(): ColumnHelper<DataTableFeatures, T> {
  return createColumnHelper<DataTableFeatures, T>();
}

type DataTableColumns<T extends object> = ReturnType<ColumnHelper<DataTableFeatures, T>["columns"]>;

const EMPTY_SELECTION: RowSelectionState = {};

/** What a state says: its title, a line under it, one action and an icon. */
interface DataTableMessage {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ComponentProps<typeof EmptyState>["icon"];
}

const LABELS = {
  emptyTitle: "No rows yet",
  filteredTitle: "Nothing matches these filters",
  filteredDescription: "Try fewer filters, or clear them to see every row.",
  clearFilters: "Clear filters",
  errorTitle: "The rows did not load",
  retry: "Try again",
  selectAll: "Select all rows",
  /** Before the row's number, when there is no rowLabel. */
  selectRow: "Select row",
};

// Skeleton bars of different lengths read as text; bars of one length read as a grid.
const SKELETON_WIDTHS = ["w-3/4", "w-1/2", "w-5/6", "w-2/3"];
const ROW_HEIGHT = 41;
const VIRTUAL_FROM = 500;

interface DataTableProps<T extends object> {
  data: T[];
  /** Built with `dataTableColumns<T>().columns([...])`. */
  columns: DataTableColumns<T>;
  /** A stable id per row, so selection survives a new page of data. */
  getRowId?: (row: T, index: number) => string;
  /** The table's name for screen readers. Or pass a caption. */
  "aria-label"?: string;
  caption?: React.ReactNode;
  /** Column ids whose cells are numbers: aligned right, in tabular figures. */
  numeric?: readonly string[];

  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** The data arrives sorted, such as from the server: the headers only report the order. */
  manualSorting?: boolean;

  /** Adds a checkbox to each row and one for the page. */
  selectable?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Names a row's checkbox: "Select Groceries, $45.00". */
  rowLabel?: (row: T) => string;

  columnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>;

  /** Skeleton rows in the table's own geometry. */
  loading?: boolean;
  loadingRows?: number;
  /** No rows at all: what is missing and the one thing to do about it. */
  empty?: DataTableMessage;
  /** The rows exist but the filters hide them all. Offers to clear them. */
  filtered?: boolean;
  onClearFilters?: () => void;
  /** The rows could not load. Shown instead of stale rows, with a retry. */
  error?: (DataTableMessage & { onRetry?: () => void }) | null;
  /** The words of the built-in states, for another language. */
  labels?: Partial<typeof LABELS>;
  onRowClick?: (row: T) => void;
  /** Past it the table scrolls in its box. Required for more than 500 rows, which then virtualize. */
  maxHeight?: number;
  className?: string;
}

/**
 * A table of records you sort, select and hide columns in, on TanStack Table
 * v9, rendered as a real `<table>`. Past 500 rows it renders only the rows in
 * view. Below 640px, show the same data as ListRows instead.
 */
function DataTable<T extends object>({
  data,
  columns,
  getRowId,
  "aria-label": ariaLabel,
  caption,
  numeric = [],
  sorting,
  onSortingChange,
  manualSorting,
  selectable = false,
  rowSelection,
  onRowSelectionChange,
  rowLabel,
  columnVisibility,
  onColumnVisibilityChange,
  loading = false,
  loadingRows = 6,
  empty,
  filtered = false,
  onClearFilters,
  error,
  labels: ownLabels,
  onRowClick,
  maxHeight,
  className,
}: DataTableProps<T>) {
  const words = { ...LABELS, ...ownLabels };
  const [ownSorting, setOwnSorting] = React.useState<SortingState>([]);
  const [ownSelection, setOwnSelection] = React.useState<RowSelectionState>(EMPTY_SELECTION);
  const [ownVisibility, setOwnVisibility] = React.useState<ColumnVisibilityState>({});

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    manualSorting,
    enableRowSelection: selectable,
    state: {
      sorting: sorting ?? ownSorting,
      rowSelection: rowSelection ?? ownSelection,
      columnVisibility: columnVisibility ?? ownVisibility,
    },
    onSortingChange: onSortingChange ?? setOwnSorting,
    onRowSelectionChange: onRowSelectionChange ?? setOwnSelection,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setOwnVisibility,
  });

  const rows = table.getRowModel().rows;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // A state in place of the rows is centered in what the box shows, not across
  // a table wider than it, which scrolls sideways on a phone.
  const [boxWidth, setBoxWidth] = React.useState<number>();
  React.useEffect(() => {
    const box = scrollRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setBoxWidth(box.clientWidth));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);
  const virtual = rows.length > VIRTUAL_FROM && maxHeight !== undefined;
  const virtualizer = useVirtualizer({
    count: virtual ? rows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: 8,
  });

  const leafColumns = table.getVisibleLeafColumns();
  const width = leafColumns.length + (selectable ? 1 : 0);
  const alignOf = (id: string) => (numeric.includes(id) ? "end" : "start");

  const renderRow = (row: Row<DataTableFeatures, T>, index: number) => {
    const selected = row.getIsSelected();
    return (
      <TableRow
        key={row.id}
        aria-rowindex={index + 2}
        // no aria-selected: a plain table's rows do not take it, and the checkbox says it
        data-state={selected ? "selected" : undefined}
        // a row that opens something takes the keyboard too: Tab to it, Enter or Space
        tabIndex={onRowClick ? 0 : undefined}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
        onKeyDown={
          onRowClick
            ? (event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onRowClick(row.original);
              }
            : undefined
        }
        className={cn(
          onRowClick &&
            "cursor-pointer outline-none focus-visible:bg-[var(--bg-hover-soft)] focus-visible:shadow-[inset_0_0_0_2px_var(--fg-brand)]"
        )}
      >
        {selectable ? (
          <TableCell className="w-10 pr-0">
            <Checkbox
              aria-label={rowLabel ? rowLabel(row.original) : `${words.selectRow} ${index + 1}`}
              checked={selected}
              disabled={!row.getCanSelect()}
              onChange={(event) => row.toggleSelected(event.target.checked)}
              onClick={(event) => event.stopPropagation()}
            />
          </TableCell>
        ) : null}
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} align={alignOf(cell.column.id)}>
            <table.FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const items = virtual ? virtualizer.getVirtualItems() : [];
  const padTop = virtual && items.length ? items[0].start : 0;
  const padBottom =
    virtual && items.length ? virtualizer.getTotalSize() - items[items.length - 1].end : 0;
  const someSelected = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();

  return (
    <Table
      aria-label={ariaLabel}
      aria-rowcount={rows.length + 1}
      aria-busy={loading || undefined}
      maxHeight={maxHeight}
      containerRef={scrollRef}
      className={className}
    >
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id} aria-rowindex={1} className="hover:bg-transparent">
            {selectable ? (
              <TableHead className="w-10 pr-0">
                <Checkbox
                  aria-label={words.selectAll}
                  disabled={loading || rows.length === 0}
                  checked={rows.length > 0 && table.getIsAllRowsSelected()}
                  indeterminate={someSelected}
                  onChange={(event) => table.toggleAllRowsSelected(event.target.checked)}
                />
              </TableHead>
            ) : null}
            {group.headers.map((header) => {
              const sortable = header.column.getCanSort();
              const direction = header.column.getIsSorted();
              const align = alignOf(header.column.id);
              return (
                <TableHead
                  key={header.id}
                  align={align}
                  aria-sort={
                    direction === "asc"
                      ? "ascending"
                      : direction === "desc"
                        ? "descending"
                        : sortable
                          ? "none"
                          : undefined
                  }
                >
                  {header.isPlaceholder ? null : sortable ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        "focus-ring -mx-1.5 inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-1.5 py-0.5",
                        "uppercase tracking-[0.08em] hover:text-[var(--fg-primary)]",
                        direction && "text-[var(--fg-primary)]",
                        align === "end" && "flex-row-reverse"
                      )}
                    >
                      <table.FlexRender header={header} />
                      {direction === "asc" ? (
                        <CaretUpIcon aria-hidden size={10} weight="bold" />
                      ) : direction === "desc" ? (
                        <CaretDownIcon aria-hidden size={10} weight="bold" />
                      ) : (
                        <CaretUpDownIcon aria-hidden size={10} className="opacity-50" />
                      )}
                    </button>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: loadingRows }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholders with no identity
            <TableRow key={i} aria-hidden className="hover:bg-transparent">
              {selectable ? (
                <TableCell className="w-10 pr-0">
                  <Skeleton className="size-4" delay={i * 0.06} />
                </TableCell>
              ) : null}
              {leafColumns.map((column, j) => (
                <TableCell key={column.id}>
                  <Skeleton
                    variant="line"
                    delay={i * 0.06}
                    className={cn(
                      "h-3",
                      numeric.includes(column.id)
                        ? "ml-auto w-1/2"
                        : SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length]
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : error ? (
          <StateRow width={width} boxWidth={boxWidth} live="assertive">
            <EmptyState
              tone="error"
              icon={error.icon ?? WarningIcon}
              title={error.title ?? words.errorTitle}
              description={error.description}
              action={
                error.action ??
                (error.onRetry ? (
                  <Button size="sm" variant="secondary" onClick={error.onRetry}>
                    <ArrowClockwiseIcon aria-hidden size={14} /> {words.retry}
                  </Button>
                ) : undefined)
              }
            />
          </StateRow>
        ) : rows.length === 0 && filtered ? (
          <StateRow width={width} boxWidth={boxWidth} live="polite">
            <EmptyState
              icon={FunnelSimpleXIcon}
              title={words.filteredTitle}
              description={words.filteredDescription}
              action={
                onClearFilters ? (
                  <Button size="sm" variant="secondary" onClick={onClearFilters}>
                    {words.clearFilters}
                  </Button>
                ) : undefined
              }
            />
          </StateRow>
        ) : rows.length === 0 ? (
          <StateRow width={width} boxWidth={boxWidth} live="polite">
            <EmptyState
              icon={empty?.icon ?? TrayIcon}
              title={empty?.title ?? words.emptyTitle}
              description={empty?.description}
              action={empty?.action}
            />
          </StateRow>
        ) : virtual ? (
          <>
            {padTop > 0 ? <tr aria-hidden style={{ height: padTop }} /> : null}
            {items.map((item) => renderRow(rows[item.index], item.index))}
            {padBottom > 0 ? <tr aria-hidden style={{ height: padBottom }} /> : null}
          </>
        ) : (
          rows.map((row, index) => renderRow(row, index))
        )}
      </TableBody>
    </Table>
  );
}

/** One cell across the table, for a state in place of the rows. It is announced as it appears. */
function StateRow({
  width,
  boxWidth,
  live,
  children,
}: {
  width: number;
  boxWidth?: number;
  live: "polite" | "assertive";
  children: React.ReactNode;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={width} className="h-auto whitespace-normal p-0">
        <div
          role={live === "assertive" ? "alert" : "status"}
          className="sticky left-0"
          style={boxWidth ? { width: boxWidth } : undefined}
        >
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
}

export { DataTable, dataTableColumns, dataTableFeatures };
export type { DataTableColumns, DataTableFeatures, DataTableMessage, DataTableProps };
