const fs = require("fs");
const path = require("path");
const createPage = require("./createPage.js");

class Context {
  constructor(contextPath) {

    let content= {};

    if (fs.existsSync(contextPath)) {
      switch(path.ext(contextPath)) {
        case '.json':
          content = JSON.parse(fs.readFileSync(contextPath));
          break;
        default:
          // do nothing
          break;
      }
    }

    this.category = jsonContent.category || "";
    this.order = jsonContent.order || -1;
    this.old_url = jsonContent.old_url || "";
    this.description = jsonContent.description || "";
    this.images = jsonContent.images || [];
    this.keywords = jsonContent.keywords || [];
    this.relevant_apis = jsonContent.relevant_apis || [];
    this.snippets = jsonContent.snippets || [];
    this.title = jsonContent.title || [];
  }
}

function extractPage(
  source_path,    // path to markdown page with data file (JSON)
  template = "",
  content = {},   // metadata extracted from file
  metadata = {},  // Acetate metadata
  options = {}
) {

  const defaults = {
    templateErrorOffset = 0,
    basePath = "",
    ext = ".json",

    // Callback functions to do customized logic for the page
    prepareSnippets,
    prepareImages,   // this function does image copying, replace paths in source
    prepareMetadata
  };

  options = Object.assign({}, defaults, options);

  const pathParts = path.parse(source_path);
  const filename = pathParts.base;
  const fileDirectory = pathParts.dir;
  const jsonFilename = filename.replace('.md', options.ext);
  let context = new Context(path.join(fileDirectory, jsonFilename));

  let source = "";

  if (fs.existsSync(source_path)) {
    source = fs.readFileSync(source_path);

    source = prepareImages(source, context.images, metadata, options);
    source = prepareSnippets(source, context.prepareSnippets, metadata, options);
  }

  metadata = prepareMetadata(source, context, metadata, options);

  return createPage(source, template, metadata, options);
};

function fromTemplate(src, templatePath, defaultMetadata = {}, options) {
  return readFile(templatePath, "utf8").then(content => {
    const page = fromTemplateString(src, content, defaultMetadata, options);
    page.templatePath = templatePath;
    return page;
  });
}

function fromTemplate(src, templatePath, defaultMetadata = {}, options) {
  return readFile(templatePath, "utf8").then(content => {
    const page = fromTemplateString(src, content, defaultMetadata, options);
    page.templatePath = templatePath;
    return page;
  });
}

module.exports = extractPage;
