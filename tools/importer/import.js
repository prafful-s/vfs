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
    if (container.getAttribute('id')?.match(/hero-container/)) {
      const parentDiv = document.createElement('div');
      const img = document.createElement('img');
      // parse background-image from style
      [...container.querySelectorAll('img')].some((elem) => {
       
        img.src =  elem.getAttribute('src');
        return false;
      });

      [...container.querySelectorAll('.cmp-text--secondary')].some((elem) => {
        [...elem.querySelectorAll('h3')].some((h3elem) => {
          const h3element = document.createElement('h3');
          h3element.innerHTML = h3elem.innerHTML;
          parentDiv.append(h3element);
          return false;
        });
        return false;
      });

      [...container.querySelectorAll('.cmp-button')].some((elem) => {
       // [...elem.querySelectorAll('button')].some((btnelem) => {
          const btnelement = document.createElement('a');
          btnelement.innerHTML = elem.innerHTML;
          parentDiv.append(btnelement);
         // return false;
       // });
        return false;
      });

     // const h1Txt = document.createElement('h3');
     // h1Txt.textContent = h1Content;

     // const h2Txt = document.createElement('h2');
     // h2Txt.textContent = h2Content;

      const block = WebImporter.DOMUtils.createTable([
        // 1 row (table head)
        ['hero'],
        // 2 row
        [img],
        [parentDiv],

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
      
      const parentDiv = document.createElement('div');
      [...container.querySelectorAll('h2,h1,p,ul')].some((elem) => {
        if (elem.tagName.toUpperCase() === 'H2') {
          const h2elem = document.createElement('h2');
          h2elem.textContent = elem.textContent;
          parentDiv.append(h2elem);
        }
        if (elem.tagName.toUpperCase() === 'P') {
          const h2elem = document.createElement('p');
          h2elem.innerHTML = elem.innerHTML;
          parentDiv.append(h2elem);
        }
        if (elem.tagName.toUpperCase() === 'UL') {
          const ulelem = document.createElement('ul');
          [...elem.querySelectorAll('li')].some((elem1) => {
            const lielem = document.createElement('li');
            lielem.innerHTML = elem1.innerHTML;
            ulelem.append(lielem);
            return false;
          });
          parentDiv.append(ulelem);
        }
        return false;
      });
   
      const block = WebImporter.DOMUtils.createTable([
        // 1 row (table head)
        ['textcont'],
        [parentDiv],
      ], document);

      container.replaceWith(block);
     // return true;
    }
    return false;
  });
}

function createHeader({ main }) {
  const logoContainer = main.querySelector('.aem-Grid div.image');
  // insert a section divider, first section contains the logo
  logoContainer.insertAdjacentHTML('afterend', '<hr>');
  logoContainer.classList.add("header-logo-cls");

  const navContainer = main.querySelector('.aem-Grid div.navigation');
  // insert a section divider, second section contains the navigation list
  navContainer.insertAdjacentHTML('afterend', '<hr>');
  navContainer.classList.add("header-nav-cls");

  // last section contains the cta
  const buttonContainer = main.querySelector('.aem-Grid div.button');
  navContainer.classList.add("header-button-cls");

  // remove any remaining content
  while (buttonContainer.nextElementSibling) buttonContainer.nextElementSibling.remove();
  
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
    document, url: urlStr, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const url = new URL(urlStr);
    const main = document.body;

   

    if (url.pathname === '/content/experience-fragments/vfs/us/en/site/header/master.html') {
      // header fragment
      createHeader({ main, document });
    } else {
      WebImporter.DOMUtils.remove(main, [
        'div.cmp-experiencefragment--evisa-header'
      ]);
      // regular pages
      
      createHeroBlock({ main, document });
      createTextContentBlock({ main, document });
    }
    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header',
      'footer'
    ]);
    
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
