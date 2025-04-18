import Papa from "papaparse";
import localStorageAPI from "./applications";

export function downloadCSV(data, filename = "job_applications.csv") {
  if (!data.length) return;

  const headers = Object.keys(data[0]);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;

      // write headers
      controller.enqueue(encoder.encode(headers.map(escape).join(",") + "\n"));

      // write rows
      for (const obj of data) {
        if (!obj.interviewDate) obj.interviewDate = "";
        if (!obj.applicationDate) obj.applicationDate = "";
        const row = headers.map((key) => escape(obj[key]));
        controller.enqueue(encoder.encode(row.join(",") + "\n"));
      }

      controller.close();
    },
  });

  new Response(stream).blob().then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

export function importCSV(file) {
  const ids = localStorageAPI.fetchApplications().map((row) => row.id);
  const results = [];
  const handleResult = (result) => {
    if (!result.interviewDate || result.interviewDate === "null")
      result.interviewDate = "";
    if (!ids.includes(result.data.id)) results.push(result.data);
  };
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: handleResult,
      dynamicTyping: true,
      complete: () => resolve(results),
      error: reject,
    });
  });
}
