import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { FixedSizeList as List, type ListOnScrollProps } from "react-window";
import { useRef } from "react";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  rowHeight?: number;
  columnWidth?: number;
  visibleMiddleColumnCount?: number;
  height?: number;
}

export function VirtualizedTable<T>({
  data,
  columns,
  rowHeight = 40,
  columnWidth = 120,
  visibleMiddleColumnCount = 10,
  height = 400,
}: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const leftColumns = columns.slice(0, 2);
  const rightColumns = columns.slice(-2);
  const middleColumns = columns.slice(2, -2);

  const leftWidth = leftColumns.length * columnWidth;
  const rightWidth = rightColumns.length * columnWidth;
  const middleWidth = visibleMiddleColumnCount * columnWidth;

  const listRefLeft = useRef<any>(null);
  const listRefMiddle = useRef<any>(null);
  const listRefRight = useRef<any>(null);

  const syncScroll = (source: "left" | "middle" | "right") => (e: ListOnScrollProps) => {
    const offset = e.scrollOffset;
    if (source !== "left" && listRefLeft.current) listRefLeft.current.scrollTo(offset);
    if (source !== "middle" && listRefMiddle.current) listRefMiddle.current.scrollTo(offset);
    if (source !== "right" && listRefRight.current) listRefRight.current.scrollTo(offset);
  };

  return (
    <div className="flex w-full overflow-hidden border border-gray-300">
      {/* Left Fixed Pane */}
      <div className="bg-white z-10 shadow-md" style={{ width: leftWidth }}>
        {/* Header */}
        <div className="flex bg-gray-200 border-b border-gray-300 sticky top-0 z-20">
          {table.getHeaderGroups()[0].headers.slice(0, 2).map((header) => (
            <div
              key={header.id}
              className="px-3 py-2 border-r border-gray-300 font-semibold text-sm text-gray-700"
              style={{ width: columnWidth }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>

        {/* Rows */}
        <List
          ref={listRefLeft}
          height={height}
          itemCount={rows.length}
          itemSize={rowHeight}
          width={leftWidth}
          onScroll={syncScroll("left")}
        >
          {({ index, style }) => {
            const row = rows[index];
            return (
              <div className="flex border-b border-gray-100 bg-white" style={style}>
                {row.getVisibleCells().slice(0, 2).map((cell) => (
                  <div
                    key={cell.id}
                    className="px-3 py-2 border-r border-gray-200 text-sm text-gray-800 truncate"
                    style={{ width: columnWidth }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          }}
        </List>
      </div>

      {/* Middle Scrollable Pane */}
      <div className="overflow-x-auto" style={{ width: middleWidth }}>
        <div style={{ width: middleColumns.length * columnWidth }}>
          {/* Header */}
          <div className="flex bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            {table.getHeaderGroups()[0].headers.slice(2, -2).map((header) => (
              <div
                key={header.id}
                className="px-3 py-2 border-r border-gray-300 font-semibold text-sm text-gray-700"
                style={{ width: columnWidth }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
          </div>

          {/* Rows */}
          <List
            ref={listRefMiddle}
            height={height}
            itemCount={rows.length}
            itemSize={rowHeight}
            width={middleColumns.length * columnWidth}
            onScroll={syncScroll("middle")}
          >
            {({ index, style }) => {
              const row = rows[index];
              return (
                <div className="flex border-b border-gray-100" style={style}>
                  {row.getVisibleCells().slice(2, -2).map((cell) => (
                    <div
                      key={cell.id}
                      className="px-3 py-2 border-r border-gray-200 text-sm text-gray-800 truncate"
                      style={{ width: columnWidth }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            }}
          </List>
        </div>
      </div>

      {/* Right Fixed Pane */}
      <div className="bg-white z-10 shadow-md" style={{ width: rightWidth }}>
        {/* Header */}
        <div className="flex bg-gray-200 border-b border-gray-300 sticky top-0 z-20">
          {table.getHeaderGroups()[0].headers.slice(-2).map((header) => (
            <div
              key={header.id}
              className="px-3 py-2 border-r border-gray-300 font-semibold text-sm text-gray-700"
              style={{ width: columnWidth }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>

        {/* Rows */}
        <List
          ref={listRefRight}
          height={height}
          itemCount={rows.length}
          itemSize={rowHeight}
          width={rightWidth}
          onScroll={syncScroll("right")}
        >
          {({ index, style }) => {
            const row = rows[index];
            return (
              <div className="flex border-b border-gray-100 bg-white" style={style}>
                {row.getVisibleCells().slice(-2).map((cell) => (
                  <div
                    key={cell.id}
                    className="px-3 py-2 border-r border-gray-200 text-sm text-gray-800 truncate"
                    style={{ width: columnWidth }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          }}
        </List>
      </div>
    </div>
  );
}
