const fetchTexts = (urls, fn) => Promise.all(urls.map(url => fetch(url)
  .then((res) => res.text())
)).then((texts) => fn(texts));

const appendScripts = urls => urls.forEach(x =>
  document.getElementsByTagName('head')[0].appendChild(
    Object.assign(document.createElement('script'), { type:'module', src: `js/${x}.js` })
  )
)

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

// appendScripts(['applyWebGlBg', 'TimeReportFieldController', 'standupAdapter']);

const functions = {
  applyWebGlBg(domElement) {
    setTimeout(() => {
      applyWebGlBg(domElement)
    }, 20);
  },
  standupAdapter: (d,u) => window.standupAdapter(d, u),
}

const xmls = ['inbox', 'index', 'references', 'tasks', 'standup', 'user'].map(x => `xml/${x}.xml`);

fetchTexts(xmls, (texts) => {
  // console.log(texts);
  const types = [...texts, window.TimeReportFieldController];

  arrmatura(`<App metaUrl="${metaUrl}"/>`, { types, resources, functions });
});
