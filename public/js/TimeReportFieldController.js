const { dateFormat } = window.arrmatura.lib;

window.TimeReportFieldController = class TimeReportFieldController {
  init() {
    return {
      actualData: !this.data?.length ? [] : JSON.parse(this.data),
    };
  }
  updateItemField(id, key, value) {
    return {
      actualData: this.actualData.map((e) => (e.id == id ? { ...e, [key]: value } : e))
    }
  }
  get visualData() {
    return this.actualData?.filter((e) => e.status !== 'deleted') || [];
  }
  setActualData(data) {
    this.actualData = data;
    this.onChange?.({ value: !data.length ? "" : JSON.stringify(data) });
  }
  onUpdateField({ id, key, value }) {
    return this.updateItemField(id, key, value);
  }
  onAddReport(defaults, { actualData }) {
    return {
      actualData: [{ status: 'planned', hours: 1, date: dateFormat(Date.now()), ...defaults, id: Date.now() }, ...actualData],
    };
  }
  onDelReport({ id }) {
    return this.updateItemField(id, 'status', 'deleted');
  }
}
