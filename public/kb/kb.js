const fetchTexts = (urls, fn) => Promise.all(urls.map(url => fetch(url)
  .then((res) => res.text())
)).then((texts) => fn(texts));

const { lib: { dateFormat, urlParse, arrayGroupBy, arrayToObject } } = arrmatura;

const { params } = urlParse(window.location.search);

// appendScripts(['applyWebGlBg', 'TimeReportFieldController', 'standupAdapter']);
const converter = new showdown.Converter();
const functions = {
  rich(markup) {
    const html = converter.makeHtml(markup);
    const rootElement = this.$impl.$element;
    rootElement.innerHTML = '';
    arrmatura(`${html}`, { rootElement })
  }
}

const kbAdapter = (list) => {
  let chapterCursor = null;
  let sectionCursor = null;
  let blockCursor = null;
  const tree = {};

  list.forEach((item) => {
    const { $row: id, chapter, section, block, content, ...e } = item;
    if (chapter) {
      chapterCursor = tree[chapter] = { id,content, name:chapter,  data: {} };
      sectionCursor = null;
      blockCursor = null;
    } else if (section) {
      sectionCursor = chapterCursor.data[section] = { id:chapterCursor.id+'-'+id, name: section,content, data: {} }
      blockCursor = null;
    } else if (block) {
      if (!sectionCursor) {
        sectionCursor = chapterCursor.data['-'] = { id:chapterCursor.id+'-0', data: {} }
      }
      blockCursor = sectionCursor.data[block] = { id:chapterCursor.id+'-'+sectionCursor.id+'-'+id, name: block,content, data: [] };
    } else {
      if (!chapterCursor) {
        chapterCursor = tree['0'] = { id:'0', data: {} }
      }
      if (!sectionCursor) {
        sectionCursor = chapterCursor.data['-'] = { id:chapterCursor.id+'-0', data: {} }
      }
      if (!blockCursor) {
        blockCursor = sectionCursor.data['-'] = { id:chapterCursor.id+'-'+sectionCursor.id+'-0', data: [] }
      }
      blockCursor.data.push({...e,name:e.item, content, id});
    }
  });

  const data = Object.values(tree)
    .map(chapter => ({
      ...chapter,
      data: Object.values(chapter.data).map(section => ({
        ...section,
        data: Object.values(section.data)
      }))
    }));

  return { data }
}

const xmls = ['kb/kb.json', 'kb/kb.xml'];

fetchTexts(xmls, (texts) => {
  const { enums, data = [], ...rest } = JSON.parse(texts.shift());

  const resources = {
    params,
    enums, 
    ...rest,
    ...kbAdapter(data, enums)
  };

  const types = [...texts];

  arrmatura(`<KbApp />`, { types, resources, functions });
});
