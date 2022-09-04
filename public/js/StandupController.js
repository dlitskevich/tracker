
window.StandupController = class StandupController {
  get usersInfo() {
    const { arrayGroupBy, arrayToObject } = window.arrmatura.lib;
    const hash = arrayGroupBy(this.data || [], 'user');
    const prepareReport = (data = []) => {
      const totalHours = data.reduce((r, e) => (r += +(e.hours || 0), r), 0);
      return {
        color: totalHours >= 7 ? "green" : (totalHours >= 4 ? "orange" : "red"),
        totalHours,
        data,
      }
    }

    return (this.users || []).map(e => {
      const reports = arrayGroupBy(hash[e.id]?.items, 'status')
      return {
        ...e,
        reports: {
          performed: prepareReport(reports.done?.items),

          planned: prepareReport(reports.planned?.items),

          blocked: prepareReport(reports.blocked?.items),
        }
      }
    })
  }

}
