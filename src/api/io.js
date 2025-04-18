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
