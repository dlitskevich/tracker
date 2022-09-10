const fetchTexts = (urls, fn) => Promise.all(urls.map(url => fetch(url)
  .then((res) => res.text())
)).then((texts) => fn(texts));

const { lib: { dateFormat, urlParse, arrayGroupBy, arrayToObject } } = arrmatura;

const { params } = urlParse(window.location.search);

// appendScripts(['applyWebGlBg', 'TimeReportFieldController', 'standupAdapter']);
const converter = new showdown.Converter();
const functions = {
  rich(rootElement,markup) {
    const html = converter.makeHtml(markup);
    rootElement.innerHTML = '';
    arrmatura(`${html}`, { rootElement })
  }
}

const kbAdapter = (list) => {
  let chapterCursor = null;
  let sectionCursor = null;
  let blockCursor = null;
  const tree = {
    main:{ id:'0', name:'', data: {'0':{ id:'0',data:{'0':{id:'0',data:[{id:'hero', type:'hero'}]}}}}}
  };

  list.forEach((item) => {
    const { $row: id, chapter, section, block, value, ...e } = item;
    if (chapter) {
      chapterCursor = tree[chapter] = { id:chapter,value, name:chapter,  data: {} };
      sectionCursor = null;
      blockCursor = null;
    } else if (section) {
      sectionCursor = chapterCursor.data[section] = { id:chapterCursor.id+'/'+id, name: section,value, data: {} }
      blockCursor = null;
    } else if (block) {
      if (!sectionCursor) {
        sectionCursor = chapterCursor.data['-'] = { id:chapterCursor.id+'/0', data: {} }
      }
      blockCursor = sectionCursor.data[block] = { id:chapterCursor.id+'/'+sectionCursor.id+'/'+id, name: block,value, data: [] };
    } else {
      if (!chapterCursor) {
        chapterCursor = tree['0'] = { id:'0', data: {} }
      }
      if (!sectionCursor) {
        sectionCursor = chapterCursor.data['-'] = { id:chapterCursor.id+'/0', data: {} }
      }
      if (!blockCursor) {
        blockCursor = sectionCursor.data['-'] = { id:chapterCursor.id+'/'+sectionCursor.id+'/0', data: [] }
      }
      blockCursor.data.push({...e,name:e.key, value, id});
    }
  });

  Object.values(tree).forEach(chapter => Object.assign(chapter, {
      data: Object.values(chapter.data).map(section => ({
        ...section,
        data: Object.values(section.data)
      }))
    }));

  return { data: tree }
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
