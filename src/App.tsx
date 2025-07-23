
import { type ColumnDef } from "@tanstack/react-table";
import { VirtualizedTable } from "./components/VirtualizedTable";


type Person = Record<string, string | number>;
const columns: ColumnDef<Person>[] = Array.from({ length: 50 }, (_, i) => ({
  accessorKey: `col${i + 1}`,
  header: `Col ${i + 1}`,
}));

const data: Person[] = Array.from({ length: 1000 }, (_, rowIndex) => {
  const row: Person = {};
  for (let colIndex = 1; colIndex <= 50; colIndex++) {
    row[`col${colIndex}`] = `R${rowIndex + 1} - C${colIndex}`;
  }
  return row;
});


function App() {
  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Virtualized Table using react-window and tenstack tables</h1>
      {/* <VirtualTable /> */}
       <VirtualizedTable data={data} columns={columns} />
    </div>
  )
}

export default App