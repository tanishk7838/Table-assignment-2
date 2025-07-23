import React, { useRef, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { generateData, numCols, numRows, headers } from "../data/tableData";

const rowHeight = 35;
const colWidth = 100;
const gridWidth = 1000;
const gridHeight = 600;

const data = generateData();

const VirtualTable: React.FC = () => {
  const headerOuterRef = useRef<HTMLDivElement>(null);
  const bodyOuterRef = useRef<HTMLDivElement>(null);

  // Sync scroll between header and body in both directions
  useEffect(() => {
    const header = headerOuterRef.current;
    const body = bodyOuterRef.current;

    if (!header || !body) return;

    let isSyncingHeader = false;
    let isSyncingBody = false;

    const handleBodyScroll = () => {
      if (isSyncingBody) {
        isSyncingBody = false;
        return;
      }
      isSyncingHeader = true;
      header.scrollLeft = body.scrollLeft;
    };

    const handleHeaderScroll = () => {
      if (isSyncingHeader) {
        isSyncingHeader = false;
        return;
      }
      isSyncingBody = true;
      body.scrollLeft = header.scrollLeft;
    };

    body.addEventListener("scroll", handleBodyScroll);
    header.addEventListener("scroll", handleHeaderScroll);

    return () => {
      body.removeEventListener("scroll", handleBodyScroll);
      header.removeEventListener("scroll", handleHeaderScroll);
    };
  }, []);

  return (
    <div className="rounded shadow border border-gray-300 w-fit mx-auto">
      {/* Header Grid */}
      <div className="overflow-hidden">
        <Grid
          outerRef={headerOuterRef}
          columnCount={numCols}
          columnWidth={colWidth}
          height={rowHeight}
          rowCount={1}
          rowHeight={rowHeight}
          width={gridWidth}
        >
          {({ columnIndex, style }) => (
            <div
              className="border border-gray-300 bg-gray-100 font-semibold flex items-center justify-center text-sm"
              style={style}
            >
              {headers[columnIndex]}
            </div>
          )}
        </Grid>
      </div>

      {/* Body Grid */}
      <Grid
        outerRef={bodyOuterRef}
        columnCount={numCols}
        columnWidth={colWidth}
        height={gridHeight}
        rowCount={numRows}
        rowHeight={rowHeight}
        width={gridWidth}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className="border border-gray-200 flex items-center justify-center text-sm bg-white"
            style={style}
          >
            {data[rowIndex][columnIndex]}
          </div>
        )}
      </Grid>
    </div>
  );
};

export default VirtualTable;
