window.fetchTexts = (urls, fn) => Promise.all(urls.map(url => fetch(url)
  .then((res) => res.text())
  )).then((texts) => fn(texts));

const { dateFormat } = window.arrmatura.lib;
