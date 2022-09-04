window.fetchTexts = (urls, fn) => Promise.all(urls.map(url => fetch(url)
  .then((res) => res.text())
)).then((texts) => fn(texts));

const { lib: { dateFormat, urlParse } } = arrmatura;

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
      applyWebGlBg(this.domElement)
    }, 20);
  }
}

const xmls = ['inbox', 'index', 'references', 'tasks', 'standup', 'user'].map(x => `xml/${x}.xml`);

window.fetchTexts(xmls, (texts) => {
  // console.log(texts);
  const types = [...texts, window.TimeReportFieldController, window.StandupController];

  arrmatura(`<App metaUrl="${metaUrl}"/>`, { types, resources, functions });
});
