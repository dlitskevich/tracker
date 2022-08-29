window.fetchText = (url, fn)=>fetch(url)
      .then((res) => res.text())
      .then(fn);
      
window.TimeReportFieldController = class TimeReportFieldController {
  init() {
    return {
      actualData: !this.data?.length ? [] : JSON.parse(this.data),
    };
  }
  setActualData(data) {
    this.actualData = data;
    this.onChange?.({ value: !data.length ? "" : JSON.stringify(data) });
  }
  onNote({ value: note, id }, { actualData, newReport }) {
    if (!id) {
      return { newReport: { ...newReport, note } };
    }
    return {
      actualData: actualData.map((e) => (e.id == id ? { ...e, note } : e)),
    };
  }
  onHours({ value: hours, id }, { actualData, newReport }) {
    if (!id) {
      return { newReport: { ...newReport, hours } };
    }
    return {
      actualData: actualData.map((e) => (e.id == id ? { ...e, hours } : e)),
    };
  }
  onAddReport({ note = "", hours = "1" }, { actualData, newReport }) {
    return {
      actualData: [{ ...newReport, id: Date.now() }, ...actualData],
    };
  }
  onDelReport({ id }, { actualData }) {
    return {
      actualData: actualData.filter((e) => e.id != id),
    };
  }
}
