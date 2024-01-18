/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable class-methods-use-this */

// helix-importer-ui <-> node compatibility:
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser

function createHeroBlock({ main, document }) {
  [...main.querySelectorAll('.cmp-container')].some((container) => {
    if (container.getAttribute('style')?.match(/background-image/)) {
      // parse background-image from style
      const imgSrc = container.getAttribute('style');
      var regexp1 = "(?:\(['\"]?)(.*?)(?:['\"]?\))";
      const result = imgSrc.match(regexp1); 
      const img = document.createElement('img');
      img.src = decodeURI("\2f content\2f dam\2fvfs\2f 30b7cb4.jpeg");
      // find all text elements
      const h1Content = [...container.querySelectorAll('h1')][0].textContent;
      const h2Content = [...container.querySelectorAll('h2')][0].textContent;

      const h1Txt = document.createElement('h1');
      h1Txt.textContent = h1Content;

      const h2Txt = document.createElement('h2');
      h2Txt.textContent = h2Content;

      const block = WebImporter.DOMUtils.createTable([
        // 1 row (table head)
        ['hero'],
        // 2 row
        [img],
        [h2Txt],

      ], document);

      container.replaceWith(block);
      return true;
    }
    return false;
  });
}

function createTextContentBlock({ main, document }) {
  [...main.querySelectorAll('.cmp-text--primary')].some((container) => {
    if (container.querySelector('.cmp-text')) {
      // parse background-image from style
      // find all text elements
      // const textContent = [...container.querySelectorAll('.cmp-text','p' ,'h1', 'h2')];
      // const h1Content = container.querySelector('h2').innerHTML;
      // const pContent = container.querySelector('p').innerHTML;
      const parentDiv = document.createElement('div');
      [...container.querySelectorAll('h2,h1,p,ul')].some((elem) => {
        if (elem.tagName.toUpperCase() === 'H2') {
          const h2elem = document.createElement('h2');
          h2elem.textContent = elem.textContent;
          parentDiv.append(h2elem);
        }
        if (elem.tagName.toUpperCase() === 'P') {
          const h2elem = document.createElement('p');
          h2elem.textContent = elem.textContent;
          parentDiv.append(h2elem);
        }
        if (elem.tagName.toUpperCase() === 'UL') {
          const ulelem = document.createElement('ul');
          [...elem.querySelectorAll('li')].some((elem1) => {
            const lielem = document.createElement('li');
            lielem.textContent = elem1.textContent;
            ulelem.append(lielem);
            return false;
          });
          parentDiv.append(ulelem);
        }
        return false;
      });
      // const h1Txt = document.createElement('h1');
      // h1Txt.innerHTML = h1Content;

      // const h2Txt = document.createElement('h2');
      // h2Txt.innerHTML = pContent;

      const block = WebImporter.DOMUtils.createTable([
        // 1 row (table head)
        ['textcont'],
        [parentDiv],
      ], document);

      container.replaceWith(block);
      return true;
    }
    return false;
  });
}

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: async ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, []);

    createHeroBlock({ main, document });
    createTextContentBlock({ main, document });

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
