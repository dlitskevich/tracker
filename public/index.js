window.fetchTexts = (urls, fn) =>
  Promise.all(urls.map((url) => fetch(url).then((res) => res.text()))).then(
    (texts) => fn(texts)
  );

const {
  lib: { dateFormat, urlParse },
} = arrmatura;

const { params } = urlParse(window.location.search);

const apiKeyDefault =
  "AKfycbwoWyFt17GjKCPHXX5a27dwq7pXyQQxKllQ5Gf8BtJgLd-g-rAr7V4DlrDS3bpcq4XCcw";

const { apiKey = apiKeyDefault } = params;

const apiBaseUrl = "https://script.google.com/macros/s/" + apiKey + "/exec";

const metaUrl = apiBaseUrl + "?action=meta";
const resources = {
  apiBaseUrl,
  params,
};

const functions = {
  applyWebGlBg() {
    setTimeout(() => {
      applyWebGlBg(this.domElement);
    }, 20);
  },
  applyMyTag(issues) {
    for (const issue of issues) {
      if (issue.myName === issue.user) {
        const labels = new Set(issue.labels.split(","));
        labels.add("my");
        issue.labels = [...labels].join(",");
      }
    }
    return issues;
  },
  resolveColor(color) {
    switch (color) {
      case "green":
        return "var(--success-color)";
      case "blue":
        return "var(--secondary-color)";
      default:
        return "rgba(0,0,0,0.2)";
    }
  },
};

const xmls = [
  "inbox",
  "index",
  "references",
  "tasks",
  "issues",
  "standup",
  "user",
].map((x) => `xml/${x}.xml`);

window.fetchTexts(xmls, (texts) => {
  // console.log(texts);
  const types = [
    ...texts,
    window.TimeReportFieldController,
    window.StandupController,
  ];

  arrmatura(`<App metaUrl="${metaUrl}"/>`, { types, resources, functions });
});
