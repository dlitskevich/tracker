const fetchTexts = (urls, fn) =>
  Promise.all(urls.map((url) => fetch(url).then((res) => res.text()))).then(
    (texts) => fn(texts)
  );

const appendScripts = (urls) =>
  urls.forEach((x) =>
    document.getElementsByTagName("head")[0].appendChild(
      Object.assign(document.createElement("script"), {
        type: "module",
        src: `js/${x}.js`,
      })
    )
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

// appendScripts(['applyWebGlBg', 'TimeReportFieldController', 'standupAdapter']);

const functions = {
  applyWebGlBg(domElement) {
    setTimeout(() => {
      applyWebGlBg(domElement);
    }, 20);
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
  ...window.adapters,
};

const commons = ["dropdown", "modal"];

const xmls = [
  ...commons.map((c) => `commons/${c}`),
  "inbox",
  "index",
  "references",
  "tasks",
  "issues",
  "standup",
  "user",
].map((x) => `xml/${x}.xml`);

fetchTexts(xmls, (texts) => {
  // console.log(texts);
  const types = [...texts, window.TimeReportFieldController];

  arrmatura(`<App metaUrl="${metaUrl}"/>`, { types, resources, functions });
});
