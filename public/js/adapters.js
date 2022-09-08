

window.adapters = (function () {
  const { arrayGroupBy, arrayToObject } = window.arrmatura.lib;

  return {
    standupAdapter: (data, users) => {
      const hash = arrayGroupBy(data || [], 'user');

      const prepareReport = (data = []) => {
        const totalHours = data.reduce((r, e) => (r += +(e.hours || 0), r), 0);
        return {
          color: totalHours >= 7 ? "green" : (totalHours >= 4 ? "orange" : "red"),
          totalHours,
          data,
        }
      }

      return (users || []).map(e => {
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
    },

    kbAdapter: (data) => {
      const hash = arrayGroupBy(data || [], 'parent');

      return (data || []).map(e => {
        return Object.assign(e, {data: hash[e.id]?.items})
      }).filter(e => !e.parent)
    }
  }
})();
