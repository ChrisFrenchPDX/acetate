const fs = require("fs");
const path = require("path");
const createPage = require("./createPage.js");

class Context {
  constructor(contextPath) {

    let context = {};

    if (fs.existsSync(contextPath)) {
      switch(path.ext(contextPath)) {
        case '.json':
          context = JSON.parse(fs.readFileSync(contextPath));
          break;
        default:
          // do nothing
          break;
      }
    }

    this.category = context.category || "";
    this.order = context.order || -1;
    this.old_url = context.old_url || "";
    this.description = context.description || "";
    this.images = context.images || [];
    this.keywords = context.keywords || [];
    this.relevant_apis = context.relevant_apis || [];
    this.snippets = context.snippets || [];
    this.title =context.title || [];
  }
}

function extractPage(
  source_path,    // path to markdown page with data file (JSON)
  template = "",
  metadata = {},  // Acetate metadata
  options = {}
) {

  const defaults = {
    templateErrorOffset = 0,
    basePath = "",
    ext = ".json",

    // Callback functions to do customized logic for the page
    prepareSnippets = () => null,
    prepareImages = () => null,   // this function does image copying, replace paths in source
    prepareMetadata = () => null
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

module.exports = extractPage;
