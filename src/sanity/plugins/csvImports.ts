import { definePlugin } from "sanity";
import { CsvImportTool } from "../tools/CsvImportTools";

export const csvImportPlugin = definePlugin({
  name: "csv-import",
  tools: [
    {
      name: "csv-import",
      title: "Import CSV",
      component: CsvImportTool,
    },
  ],
});
