
export const numRows = 200;
export const numCols = 50;


export const generateData = () =>
  Array.from({ length: numRows }, (_, rowIndex) =>
    Array.from(
      { length: numCols },
      (_, colIndex) => `R${rowIndex + 1}C${colIndex + 1}`
    )
  );

export const headers = Array.from(
  { length: numCols },
  (_, i) => `Col ${i + 1}`
);
